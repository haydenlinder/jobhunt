'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { graphqlRequest } from '@/lib/nhost-client';
import JobCard from './JobCard';
import { GET_FEATURED_JOBS } from '@/graphql/queries/getFeaturedJobs';
import { GetFeaturedJobsQuery } from '@/gql/graphql';

// Convert the gql template literal to a string for nhost client
const GET_FEATURED_JOBS_QUERY = GET_FEATURED_JOBS.loc?.source.body || '';

export default function FeaturedJobs() {
  // Use React Query to fetch featured jobs using the query from the external file
  const { data, isLoading } = useQuery({
    queryKey: ['featuredJobs'],
    queryFn: async () => {
      const data = await graphqlRequest<GetFeaturedJobsQuery>(GET_FEATURED_JOBS_QUERY);
      return data?.jobs || [];
    },
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
  });

  // Access the jobs data from the query result
  const featuredJobs = data || [];

  return (
    <section>
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Jobs</h2>
        <Link
          href="/jobs"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all jobs →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading state
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse mb-2"></div>
                <div className="flex justify-between mt-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))
        ) : featuredJobs.length > 0 ? (
          // Jobs data
          featuredJobs.map(job => <JobCard key={job.id} job={job} />)
        ) : (
          // No jobs found
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No job listings found. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
