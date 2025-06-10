'use client';

import { useState } from 'react';

interface Application {
  id: string;
  resume_url: string;
  created_at: string;
}

interface JobApplicationsListProps {
  applications: Application[];
}

export function JobApplicationsList({ applications }: JobApplicationsListProps) {
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  if (!applications || applications.length === 0) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Applications</h2>
        <p className="text-gray-500 dark:text-gray-400">No applications have been submitted yet.</p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    if (expandedApplication === id) {
      setExpandedApplication(null);
    } else {
      setExpandedApplication(id);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Applications ({applications.length})
      </h2>
      <div className="space-y-4">
        {applications.map(application => (
          <div
            key={application.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <div
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(application.id)}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Application submitted on {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(application.created_at).toLocaleTimeString()}
                </p>
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${expandedApplication === application.id ? 'transform rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {expandedApplication === application.id && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Resume</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded flex items-center justify-between">
                    <div className="truncate flex-1">
                      <a
                        href={application.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
                      >
                        {application.resume_url}
                      </a>
                    </div>
                    <a
                      href={application.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
