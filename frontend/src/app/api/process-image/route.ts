import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { convertToImage } from '@/utils/image-processing/file-converter';

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Request must be multipart/form-data' }, { status: 400 });
    }

    // Parse the form data to get the image
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Check if the file is a supported type (image or document)
    const supportedTypes = [
      'image/',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!supportedTypes.some(type => imageFile.type.startsWith(type))) {
      return NextResponse.json(
        { error: 'File must be an image or a supported document type (PDF, DOCX)' },
        { status: 400 }
      );
    }

    // Get file buffer
    const fileBuffer = await imageFile.arrayBuffer();

    // Convert file to image if needed
    let processedImageBuffer: Buffer;
    let mimeType: string;

    try {
      // Convert file to image if it's not already an image
      const { buffer, type } = await convertToImage(fileBuffer, imageFile.type);
      processedImageBuffer = buffer;
      mimeType = type;
    } catch (error) {
      console.error('Error converting file to image:', error);
      return NextResponse.json(
        { error: 'Failed to process document. The format may be unsupported.' },
        { status: 400 }
      );
    }

    // Convert the image to base64
    const base64Image = processedImageBuffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Send the image to OpenAI for processing
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'This is an image of a resume. Extract and return ONLY the following information in JSON format:\n' +
                "1. The applicant's full name\n" +
                '2. Their website URL (if present)\n' +
                '3. Their email address\n\n' +
                'Format the response as a valid JSON object with the keys: "name", "website", and "email". ' +
                'If any information is not found, use null for that field. ' +
                'For example: {"name": "John Doe", "website": "johndoe.com", "email": "john@example.com"}',
            },
            { type: 'image_url', image_url: { url: dataUri } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Parse the response from OpenAI (which may include markdown formatting)
    let resumeData;
    try {
      // Get the content from the response
      const responseText = response.choices[0].message.content || '';

      // Simply clean the markdown code block markers
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

    // Return the structured resume data
    return NextResponse.json({
      ...resumeData,
      processingTime: response.usage?.total_tokens,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}

// Configure route options for Next.js App Router
export const config = {
  api: {
    // The App Router doesn't use bodyParser config the same way
    responseLimit: '8mb',
  },
};
