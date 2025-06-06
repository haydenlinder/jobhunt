import { gql } from "@apollo/client";

export const GET_JOB_BY_ID = gql`
  query getJobById($id: uuid!) {
    jobs_by_pk(id: $id) {
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
