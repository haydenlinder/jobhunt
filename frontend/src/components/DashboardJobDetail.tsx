'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GetJobByIdQuery } from '@/gql/graphql';
import { useQuery } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/nhost-client';
import { GET_JOB_BY_ID } from '@/graphql/queries/getJobById';

interface DashboardJobDetailProps {
  jobId: string;
}

export function DashboardJobDetail({ jobId }: DashboardJobDetailProps) {
  const { data, isLoading, error } = useQuery<GetJobByIdQuery>({
    queryKey: ['job', jobId],
    queryFn: () => 
      graphqlRequest(GET_JOB_BY_ID.loc?.source.body || '', { id: jobId }),
  });
  
  const job = data?.jobs_by_pk;
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-red-500">Failed to load job details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Link
            href={`/company/${job.company.id}/jobs`}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
          >
            {job.company?.name}
          </Link>
          <span className="mx-2">•</span>
          <span>{job.location}</span>
          <span className="mx-2">•</span>
          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Job Description
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex justify-between items-center">
          <Link
            href={`/dashboard`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Back to Dashboard
          </Link>
          <Link
            href={`/jobs/${jobId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Public Job Page
          </Link>
        </div>
      </div>
    </div>
  );
}
