import { gql } from "@apollo/client";

export const CREATE_COMPANY = gql`
    mutation createCompany($name: String = "") {
        insert_companies_one(object: {name: $name}) {
            id
            name
        }
    }
`;

export const CREATE_COMPANY_USER = gql`
    mutation createCompanyUser($company_id: uuid = "", $user_id: uuid = "") {
        insert_company_users_one(object: {company_id: $company_id, user_id: $user_id}) {
            id
        }
    }
`;
