import { NhostClient } from '@nhost/nhost-js';

// Create Nhost client - matching the configuration from AuthContext
export const nhost =
  process.env.NODE_ENV === 'production'
    ? new NhostClient({
        subdomain: process.env.NEXT_PUBLIC_SUBDOMAIN,
        region: process.env.NEXT_PUBLIC_REGION,
      })
    : new NhostClient({
        subdomain: 'local',
        region: 'local',
        authUrl: 'https://local.auth.local.nhost.run',
        graphqlUrl: 'https://local.graphql.local.nhost.run',
        storageUrl: 'https://local.storage.local.nhost.run',
        functionsUrl: 'https://local.functions.local.nhost.run',
      });

// Generic GraphQL request function that can be used with react-query
export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  try {
    // Pass the query string directly as the first argument, and variables as the second
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await nhost.graphql.request<TData>(query, variables as any);

    if (error) {
      // Handle different error types
      if (Array.isArray(error)) {
        // It's a GraphQL error array
        throw new Error(error.map(e => e.message).join(', '));
      } else {
        // It's an ErrorPayload
        throw new Error(error.message || 'Unknown GraphQL error');
      }
    }

    return data;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
  }
}
