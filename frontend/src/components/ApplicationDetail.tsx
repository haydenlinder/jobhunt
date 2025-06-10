'use client';

import { Applications } from '@/gql/graphql';
import { useState, useEffect } from 'react';

interface ParsedResumeData {
  name: string | null;
  website: string | null;
  email: string | null;
  linkedin: string | null;
  resume_url: string;
}

export function ApplicationDetail({
  application: { resume_url, id, linkedin, email, website },
}: {
  application: Partial<Applications>;
}) {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null | Partial<Applications>>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseResume = async () => {
      if (!resume_url) return;
      if (email) return setParsedData({ resume_url, linkedin, email, website });

      setIsLoading(true);
      setError(null);

      try {
        // First, fetch the PDF file from the resume URL
        const resumeResponse = await fetch(resume_url);
        if (!resumeResponse.ok) {
          throw new Error('Failed to fetch resume file');
        }

        const resumeBlob = await resumeResponse.blob();
        const resumeFile = new File([resumeBlob], 'resume.pdf', { type: 'application/pdf' });

        // Create form data to send to the parse-resume endpoint
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('applicationId', id);

        // Call the parse-resume endpoint
        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to parse resume');
        }

        const data = await response.json();
        setParsedData(data);
      } catch (err) {
        console.error('Error parsing resume:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    parseResume();
  }, [resume_url, linkedin, email, website, id]);

  if (isLoading) {
    return (
      <div className="py-3">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-3 text-red-500 dark:text-red-400">
        <p>Error parsing resume: {error}</p>
      </div>
    );
  }

  if (!parsedData) {
    return null;
  }

  return (
    <div className="pt-3">
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">Parsed Resume Information</h3>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md space-y-3">
        {parsedData.name && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Name:
            </span>
            <span className="text-gray-900 dark:text-white">{parsedData.name}</span>
          </div>
        )}

        {parsedData.email && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Email:
            </span>
            <a
              href={`mailto:${parsedData.email}`}
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {parsedData.email}
            </a>
          </div>
        )}

        {parsedData.website && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Website:
            </span>
            <a
              href={
                parsedData.website.startsWith('http')
                  ? parsedData.website
                  : `https://${parsedData.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {parsedData.website}
            </a>
          </div>
        )}

        {parsedData.linkedin && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              LinkedIn:
            </span>
            <a
              href={parsedData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {parsedData.linkedin}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
