'use client';

import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useYjsStore } from '@/lib/useYjsStore';

interface WhiteboardEditorProps {
  roomId: string;
  userName: string;
  userRole: 'tutor' | 'student';
}

export default function WhiteboardEditor({ roomId, userName, userRole }: WhiteboardEditorProps) {
  const store = useYjsStore({
    roomId,
    hostUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234',
  });

  return (
    <div className="w-full h-screen relative">
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-vmotiv8-primary">
            vMotiv<span className="text-vmotiv8-accent">8</span>
          </span>
        </div>
        <div className="border-l border-gray-300 pl-3">
          <div className="text-xs text-gray-500">Room Code</div>
          <div className="font-mono font-bold text-vmotiv8-primary">{roomId}</div>
        </div>
        <div className="border-l border-gray-300 pl-3">
          <div className="text-xs text-gray-500">User</div>
          <div className="font-semibold text-gray-700 flex items-center gap-1">
            {userName}
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                userRole === 'tutor'
                  ? 'bg-vmotiv8-secondary text-white'
                  : 'bg-vmotiv8-primary text-white'
              }`}
            >
              {userRole}
            </span>
          </div>
        </div>
      </div>

      {store ? (
        <Tldraw
          store={store}
          autoFocus
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-vmotiv8-light">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-vmotiv8-primary mx-auto mb-4"></div>
            <p className="text-vmotiv8-dark font-semibold">Connecting to whiteboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}
