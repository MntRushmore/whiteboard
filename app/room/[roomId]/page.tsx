'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import WhiteboardEditor from '@/components/WhiteboardEditor';

function RoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const userName = searchParams.get('name') || 'Anonymous';
  const userRole = (searchParams.get('role') as 'tutor' | 'student') || 'student';

  return (
    <WhiteboardEditor
      roomId={roomId}
      userName={userName}
      userRole={userRole}
    />
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-vmotiv8-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-vmotiv8-primary mx-auto mb-4"></div>
          <p className="text-vmotiv8-dark font-semibold">Loading room...</p>
        </div>
      </div>
    }>
      <RoomContent />
    </Suspense>
  );
}
