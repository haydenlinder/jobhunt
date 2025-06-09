'use client';

import { useState } from 'react';
import { ServerApplicationForm } from './ServerApplicationForm';

interface JobApplicationButtonProps {
  jobId: string;
  companyId: string;
}

export function JobApplicationButton({ jobId, companyId }: JobApplicationButtonProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  return (
    <>
      {!showApplicationForm ? (
        <button
          onClick={() => setShowApplicationForm(true)}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Now
        </button>
      ) : (
        <ServerApplicationForm jobId={jobId} companyId={companyId} />
      )}
    </>
  );
}
