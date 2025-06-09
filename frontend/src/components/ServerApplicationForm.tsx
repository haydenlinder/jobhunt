import { ClientApplicationForm } from "./ClientApplicationForm";


interface ServerApplicationFormProps {
  jobId: string;
  companyId: string;
}

export function ServerApplicationForm({ jobId, companyId }: ServerApplicationFormProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Submit Your Application
      </h2>
      
      <ClientApplicationForm jobId={jobId} companyId={companyId} />
    </div>
  );
}
