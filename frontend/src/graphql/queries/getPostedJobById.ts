import { gql } from '@apollo/client';

export const GET_POSTED_JOB_BY_ID = gql`
  query getPostedJobById($id: uuid!) {
    jobs_by_pk(id: $id) {
      id
      title
      location
      description
      created_at
      company {
        id
        name
      }
      application_stages {
        id
        name
        description
      }
      applications {
        id
        stage
        job_id
        resume_url
        created_at
        linkedin
        website
        email
        years_of_experience
        skills
        relevant_skills
        match_score
        stage_id
      }
    }
  }
`;
