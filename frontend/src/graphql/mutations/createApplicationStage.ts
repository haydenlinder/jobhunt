import { gql } from '@apollo/client';

export const CREATE_COMPANY = gql`
  mutation CreateApplicationStage(
    $job_id: uuid = ""
    $name: String = ""
    $description: String = ""
    $user_id: uuid = ""
  ) {
    insert_application_stages_one(
      object: { job_id: $job_id, name: $name, description: $description, user_id: $user_id }
    ) {
      id
    }
  }
`;
