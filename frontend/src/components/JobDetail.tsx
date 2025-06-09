'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { graphqlRequest } from '@/lib/nhost-client';
import { GET_JOB_BY_ID } from '@/graphql/queries/getJobById';
import { GetJobByIdQuery } from '@/gql/graphql';
import { ApplicationForm } from './ApplicationForm';

interface JobDetailProps {
  jobId: string;
}

export function JobDetail({ jobId }: JobDetailProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data, isLoading, error } = useQuery<GetJobByIdQuery>({
    queryKey: ['job', jobId],
    queryFn: () => graphqlRequest(GET_JOB_BY_ID.loc?.source.body || '', { id: jobId }),
    enabled: !!jobId,
  });

  const job = data?.jobs_by_pk;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
        {!showApplicationForm ? (
          <button
            onClick={() => setShowApplicationForm(true)}
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Now
          </button>
        ) : (
          <ApplicationForm
            jobId={jobId}
            companyId={job.company.id}
            onSuccess={() => {
              // Form submission was successful
            }}
          />
        )}
      </div>
    </div>
  );
}
