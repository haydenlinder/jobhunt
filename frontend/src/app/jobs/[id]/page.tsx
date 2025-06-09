import { JobDetail } from '@/components/JobDetail';
import Link from 'next/link';
import { getJobById } from '@/lib/server-utils';
import { Metadata } from 'next';

// Disable caching for this page to ensure fresh data on each request
export const revalidate = 0;

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: jobId } = await params;
  const jobData = await getJobById(jobId);
  const job = jobData.jobs_by_pk;

  if (!job) {
    return {
      title: 'Job Not Found',
    };
  }

  return {
    title: `${job.title} at ${job.company.name} | JobHunt`,
    description:
      job.description?.substring(0, 160) || `${job.title} job opportunity at ${job.company.name}`,
  };
}

// This makes the page server-side rendered
export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: jobId } = await params;

  // Fetch job data on the server side
  const jobData = await getJobById(jobId);

  // Create structured data for the job posting
  const job = jobData.jobs_by_pk;

  // Create JSON-LD structured data for better SEO
  const structuredData = job
    ? {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        datePosted: job.created_at,
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company.name,
          identifier: job.company.id,
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.location,
          },
        },
      }
    : null;

  return (
    <div className="space-y-6">
      {job && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      <div className="flex items-center">
        <Link
          href="/jobs"
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
        >
          <svg
            className="h-5 w-5 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Job Search
        </Link>
      </div>

      <JobDetail jobId={jobId} initialData={jobData} />
    </div>
  );
}
