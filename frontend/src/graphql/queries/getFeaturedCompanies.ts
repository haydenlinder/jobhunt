import { gql } from "@apollo/client";

export const GET_FEATURED_COMPANIES = gql`
  query GetFeaturedCompanies {
    companies(order_by: { created_at: desc }, limit: 3) {
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
