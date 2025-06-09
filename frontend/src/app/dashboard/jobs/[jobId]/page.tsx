'use client';

import { DashboardJobDetail } from '@/components/DashboardJobDetail';
import { useParams } from 'next/navigation';

export default function DashboardJobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  return (
    <div className="container mx-auto py-6 px-4">
      <DashboardJobDetail jobId={jobId} />
    </div>
  );
}
