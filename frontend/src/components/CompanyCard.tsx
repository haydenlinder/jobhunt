'use client';

import Link from 'next/link';

interface CompanyCardProps {
  companyName: string;
  index: number;
}

export function CompanyCard({ companyName, index }: CompanyCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 dark:text-indigo-300 font-bold text-lg">
              {companyName.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{companyName}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Role: Member
            </span>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">0</span> job postings
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">0</span> applications
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/organizations/${index}`}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          View Details
        </Link>
        <Link
          href={`/dashboard/organizations/${index}/jobs`}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Manage Jobs
        </Link>
        <Link
          href={`/dashboard/organizations/${index}/applications`}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Review Applications
        </Link>
        <Link
          href={`/${companyName.toLowerCase().replace(/\s+/g, '-')}/jobs`}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          View Public Page
        </Link>
      </div>
    </div>
  );
}
