import { gql } from '@apollo/client';

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication(
    $id: uuid = ""
    $email: String = ""
    $linkedin: String = ""
    $website: String = ""
    $name: String = ""
  ) {
    update_applications_by_pk(
      pk_columns: { id: $id }
      _set: { email: $email, linkedin: $linkedin, website: $website, name: $name }
    ) {
      id
    }
  }
`;
