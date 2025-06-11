import { gql } from '@apollo/client';

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication(
    $id: uuid = ""
    $email: String = ""
    $linkedin: String = ""
    $website: String = ""
    $skills: [String!] = ""
    $relevant_skills: [String!] = ""
    $years_of_experience: Int = 10
    $match_score: Int = 0
  ) {
    update_applications_by_pk(
      pk_columns: { id: $id }
      _set: {
        email: $email
        linkedin: $linkedin
        website: $website
        skills: $skills
        years_of_experience: $years_of_experience
        relevant_skills: $relevant_skills
        match_score: $match_score
      }
    ) {
      id
    }
  }
`;
