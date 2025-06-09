import Link from 'next/link';
import JobSearchForm from '@/components/JobSearchForm';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-indigo-700 -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find Your Dream Job
          </h1>
          <p className="mt-6 text-xl max-w-2xl mx-auto">
            Connect with top companies and opportunities. Whether you&apos;re looking for your next
            career move or hiring talent, JobHunt has you covered.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-white px-4 py-3 text-base font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
            >
              Sign Up
            </Link>
            <Link
              href="/jobs"
              className="rounded-md bg-indigo-600 border border-white px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Job Search Form Component */}
      <JobSearchForm />

      {/* For Job Seekers and Employers Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">For Job Seekers</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Access thousands of job opportunities
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Create a profile to showcase your skills
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Apply with a single click</span>
            </li>
          </ul>
          <div className="mt-6">
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create an Account
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">For Employers</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Post job openings to reach qualified candidates
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Manage applications efficiently
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 text-green-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Branded company profile and careers page
              </span>
            </li>
          </ul>
          <div className="mt-6">
            <Link
              href="/signup?employer=true"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
