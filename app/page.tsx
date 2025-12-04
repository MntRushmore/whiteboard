import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vmotiv8-primary via-vmotiv8-secondary to-vmotiv8-accent">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            vMotiv<span className="text-vmotiv8-accent">8</span>
          </h1>
          <p className="text-2xl text-white/90">Collaborative Whiteboard</p>
          <p className="text-lg text-white/70 mt-2">
            Empower learning through real-time collaboration
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-vmotiv8-dark mb-6">
              Get Started
            </h2>
            <p className="text-gray-600 mb-8">
              Join or create a whiteboard session to collaborate with tutors and students in real-time.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-vmotiv8-light rounded-lg p-6 border-2 border-vmotiv8-primary/20 hover:border-vmotiv8-primary transition-colors">
                <h3 className="text-xl font-semibold text-vmotiv8-dark mb-3">
                  Create a Room
                </h3>
                <p className="text-gray-600 mb-4">
                  Start a new whiteboard session and invite students to join.
                </p>
                <Link
                  href="/room/new"
                  className="inline-block bg-vmotiv8-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-vmotiv8-secondary transition-colors"
                >
                  Create Room
                </Link>
              </div>

              <div className="bg-vmotiv8-light rounded-lg p-6 border-2 border-vmotiv8-secondary/20 hover:border-vmotiv8-secondary transition-colors">
                <h3 className="text-xl font-semibold text-vmotiv8-dark mb-3">
                  Join a Room
                </h3>
                <p className="text-gray-600 mb-4">
                  Enter a room code to join an existing whiteboard session.
                </p>
                <Link
                  href="/room/join"
                  className="inline-block bg-vmotiv8-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-vmotiv8-primary transition-colors"
                >
                  Join Room
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-3">✏️</div>
              <h3 className="text-xl font-semibold mb-2">Draw & Annotate</h3>
              <p className="text-white/80">
                Full-featured drawing tools for interactive lessons
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Sync</h3>
              <p className="text-white/80">
                See changes instantly as everyone collaborates
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-semibold mb-2">Multi-user</h3>
              <p className="text-white/80">
                Multiple tutors and students in one session
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-16 text-white/60">
          <p>Powered by vMotiv8 - Making Education Interactive</p>
        </footer>
      </div>
    </div>
  );
}
