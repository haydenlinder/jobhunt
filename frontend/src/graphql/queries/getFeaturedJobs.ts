import { gql } from '@apollo/client';

export const GET_FEATURED_JOBS = gql`
  query GetFeaturedJobs {
    jobs(order_by: { created_at: desc }, limit: 3) {
      id
      title
      location
      description
      created_at
      company {
        id
        name
      }
    }
  }
`;
