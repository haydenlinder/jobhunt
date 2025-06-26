'use client';

import Link from 'next/link';
import { useState } from 'react';
import { GetPostedJobByIdQuery } from '@/gql/graphql';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/nhost-client';
import { JobEditForm } from './JobEditForm';
import { JobApplicationsList } from './JobApplicationsList';
import { GET_POSTED_JOB_BY_ID } from '@/graphql/queries/getPostedJobById';
import { CREATE_APPLICATION_STAGE } from '@/graphql/mutations/createApplicationStage';
import { useAuth } from './AuthContext';

interface DashboardJobDetailProps {
  jobId: string;
}

export function DashboardJobDetail({ jobId }: DashboardJobDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);
  const [stageName, setStageName] = useState('');
  const [stageDescription, setStageDescription] = useState('');

  const queryClient = useQueryClient();
  const { user: userData } = useAuth();

  const { data, isLoading, error } = useQuery<GetPostedJobByIdQuery>({
    queryKey: ['job', jobId],
    queryFn: () => graphqlRequest(GET_POSTED_JOB_BY_ID.loc?.source.body || '', { id: jobId }),
  });

  const createStageMutation = useMutation({
    mutationFn: (variables: {
      job_id: string;
      name: string;
      description: string;
      user_id: string;
    }) => graphqlRequest(CREATE_APPLICATION_STAGE.loc?.source.body || '', variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      setIsAddStageModalOpen(false);
      setStageName('');
      setStageDescription('');
    },
  });

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim() || !userData?.id) return;

    createStageMutation.mutate({
      job_id: jobId,
      name: stageName.trim(),
      description: stageDescription.trim(),
      user_id: userData.id,
    });
  };

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
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
            </div>
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
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stages</h2>
              <button
                onClick={() => setIsAddStageModalOpen(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Stage
              </button>
            </div>
            {job.application_stages.length > 0 ? (
              <ul className="space-y-2">
                {job.application_stages.map((stage, index) => (
                  <li key={stage.id} className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium">{stage.name}</div>
                      {stage.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stage.description}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No stages defined yet.</p>
            )}
          </div>

          {/* Applications list */}
          <JobApplicationsList applications={job.applications || []} />

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

      {/* Add Stage Modal */}
      {isAddStageModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add New Stage</h3>
                <button
                  onClick={() => setIsAddStageModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddStage} className="space-y-4">
                <div>
                  <label
                    htmlFor="stageName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Stage Name *
                  </label>
                  <input
                    type="text"
                    id="stageName"
                    value={stageName}
                    onChange={e => setStageName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Phone Screen, Technical Interview"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="stageDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="stageDescription"
                    value={stageDescription}
                    onChange={e => setStageDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Brief description of this stage..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddStageModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createStageMutation.isPending || !stageName.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createStageMutation.isPending ? 'Adding...' : 'Add Stage'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
