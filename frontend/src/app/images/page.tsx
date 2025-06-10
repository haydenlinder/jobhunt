'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
// Using img instead of next/image for client-side blob URLs

export default function ImagesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('image');
  const [summary, setSummary] = useState<{ website: string; name: string; email: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setSelectedFile(file);

      // Determine file type
      const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type === 'application/pdf'
          ? 'pdf'
          : file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ? 'docx'
            : 'other';

      setFileType(fileType);

      // Create a preview URL for the selected file (only for images)
      if (fileType === 'image') {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null);
      }

      // Reset previous results
      setSummary(null);
      setError(null);
      setProcessingTime(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('image', selectedFile); // keeping the field name as 'image' for backward compatibility

      // Send the image to our API endpoint
      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Display the result
      setSummary(data);
      setProcessingTime(data.processingTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setSelectedFile(null);
    setSummary(null);
    setError(null);
    setProcessingTime(null);
    setFileType('image');

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Resume Analysis</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block mb-2 font-medium">
                Select a resume to analyze (Image, PDF, or DOCX)
              </label>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2.5"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={!selectedFile || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Analyze Resume'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selectedFile && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">File Information</h2>
              <div className="mb-4">
                <p>
                  <span className="font-medium">Name:</span> {selectedFile.name}
                </p>
                <p>
                  <span className="font-medium">Type:</span> {selectedFile.type || 'Unknown'}
                </p>
                <p>
                  <span className="font-medium">Size:</span> {(selectedFile.size / 1024).toFixed(2)}{' '}
                  KB
                </p>
              </div>

              {previewUrl && (
                <div className="h-64 w-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Selected file preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              {fileType === 'pdf' && (
                <div className="flex items-center justify-center bg-gray-100 p-4 rounded">
                  <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8h4v12H6V4h8v4zm-1 7h-2v2h2v-2zm-2-2h2v-2h-2v2zm6 2h-2v2h2v-2zm-2-2h2v-2h-2v2z" />
                  </svg>
                  <span className="ml-2">PDF Document</span>
                </div>
              )}

              {fileType === 'docx' && (
                <div className="flex items-center justify-center bg-gray-100 p-4 rounded">
                  <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 8h4v12H6V4h8v4zm-2 8h-4v2h4v-2zm6 0h-4v2h4v-2zm-6-4h-4v2h4v-2zm6 0h-4v2h4v-2z" />
                  </svg>
                  <span className="ml-2">DOCX Document</span>
                </div>
              )}
            </div>
          )}

          {summary && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">Resume Analysis</h2>
              <div className="prose">
                <p className="whitespace-pre-wrap">{summary.name}</p>
                <p className="whitespace-pre-wrap">{summary.website}</p>
                <p className="whitespace-pre-wrap">{summary.email}</p>
                {processingTime && (
                  <p className="text-sm text-gray-500 mt-4">Processing tokens: {processingTime}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
