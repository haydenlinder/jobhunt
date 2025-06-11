'use client';

import { Applications } from '@/gql/graphql';
import { useState, useEffect } from 'react';

export function ApplicationDetail({
  application: { resume_url, id, linkedin, email, website, years_of_experience, skills, relevant_skills, match_score },
}: {
  application: Partial<Applications>;
}) {
  const [parsedData, setParsedData] = useState<null | Partial<Applications>>({ resume_url, id, linkedin, email, website, years_of_experience, skills, relevant_skills, match_score });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseResume = async () => {
      if (!resume_url) return;
      console.log({match_score})
      if (typeof match_score === 'number')
        return 

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
        console.log({ data });
        setParsedData(data);
      } catch (err) {
        console.error('Error parsing resume:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    parseResume();
  }, [resume_url]);

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
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md space-y-3">
        <Resume url={resume_url || ''} />

        {parsedData.name && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Name:
            </span>
            <span className="text-gray-900 dark:text-white">{parsedData.name}</span>
          </div>
        )}
        
        {typeof parsedData.match_score === 'number' && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Match Score:
            </span>
            {parsedData.match_score > 70 ? 
            <span className="text-gray-900 bg-green-800 p-1 rounded-full text-center dark:text-white">{parsedData.match_score}</span>
            :
            <span className="text-gray-900 bg-yellow-800 p-1 rounded-full text-center dark:text-white">{parsedData.match_score}</span>
            }
          </div>
        )}

        {parsedData.years_of_experience && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Years of experience:
            </span>
            <span className="text-gray-900 dark:text-white">{parsedData.years_of_experience}</span>
          </div>
        )}

        {parsedData.skills && (
          <div className="max-w-full">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
              Top Skills:
            </span>
            <div className="flex flex-wrap gap-1">
              {parsedData.skills?.slice(0, 5).map((skill, i) => {
                if (parsedData.relevant_skills?.includes(skill)) 
                return (
                <div
                  key={`${skill}-${i}`}
                  className="text-gray-900 bg-green-800 py-1 px-2 rounded dark:text-white h-fit"
                >
                  {skill}
                </div>
                )
                else return (
                  <div
                  key={`${skill}-${i}`}
                  className="text-gray-900 bg-gray-800 py-1 px-2 rounded dark:text-white h-fit"
                >
                  {skill}
                </div>
                )
              })}
            </div>
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
              href={
                parsedData.linkedin.startsWith('http')
                  ? parsedData.linkedin
                  : `https://${parsedData.linkedin}`
              }
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

const Resume = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <svg
        className="h-5 w-5 flex-shrink-0 text-indigo-500 dark:text-indigo-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <div className="ml-2">resume</div>
    </a>
  );
};
