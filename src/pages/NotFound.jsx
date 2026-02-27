import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const NotFound = () => {
  return (
    <>
      <SEO
        title="Page Not Found"
        path="/404"
        description="The page you are looking for could not be found. Return to JB Dental Clinic Kampala."
        noindex
      />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <FileQuestion className="w-24 h-24 text-[#7FD856]/60 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Page not found
          </h1>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved. Here are some helpful links.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded-lg">
              <Button className="w-full sm:w-auto bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold">
                <Home className="mr-2" size={20} />
                Back to Home
              </Button>
            </Link>
            <Link to="/services" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded-lg">
              <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10">
                Our Services
              </Button>
            </Link>
            <Link to="/contact" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded-lg">
              <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
