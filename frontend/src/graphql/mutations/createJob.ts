import { gql } from '@apollo/client';

export const CREATE_JOB = gql`
  mutation createJob(
    $company_id: uuid = ""
    $description: String = ""
    $location: String = ""
    $title: String = ""
    $user_id: uuid = ""
  ) {
    insert_jobs_one(
      object: {
        company_id: $company_id
        description: $description
        location: $location
        title: $title
        user_id: $user_id
      }
    ) {
      id
    }
  }
`;
