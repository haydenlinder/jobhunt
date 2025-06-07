'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateJobPostingPage({ params }: { params: { organizationId: string } }) {
  const router = useRouter();
  const { organizationId } = params;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    salaryRange: '',
    requirements: '',
    responsibilities: '',
    contactEmail: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, we would fetch the organization details here
  const organizationName = 'TechCorp'; // Mock data

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const val =
      (e.target as HTMLInputElement).type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value;

    setFormData(prev => ({
      ...prev,
      [name]: val,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required (can be "Remote")';
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Job requirements are required';
    }

    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = 'Job responsibilities are required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, this would be an API call to create the job posting
      console.log('Job posting data:', { ...formData, organizationId });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to job postings list
      router.push(`/dashboard/organizations/${organizationId}/jobs`);
    } catch (error) {
      console.error('Error creating job posting:', error);
      setErrors({
        form: 'An error occurred while creating the job posting. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Job Posting</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">for {organizationName}</p>
        </div>
        <Link
          href={`/dashboard/organizations/${organizationId}/jobs`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Job Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md dark:bg-gray-700 dark:text-white`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="City, State or Remote"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md dark:bg-gray-700 dark:text-white`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="jobType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Job Type *
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="salaryRange"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Salary Range
            </label>
            <input
              id="salaryRange"
              name="salaryRange"
              type="text"
              placeholder="e.g. $50,000 - $70,000 per year"
              value={formData.salaryRange}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md dark:bg-gray-700 dark:text-white`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="responsibilities"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Responsibilities *
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={5}
              placeholder="List the key responsibilities for this role"
              value={formData.responsibilities}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.responsibilities ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md dark:bg-gray-700 dark:text-white`}
            />
            {errors.responsibilities && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.responsibilities}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Requirements *
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={5}
              placeholder="List qualifications, skills, and experience required"
              value={formData.requirements}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.requirements ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md dark:bg-gray-700 dark:text-white`}
            />
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.requirements}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Contact Email *
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md dark:bg-gray-700 dark:text-white`}
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactEmail}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Make this job posting active immediately
            </label>
          </div>

          {errors.form && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Job Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
