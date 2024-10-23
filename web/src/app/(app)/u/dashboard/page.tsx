"use client"
import ProgressDashboard from '@/components/ProgressDashboard';
import PeerLearningNetwork from '@/components/PeerLearningNetwork';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <section className="text-center py-16">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-600">
          User Dashboard
        </h1>
        <p className="text-lg lg:text-xl max-w-3xl mx-auto text-gray-300">
          Track your learning progress and connect with peers for collaborative growth.
        </p>
      </section>

      {/* Progress Dashboard Section */}
      <section className="py-16 px-8 lg:px-24">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Progress Overview</h2>
          <ProgressDashboard />
        </div>
      </section>

      {/* Peer Learning Network Section */}
      <section className="py-16 px-8 lg:px-24 bg-gray-900">
        <div className="p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Peer Learning Network</h2>
          <PeerLearningNetwork />
        </div>
      </section>
    </main>
  );
}
