"use client"
import ProgressDashboard from '@/components/ProgressDashboard';
import PeerLearningNetwork from '@/components/PeerLearningNetwork';

export default function DashboardPage() {
  return (
    <main className="container mx-auto py-12 ">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <ProgressDashboard />
      <div className="h-6" /> 
      <PeerLearningNetwork />
    </main>
  );
}