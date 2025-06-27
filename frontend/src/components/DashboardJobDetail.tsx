'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GetPostedJobByIdQuery } from '@/gql/graphql';
import { useQuery } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/nhost-client';
import { JobEditForm } from './JobEditForm';
import { JobApplicationsList } from './JobApplicationsList';
import { JobInfo } from './JobInfo';
import { JobStagesManager } from './JobStagesManager';
import { GET_POSTED_JOB_BY_ID } from '@/graphql/queries/getPostedJobById';

interface DashboardJobDetailProps {
  jobId: string;
}

export function DashboardJobDetail({ jobId }: DashboardJobDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('');
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<GetPostedJobByIdQuery>({
    queryKey: ['job', jobId],
    queryFn: () => graphqlRequest(GET_POSTED_JOB_BY_ID.loc?.source.body || '', { id: jobId }),
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
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      {isEditing && job ? (
        <JobEditForm
          job={job}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <>
          <JobInfo job={job} showEditButton={true} onEdit={() => setIsEditing(true)} />

          <JobStagesManager
            isAddStageModalOpen={isAddStageModalOpen}
            setIsAddStageModalOpen={setIsAddStageModalOpen}
            jobId={jobId}
            filter={filter}
            stages={job.application_stages || []}
            applications={job.applications || []}
            onClickFilter={stage => setFilter(s => (s === stage.id ? '' : stage.id))}
          />
          {/* Applications list */}
          {filter && (
            <JobApplicationsList
              setIsAddStageModalOpen={setIsAddStageModalOpen}
              applications={
                filter
                  ? job.applications.filter(ap =>
                      filter === 'applied' ? !ap.stage_id : ap.stage_id === filter
                    )
                  : job.applications || []
              }
              applicationStages={job.application_stages || []}
            />
          )}
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
        </>
      )}
    </div>
  );
}
