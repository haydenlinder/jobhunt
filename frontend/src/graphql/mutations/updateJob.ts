import { gql } from '@apollo/client';

export const UPDATE_JOB = gql`
  mutation updateJob($id: uuid!, $title: String, $location: String, $description: String) {
    update_jobs_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title, location: $location, description: $description }
    ) {
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
