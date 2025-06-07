'use client';

import { GetFeaturedJobsQuery } from '@/gql/graphql';
import Link from 'next/link';

export default function JobCard({ job }: { job: GetFeaturedJobsQuery['jobs'][0] }) {
  // Get company name based on structure
  const companyName = job.company?.name;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
      <p className="text-indigo-600 dark:text-indigo-400 mt-1">{companyName}</p>
      <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg
          className="h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        {job.location}
      </div>
    </Link>
  );
}
