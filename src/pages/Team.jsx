
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Stethoscope, Award, Calendar, Heart } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const Team = () => {
  const teamMembers = [
    {
      name: 'Dr JB Mubiru', // Changed name from "Dr. Joseph Bakka"
      role: 'Lead Dentist & Founder',
      expertise: ['Cosmetic Dentistry', 'Implantology', 'Full Mouth Rehabilitation'],
      qualifications: 'BDS (Mak), MPH',
      experience: '15+ Years',
      contribution: 'Pioneered the introduction of advanced digital dentistry techniques in Makindye, ensuring international standards of care.',
      icon: Stethoscope
    },
    {
      name: 'Dr. Sarah Nakato',
      role: 'Pediatric Specialist',
      expertise: ['Child Psychology', 'Preventive Care', 'Interceptive Orthodontics'],
      qualifications: 'BDS, MDS (Pedodontics)',
      experience: '10+ Years',
      contribution: 'Developed our proprietary "Fear-Free" protocol for children, making dental visits a joy rather than a chore for young ones.',
      icon: Heart
    },
    {
      name: 'Dr. Paul Kintu',
      role: 'Orthodontist',
      expertise: ['Invisalign', 'Traditional Braces', 'Jaw Correction'],
      qualifications: 'BDS, MDS (Orthodontics)',
      experience: '12+ Years',
      contribution: 'Renowned for transforming hundreds of smiles across Kampala using the latest non-invasive orthodontic technologies.',
      icon: Award
    },
    {
      name: 'Nurse Mary Achieng',
      role: 'Senior Dental Hygienist',
      expertise: ['Periodontal Therapy', 'Patient Education', 'Post-Op Care'],
      qualifications: 'Dip. Dental Hygiene',
      experience: '8+ Years',
      contribution: 'Leads our community outreach program, teaching oral hygiene in local schools and ensuring patient comfort during procedures.',
      icon: Heart
    },
    {
      name: 'James Omondi',
      role: 'Clinic Manager',
      expertise: ['Patient Relations', 'Clinic Operations', 'Insurance Coordination'],
      qualifications: 'MBA (Healthcare Management)',
      experience: '14+ Years',
      contribution: 'The backbone of our smooth operations, ensuring every patient receives timely, efficient, and warm service from the moment they walk in.',
      icon: Calendar
    },
  ];

  return (
    <>
      <Helmet>
        <title>Meet the Team - JB Dental Clinic Kampala</title>
        <meta name="description" content="Meet the experienced team of Ugandan dental professionals at JB Dental Clinic. Our dedicated staff is committed to providing world-class dental care." />
      </Helmet>
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F] min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Our Dedicated Team"
            subtitle="Expert professionals united by a passion for your smile"
          />

          {/* Group Photo Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-24 relative rounded-3xl overflow-hidden shadow-2xl shadow-[#7FD856]/10 border border-zinc-800"
          >
            <div className="aspect-w-16 aspect-h-9 md:aspect-h-6 lg:h-[600px]">
              <LazyImage 
                src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/ae6051839c5f3c32034cb4843e81a241.jpg" 
                alt="JB Dental Clinic Team - Dr. Paul and Staff" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-90 pointer-events-none">
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 font-['Poppins']">
                    A Family Treating Families
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    At JB Dental, we aren't just colleagues; we are a family of passionate professionals dedicated to serving the Makindye community. Our cohesive team environment translates directly into better, more coordinated care for you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Introduction */}
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 font-['Poppins']">
              Expertise You Can <span className="text-[#7FD856]">Trust</span>
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our clinic is home to some of Uganda's finest dental talents. Each member of our team brings a unique set of skills and a shared commitment to excellence. We believe in continuous learning, compassion, and treating every patient with the dignity they deserve.
            </p>
          </div>

          {/* Individual Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-800/80 hover:shadow-xl hover:shadow-[#7FD856]/5 hover:border-[#7FD856]/30 transition-all duration-300 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                   <div className="w-14 h-14 bg-[#7FD856]/10 rounded-xl flex items-center justify-center text-[#7FD856]">
                      <member.icon size={28} />
                   </div>
                   <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-medium text-gray-300 border border-zinc-700">
                      {member.experience} Exp.
                   </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-1 font-['Poppins'] group-hover:text-[#7FD856] transition-colors">
                  {member.name}
                </h3>
                <p className="text-[#7FD856] font-medium text-sm mb-4 uppercase tracking-wide">
                  {member.role}
                </p>
                
                <div className="mb-6 space-y-1">
                   <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Qualifications</p>
                   <p className="text-gray-300 text-sm">{member.qualifications}</p>
                </div>

                <div className="mb-6 space-y-2">
                   <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Specialties</p>
                   <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                         <span key={skill} className="bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded border border-zinc-700">
                            {skill}
                         </span>
                      ))}
                   </div>
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-800">
                   <p className="text-gray-400 text-sm italic leading-relaxed">
                      "{member.contribution}"
                   </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join Our Team CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-12 text-center relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Stethoscope size={200} />
             </div>
             <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold mb-4 font-['Poppins']">
                  Ready to Meet Us in Person?
                </h3>
                <p className="text-gray-400 mb-8 text-lg">
                  We look forward to welcoming you to our clinic. Experience the difference of a team that truly cares about your oral health journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/appointment">
                    <Button className="w-full sm:w-auto bg-[#7FD856] text-black hover:bg-[#6FC745] font-bold px-8 py-6 text-lg rounded-xl">
                      Book an Appointment
                    </Button>
                  </Link>
                  <Link to="/contact">
                     <Button variant="outline" className="w-full sm:w-auto border-zinc-700 text-white hover:bg-zinc-800 font-semibold px-8 py-6 text-lg rounded-xl">
                        Contact Us
                     </Button>
                  </Link>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Team;
