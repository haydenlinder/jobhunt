import { gql } from "@apollo/client";

export const GET_USER_COMPANIES = gql`
query getUserCompanies($id: uuid = "") {
  user(id: $id) {
    company_users {
      company {
        name
        id
      }
    }
  }
}`