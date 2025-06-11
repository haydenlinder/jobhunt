import JobSearchForm from '@/components/JobSearchForm';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-indigo-700 -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find Your Dream Job
          </h1>
          <p className="mt-6 text-xl max-w-2xl mx-auto">
            Connect with top companies and opportunities. Whether you&apos;re looking for your next
            career move or hiring talent, JobHunt has you covered.
          </p>
        </div>
      </section>

      {/* Job Search Form Component */}
      <JobSearchForm />
    </div>
  );
}
