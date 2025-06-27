'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/nhost-client';
import { DELETE_APPLICATION_STAGE } from '@/graphql/mutations/deleteApplicationStage';
import { Application_Stages, Applications } from '@/gql/graphql';
import { AddStageModal } from './AddStageModal';

interface JobStagesManagerProps {
  jobId: string;
  stages: Array<Partial<Application_Stages>>;
  applications: Array<Partial<Applications>>;
  onClickFilter?: (stage: Partial<Application_Stages>) => void;
  filter?: string;
}

export function JobStagesManager({
  jobId,
  stages,
  applications,
  onClickFilter = () => null,
  filter,
}: JobStagesManagerProps) {
  const queryClient = useQueryClient();

  const deleteStageMutation = useMutation({
    mutationFn: (stageId: string) =>
      graphqlRequest(DELETE_APPLICATION_STAGE.loc?.source.body || '', { id: stageId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
    },
  });

  const handleDeleteStage = (stageId: string, stageName: string) => {
    if (window.confirm(`Are you sure you want to delete the "${stageName}" stage?`)) {
      deleteStageMutation.mutate(stageId);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stages</h2>
        <AddStageModal jobId={jobId} />
      </div>

      <ul className="space-y-2">
        {[{ id: 'applied', name: 'Applied' }, ...stages].map((stage, index) => {
          return (
            <li
              key={stage.id}
              className={`flex items-center justify-between ${!filter ? '' : filter === stage.id ? '' : 'opacity-15'} text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg`}
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full mr-3">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-baseline">
                    <div className="font-medium">{stage.name}</div>
                    <button
                      className="ml-2 text-sm text-blue-400 cursor-pointer hover:underline"
                      onClick={() => onClickFilter(stage)}
                    >
                      {
                        applications.filter(
                          a => (!a.stage_id && stage.id === 'applied') || a.stage_id === stage.id
                        ).length
                      }{' '}
                      candidate
                      {applications.filter(
                        a => (!a.stage_id && stage.id === 'applied') || a.stage_id === stage.id
                      ).length === 1
                        ? ''
                        : 's'}
                    </button>
                  </div>
                  {stage.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {stage.description}
                    </div>
                  )}
                </div>
              </div>
              {stage.id !== 'applied' && (
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
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
