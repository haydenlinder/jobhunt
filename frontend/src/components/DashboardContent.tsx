'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobCreation } from '@/components/JobCreation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/AuthContext';
import { graphqlRequest } from '@/lib/nhost-client';

import { GET_JOBS } from '@/graphql/queries/getJobs';
import { GET_USER_COMPANIES } from '@/graphql/queries/getCompanies';
import { GetJobsQuery, GetUserCompaniesQuery } from '@/gql/graphql';

export function DashboardContent() {
  const [isJobCreationOpen, setIsJobCreationOpen] = useState(false);
  const [userCompanyIds, setUserCompanyIds] = useState<string[]>([]);

  // Get authenticated user
  const { user: authUser } = useAuth();

  // Fetch user's companies
  const { data: companiesData } = useQuery({
    queryKey: ['userCompanies', authUser?.id],
    queryFn: () =>
      graphqlRequest<GetUserCompaniesQuery>(GET_USER_COMPANIES.loc?.source.body || '', {
        id: authUser?.id,
      }),
    enabled: !!authUser?.id,
  });

  // Extract company IDs for jobs query
  useEffect(() => {
    if (companiesData?.user?.company_users) {
      const companyIds = companiesData.user.company_users.map(cu => cu.company?.id);
      setUserCompanyIds(companyIds);
    }
  }, [companiesData]);

  // Fetch jobs data for user's companies
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
  } = useQuery<GetJobsQuery>({
    queryKey: ['jobs', userCompanyIds],
    queryFn: () =>
      graphqlRequest(GET_JOBS.loc?.source.body || '', {
        company_id: { _in: userCompanyIds },
      }),
    enabled: userCompanyIds.length > 0,
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="sm:flex sm:items-baseline">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
      </div>

      {/* Job Postings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Job Postings</h2>
          <button
            onClick={() => setIsJobCreationOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-4 w-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Create Job
          </button>
        </div>

        {isLoadingJobs || userCompanyIds.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : jobsData?.jobs?.length ? (
          <div className="space-y-4">
            {jobsData.jobs.map(job => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{job.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{job.location}</p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {job.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {job.applications_aggregate?.aggregate?.count || 0} Applications
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No job postings available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Job Creation Modal */}
      <JobCreation
        isOpen={isJobCreationOpen}
        onClose={() => setIsJobCreationOpen(false)}
        onSuccess={() => {
          // Refresh job postings after successful creation
          refetchJobs();
        }}
      />
    </div>
  );
}
