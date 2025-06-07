'use client';

import { JobDetail } from '@/components/JobDetail';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/jobs"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
        >
          <svg
            className="h-5 w-5 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Job Search
        </Link>
      </div>

      <JobDetail jobId={jobId} />
    </div>
  );
}
