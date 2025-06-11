'use client';

import { ApplicationDetail } from './ApplicationDetail';
import { Applications } from '@/gql/graphql';

export function JobApplicationsList({ applications }: { applications: Partial<Applications>[] }) {
  if (!applications || applications.length === 0) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applications</h2>
        <p className="text-gray-500 dark:text-gray-400">No applications have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Applications ({applications.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map(application => (
          <div
            key={application.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="truncate">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(application.created_at).toLocaleDateString()} at{' '}
                    {new Date(application.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="text-sm">
                  <div className=""></div>

                  {/* Parsed Resume Information */}
                  <ApplicationDetail application={application} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
