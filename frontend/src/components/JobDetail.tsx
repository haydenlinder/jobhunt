import Link from 'next/link';
import { GetJobByIdQuery } from '@/gql/graphql';
import { getJobById } from '@/lib/server-utils';
import { ApplicationForm } from './ApplicationForm';
import { ServerApplicationForm } from './ServerApplicationForm';
interface JobDetailProps {
  jobId: string;
  initialData?: GetJobByIdQuery;
}

export async function JobDetail({ jobId, initialData }: JobDetailProps) {
  // If initialData is provided, use it; otherwise fetch the data server-side
  const data = initialData || await getJobById(jobId);
  const job = data?.jobs_by_pk;

  if (!job) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-red-500">Failed to load job details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Link
            href={`/company/${job.company.id}/jobs`}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline"
          >
            {job.company?.name}
          </Link>
          <span className="mx-2">•</span>
          <span>{job.location}</span>
          <span className="mx-2">•</span>
          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Job Description
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <ServerApplicationForm
          jobId={jobId}
          companyId={job.company.id}
        />
      </div>
    </div>
  );
}
