'use client';

import Link from 'next/link';
import { Logo } from "./logo";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-100 mb-8">
      <div className="flex items-center">
        {/* Logo with link to homepage */}
        <Link href="/" className="flex items-center mr-12" aria-label="Go to homepage">
          <Logo />
        </Link>
        
        {/* Main navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-red-600 font-medium"
          >
            Home
          </Link>
          <Link 
            href="/posts" 
            className="text-gray-700 hover:text-red-600 font-medium"
          >
            All Posts
          </Link>
          <Link 
            href="/amas" 
            className="text-gray-700 hover:text-red-600 font-medium"
          >
            AMAs
          </Link>

        </nav>
      </div>
      
      {/* Right side elements can be added here in the future */}
      <div className="flex items-center space-x-4">
        {/* Search icon removed */}
      </div>
    </header>
  );
};

export default Header;
