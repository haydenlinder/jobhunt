import { gql } from "@apollo/client";

export const GET_JOBS = gql`
  query getJobs($company_id: uuid_comparison_exp = {}) {
    jobs(where: {company_id: $company_id}) {
      location
      title
      user_id
      created_at
      description
      id
    }
  }
`;
