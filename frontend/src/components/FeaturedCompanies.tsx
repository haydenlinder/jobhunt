'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { graphqlRequest } from '@/lib/nhost-client';
import { GET_FEATURED_COMPANIES } from '@/graphql/queries/getFeaturedCompanies';
import { GetFeaturedCompaniesQuery } from '@/gql/graphql';

export default function FeaturedCompanies() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['featuredCompanies'],
    queryFn: async () => {
      const data = await graphqlRequest<GetFeaturedCompaniesQuery>(
        GET_FEATURED_COMPANIES.loc?.source.body || ''
      );
      return data?.companies || [];
    },
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
  });

  // Use first 3 companies or fallback to mock data if no data
  const featuredCompanies = data.slice(0, 3);

  return (
    <section>
      <div className="flex justify-between items-baseline mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Companies</h2>
        <Link
          href="/companies"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          View all companies →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? // Loading state
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                </div>
              ))
          : featuredCompanies.map(company => (
              <Link
                key={company.id}
                href={`company/${company.id}/jobs`}
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-indigo-600 dark:text-indigo-300 font-bold text-lg">
                    {company.name?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {company.name}
                </h3>
                <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {company.jobs_aggregate?.aggregate?.count || 0} open positions
                </p>
              </Link>
            ))}
      </div>
    </section>
  );
}
