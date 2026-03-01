
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Award, Heart, Lightbulb, Users, Calendar, Building2, Target, Eye, ShieldCheck, Stethoscope } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LazyImage from '@/components/LazyImage';

const About = () => {
  const stats = [
    { icon: Calendar, number: '10+', label: 'Years in Kampala' },
    { icon: Users, number: '5,000+', label: 'Ugandan Smiles' },
    { icon: Building2, number: '1', label: 'Premium Facility' },
  ];

  const values = [
    {
      icon: Award,
      title: 'Professional Excellence',
      description: 'We bring international dental standards to Uganda, constantly upgrading our skills and equipment to provide world-class treatments.'
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We treat every patient like family, providing gentle, understanding care to the Makindye community and beyond.'
    },
    {
      icon: Lightbulb,
      title: 'Modern Innovation',
      description: 'We invest in the latest dental technology to ensure our patients receive the most effective and comfortable treatments available in East Africa.'
    },
    {
      icon: ShieldCheck,
      title: 'Integrity & Trust',
      description: 'We believe in transparent pricing and honest treatment plans. We only recommend what is necessary for your long-term oral health.'
    },
    {
      icon: Stethoscope,
      title: 'Holistic Approach',
      description: 'We look beyond just teeth. Our comprehensive approach considers your overall health, lifestyle, and personal goals.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'Deeply rooted in Kampala, we are committed to improving oral health awareness and accessibility for our local community.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About JB Dental Clinic - Our Mission & Vision</title>
        <meta name="description" content="Discover the story behind JB Dental Clinic in Kampala. Learn about our mission to provide world-class dental care, our vision for the future, and our commitment to the community." />
      </Helmet>
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F] min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="About JB Dental Clinic"
            subtitle="Your trusted partner in dental excellence in the heart of Kampala"
          />

          {/* Intro Section with Image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden h-[500px] group shadow-2xl shadow-[#7FD856]/10 border border-zinc-800">
                <LazyImage
                  src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/edbb629780c6b6d0716cdbdd9a5316aa.jpg"
                  alt="JB Dental Clinic Team - Professional and Welcoming"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
                   <div className="absolute bottom-6 left-6 text-white">
                      <p className="font-bold text-lg">Welcome to JB Dental</p>
                      <p className="text-sm text-[#7FD856]">Where your smile is our priority</p>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 flex flex-col justify-center space-y-6"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white font-['Poppins']">
                Redefining Dental Care in <span className="text-[#7FD856]">Uganda</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                JB Dental Clinic was established to bridge the gap in quality dental care in Kampala. Located in the heart of Makindye, we have been serving the community with dedication, bringing world-class dental solutions closer to home.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                Our team of certified Ugandan professionals understands local dental needs and is committed to promoting oral hygiene and health across the region. We combine warm African hospitality with modern medical expertise to create a dental experience that is both professional and personal.
              </p>
              <div className="pt-4">
                <Link to="/contact">
                  <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(127,216,86,0.3)]">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
             {/* Mission */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="bg-zinc-900/50 p-10 rounded-3xl border border-zinc-800 hover:border-[#7FD856]/50 transition-colors group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Target size={120} />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#7FD856]/10 rounded-2xl flex items-center justify-center mb-6 text-[#7FD856]">
                    <Target size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 font-['Poppins'] text-white">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    To empower our community through exceptional oral healthcare. We are driven by the belief that a healthy smile is the foundation of confidence and well-being. Our mission is to provide accessible, high-quality, and pain-free dental services that exceed patient expectations.
                  </p>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#7FD856] rounded-full"></span>Patient-centered approach in every procedure</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#7FD856] rounded-full"></span>Continuous education for our medical team</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#7FD856] rounded-full"></span>Creating a fear-free dental environment</li>
                  </ul>
                </div>
             </motion.div>

             {/* Vision */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className="bg-zinc-900/50 p-10 rounded-3xl border border-zinc-800 hover:border-[#7FD856]/50 transition-colors group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Eye size={120} />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#7FD856]/10 rounded-2xl flex items-center justify-center mb-6 text-[#7FD856]">
                    <Eye size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 font-['Poppins'] text-white">Our Vision</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    To be the leading dental healthcare provider in Uganda, recognized for our innovation, integrity, and clinical excellence. We aspire to set the benchmark for modern dentistry in East Africa, where advanced technology meets compassionate human care.
                  </p>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#7FD856] rounded-full"></span>Pioneering digital dentistry in the region</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#7FD856] rounded-full"></span>Expanding access to specialized treatments</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#7FD856] rounded-full"></span>Building lasting relationships with generations of families</li>
                  </ul>
                </div>
             </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#7FD856]/10 to-transparent rounded-2xl p-8 text-center border border-[#7FD856]/20 hover:border-[#7FD856]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-[#7FD856]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="text-[#7FD856]" size={32} />
                </div>
                <div className="text-5xl font-bold text-[#7FD856] mb-2 font-['Poppins']">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Core Values */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-5xl font-bold mb-6 font-['Poppins']">
                Our Core <span className="text-[#7FD856]">Values</span>
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                These principles guide every interaction, every procedure, and every decision we make at JB Dental Clinic.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-800/80 hover:shadow-xl hover:shadow-[#7FD856]/5 hover:border-[#7FD856]/30 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#7FD856]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="text-[#7FD856]" size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white font-['Poppins']">
                    {value.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action Area */}
          <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden relative">
             <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                   <h3 className="text-3xl md:text-4xl font-bold mb-6 font-['Poppins']">Ready to Experience the Difference?</h3>
                   <p className="text-gray-300 mb-8 text-lg">
                      Whether you're looking for a routine check-up, a complete smile makeover, or emergency care, our team is here to welcome you.
                   </p>
                   <Link to="/appointment">
                      <Button className="w-full sm:w-auto bg-[#7FD856] text-black hover:bg-[#6FC745] font-bold px-8 py-6 text-lg rounded-xl">
                        Book Your Visit Today
                      </Button>
                   </Link>
                </div>
                <div className="relative h-64 lg:h-auto">
                   <LazyImage 
                      src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/6fba89a3351109728e367592f7616883.jpg" 
                      alt="JB Dental Clinic storefront with illuminated neon sign, clinic entrance at night, and the tagline 'For All Your Dental Solutions'" 
                      className="absolute inset-0 w-full h-full object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent lg:bg-gradient-to-l pointer-events-none"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
