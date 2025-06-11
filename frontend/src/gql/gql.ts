/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateApplication($job_id: uuid = \"\", $resume_url: String = \"\", $company_id: uuid = \"\") {\n    insert_applications_one(\n      object: { job_id: $job_id, resume_url: $resume_url, company_id: $company_id }\n    ) {\n      id\n      resume_url\n    }\n  }\n": typeof types.CreateApplicationDocument,
    "\n  mutation createCompany($name: String = \"\") {\n    insert_companies_one(object: { name: $name }) {\n      id\n      name\n    }\n  }\n": typeof types.CreateCompanyDocument,
    "\n  mutation createCompanyUser($company_id: uuid = \"\", $user_id: uuid = \"\") {\n    insert_company_users_one(object: { company_id: $company_id, user_id: $user_id }) {\n      id\n    }\n  }\n": typeof types.CreateCompanyUserDocument,
    "\n  mutation createJob(\n    $company_id: uuid = \"\"\n    $description: String = \"\"\n    $location: String = \"\"\n    $title: String = \"\"\n    $user_id: uuid = \"\"\n  ) {\n    insert_jobs_one(\n      object: {\n        company_id: $company_id\n        description: $description\n        location: $location\n        title: $title\n        user_id: $user_id\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.CreateJobDocument,
    "\n  mutation UpdateApplication(\n    $id: uuid = \"\"\n    $email: String = \"\"\n    $linkedin: String = \"\"\n    $website: String = \"\"\n    $skills: [String!] = \"\"\n    $relevant_skills: [String!] = \"\"\n    $years_of_experience: Int = 10\n    $match_score: Int = 0\n  ) {\n    update_applications_by_pk(\n      pk_columns: { id: $id }\n      _set: {\n        email: $email\n        linkedin: $linkedin\n        website: $website\n        skills: $skills\n        years_of_experience: $years_of_experience\n        relevant_skills: $relevant_skills\n        match_score: $match_score\n      }\n    ) {\n      id\n    }\n  }\n": typeof types.UpdateApplicationDocument,
    "\n  mutation updateJob($id: uuid!, $title: String, $location: String, $description: String) {\n    update_jobs_by_pk(\n      pk_columns: { id: $id }\n      _set: { title: $title, location: $location, description: $description }\n    ) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": typeof types.UpdateJobDocument,
    "\n  query getAllCompanies {\n    companies {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": typeof types.GetAllCompaniesDocument,
    "\n  query GetApplicationJobInfo($id: uuid = \"\") {\n    applications_by_pk(id: $id) {\n      job {\n        description\n        title\n        location\n      }\n    }\n  }\n": typeof types.GetApplicationJobInfoDocument,
    "\n  query getUserCompanies($id: uuid = \"\") {\n    user(id: $id) {\n      company_users {\n        company {\n          name\n          id\n        }\n      }\n    }\n  }\n": typeof types.GetUserCompaniesDocument,
    "\n  query GetFeaturedCompanies {\n    companies(order_by: { created_at: desc }, limit: 3) {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": typeof types.GetFeaturedCompaniesDocument,
    "\n  query GetFeaturedJobs {\n    jobs(order_by: { created_at: desc }, limit: 3) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetFeaturedJobsDocument,
    "\n  query getJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": typeof types.GetJobByIdDocument,
    "\n  query getJobs($company_id: uuid_comparison_exp = {}) {\n    jobs(where: { company_id: $company_id }) {\n      location\n      title\n      user_id\n      created_at\n      description\n      id\n      company {\n        name\n        id\n      }\n      applications_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": typeof types.GetJobsDocument,
    "\n  query getPostedJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n      applications {\n        id\n        resume_url\n        created_at\n        linkedin\n        website\n        email\n        years_of_experience\n        skills\n        relevant_skills\n        match_score\n      }\n    }\n  }\n": typeof types.GetPostedJobByIdDocument,
    "\n  query GetUserProfile($userId: uuid!) {\n    # Get companies where the user is associated\n    company_users(where: { user_id: { _eq: $userId } }) {\n      id\n      company {\n        id\n        name\n        created_at\n        jobs_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n\n    # Get jobs created by companies the user is associated with\n    # This would be useful for employers\n    jobs(where: { company: { company_users: { user_id: { _eq: $userId } } } }) {\n      id\n      title\n      location\n      created_at\n      company {\n        id\n        name\n      }\n    }\n\n    # Note: In a real application, you would also have a table for job applications\n    # For now, we'll simulate this with the available data\n  }\n": typeof types.GetUserProfileDocument,
    "\n  query searchJobs($title: String = \"\", $location: String = \"\") {\n    jobs(where: { _and: { title: { _iregex: $title }, location: { _iregex: $location } } }) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": typeof types.SearchJobsDocument,
};
const documents: Documents = {
    "\n  mutation CreateApplication($job_id: uuid = \"\", $resume_url: String = \"\", $company_id: uuid = \"\") {\n    insert_applications_one(\n      object: { job_id: $job_id, resume_url: $resume_url, company_id: $company_id }\n    ) {\n      id\n      resume_url\n    }\n  }\n": types.CreateApplicationDocument,
    "\n  mutation createCompany($name: String = \"\") {\n    insert_companies_one(object: { name: $name }) {\n      id\n      name\n    }\n  }\n": types.CreateCompanyDocument,
    "\n  mutation createCompanyUser($company_id: uuid = \"\", $user_id: uuid = \"\") {\n    insert_company_users_one(object: { company_id: $company_id, user_id: $user_id }) {\n      id\n    }\n  }\n": types.CreateCompanyUserDocument,
    "\n  mutation createJob(\n    $company_id: uuid = \"\"\n    $description: String = \"\"\n    $location: String = \"\"\n    $title: String = \"\"\n    $user_id: uuid = \"\"\n  ) {\n    insert_jobs_one(\n      object: {\n        company_id: $company_id\n        description: $description\n        location: $location\n        title: $title\n        user_id: $user_id\n      }\n    ) {\n      id\n    }\n  }\n": types.CreateJobDocument,
    "\n  mutation UpdateApplication(\n    $id: uuid = \"\"\n    $email: String = \"\"\n    $linkedin: String = \"\"\n    $website: String = \"\"\n    $skills: [String!] = \"\"\n    $relevant_skills: [String!] = \"\"\n    $years_of_experience: Int = 10\n    $match_score: Int = 0\n  ) {\n    update_applications_by_pk(\n      pk_columns: { id: $id }\n      _set: {\n        email: $email\n        linkedin: $linkedin\n        website: $website\n        skills: $skills\n        years_of_experience: $years_of_experience\n        relevant_skills: $relevant_skills\n        match_score: $match_score\n      }\n    ) {\n      id\n    }\n  }\n": types.UpdateApplicationDocument,
    "\n  mutation updateJob($id: uuid!, $title: String, $location: String, $description: String) {\n    update_jobs_by_pk(\n      pk_columns: { id: $id }\n      _set: { title: $title, location: $location, description: $description }\n    ) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": types.UpdateJobDocument,
    "\n  query getAllCompanies {\n    companies {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": types.GetAllCompaniesDocument,
    "\n  query GetApplicationJobInfo($id: uuid = \"\") {\n    applications_by_pk(id: $id) {\n      job {\n        description\n        title\n        location\n      }\n    }\n  }\n": types.GetApplicationJobInfoDocument,
    "\n  query getUserCompanies($id: uuid = \"\") {\n    user(id: $id) {\n      company_users {\n        company {\n          name\n          id\n        }\n      }\n    }\n  }\n": types.GetUserCompaniesDocument,
    "\n  query GetFeaturedCompanies {\n    companies(order_by: { created_at: desc }, limit: 3) {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": types.GetFeaturedCompaniesDocument,
    "\n  query GetFeaturedJobs {\n    jobs(order_by: { created_at: desc }, limit: 3) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": types.GetFeaturedJobsDocument,
    "\n  query getJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": types.GetJobByIdDocument,
    "\n  query getJobs($company_id: uuid_comparison_exp = {}) {\n    jobs(where: { company_id: $company_id }) {\n      location\n      title\n      user_id\n      created_at\n      description\n      id\n      company {\n        name\n        id\n      }\n      applications_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n": types.GetJobsDocument,
    "\n  query getPostedJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n      applications {\n        id\n        resume_url\n        created_at\n        linkedin\n        website\n        email\n        years_of_experience\n        skills\n        relevant_skills\n        match_score\n      }\n    }\n  }\n": types.GetPostedJobByIdDocument,
    "\n  query GetUserProfile($userId: uuid!) {\n    # Get companies where the user is associated\n    company_users(where: { user_id: { _eq: $userId } }) {\n      id\n      company {\n        id\n        name\n        created_at\n        jobs_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n\n    # Get jobs created by companies the user is associated with\n    # This would be useful for employers\n    jobs(where: { company: { company_users: { user_id: { _eq: $userId } } } }) {\n      id\n      title\n      location\n      created_at\n      company {\n        id\n        name\n      }\n    }\n\n    # Note: In a real application, you would also have a table for job applications\n    # For now, we'll simulate this with the available data\n  }\n": types.GetUserProfileDocument,
    "\n  query searchJobs($title: String = \"\", $location: String = \"\") {\n    jobs(where: { _and: { title: { _iregex: $title }, location: { _iregex: $location } } }) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n": types.SearchJobsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateApplication($job_id: uuid = \"\", $resume_url: String = \"\", $company_id: uuid = \"\") {\n    insert_applications_one(\n      object: { job_id: $job_id, resume_url: $resume_url, company_id: $company_id }\n    ) {\n      id\n      resume_url\n    }\n  }\n"): (typeof documents)["\n  mutation CreateApplication($job_id: uuid = \"\", $resume_url: String = \"\", $company_id: uuid = \"\") {\n    insert_applications_one(\n      object: { job_id: $job_id, resume_url: $resume_url, company_id: $company_id }\n    ) {\n      id\n      resume_url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCompany($name: String = \"\") {\n    insert_companies_one(object: { name: $name }) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createCompany($name: String = \"\") {\n    insert_companies_one(object: { name: $name }) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createCompanyUser($company_id: uuid = \"\", $user_id: uuid = \"\") {\n    insert_company_users_one(object: { company_id: $company_id, user_id: $user_id }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createCompanyUser($company_id: uuid = \"\", $user_id: uuid = \"\") {\n    insert_company_users_one(object: { company_id: $company_id, user_id: $user_id }) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createJob(\n    $company_id: uuid = \"\"\n    $description: String = \"\"\n    $location: String = \"\"\n    $title: String = \"\"\n    $user_id: uuid = \"\"\n  ) {\n    insert_jobs_one(\n      object: {\n        company_id: $company_id\n        description: $description\n        location: $location\n        title: $title\n        user_id: $user_id\n      }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createJob(\n    $company_id: uuid = \"\"\n    $description: String = \"\"\n    $location: String = \"\"\n    $title: String = \"\"\n    $user_id: uuid = \"\"\n  ) {\n    insert_jobs_one(\n      object: {\n        company_id: $company_id\n        description: $description\n        location: $location\n        title: $title\n        user_id: $user_id\n      }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateApplication(\n    $id: uuid = \"\"\n    $email: String = \"\"\n    $linkedin: String = \"\"\n    $website: String = \"\"\n    $skills: [String!] = \"\"\n    $relevant_skills: [String!] = \"\"\n    $years_of_experience: Int = 10\n    $match_score: Int = 0\n  ) {\n    update_applications_by_pk(\n      pk_columns: { id: $id }\n      _set: {\n        email: $email\n        linkedin: $linkedin\n        website: $website\n        skills: $skills\n        years_of_experience: $years_of_experience\n        relevant_skills: $relevant_skills\n        match_score: $match_score\n      }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateApplication(\n    $id: uuid = \"\"\n    $email: String = \"\"\n    $linkedin: String = \"\"\n    $website: String = \"\"\n    $skills: [String!] = \"\"\n    $relevant_skills: [String!] = \"\"\n    $years_of_experience: Int = 10\n    $match_score: Int = 0\n  ) {\n    update_applications_by_pk(\n      pk_columns: { id: $id }\n      _set: {\n        email: $email\n        linkedin: $linkedin\n        website: $website\n        skills: $skills\n        years_of_experience: $years_of_experience\n        relevant_skills: $relevant_skills\n        match_score: $match_score\n      }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateJob($id: uuid!, $title: String, $location: String, $description: String) {\n    update_jobs_by_pk(\n      pk_columns: { id: $id }\n      _set: { title: $title, location: $location, description: $description }\n    ) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateJob($id: uuid!, $title: String, $location: String, $description: String) {\n    update_jobs_by_pk(\n      pk_columns: { id: $id }\n      _set: { title: $title, location: $location, description: $description }\n    ) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllCompanies {\n    companies {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getAllCompanies {\n    companies {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetApplicationJobInfo($id: uuid = \"\") {\n    applications_by_pk(id: $id) {\n      job {\n        description\n        title\n        location\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetApplicationJobInfo($id: uuid = \"\") {\n    applications_by_pk(id: $id) {\n      job {\n        description\n        title\n        location\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getUserCompanies($id: uuid = \"\") {\n    user(id: $id) {\n      company_users {\n        company {\n          name\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUserCompanies($id: uuid = \"\") {\n    user(id: $id) {\n      company_users {\n        company {\n          name\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFeaturedCompanies {\n    companies(order_by: { created_at: desc }, limit: 3) {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFeaturedCompanies {\n    companies(order_by: { created_at: desc }, limit: 3) {\n      id\n      name\n      created_at\n      updated_at\n      jobs_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFeaturedJobs {\n    jobs(order_by: { created_at: desc }, limit: 3) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFeaturedJobs {\n    jobs(order_by: { created_at: desc }, limit: 3) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query getJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getJobs($company_id: uuid_comparison_exp = {}) {\n    jobs(where: { company_id: $company_id }) {\n      location\n      title\n      user_id\n      created_at\n      description\n      id\n      company {\n        name\n        id\n      }\n      applications_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getJobs($company_id: uuid_comparison_exp = {}) {\n    jobs(where: { company_id: $company_id }) {\n      location\n      title\n      user_id\n      created_at\n      description\n      id\n      company {\n        name\n        id\n      }\n      applications_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPostedJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n      applications {\n        id\n        resume_url\n        created_at\n        linkedin\n        website\n        email\n        years_of_experience\n        skills\n        relevant_skills\n        match_score\n      }\n    }\n  }\n"): (typeof documents)["\n  query getPostedJobById($id: uuid!) {\n    jobs_by_pk(id: $id) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n      applications {\n        id\n        resume_url\n        created_at\n        linkedin\n        website\n        email\n        years_of_experience\n        skills\n        relevant_skills\n        match_score\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserProfile($userId: uuid!) {\n    # Get companies where the user is associated\n    company_users(where: { user_id: { _eq: $userId } }) {\n      id\n      company {\n        id\n        name\n        created_at\n        jobs_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n\n    # Get jobs created by companies the user is associated with\n    # This would be useful for employers\n    jobs(where: { company: { company_users: { user_id: { _eq: $userId } } } }) {\n      id\n      title\n      location\n      created_at\n      company {\n        id\n        name\n      }\n    }\n\n    # Note: In a real application, you would also have a table for job applications\n    # For now, we'll simulate this with the available data\n  }\n"): (typeof documents)["\n  query GetUserProfile($userId: uuid!) {\n    # Get companies where the user is associated\n    company_users(where: { user_id: { _eq: $userId } }) {\n      id\n      company {\n        id\n        name\n        created_at\n        jobs_aggregate {\n          aggregate {\n            count\n          }\n        }\n      }\n    }\n\n    # Get jobs created by companies the user is associated with\n    # This would be useful for employers\n    jobs(where: { company: { company_users: { user_id: { _eq: $userId } } } }) {\n      id\n      title\n      location\n      created_at\n      company {\n        id\n        name\n      }\n    }\n\n    # Note: In a real application, you would also have a table for job applications\n    # For now, we'll simulate this with the available data\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchJobs($title: String = \"\", $location: String = \"\") {\n    jobs(where: { _and: { title: { _iregex: $title }, location: { _iregex: $location } } }) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query searchJobs($title: String = \"\", $location: String = \"\") {\n    jobs(where: { _and: { title: { _iregex: $title }, location: { _iregex: $location } } }) {\n      id\n      title\n      location\n      description\n      created_at\n      company {\n        id\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;