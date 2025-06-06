'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CREATE_COMPANY, CREATE_COMPANY_USER } from '@/graphql/mutations/createCompany';
import { useAuth } from '@/components/AuthContext';
import { graphqlRequest } from '@/lib/nhost-client';
import { DocumentNode } from 'graphql';
import { CreateCompanyMutation, CreateCompanyUserMutation } from '@/gql/graphql';

interface OrganizationCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function OrganizationCreation({ isOpen, onClose, onSuccess }: OrganizationCreationProps) {
  const { user: authUser } = useAuth();
  const [orgName, setOrgName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Define mutation functions using react-query
  const createCompanyMutation = useMutation({
    mutationFn: (name: string) => 
      graphqlRequest<CreateCompanyMutation>(
        (CREATE_COMPANY as unknown as DocumentNode).loc?.source.body || '',
        { name }
      ),
  });
  
  const createCompanyUserMutation = useMutation({
    mutationFn: ({ company_id, user_id }: { company_id: string; user_id: string }) => 
      graphqlRequest<CreateCompanyUserMutation>(
        (CREATE_COMPANY_USER as unknown as DocumentNode).loc?.source.body || '',
        { company_id, user_id }
      ),
  });
  
  // Function to handle organization creation
  const handleCreateOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create the company
      const createCompanyResult = await createCompanyMutation.mutateAsync(orgName);
      const companyId = createCompanyResult.insert_companies_one?.id;
      
      if (companyId) {
        // Create company-user relationship
        await createCompanyUserMutation.mutateAsync({
          company_id: companyId,
          user_id: authUser?.id
        });
        
        setSuccessMessage(`Organization "${orgName}" created successfully!`);
        setOrgName('');
        
        // Close modal after a delay
        setTimeout(() => {
          onClose();
          setSuccessMessage('');
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred while creating the organization'
      );
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create Organization</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {successMessage ? (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded">
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleCreateOrganization}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="orgName"
                name="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Enter organization name"
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
                disabled={isSubmitting || !orgName}
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (isSubmitting || !orgName) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
