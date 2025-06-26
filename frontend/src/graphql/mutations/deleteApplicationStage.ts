import { gql } from '@apollo/client';

export const DELETE_APPLICATION_STAGE = gql`
  mutation DeleteApplicationStage($id: uuid!) {
    delete_application_stages_by_pk(id: $id) {
      id
    }
  }
`;
