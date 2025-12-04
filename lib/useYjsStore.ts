import { useEffect, useState } from 'react';
import { TLRecord, createTLStore, defaultShapeUtils } from '@tldraw/tldraw';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export function useYjsStore({
  roomId,
  hostUrl,
}: {
  roomId: string;
  hostUrl: string;
}) {
  const [store, setStore] = useState<ReturnType<typeof createTLStore> | null>(null);

  useEffect(() => {
    const doc = new Y.Doc({ gc: true });
    const yStore = doc.getMap<TLRecord>('tldraw');

    const provider = new WebsocketProvider(hostUrl, roomId, doc, {
      connect: true,
    });

    const newStore = createTLStore({
      shapeUtils: defaultShapeUtils,
    });

    // Sync Y.js changes to tldraw store
    yStore.observe((event) => {
      newStore.mergeRemoteChanges(() => {
        event.changes.keys.forEach((change, key) => {
          if (change.action === 'delete') {
            // Use type assertion to bypass strict type checking
            const recordId = key as any;
            if (newStore.has(recordId)) {
              newStore.remove([recordId]);
            }
          } else if (change.action === 'add' || change.action === 'update') {
            const value = yStore.get(key);
            if (value) {
              newStore.put([value]);
            }
          }
        });
      });
    });

    // Sync tldraw store changes to Y.js
    const removeListener = newStore.listen(
      ({ changes }) => {
        doc.transact(() => {
          Object.values(changes.added).forEach((record) => {
            yStore.set(record.id, record);
          });
          Object.values(changes.updated).forEach(([_, record]) => {
            yStore.set(record.id, record);
          });
          Object.values(changes.removed).forEach((record) => {
            yStore.delete(record.id);
          });
        });
      },
      { source: 'user', scope: 'all' }
    );

    setStore(newStore);

    return () => {
      removeListener();
      provider?.destroy();
      doc?.destroy();
    };
  }, [hostUrl, roomId]);

  return store;
}
