'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/nhost-client';
import { CREATE_APPLICATION_STAGE } from '@/graphql/mutations/createApplicationStage';
import { DELETE_APPLICATION_STAGE } from '@/graphql/mutations/deleteApplicationStage';
import { useAuth } from './AuthContext';
import { Application_Stages, Applications } from '@/gql/graphql';

interface JobStagesManagerProps {
  jobId: string;
  stages: Array<Partial<Application_Stages>>;
  applications: Array<Partial<Applications>>;
}

export function JobStagesManager({ jobId, stages, applications }: JobStagesManagerProps) {
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);
  const [stageName, setStageName] = useState('');
  const [stageDescription, setStageDescription] = useState('');

  const queryClient = useQueryClient();
  const { user: userData } = useAuth();

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

  const deleteStageMutation = useMutation({
    mutationFn: (stageId: string) =>
      graphqlRequest(DELETE_APPLICATION_STAGE.loc?.source.body || '', { id: stageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
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

  const handleDeleteStage = (stageId: string, stageName: string) => {
    if (window.confirm(`Are you sure you want to delete the "${stageName}" stage?`)) {
      deleteStageMutation.mutate(stageId);
    }
  };

  return (
    <>
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
        {stages.length > 0 ? (
          <ul className="space-y-2">
            {stages.map((stage, index) => (
              <li
                key={stage.id}
                className="flex items-center justify-between text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
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
                  <div className="ml-2">
                    {applications.filter(a => a.stage === index + 1).length} candidate
                    {applications.filter(a => a.stage === index + 1).length === 1 ? '' : 's'}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStage(stage.id, stage.name || '')}
                  disabled={deleteStageMutation.isPending}
                  className="inline-flex items-center p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete stage"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No stages defined yet.</p>
        )}
      </div>

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
    </>
  );
}
