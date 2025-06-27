'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/nhost-client';
import { CREATE_APPLICATION_STAGE } from '@/graphql/mutations/createApplicationStage';
import { useAuth } from './AuthContext';
import {
  CreateApplicationStageMutation,
  CreateApplicationStageMutationVariables,
} from '@/gql/graphql';

interface AddStageModalProps {
  jobId: string;
  text?: string;
  onComplete?: (id: string) => void;
}

export function AddStageModal({ jobId, text, onComplete = () => null }: AddStageModalProps) {
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);
  const [stageName, setStageName] = useState('');
  const [stageDescription, setStageDescription] = useState('');

  const queryClient = useQueryClient();
  const { user: userData } = useAuth();

  const { mutate, isPending } = useMutation<
    CreateApplicationStageMutation,
    Error,
    CreateApplicationStageMutationVariables
  >({
    mutationFn: variables =>
      graphqlRequest(CREATE_APPLICATION_STAGE.loc?.source.body || '', variables),
    onSuccess: data => {
      onComplete(data.insert_application_stages_one?.id);
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      setIsAddStageModalOpen(false);
      setStageName('');
      setStageDescription('');
    },
  });

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim() || !userData?.id) return;

    mutate({
      job_id: jobId,
      name: stageName.trim(),
      description: stageDescription.trim(),
      user_id: userData.id,
    });
  };

  return (
    <>
      <button
        onClick={() => setIsAddStageModalOpen(true)}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
      >
        {!text && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
        {text || 'Add Stage'}
      </button>

      {/* Add Stage Modal */}
      {isAddStageModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Add New Interview Stage
                </h3>
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
                    disabled={isPending || !stageName.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? 'Adding...' : 'Add Stage'}
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
