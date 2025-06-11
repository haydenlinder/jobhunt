import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { nhost } from '@/lib/nhost-client';
import { UPDATE_APPLICATION } from '@/graphql/mutations/updateApplication';
import { GET_APPLICATION_JOB_INFO } from '@/graphql/queries/getApplicationJobInfo';
import {
  GetApplicationJobInfoQuery,
  UpdateApplicationMutation,
  UpdateApplicationMutationVariables,
} from '@/gql/graphql';

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Request must be multipart/form-data' }, { status: 400 });
    }

    // Parse the form data to get the resume and applicationId
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File | null;
    const applicationId = formData.get('applicationId') as string | null;

    let job:
      | Exclude<GetApplicationJobInfoQuery['applications_by_pk'], null | undefined>['job']
      | undefined = undefined;
    if (applicationId) {
      try {
        const res = await nhost.graphql.request<GetApplicationJobInfoQuery>(
          GET_APPLICATION_JOB_INFO.loc?.source.body || '',
          {
            id: applicationId,
          },
          {
            headers: {
              'x-hasura-admin-secret': process.env.GRAPHQL_ADMIN_SECRET || '',
            },
          }
        );
        job = res.data?.applications_by_pk?.job;
      } catch (error) {
        console.error('Error updating application in Nhost:', error);
        // Continue execution even if update fails - still return the parsed data
      }
    }

    if (!resumeFile) {
      return NextResponse.json({ error: 'No resume provided' }, { status: 400 });
    }

    // Check if the file is a PDF
    if (resumeFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Create a file object for OpenAI using the raw File API
    const file = await client.files.create({
      file: resumeFile,
      purpose: 'user_data',
    });

    // Send the file to OpenAI for processing using the responses API
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_file',
              file_id: file.id,
            },
            {
              type: 'input_text',
              text:
                'This is a resume. Below is the job description. Extract and return ONLY the following information in JSON format:\n' +
                "1. name: The applicant's full name\n" +
                '2. website: Their website URL (if present)\n' +
                '3. linkedin: Their linkedin URL (if present)\n' +
                '4. email: Their email address\n\n' +
                '5. years_of_experience: Years of experience (work experience only)\n\n' +
                '6. skills: Skills (ordered by top skills)\n\n' +
                '7. relevant_skills: Skills Relevant to the job description (ordered by top skills)\n\n' +
                '8. match_score: an integer between 0 and 100 inclusive, which scores how good of a match this applicant is with the job\n\n' +
                'Format the response as a valid JSON object. ' +
                'If any information is not found, use null for that field. ' +
                'For example: {"name": "John Doe", "website": "johndoe.com", "email": "john@example.com", linkedin: "https://linkedin.com/in/johndoe", years_of_experience: "3", skills: "[\"carpentry\", \"microsoft office\"]", relevant_skills: "[\"microsoft office\"]"}' +
                `\n\nJob Title: ${job?.title}\n` +
                `\n\nJob Location: ${job?.location}\n` +
                `\n\nJob description: \n` +
                `${job?.description}`,
            },
          ],
        },
      ],
    });

    // Parse the response from OpenAI
    let resumeData;
    try {
      // Get the content from the response
      const responseText = response.output_text || '';

      // Clean the response if it contains markdown code blocks
      let jsonString = responseText;
      // Remove ```json at the beginning if it exists
      jsonString = jsonString.replace(/^```json\s*/m, '');
      // Remove ``` at the end if it exists
      jsonString = jsonString.replace(/\s*```$/m, '');

      resumeData = JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing OpenAI response as JSON:', e);
      // Fallback structure if parsing fails
      resumeData = {
        name: null,
        website: null,
        email: null,
      };
    }
    console.log({ applicationId });

    // If applicationId is provided, update the application in Nhost
    if (applicationId) {
      try {
        await nhost.graphql.request<UpdateApplicationMutation, UpdateApplicationMutationVariables>(
          UPDATE_APPLICATION.loc?.source.body || '',
          {
            id: applicationId,
            email: resumeData.email || null,
            linkedin: resumeData.linkedin || null,
            website: resumeData.website || null,
            skills: resumeData.skills || null,
            years_of_experience: resumeData.years_of_experience || null,
            relevant_skills: resumeData.relevant_skills || null,
            match_score: resumeData.match_score ?? null,
          },
          {
            headers: {
              'x-hasura-admin-secret': process.env.GRAPHQL_ADMIN_SECRET || '',
            },
          }
        );
      } catch (error) {
        console.error('Error updating application in Nhost:', error);
        // Continue execution even if update fails - still return the parsed data
      }
    }

    // Return the structured resume data
    return NextResponse.json(resumeData);
  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}

// Configure route options for Next.js App Router
export const config = {
  api: {
    // The App Router doesn't use bodyParser config the same way
    responseLimit: '8mb',
  },
};
