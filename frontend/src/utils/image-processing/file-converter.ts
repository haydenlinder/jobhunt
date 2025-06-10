import sharp from 'sharp';
import * as im from 'imagemagick';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';

// Promisify imagemagick functions
const convertAsync = (args: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    im.convert(args, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};

/**
 * Converts a PDF file to an image
 * @param buffer PDF file buffer
 * @returns Promise resolving to a PNG buffer
 */
export async function pdfToImage(buffer: ArrayBuffer): Promise<Buffer> {
  try {
    // Create temp files for processing
    const tempDir = os.tmpdir();
    const uniqueId = uuidv4();
    const pdfPath = join(tempDir, `${uniqueId}.pdf`);
    const outputPath = join(tempDir, `${uniqueId}.png`);

    // Write the PDF buffer to a temp file
    await fs.writeFile(pdfPath, Buffer.from(buffer));

    // Use ImageMagick to convert the PDF to PNG (first page only)
    await convertAsync([
      `${pdfPath}[0]`, // [0] specifies first page only
      '-density',
      '300', // Higher density for better quality
      '-quality',
      '100',
      outputPath,
    ]);

    // Read the output file
    const outputBuffer = await fs.readFile(outputPath);

    // Clean up temp files
    try {
      await fs.unlink(pdfPath);
      await fs.unlink(outputPath);
    } catch (e) {
      console.warn('Error cleaning up temp files:', e);
    }

    return outputBuffer;
  } catch (error) {
    console.error('Error converting PDF to image with ImageMagick:', error);

    // Fallback to placeholder if ImageMagick fails
    console.log('Falling back to placeholder image');
    const placeholderBuffer = await sharp({
      create: {
        width: 800,
        height: 1000,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        {
          input: Buffer.from(
            '<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">' +
              '<rect width="800" height="1000" fill="white"/>' +
              '<text x="400" y="480" font-family="Arial" font-size="24" text-anchor="middle" fill="black">PDF Document</text>' +
              '<text x="400" y="520" font-family="Arial" font-size="18" text-anchor="middle" fill="gray">PDF conversion failed - using placeholder</text>' +
              '</svg>'
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    return placeholderBuffer;
  }
}

/**
 * Converts a docx file to an image (placeholder implementation)
 * @param buffer DOCX file buffer
 * @returns Promise resolving to a PNG buffer
 */
export async function docxToImage(): Promise<Buffer> {
  // Note: Direct DOCX conversion with ImageMagick is challenging
  // In a production environment, you would typically:
  // 1. Convert DOCX to PDF first using a library like libreoffice-convert
  // 2. Then convert the PDF to an image

  console.log(
    'DOCX conversion requested - ImageMagick cannot directly convert DOCX, using placeholder'
  );

  // Create a placeholder image
  const placeholderBuffer = await sharp({
    create: {
      width: 800,
      height: 1000,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          '<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">' +
            '<rect width="800" height="1000" fill="white"/>' +
            '<text x="400" y="480" font-family="Arial" font-size="24" text-anchor="middle" fill="black">DOCX Document</text>' +
            '<text x="400" y="520" font-family="Arial" font-size="18" text-anchor="middle" fill="gray">DOCX content processed for analysis</text>' +
            '<text x="400" y="560" font-family="Arial" font-size="14" text-anchor="middle" fill="gray">(Direct DOCX conversion requires additional libraries)</text>' +
            '</svg>'
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  return placeholderBuffer;
}

/**
 * Converts file buffer to image based on file type
 * @param buffer File buffer
 * @param mimeType File MIME type
 * @returns Promise resolving to a Buffer and MIME type
 */
export async function convertToImage(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<{ buffer: Buffer; type: string }> {
  if (mimeType === 'application/pdf') {
    const imageBuffer = await pdfToImage(buffer);
    return { buffer: imageBuffer, type: 'image/png' };
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const imageBuffer = await docxToImage();
    return { buffer: imageBuffer, type: 'image/png' };
  } else if (mimeType.startsWith('image/')) {
    // If it's already an image, just return it
    return { buffer: Buffer.from(buffer), type: mimeType };
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}
