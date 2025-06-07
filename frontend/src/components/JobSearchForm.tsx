'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface JobSearchFormProps {
  initialTitle?: string;
  initialLocation?: string;
}

export default function JobSearchForm({
  initialTitle = '',
  initialLocation = '',
}: JobSearchFormProps) {
  const router = useRouter();
  const [searchTitle, setSearchTitle] = useState(initialTitle);
  const [searchLocation, setSearchLocation] = useState(initialLocation);

  // Handle job search
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    // Build search query parameters
    const params = new URLSearchParams();
    if (searchTitle) {
      params.append('title', searchTitle);
    }
    if (searchLocation) {
      params.append('location', searchLocation);
    }

    // Navigate to the jobs page with search parameters
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Find Your Perfect Role
        </h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              value={searchTitle}
              onChange={e => setSearchTitle(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Location or Remote"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
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
  );
}
