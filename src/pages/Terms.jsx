import React from 'react';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';

const Terms = () => {
  return (
    <>
      <SEO
        title="Terms of Service"
        path="/terms"
        description="Terms of service for using the JB Dental Clinic Kampala website and services."
      />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="Terms of Service"
            subtitle="Terms governing use of our website and services"
          />
          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300">
            <p className="leading-relaxed">
              By using the JB Dental Clinic website and our services in Makindye, Kampala, you agree to these terms. Please read them carefully.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Use of Website</h3>
            <p className="leading-relaxed">
              This website is for informational purposes and to help you book appointments or contact us. You may not use it for any unlawful purpose or to transmit harmful or offensive content.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Appointments &amp; Services</h3>
            <p className="leading-relaxed">
              Booking via WhatsApp or our website does not guarantee a specific time until confirmed by our team. We reserve the right to reschedule or cancel appointments when necessary. Our dental services are provided in accordance with Ugandan medical standards and our clinic policies.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Limitation of Liability</h3>
            <p className="leading-relaxed">
              JB Dental Clinic is not liable for any indirect, incidental, or consequential damages arising from your use of this website. Clinical outcomes depend on individual circumstances and adherence to aftercare instructions.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Changes</h3>
            <p className="leading-relaxed">
              We may update these terms from time to time. Continued use of the website after changes constitutes acceptance of the updated terms.
            </p>
            <h3 className="text-xl font-semibold text-white mt-8">Contact</h3>
            <p className="leading-relaxed">
              Questions? Contact us at <a href="mailto:info@jbdental.ug" className="text-[#7FD856] hover:text-[#6FC745]">info@jbdental.ug</a> or visit our <Link to="/contact" className="text-[#7FD856] hover:text-[#6FC745]">Contact</Link> page.
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

export default Terms;
