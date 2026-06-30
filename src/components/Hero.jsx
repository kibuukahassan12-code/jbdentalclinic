import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Player from '@vimeo/player';

const SERVICES_BADGES = [
  'Dental Checkup',
  'Teeth Cleaning',
  'Tooth Filling',
  'Laser Treatment',
  'Root Canal',
];

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let player;
    try {
      player = new Player(iframe);

      const handlePlay = () => {
        setVideoLoaded(true);
      };

      player.on('play', handlePlay);
      player.on('playing', handlePlay);

      // Fallback if the video starts playing but events aren't captured
      player.ready().then(() => {
        setTimeout(() => {
          setVideoLoaded(true);
        }, 2500);
      });
    } catch (error) {
      console.warn('Vimeo Player SDK failed to load/initialize:', error);
      // Fallback: set loaded after 3 seconds anyway
      setTimeout(() => {
        setVideoLoaded(true);
      }, 3000);
    }

    return () => {
      if (player) {
        try {
          player.off('play');
          player.off('playing');
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Delay offset to start animations after the 950ms + 450ms IntroSplash finishes fading out
  const ANIM_DELAY_OFFSET = 1.15;

  return (
    <div className="bg-[#050608] pt-3 pb-3 px-3 sm:pt-4 sm:pb-4 sm:px-4 lg:pt-5 lg:pb-5 lg:px-5">
      <section className="relative min-h-[calc(100svh-24px)] sm:min-h-[calc(100svh-32px)] lg:min-h-[calc(100svh-40px)] flex flex-col justify-between overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl bg-[#050608]">

        {/* Background Video (Declarative IFrame) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
          {/* Inner wrapper with slow zoom-out (Ken Burns) animation */}
          <div className="hero-poster-zoom absolute inset-0">
            {/* Poster/fallback image with smooth fade out when video plays */}
            <motion.img
              src="/images/man-smiling-while-female-dentist-keeping-range-fillings.jpg"
              alt="Dental care background"
              className="absolute inset-0 w-full h-full object-cover z-10"
              animate={{ opacity: videoLoaded ? 0 : 1 }}
              transition={{ duration: 0.8 }}
            />
            <iframe
              ref={iframeRef}
              src="https://player.vimeo.com/video/1195036296?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&playsinline=1"
              className="absolute top-1/2 left-1/2"
              style={{
                width: '177.78vh', /* 16:9 ratio to fill viewport height */
                height: '100vh',
                minWidth: '100%',
                minHeight: '56.25vw', /* 16:9 ratio to fill viewport width */
                transform: 'translate(-50%, -50%)',
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              title="Hero Background Video"
            />
          </div>
        </div>

        {/* Responsive Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#050608] via-[#050608]/90 lg:via-[#050608]/75 to-black/45 lg:to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-[#050608]/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(127,216,86,0.12),transparent_50%)] z-10 pointer-events-none" />

        {/* Main Container */}
        <div className="relative z-20 flex-1 flex flex-col justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8 sm:pb-10">

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-auto mb-auto w-full">

            {/* Left Column: Text & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: ANIM_DELAY_OFFSET }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#86DE5E] mb-6 backdrop-blur-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span>Trusted Dentistry in Makindye, Kampala</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: ANIM_DELAY_OFFSET + 0.15 }}
                className="text-4xl sm:text-6xl lg:text-[4.6rem] font-bold text-white leading-[1.08] mb-6 drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Family-Friendly
                <span className="block bg-gradient-to-r from-white via-[#e8ffd9] to-[#86DE5E] bg-clip-text text-transparent">
                  Dental Care
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: ANIM_DELAY_OFFSET + 0.3 }}
                className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mb-8 leading-relaxed font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Permanent natural-looking solutions to replace missing teeth, restore clinical health, and rebuild confident smiles for every member of your family.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: ANIM_DELAY_OFFSET + 0.45 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button
                  asChild
                  className="rounded-full bg-[#7FD856] hover:bg-[#6FC745] text-black font-bold pl-6 pr-2.5 py-2.5 h-auto text-sm sm:text-base flex items-center gap-3 shadow-lg shadow-[#7FD856]/20 transition-all duration-300 hover:scale-[1.03] group border-none"
                >
                  <a
                    href="https://wa.me/256752001269?text=Hello%20JB%20Dental%20Clinic,%20I%20would%20like%20to%20book%20an%20appointment."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Book an Appointment</span>
                    <span className="bg-black text-[#7FD856] rounded-full p-2.5 flex items-center justify-center transition-transform group-hover:translate-x-0.5 duration-300">
                      <ArrowRight size={16} />
                    </span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border border-white/20 bg-black/30 hover:bg-white hover:text-black text-white font-semibold px-6 py-4 h-auto text-sm sm:text-base transition-all duration-300 hover:scale-[1.03]"
                >
                  <a href="tel:+256752001269">Call +256 752 001269</a>
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Floating Pill Tags */}
            <div className="lg:col-span-5 flex flex-col items-end justify-end h-full w-full pb-10">
              <div className="hidden lg:flex flex-wrap justify-end gap-3 max-w-[340px] ml-auto">
                {SERVICES_BADGES.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: ANIM_DELAY_OFFSET + 0.35 + 0.08 * index }}
                    whileHover={{ scale: 1.05 }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-md border transition-all duration-300 cursor-pointer ${
                      index === 0
                        ? 'bg-white text-black border-white shadow-lg'
                        : 'bg-black/30 text-white border-white/20 hover:border-white hover:bg-white/10'
                    }`}
                  >
                    {service}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: ANIM_DELAY_OFFSET + 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-400 font-medium"
          >
            <div className="tracking-wide">Your Teeth Our Smile</div>
            <div className="flex-1"></div>
            <a href="#services" className="hover:text-white transition-colors flex items-center gap-1.5 group">
              <span>Scroll for More</span>
              <motion.span
                animate={{ y: shouldReduceMotion ? 0 : [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center"
              >
                <ChevronDown size={14} />
              </motion.span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
