'use client';

import { JobDetail } from '@/components/JobDetail';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-4">
        <Link 
          href="/dashboard" 
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      <JobDetail jobId={jobId} />
    </div>
  );
}
