import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLINIC } from '@/lib/clinic-branding';

export default function IntroSplash({ visible }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
          aria-hidden="true"
        >
          <div className="relative z-10 flex flex-col items-center gap-4">
            <img
              src={CLINIC.logoUrl}
              alt="JB Dental Clinic"
              className="h-64 w-auto object-contain sm:h-72"
            />
            <p className="text-base font-medium tracking-[0.22em] text-white uppercase">
              JB Dental Clinic
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
