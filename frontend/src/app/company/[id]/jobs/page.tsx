'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { graphqlRequest } from '@/lib/nhost-client';
import { GET_JOBS } from '@/graphql/queries/getJobs';
import { GetJobsQuery } from '@/gql/graphql';
import JobCard from '@/components/JobCard';
import React from 'react';

interface CompanyJobsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CompanyJobsPage({ params }: CompanyJobsPageProps) {
  const awaitedParams = React.use(params);
  const { id } = awaitedParams;
  const searchParams = useSearchParams();
  const titleFilter = searchParams?.get('title') || '';
  const locationFilter = searchParams?.get('location') || '';

  const { data, isLoading, error } = useQuery<GetJobsQuery>({
    queryKey: ['jobs', id, titleFilter, locationFilter],
    queryFn: () =>
      graphqlRequest(GET_JOBS.loc?.source.body || '', {
        company_id: { _in: id },
      }),
  });

  const jobs = data?.jobs || [];
  const companyName = jobs.length > 0 ? jobs[0].company?.name : 'Company';

  return (
    <div className="space-y-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{companyName}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Browse available positions</p>
      </div>

      {/* Job Search Form Component */}
      {/* Modified JobSearchForm to maintain company context */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Find Your Perfect Role
          </h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              const location = formData.get('location') as string;

              // Build search query parameters
              const params = new URLSearchParams();
              if (title) {
                params.append('title', title);
              }
              if (location) {
                params.append('location', location);
              }

              // Navigate within the company page
              window.location.href = `/company/${id}/jobs?${params.toString()}`;
            }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                name="title"
                placeholder="Job title or keywords"
                defaultValue={titleFilter}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="location"
                placeholder="Location or Remote"
                defaultValue={locationFilter}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex-none">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Jobs List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {titleFilter || locationFilter
            ? `Search Results (${jobs.length})`
            : `All Positions (${jobs.length})`}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">Error loading jobs. Please try again.</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No jobs found matching your search criteria.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
