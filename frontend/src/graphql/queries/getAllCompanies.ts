import { gql } from '@apollo/client';

export const GET_ALL_COMPANIES = gql`
  query getAllCompanies {
    companies {
      id
      name
      created_at
      updated_at
      jobs_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;
