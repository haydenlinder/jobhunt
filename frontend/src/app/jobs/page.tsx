'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SEARCH_JOBS } from '@/graphql/queries/searchJobs';
import JobCard from '@/components/JobCard';
import JobSearchForm from '@/components/JobSearchForm';
import { graphqlRequest } from '@/lib/nhost-client';
import { SearchJobsQuery } from '@/gql/graphql';

// Convert the gql template literal to a string for nhost client
const SEARCH_JOBS_QUERY = SEARCH_JOBS.loc?.source.body || '';

// Extract the search parameters logic into a separate component
function JobSearch() {
  const searchParams = useSearchParams();
  const titleParam = searchParams.get('title') || '';
  const locationParam = searchParams.get('location') || '';

  const [searchTitle, setSearchTitle] = useState(titleParam);
  const [searchLocation, setSearchLocation] = useState(locationParam);

  // Use React Query to fetch jobs based on search criteria
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['searchJobs', searchTitle, searchLocation],
    queryFn: async () => {
      const data = await graphqlRequest<SearchJobsQuery>(SEARCH_JOBS_QUERY, {
        title: searchTitle ? `${searchTitle}` : '',
        location: searchLocation ? `${searchLocation}` : '',
      });
      return data?.jobs || [];
    },
    // enabled: false, // Don't run on mount, we'll trigger manually
  });

  useEffect(() => {
    // Update state when URL parameters change
    setSearchTitle(titleParam);
    setSearchLocation(locationParam);

    // Trigger the query to run
    refetch();
  }, [titleParam, locationParam, refetch]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Search Results</h1>

      {/* Search form for refining results */}
      <JobSearchForm initialTitle={searchTitle} initialLocation={searchLocation} />

      {/* Results */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            Error loading jobs: {error.message}
          </div>
        )}

        {!isLoading && !error && data && (
          <>
            <p className="text-gray-700 dark:text-gray-300">
              Found {data.length} job{data.length !== 1 ? 's' : ''}
              {searchTitle && ` matching "${searchTitle}"`}
              {searchLocation && searchTitle && ' in '}
              {searchLocation && `"${searchLocation}"`}
            </p>

            {data.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  No jobs found matching your criteria.
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Try broadening your search terms or exploring our featured jobs.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <JobSearch />
    </Suspense>
  );
}
