import { gql } from '@apollo/client';

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($job_id: uuid = "", $resume_url: String = "", $company_id: uuid = "") {
    insert_applications_one(
      object: { job_id: $job_id, resume_url: $resume_url, company_id: $company_id }
    ) {
      id
      resume_url
    }
  }
`;
