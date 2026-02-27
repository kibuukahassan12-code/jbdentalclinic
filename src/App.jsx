
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Eager load core pages for better LCP
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Appointment from '@/pages/Appointment';
import NotFound from '@/pages/NotFound';

// Lazy load less critical pages and service details
const About = lazy(() => import('@/pages/About'));
const Team = lazy(() => import('@/pages/Team'));
const Contact = lazy(() => import('@/pages/Contact'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Admin = lazy(() => import('@/pages/Admin'));

// Service Pages - Lazy Loaded
const GeneralDentistry = lazy(() => import('@/pages/services/GeneralDentistry'));
const CosmeticDentistry = lazy(() => import('@/pages/services/CosmeticDentistry'));
const DentalImplants = lazy(() => import('@/pages/services/DentalImplants'));
const Orthodontics = lazy(() => import('@/pages/services/Orthodontics'));
const TeethWhitening = lazy(() => import('@/pages/services/TeethWhitening'));
const RootCanal = lazy(() => import('@/pages/services/RootCanal'));
const DentalCrowns = lazy(() => import('@/pages/services/DentalCrowns'));
const Periodontics = lazy(() => import('@/pages/services/Periodontics'));
const EmergencyDental = lazy(() => import('@/pages/services/EmergencyDental'));
const PediatricDentistry = lazy(() => import('@/pages/services/PediatricDentistry'));
const ToothExtraction = lazy(() => import('@/pages/services/ToothExtraction'));
const DentalBridges = lazy(() => import('@/pages/services/DentalBridges'));
const BridalDentistry = lazy(() => import('@/pages/services/BridalDentistry'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] text-[#7FD856]">
    <Loader2 className="w-12 h-12 animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <a
          href="#main-content"
          className="absolute -left-[9999px] z-[100] px-4 py-2 bg-[#7FD856] text-black font-semibold rounded-lg focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <LocalBusinessSchema />
        <Navigation />
        <main id="main-content">
        <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/appointment" element={<Appointment />} />
            
            {/* Service Detail Routes */}
            <Route path="/services/general-dentistry" element={<GeneralDentistry />} />
            <Route path="/services/cosmetic-dentistry" element={<CosmeticDentistry />} />
            <Route path="/services/dental-implants" element={<DentalImplants />} />
            <Route path="/services/orthodontics" element={<Orthodontics />} />
            <Route path="/services/teeth-whitening" element={<TeethWhitening />} />
            <Route path="/services/root-canal" element={<RootCanal />} />
            <Route path="/services/dental-crowns" element={<DentalCrowns />} />
            <Route path="/services/periodontics" element={<Periodontics />} />
            <Route path="/services/emergency-dental" element={<EmergencyDental />} />
            <Route path="/services/pediatric-dentistry" element={<PediatricDentistry />} />
            <Route path="/services/tooth-extraction" element={<ToothExtraction />} />
            <Route path="/services/dental-bridges" element={<DentalBridges />} />
            <Route path="/services/bridal-dentistry" element={<BridalDentistry />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
