import { GetJobByIdQuery } from '@/gql/graphql';
import Link from 'next/link';

interface JobInfoProps {
  job: Exclude<Partial<GetJobByIdQuery['jobs_by_pk']>, null | undefined>;
  showEditButton?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  isDuplicating?: boolean;
}

export function JobInfo({ job, showEditButton = false, onEdit, onDuplicate, isDuplicating = false }: JobInfoProps) {
  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
          {showEditButton && (onEdit || onDuplicate) && (
            <div className="flex space-x-2">
              {onEdit && (
                <button
                  onClick={onEdit}
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
              )}
              {onDuplicate && (
                <button
                  onClick={onDuplicate}
                  disabled={isDuplicating}
                  className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                    isDuplicating
                      ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
                      : 'text-green-700 bg-green-100 hover:bg-green-200'
                  }`}
                >
                  {isDuplicating ? (
                    <div className="animate-spin rounded-full h-4 w-4 mr-1 border-b-2 border-gray-500"></div>
                  ) : (
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {isDuplicating ? 'Duplicating...' : 'Duplicate'}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Link
            href={`/company/${job.company?.id}/jobs`}
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
    </>
  );
}
