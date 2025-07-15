'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CREATE_JOB } from '@/graphql/mutations/createJob';
import { GET_USER_COMPANIES } from '@/graphql/queries/getCompanies';
import { useAuth } from '@/components/AuthContext';
import { graphqlRequest } from '@/lib/nhost-client';
import { DocumentNode } from 'graphql';
import {
  CreateJobMutation,
  CreateJobMutationVariables,
  GetUserCompaniesQuery,
} from '@/gql/graphql';

interface JobCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    title?: string;
    description?: string;
    location?: string;
    companyId?: string;
  };
}

interface Company {
  id: string;
  name: string;
}

export function JobCreation({ isOpen, onClose, onSuccess, initialData }: JobCreationProps) {
  const { user: authUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);

  // Fetch user's companies
  const { data: companiesData } = useQuery({
    queryKey: ['userCompanies', authUser?.id],
    queryFn: () =>
      graphqlRequest<GetUserCompaniesQuery>(
        (GET_USER_COMPANIES as unknown as DocumentNode).loc?.source.body || '',
        { id: authUser?.id }
      ),
    enabled: !!authUser?.id,
  });

  // Update companies when data changes
  useEffect(() => {
    if (companiesData?.user?.company_users) {
      const formattedCompanies = companiesData.user.company_users.map(cu => ({
        id: cu.company?.id || '',
        name: cu.company?.name || '',
      }));
      setCompanies(formattedCompanies);

      // Set default company if available and not already set
      if (formattedCompanies.length > 0 && !companyId) {
        setCompanyId(formattedCompanies[0].id);
      }
    }
  }, [companiesData, companyId]);

  // Populate form with initial data when provided (for duplication)
  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setLocation(initialData.location || '');
      if (initialData.companyId) {
        setCompanyId(initialData.companyId);
      }
    }
  }, [initialData, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setLocation('');
      setCompanyId('');
      setError('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  // Define job creation mutation
  const createJobMutation = useMutation({
    mutationFn: (jobData: CreateJobMutationVariables) =>
      graphqlRequest<CreateJobMutation, CreateJobMutationVariables>(
        CREATE_JOB.loc?.source.body || '',
        jobData
      ),
  });

  // Function to handle job creation
  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create the job
      await createJobMutation.mutateAsync({
        company_id: companyId,
        description,
        location,
        title,
        user_id: authUser?.id || '',
      });

      setSuccessMessage(`Job "${title}" created successfully!`);

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');

      // Close modal after a delay
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the job');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {initialData ? 'Duplicate Job Posting' : 'Create Job Posting'}
          </h3>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {successMessage ? (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleCreateJob}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="companySelect"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Company
              </label>
              <select
                id="companySelect"
                value={companyId}
                onChange={e => setCompanyId(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                required
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter job title"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter job location"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter job description"
                required
              />
            </div>

            <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title || !companyId || !location}
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting || !title || !companyId || !location
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
