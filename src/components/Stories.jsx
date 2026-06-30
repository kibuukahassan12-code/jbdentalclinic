import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/SectionHeader';
import StoryViewerModal from '@/components/StoryViewerModal';
import { BookOpen, Sparkles, Smile, ShieldAlert, Award } from 'lucide-react';

const Stories = () => {
  const navigate = useNavigate();
  const [activeGroupIndex, setActiveGroupIndex] = useState(null);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [seenStories, setSeenStories] = useState({});

  // Initialize seen state from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jbdental_seen_stories');
      if (saved) {
        setSeenStories(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error reading from localStorage", e);
    }
  }, []);

  const markGroupAsSeen = (groupId) => {
    try {
      const updated = { ...seenStories, [groupId]: true };
      setSeenStories(updated);
      localStorage.setItem('jbdental_seen_stories', JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving to localStorage", e);
    }
  };

  const handleOpenGroup = (index) => {
    setActiveGroupIndex(index);
    setStoryViewerOpen(true);
  };

  const handleCloseViewer = () => {
    if (activeGroupIndex !== null) {
      // Mark the active story group as seen when closed
      markGroupAsSeen(STORIES_DATA[activeGroupIndex].id);
    }
    setStoryViewerOpen(false);
  };

  const handleNextGroup = () => {
    if (activeGroupIndex !== null) {
      markGroupAsSeen(STORIES_DATA[activeGroupIndex].id);
    }
    
    if (activeGroupIndex < STORIES_DATA.length - 1) {
      setActiveGroupIndex(activeGroupIndex + 1);
    } else {
      setStoryViewerOpen(false);
    }
  };

  const handlePrevGroup = () => {
    if (activeGroupIndex > 0) {
      setActiveGroupIndex(activeGroupIndex - 1);
    }
  };

  const handleCTA = (path) => {
    // Save current group viewed before navigating
    if (activeGroupIndex !== null) {
      markGroupAsSeen(STORIES_DATA[activeGroupIndex].id);
    }
    setStoryViewerOpen(false);
    navigate(path);
  };

  // Structured Story Data with mixed images and highly responsive beautiful custom HTML/Tailwind cards
  const STORIES_DATA = [
    {
      id: 'clinic-tour',
      title: 'Clinic Tour',
      avatar: '/images/jbdental-reception.png',
      stories: [
        {
          url: '/images/jbdental-reception.png',
          header: {
            heading: 'Clinic Tour',
            subheading: 'Welcome to JB Dental',
            profileImage: '/images/jb-dental-logo.png'
          }
        },
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0B0D0A] via-[#121B0F] to-[#050604] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">JB Dental Clinic</h4>
                  <p className="text-xs text-[#7FD856]">State-of-the-Art Setup</p>
                </div>
              </div>
              <div className="my-auto space-y-5 text-center px-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <BookOpen className="w-8 h-8 text-[#7FD856]" />
                </div>
                <h3 className="text-xl font-bold text-[#7FD856] tracking-tight">Ergonomic Dental Chairs</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  We use modern, luxury European-style dental chairs designed for orthopedic support, keeping you relaxed and strain-free during treatment.
                </p>
              </div>
              <button 
                onClick={() => handleCTA('/appointment')}
                className="w-full py-3.5 bg-[#7FD856] text-black font-semibold rounded-xl hover:bg-[#6FC745] active:scale-95 transition-all shadow-lg shadow-[#7FD856]/20 font-sans tracking-wide text-sm"
              >
                Book a Visit
              </button>
            </div>
          )
        },
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#090A09] via-[#0F1C0D] to-[#070806] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">JB Dental Clinic</h4>
                  <p className="text-xs text-[#7FD856]">Hygiene & Safety</p>
                </div>
              </div>
              <div className="my-auto space-y-5 text-center px-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <ShieldAlert className="w-8 h-8 text-[#7FD856]" />
                </div>
                <h3 className="text-xl font-bold text-[#7FD856] tracking-tight">100% Sterile Environment</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  Your safety is our absolute priority. We employ high-temperature autoclave sterilization systems and rigorous clinical hygiene standards.
                </p>
              </div>
              <button 
                onClick={() => handleCTA('/about')}
                className="w-full py-3.5 border border-[#7FD856] text-[#7FD856] bg-[#7FD856]/5 font-semibold rounded-xl hover:bg-[#7FD856]/10 active:scale-95 transition-all font-sans text-sm"
              >
                About Our Clinic
              </button>
            </div>
          )
        }
      ]
    },
    {
      id: 'smile-makeover',
      title: 'Makeovers',
      avatar: '/images/cosmetic-dentistry.png',
      stories: [
        {
          url: '/images/cosmetic-dentistry.png',
          header: {
            heading: 'Smile Makeover',
            subheading: 'Cosmetic Veneers',
            profileImage: '/images/jb-dental-logo.png'
          }
        },
        {
          url: '/images/teeth-whitening.png',
          header: {
            heading: 'Teeth Whitening',
            subheading: 'Instant Brightness Boost',
            profileImage: '/images/jb-dental-logo.png'
          }
        },
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0B0D0A] via-[#102422] to-[#050604] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">JB Dental Clinic</h4>
                  <p className="text-xs text-[#7FD856]">Braces & Veneers</p>
                </div>
              </div>
              <div className="my-auto space-y-5 text-center px-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <Sparkles className="w-8 h-8 text-[#7FD856]" />
                </div>
                <h3 className="text-xl font-bold text-[#7FD856] tracking-tight">Veneers & Whitening</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  Get that red-carpet smile! We create customized ceramic veneers and offer professional, sensitivity-free bleaching that whitens up to 8 shades.
                </p>
              </div>
              <button 
                onClick={() => handleCTA('/services/cosmetic-dentistry')}
                className="w-full py-3.5 bg-[#7FD856] text-black font-semibold rounded-xl hover:bg-[#6FC745] active:scale-95 transition-all shadow-lg shadow-[#7FD856]/20 font-sans tracking-wide text-sm"
              >
                Explore Cosmetic Care
              </button>
            </div>
          )
        }
      ]
    },
    {
      id: 'dental-tips',
      title: 'Dental Tips',
      avatar: '/images/man-lying-dentist-chair-protective-glasses-clinic_651396-1704.avif',
      stories: [
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0D0B0A] via-[#241B10] to-[#070504] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">Dental Tips</h4>
                  <p className="text-xs text-[#7FD856]">Daily Care #1</p>
                </div>
              </div>
              <div className="my-auto space-y-5 px-2">
                <div className="w-14 h-14 rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <span className="text-2xl">🪥</span>
                </div>
                <h3 className="text-xl font-bold text-[#7FD856] tracking-tight">The 2-Minute Rule</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  Did you know the average person only brushes for 45 seconds? 
                  <br /><br />
                  Brush for **at least 2 full minutes, twice a day** to thoroughly remove dental plaque and maintain clean teeth.
                </p>
              </div>
              <div className="text-center text-xs text-white/40 mb-2">Swipe or tap right for next tip</div>
            </div>
          )
        },
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0A0D0C] via-[#102224] to-[#040606] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">Dental Tips</h4>
                  <p className="text-xs text-[#7FD856]">Daily Care #2</p>
                </div>
              </div>
              <div className="my-auto space-y-5 px-2">
                <div className="w-14 h-14 rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <span className="text-2xl">🦷</span>
                </div>
                <h3 className="text-xl font-bold text-[#7FD856] tracking-tight">Clean Between Teeth</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  Flossing or using interdental brushes cleans the 40% of tooth surfaces that standard brushing misses!
                  <br /><br />
                  Floss daily to prevent painful inter-dental cavities and swollen gums.
                </p>
              </div>
              <div className="text-center text-xs text-white/40 mb-2">Swipe or tap right for next tip</div>
            </div>
          )
        },
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0B0D0A] via-[#1A2610] to-[#050604] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">Dental Tips</h4>
                  <p className="text-xs text-[#7FD856]">Daily Care #3</p>
                </div>
              </div>
              <div className="my-auto space-y-5 px-2">
                <div className="w-14 h-14 rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <span className="text-2xl">⏳</span>
                </div>
                <h3 className="text-xl font-bold text-[#7FD856] tracking-tight">Replace Your Brush</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  Replace your manual toothbrush or electric brush head **every 3 months**. 
                  <br /><br />
                  Frayed bristles lose their cleaning efficacy and build up bacteria over time. Always replace your brush after recovering from a cold!
                </p>
              </div>
              <button 
                onClick={() => handleCTA('/appointment')}
                className="w-full py-3.5 bg-[#7FD856] text-black font-semibold rounded-xl hover:bg-[#6FC745] active:scale-95 transition-all shadow-lg shadow-[#7FD856]/20 font-sans text-sm"
              >
                Book Dental Checkup
              </button>
            </div>
          )
        }
      ]
    },
    {
      id: 'patient-reviews',
      title: 'Testimonials',
      avatar: '/images/man-smiling-while-female-dentist-keeping-range-fillings.jpg',
      stories: [
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0B0C0E] via-[#1B1624] to-[#050506] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">Happy Patient</h4>
                  <p className="text-xs text-[#7FD856]">Braces Transformation</p>
                </div>
              </div>
              <div className="my-auto space-y-5 text-center px-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <Smile className="w-8 h-8 text-[#7FD856]" />
                </div>
                <p className="text-base text-gray-200 italic font-light leading-relaxed">
                  "Getting my orthodontic braces here was the best decision. The clinic is incredibly clean, and Dr. Hassan explains every step of the process. I can finally smile with confidence!"
                </p>
                <div>
                  <h4 className="font-bold text-[#7FD856]">- Sarah K.</h4>
                  <p className="text-xs text-white/50">Kampala Resident</p>
                </div>
              </div>
              <div className="text-center text-xs text-white/40 mb-2">Tap right to read next review</div>
            </div>
          )
        },
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0C0B0E] via-[#121B24] to-[#050506] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">Happy Patient</h4>
                  <p className="text-xs text-[#7FD856]">Emergency Treatment</p>
                </div>
              </div>
              <div className="my-auto space-y-5 text-center px-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <Smile className="w-8 h-8 text-[#7FD856]" />
                </div>
                <p className="text-base text-gray-200 italic font-light leading-relaxed">
                  "Had a severe toothache at night. JB Dental Clinic scheduled me instantly next morning for a root canal. Pain-free treatment, professional therapists. Outstanding emergency dental care!"
                </p>
                <div>
                  <h4 className="font-bold text-[#7FD856]">- Derrick O.</h4>
                  <p className="text-xs text-white/50">Makindye Area</p>
                </div>
              </div>
              <button 
                onClick={() => handleCTA('/appointment')}
                className="w-full py-3.5 bg-[#7FD856] text-black font-semibold rounded-xl hover:bg-[#6FC745] active:scale-95 transition-all shadow-lg shadow-[#7FD856]/20 font-sans text-sm"
              >
                Schedule Appointment
              </button>
            </div>
          )
        }
      ]
    },
    {
      id: 'meet-team',
      title: 'Our Team',
      avatar: '/images/man-smiling-while-female-dentist-keeping-range-fillings.jpg',
      stories: [
        {
          content: () => (
            <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0A0D0A] via-[#142610] to-[#040604] text-white">
              <div className="flex items-center space-x-3">
                <img src="/images/jb-dental-logo.png" className="w-8 h-8 rounded-full border border-[#7FD856]" alt="logo" />
                <div>
                  <h4 className="font-semibold text-sm">Our Team</h4>
                  <p className="text-xs text-[#7FD856]">Lead Dentist</p>
                </div>
              </div>
              <div className="my-auto space-y-5 text-center px-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#7FD856]/10 flex items-center justify-center border border-[#7FD856]/30">
                  <Award className="w-8 h-8 text-[#7FD856]" />
                </div>
                <h3 className="text-xl font-bold text-[#7FD856] tracking-tight">Meet Dr. Hassan Kibuuka</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  Dedicated to restoring smiles and providing high-quality, pain-free general and aesthetic dental services. Dr. Hassan brings extensive surgical expertise and clinical care to Makindye.
                </p>
              </div>
              <button 
                onClick={() => handleCTA('/team')}
                className="w-full py-3.5 bg-[#7FD856] text-black font-semibold rounded-xl hover:bg-[#6FC745] active:scale-95 transition-all shadow-lg shadow-[#7FD856]/20 font-sans text-sm"
              >
                Meet All Doctors
              </button>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <section className="py-10 bg-[#0F0F0F] relative overflow-hidden">
      {/* Accent Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#7FD856]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader 
          title="Clinical Daily Stories" 
          subtitle="Explore clinic daily updates, quick advice, transformations, and expert advice from our lead dentist." 
        />

        {/* Stories Horizontal Row */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto gap-6 sm:gap-8 pb-4 pt-2 no-scrollbar scroll-smooth">
          {STORIES_DATA.map((group, index) => {
            const isSeen = !!seenStories[group.id];
            
            return (
              <div 
                key={group.id} 
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                onClick={() => handleOpenGroup(index)}
              >
                {/* Story Circular Avatar Container with dynamic glowing border */}
                <div className="relative p-[3px] rounded-full transition-all duration-350 transform group-hover:scale-105 active:scale-95">
                  
                  {/* Glowing Border Background */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    isSeen 
                      ? 'bg-neutral-800' 
                      : 'bg-gradient-to-tr from-[#7FD856] via-[#10B981] to-[#14B8A6] animate-pulse'
                  }`}></div>

                  {/* Inner Dark Gap */}
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-[3px] bg-[#0F0F0F]">
                    {/* Avatar Image */}
                    <img 
                      src={group.avatar} 
                      className="w-full h-full rounded-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-350"
                      alt={group.title} 
                      onError={(e) => {
                        // Fallback in case of missing custom image
                        e.target.src = '/images/jb-dental-logo.png';
                      }}
                    />
                  </div>
                </div>

                {/* Title */}
                <span className={`mt-3 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isSeen ? 'text-gray-500' : 'text-gray-300 group-hover:text-[#7FD856]'
                }`}>
                  {group.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* React Story Player Modal Overlay */}
      <AnimatePresence>
        {storyViewerOpen && activeGroupIndex !== null && (
          <StoryViewerModal
            isOpen={storyViewerOpen}
            onClose={handleCloseViewer}
            stories={STORIES_DATA[activeGroupIndex].stories}
            storyIndex={0}
            onPrevGroup={handlePrevGroup}
            onNextGroup={handleNextGroup}
            hasPrevGroup={activeGroupIndex > 0}
            hasNextGroup={activeGroupIndex < STORIES_DATA.length - 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Stories;
