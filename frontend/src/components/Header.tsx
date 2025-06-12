'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { OrganizationCreation } from '@/components/OrganizationCreation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <header className="bg-white dark:bg-gray-900 sticky top-0 shadow-lg border-b-gray-700 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="font-bold text-xl">
                  JobHunt
                </Link>
              </div>
              {!isAuthenticated && (
                <nav className="ml-6 flex sm:space-x-8">
                  <Link
                    href="/companies"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Companies
                  </Link>
                </nav>
              )}
            </div>
            <div className="ml-6 flex items-center">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <div className="ml-3 relative">
                    <div>
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="user-menu"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-700">
                            {user?.displayName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </button>
                    </div>
                    {isMenuOpen && (
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                      >
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          Your Profile
                        </Link>
                        <Link
                          href="/dashboard/organizations"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          Organizations
                        </Link>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsOrgModalOpen(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          Create Organization
                        </button>
                        <button
                          onClick={() => logout()}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Organization Creation Modal */}
      <OrganizationCreation isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} />
    </>
  );
}
