'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function NewRoom() {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'tutor' | 'student'>('tutor');
  const router = useRouter();

  useEffect(() => {
    setRoomCode(generateRoomCode());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode && userName) {
      router.push(`/room/${roomCode}?name=${encodeURIComponent(userName)}&role=${userRole}`);
    }
  };

  const regenerateCode = () => {
    setRoomCode(generateRoomCode());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vmotiv8-primary via-vmotiv8-secondary to-vmotiv8-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-vmotiv8-dark mb-2">
            vMotiv<span className="text-vmotiv8-accent">8</span>
          </h1>
          <p className="text-gray-600">Create a Whiteboard Session</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vmotiv8-primary focus:border-transparent outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomCode}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-lg tracking-wider text-center"
              />
              <button
                type="button"
                onClick={regenerateCode}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                title="Generate new code"
              >
                🔄
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Share this code with students to let them join
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserRole('student')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  userRole === 'student'
                    ? 'bg-vmotiv8-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setUserRole('tutor')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  userRole === 'tutor'
                    ? 'bg-vmotiv8-secondary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tutor
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-vmotiv8-primary text-white py-3 rounded-lg font-semibold hover:bg-vmotiv8-secondary transition-colors"
          >
            Create Room
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-vmotiv8-primary hover:text-vmotiv8-secondary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
