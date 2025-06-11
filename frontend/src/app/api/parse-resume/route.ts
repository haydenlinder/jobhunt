import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { nhost } from '@/lib/nhost-client';
import { UPDATE_APPLICATION } from '@/graphql/mutations/updateApplication';

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
                'This is a resume. Extract and return ONLY the following information in JSON format:\n' +
                "1. The applicant's full name\n" +
                '2. Their website URL (if present)\n' +
                '2. Their linkedin URL (if present)\n' +
                '3. Their email address\n\n' +
                'Format the response as a valid JSON object with the keys: "name", "website", and "email". ' +
                'If any information is not found, use null for that field. ' +
                'For example: {"name": "John Doe", "website": "johndoe.com", "email": "john@example.com", linkedin: "https://linkedin.com/in/johndoe"}',
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
        await nhost.graphql.request(
          UPDATE_APPLICATION.loc?.source.body || '',
          {
            id: applicationId,
            email: resumeData.email || null,
            linkedin: resumeData.linkedin || null,
            website: resumeData.website || null,
          },
          {
            headers: {
              'x-hasura-admin-secret': process.env.GRAPHQL_ADMIN_SECRET || "",
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
