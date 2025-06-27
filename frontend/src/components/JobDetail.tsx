import { GetJobByIdQuery } from '@/gql/graphql';
import { getJobById } from '@/lib/server-utils';
import { ServerApplicationForm } from './ServerApplicationForm';
import { JobInfo } from './JobInfo';
interface JobDetailProps {
  jobId: string;
  initialData?: GetJobByIdQuery;
}

export async function JobDetail({ jobId, initialData }: JobDetailProps) {
  // If initialData is provided, use it; otherwise fetch the data server-side
  const data = initialData || (await getJobById(jobId));
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
      <JobInfo job={job} />

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <ServerApplicationForm jobId={jobId} companyId={job.company.id} />
      </div>
    </div>
  );
}
