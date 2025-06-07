import Link from 'next/link';
import { notFound } from 'next/navigation';

// This is a server component, allowing us to fetch data on the server for SEO
export default async function CompanyJobsPage({ params }: { params: { companySlug: string } }) {
  const { companySlug } = params;

  // In a real application, we would fetch this data from our backend API
  // For now, we'll use mock data
  const companies = [
    {
      slug: 'techcorp',
      name: 'TechCorp',
      description:
        'Leading technology solutions provider with a focus on innovation and digital transformation.',
      logo: '/company-logos/techcorp.png',
      jobs: [
        {
          id: '101',
          title: 'Frontend Developer',
          location: 'San Francisco, CA',
          type: 'Full-time',
          postedDate: '2 days ago',
        },
        {
          id: '102',
          title: 'Backend Engineer',
          location: 'Remote',
          type: 'Full-time',
          postedDate: '1 week ago',
        },
        {
          id: '103',
          title: 'DevOps Specialist',
          location: 'Seattle, WA',
          type: 'Full-time',
          postedDate: '3 days ago',
        },
      ],
    },
    {
      slug: 'design-studio',
      name: 'Design Studio',
      description:
        'Creative design agency specializing in brand identity, UX/UI design, and digital experiences.',
      logo: '/company-logos/design-studio.png',
      jobs: [
        {
          id: '201',
          title: 'UX Designer',
          location: 'Remote',
          type: 'Full-time',
          postedDate: '1 week ago',
        },
        {
          id: '202',
          title: 'Visual Designer',
          location: 'New York, NY',
          type: 'Contract',
          postedDate: '2 weeks ago',
        },
      ],
    },
    {
      slug: 'startupxyz',
      name: 'StartupXYZ',
      description:
        'Fast-growing startup focused on building the next generation of productivity tools.',
      logo: '/company-logos/startupxyz.png',
      jobs: [
        {
          id: '301',
          title: 'Product Manager',
          location: 'New York, NY',
          type: 'Full-time',
          postedDate: '3 days ago',
        },
        {
          id: '302',
          title: 'Full Stack Developer',
          location: 'Remote',
          type: 'Full-time',
          postedDate: '5 days ago',
        },
        {
          id: '303',
          title: 'Marketing Specialist',
          location: 'Boston, MA',
          type: 'Full-time',
          postedDate: '1 week ago',
        },
      ],
    },
  ];

  // Find the company by slug
  const company = companies.find(c => c.slug === companySlug);

  // If company not found, return 404
  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 dark:text-indigo-300 font-bold text-2xl">
              {company.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{company.name}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl">{company.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <Link
                href={`/${companySlug}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
              >
                Company Profile
              </Link>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {company.jobs.length} open position{company.jobs.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Open Positions</h2>

        {company.jobs.length > 0 ? (
          <div className="space-y-4">
            {company.jobs.map(job => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <Link href={`/jobs/${job.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                    {job.title}
                  </h3>
                </Link>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    {job.type}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {job.postedDate}
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No open positions at the moment.</p>
          </div>
        )}
      </div>

      {/* SEO metadata */}
      <div className="hidden">
        <h2>{company.name} Jobs</h2>
        <p>
          Find and apply to the latest job opportunities at {company.name}. Browse through{' '}
          {company.jobs.length} open positions.
        </p>
        <p>Job openings include: {company.jobs.map(job => job.title).join(', ')}</p>
        <p>Locations: {Array.from(new Set(company.jobs.map(job => job.location))).join(', ')}</p>
      </div>
    </div>
  );
}

// Generate static paths for companies - in production, this would be generated from the database
export async function generateStaticParams() {
  // This would be fetched from your database in a real application
  const companySlugs = ['techcorp', 'design-studio', 'startupxyz'];

  return companySlugs.map(slug => ({
    companySlug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { companySlug: string } }) {
  const { companySlug } = params;

  // In a real application, fetch this from your API/database
  const companies = [
    { slug: 'techcorp', name: 'TechCorp' },
    { slug: 'design-studio', name: 'Design Studio' },
    { slug: 'startupxyz', name: 'StartupXYZ' },
  ];

  const company = companies.find(c => c.slug === companySlug);

  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }

  return {
    title: `${company.name} Jobs - Career Opportunities`,
    description: `Explore career opportunities at ${company.name}. Find and apply to open positions that match your skills and experience.`,
    openGraph: {
      title: `${company.name} Jobs - Career Opportunities`,
      description: `Explore career opportunities at ${company.name}. Find and apply to open positions that match your skills and experience.`,
    },
  };
}
