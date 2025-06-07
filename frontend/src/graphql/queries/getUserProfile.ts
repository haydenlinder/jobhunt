import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: uuid!) {
    # Get companies where the user is associated
    company_users(where: { user_id: { _eq: $userId } }) {
      id
      company {
        id
        name
        created_at
        jobs_aggregate {
          aggregate {
            count
          }
        }
      }
    }

    # Get jobs created by companies the user is associated with
    # This would be useful for employers
    jobs(where: { company: { company_users: { user_id: { _eq: $userId } } } }) {
      id
      title
      location
      created_at
      company {
        id
        name
      }
    }

    # Note: In a real application, you would also have a table for job applications
    # For now, we'll simulate this with the available data
  }
`;
