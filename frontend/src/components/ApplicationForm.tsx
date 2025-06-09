'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { nhost, graphqlRequest } from '@/lib/nhost-client';
import { CREATE_APPLICATION } from '@/graphql/mutations/createApplication';
import { CreateApplicationMutation, CreateApplicationMutationVariables } from '@/gql/graphql';

interface ApplicationFormProps {
  jobId: string;
  onSuccess?: () => void;
}

export function ApplicationForm({ jobId, onSuccess }: ApplicationFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createApplicationMutation = useMutation<
    CreateApplicationMutation,
    CreateApplicationMutationVariables
  >({
    mutationFn: (resumeUrl: string) =>
      graphqlRequest(CREATE_APPLICATION.loc?.source.body || '', {
        job_id: jobId,
        resume_url: resumeUrl,
      }),
    onSuccess: () => {
      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: err => {
      setError(
        `Failed to submit application: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a resume file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload file to Nhost storage
      const { error: uploadError, fileMetadata } = await nhost.storage.upload({
        file,
        name: `resumes/${jobId}/${Date.now()}-${file.name}`,
      });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (!fileMetadata) {
        throw new Error('File upload failed');
      }

      // Get the file URL
      const resumeUrl = nhost.storage.getPublicUrl({ fileId: fileMetadata.id });

      // Submit application with the file URL
      createApplicationMutation.mutate(resumeUrl);
    } catch (err) {
      setError(`File upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsUploading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
        <p className="text-green-700 dark:text-green-400 font-medium">
          Your application has been submitted successfully!
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Submit Your Application
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload Resume
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-indigo-50 file:text-indigo-700
                      dark:file:bg-indigo-900/20 dark:file:text-indigo-300
                      hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/30
                      file:cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Accepted formats: PDF, DOC, DOCX (Max. 5MB)
          </p>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  );
}
