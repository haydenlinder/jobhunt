import { gql } from '@apollo/client';

export const UPDATE_APPLICATION_STAGE = gql`
  mutation UpdateApplicationStage($id: uuid = "", $stage_id: uuid = "") {
    update_applications_by_pk(pk_columns: { id: $id }, _set: { stage_id: $stage_id }) {
      id
    }
  }
`;
