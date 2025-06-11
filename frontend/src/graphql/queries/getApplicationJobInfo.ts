import { gql } from '@apollo/client';

export const GET_APPLICATION_JOB_INFO = gql`
  query GetApplicationJobInfo($id: uuid = "") {
    applications_by_pk(id: $id) {
      job {
        description
        title
        location
      }
    }
  }
`;
