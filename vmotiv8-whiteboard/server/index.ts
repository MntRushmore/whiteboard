import { WebSocketServer, WebSocket } from 'ws';
import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as map from 'lib0/map';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 1234;

const wss = new WebSocketServer({ port: PORT });

const docs = new Map<string, WSSharedDoc>();

const messageSync = 0;
const messageAwareness = 1;

interface WSSharedDoc extends Y.Doc {
  name: string;
  conns: Map<WebSocket, Set<number>>;
  awareness: awarenessProtocol.Awareness;
}

const getYDoc = (docname: string): WSSharedDoc => {
  return map.setIfUndefined(docs, docname, () => {
    const doc = new Y.Doc() as WSSharedDoc;
    doc.name = docname;
    doc.conns = new Map();
    doc.awareness = new awarenessProtocol.Awareness(doc);

    doc.awareness.on('update', ({ added, updated, removed }: any) => {
      const changedClients = added.concat(updated).concat(removed);
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(doc.awareness, changedClients);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(encoder, awarenessUpdate);
      const buff = encoding.toUint8Array(encoder);

      doc.conns.forEach((_, conn) => {
        if (conn.readyState === WebSocket.OPEN) {
          conn.send(buff);
        }
      });
    });

    return doc;
  });
};

wss.on('connection', (conn, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const roomName = url.pathname.slice(1);

  if (!roomName) {
    conn.close();
    return;
  }

  console.log(`New connection to room: ${roomName}`);

  const doc = getYDoc(roomName);
  doc.conns.set(conn, new Set());

  conn.on('message', (message: ArrayBuffer) => {
    try {
      const uint8Array = new Uint8Array(message);
      const decoder = decoding.createDecoder(uint8Array);
      const messageType = decoding.readVarUint(decoder);

      switch (messageType) {
        case messageSync: {
          encoding.writeVarUint(encoding.createEncoder(), messageSync);
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, messageSync);
          syncProtocol.readSyncMessage(decoder, encoder, doc, conn);

          if (encoding.length(encoder) > 1) {
            conn.send(encoding.toUint8Array(encoder));
          }
          break;
        }
        case messageAwareness: {
          awarenessProtocol.applyAwarenessUpdate(
            doc.awareness,
            decoding.readVarUint8Array(decoder),
            conn
          );
          break;
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  conn.on('close', () => {
    console.log(`Connection closed for room: ${roomName}`);
    doc.conns.delete(conn);
    awarenessProtocol.removeAwarenessStates(doc.awareness, [doc.awareness.clientID], null);

    if (doc.conns.size === 0) {
      docs.delete(roomName);
      console.log(`Room ${roomName} is empty, document removed`);
    }
  });

  // Send sync step 1
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeSyncStep1(encoder, doc);
  conn.send(encoding.toUint8Array(encoder));

  // Send awareness states
  const awarenessStates = doc.awareness.getStates();
  if (awarenessStates.size > 0) {
    const awarenessEncoder = encoding.createEncoder();
    encoding.writeVarUint(awarenessEncoder, messageAwareness);
    encoding.writeVarUint8Array(
      awarenessEncoder,
      awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys()))
    );
    conn.send(encoding.toUint8Array(awarenessEncoder));
  }
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
console.log(`vMotiv8 Whiteboard Server Ready`);

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  wss.close();
  process.exit(0);
});
