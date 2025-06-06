import { gql } from "@apollo/client";

export const SEARCH_JOBS = gql`
  query searchJobs($title: String = "", $location: String = "") {
  jobs(where: {_and: { title: {_iregex: $title}, location: {_iregex: $location}}}) {
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
