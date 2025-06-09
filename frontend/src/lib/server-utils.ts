import { GET_JOB_BY_ID } from '@/graphql/queries/getJobById';
import { GetJobByIdQuery } from '@/gql/graphql';
import { graphqlRequest } from './nhost-client';

// Helper function for server-side GraphQL requests using nhost client
export async function getJobById(jobId: string): Promise<GetJobByIdQuery> {
  try {
    // Using the nhost client to fetch job data
    const data = await graphqlRequest<GetJobByIdQuery>(GET_JOB_BY_ID.loc?.source.body || '', {
      id: jobId,
    });

    return data;
  } catch (error) {
    console.error('Error fetching job data:', error);
    throw new Error('Failed to fetch job data');
  }
}
