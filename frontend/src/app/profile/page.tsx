'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { nhost } from '@/lib/nhost-client';
import { GET_USER_PROFILE } from '@/graphql/queries/getUserProfile';
import { GetUserProfileQuery } from '@/gql/graphql';

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Use react-query to fetch profile data
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await nhost.graphql.request<GetUserProfileQuery>(GET_USER_PROFILE, {
        userId: user.id,
      });

      if (error) {
        throw new Error(
          Array.isArray(error)
            ? error.map(e => e.message).join(', ')
            : error.message || 'Unknown error'
        );
      }

      return data;
    },
    enabled: !!user?.id && isAuthenticated,
  });

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load profile data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">
          You need to be signed in to view your profile
        </h2>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // User's metadata containing personal information
  const userMetadata = user.metadata || {};
  const firstName = userMetadata.firstName || '';
  const lastName = userMetadata.lastName || '';
  const isEmployer = profileData?.company_users && profileData.company_users.length > 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="sm:flex sm:items-baseline">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-800 dark:text-gray-200">
                  {`${firstName}`} {`${lastName}`}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-800 dark:text-gray-200">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/profile/edit"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {!isEmployer && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Resume & Skills
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-6 flex flex-col items-center justify-center">
                <svg
                  className="h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  No resume uploaded yet
                </p>
                <button className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  Upload Resume
                </button>
              </div>
              <div className="mt-6">
                <Link
                  href="/profile/skills"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Update Skills
                </Link>
              </div>
            </div>
          )}

          {isEmployer && profileData?.company_users && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Your Organizations
              </h3>
              <div className="space-y-4">
                {profileData.company_users.map(companyUser => (
                  <div key={companyUser.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                    <h4 className="font-medium">{companyUser.company?.name}</h4>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        Job Postings: {companyUser.company?.jobs_aggregate?.aggregate?.count || 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
