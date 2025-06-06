'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GET_USER_COMPANIES } from '@/graphql/queries/getCompanies';
import { useAuth } from '@/components/AuthContext';
import { graphqlRequest } from '@/lib/nhost-client';
import { DocumentNode } from 'graphql';
import { CompanyCard } from '@/components/CompanyCard';
import { OrganizationCreation } from '@/components/OrganizationCreation';
import { GetUserCompaniesQuery } from '@/gql/graphql';


export default function OrganizationsPage() {
  // Get authenticated user
  const { user: authUser } = useAuth();
  
  // State for the create organization modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user companies data
  const { data: userCompaniesData, isLoading: isLoadingCompanies, refetch } = useQuery<GetUserCompaniesQuery>({
    queryKey: ['userCompanies', authUser?.id],
    queryFn: () => 
      graphqlRequest(
        GET_USER_COMPANIES.loc?.source.body || '', 
        { id: authUser?.id }
      ),
    enabled: !!authUser?.id,
  });
  
  // Handle successful organization creation
  const handleOrgCreationSuccess = () => {
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="sm:flex sm:items-baseline">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Organizations</h1>
          </div>
        </div>

        {/* Organizations */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Organizations</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Organization
            </button>
          </div>
          
          {isLoadingCompanies ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : userCompaniesData?.user?.company_users?.length ? (
            <div className="space-y-4">
              {userCompaniesData.user.company_users.map((companyUser, index) => (
                <CompanyCard 
                  key={index}
                  companyName={companyUser?.company?.name||""}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any organizations yet.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Your First Organization
              </button>
            </div>
          )}
        </div>

        {/* Organization Creation Modal */}
        <OrganizationCreation 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleOrgCreationSuccess}
        />
      </div>
    </div>
  );
}
