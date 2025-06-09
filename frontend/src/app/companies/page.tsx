'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import FeaturedCompanies from '@/components/FeaturedCompanies';

export default function CompaniesPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Grow Your Team with JobHunt</h1>
          <p className="text-lg md:text-xl mb-8">
            Post unlimited jobs for free and connect with the best candidates in your industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/signup"
                  className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg shadow-md transition-all"
                >
                  Sign Up Now
                </Link>
                <Link
                  href="/login"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-lg transition-all"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard/organizations"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg shadow-md transition-all"
              >
                Manage My Organizations
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Why Companies Choose JobHunt
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Post Unlimited Jobs
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No limits, no hidden fees. Post as many positions as you need to build your perfect
              team.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              See the Best Talent First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our smart matching algorithm shows you the most qualified candidates for your
              positions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-600 dark:text-indigo-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Simple and Effective
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easy-to-use dashboard to manage applications and communicate with candidates.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 p-8 rounded-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Create Your Account
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Sign up and create your company profile in minutes.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Post Your Jobs
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily create and publish job listings with our intuitive interface.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              Connect with Talent
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Review applications and connect with the best candidates for your positions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-50 dark:bg-gray-800 p-8 md:p-12 rounded-xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Ready to Find Your Next Team Member?
        </h2>
        <p className="text-lg mb-8 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Join thousands of companies that trust JobHunt to help them build their teams with top
          talent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isAuthenticated ? (
            <>
              <Link
                href="/signup"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium text-lg shadow-md transition-all"
              >
                Get Started For Free
              </Link>
              <Link
                href="/login"
                className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium text-lg transition-all"
              >
                Log In
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard/jobs"
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium text-lg shadow-md transition-all"
            >
              Post a Job
            </Link>
          )}
        </div>
      </section>

      {/* Featured Companies Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Companies Using JobHunt
        </h2>
        <FeaturedCompanies />
      </section>
    </div>
  );
}
