import React from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const Privacy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy"
        path="/privacy"
        description="Privacy policy for JB Dental Clinic Kampala. How we collect, use, and protect your information."
      />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Privacy Policy"
            subtitle="How we handle your information at JB Dental Clinic"
          />
          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300">
            <p className="leading-relaxed">
              JB Dental Clinic (&quot;we&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you visit our website or use our services in Makindye, Kampala.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Information We Collect</h3>
            <p className="leading-relaxed">
              We may collect information you provide when booking an appointment, contacting us via WhatsApp, email, or in person at our clinic. This may include your name, phone number, email address, and details related to your dental care.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">How We Use Your Information</h3>
            <p className="leading-relaxed">
              We use your information to schedule and manage appointments, communicate with you about your care, send reminders, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Data Security</h3>
            <p className="leading-relaxed">
              We take reasonable steps to protect your personal information. Our website may use cookies or similar technologies for basic functionality; you can adjust your browser settings if you prefer to limit these.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Contact Us</h3>
            <p className="leading-relaxed">
              If you have questions about this privacy policy or your data, contact us at{' '}
              <a href="mailto:info@jbdental.ug" className="text-[#7FD856] hover:text-[#6FC745]">info@jbdental.ug</a> or visit our <Link to="/contact" className="text-[#7FD856] hover:text-[#6FC745]">Contact</Link> page.
            </p>
            <p className="text-gray-500 text-sm mt-12">
              Last updated: 2026. JB Dental Clinic, Kampala, Uganda.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center mt-8 text-[#7FD856] hover:text-[#6FC745] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Privacy;
