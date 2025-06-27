'use client';

import { ApplicationDetail } from './ApplicationDetail';
import { Applications } from '@/gql/graphql';

export function JobApplicationsList({
  applications,
  applicationStages = [],
}: {
  applications: Partial<Applications>[];
  applicationStages?: Array<{ id: string; name: string; description?: string | null }>;
}) {
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
          <div key={application.id} className="overflow-hidden">
            <div className="text-sm">
              {/* Parsed Resume Information */}
              <ApplicationDetail application={application} applicationStages={applicationStages} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
