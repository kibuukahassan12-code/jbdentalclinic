
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Camera, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Gem,
  Smile,
  Zap,
  UserCheck,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const BridalDentistry = () => {
  const subServices = [
    {
      title: "Pre-wedding Smile Assessment",
      description: "A comprehensive digital analysis of your smile to identify enhancements that will make you shine.",
      benefits: "Custom roadmap to your perfect look",
      timeline: "3-6 months before",
      icon: Calendar,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/561f6e3cc166d92883f00374ff5cf30b.jpg" // Updated image for Pre-wedding Smile Assessment
    },
    {
      title: "Professional Bridal Whitening",
      description: "High-intensity, safe whitening treatments designed to remove deep stains for a blindingly bright smile.",
      benefits: "3-8 shades lighter in one visit",
      timeline: "2-4 weeks before",
      icon: Sparkles,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/0eefde4e66c1530e988ed1fbc40d8276.jpg" // African dentist and assistant in clinic setting
    },
    {
      title: "Smile Makeover Corrections",
      description: "Artistic bonding and contouring to fix chips, gaps, or irregularities that might show in close-ups.",
      benefits: "Flawless symmetry for photos",
      timeline: "1-3 months before",
      icon: Gem,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/786315b99e887828f34313c28418e9d7.jpg" // Before and after smile transformation photos
    },
    {
      title: "Gum Contouring",
      description: "Gentle laser reshaping of the gum line to reduce 'gummy smiles' and reveal more of your beautiful teeth.",
      benefits: "Balanced, proportionate smile",
      timeline: "2-3 months before",
      icon: Heart,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/b206e3cf8da24a507c3a848aa825138d.jpg" // Dentist performing procedure on patient
    },
    {
      title: "Bridal Veneers",
      description: "Ultra-thin porcelain shells custom-crafted to create the ultimate red-carpet celebrity smile for your day.",
      benefits: "Total transformation",
      timeline: "2-4 months before",
      icon: Sparkles,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/12e5f4123c70669bc67dacc28ed1d615.jpg" // Happy patient smiling in dental chair
    },
    {
      title: "Teeth Alignment Quick Fixes",
      description: "Accelerated orthodontic solutions or cosmetic alignment to straighten visible teeth quickly.",
      benefits: "Straighter teeth without long-term braces",
      timeline: "3-6 months before",
      icon: Timer,
      image: "https://images.unsplash.com/photo-1619987614890-4797e713fb03"
    },
    {
      title: "Emergency Dental Repairs",
      description: "Priority access for last-minute chips, cracks, or pain. We ensure nothing ruins your big day.",
      benefits: "Peace of mind & rapid response",
      timeline: "Anytime",
      icon: Zap,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/5914f424279c99251a1a6fc49e4a9de3.jpg" // Patient receiving dental treatment
    },
    {
      title: "Smile Confidence Coaching",
      description: "Tips and exercises to help you relax your facial muscles and smile naturally for hundreds of photos.",
      benefits: "Natural, relaxed photo-ready look",
      timeline: "1 month before",
      icon: UserCheck,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/ce0dafc6cf6ec9ed89a14f3ee5b12bc3.png" // Updated: Woman with radiant smile, pointing to her teeth
    },
    {
      title: "Breath Freshening Treatments",
      description: "Deep cleaning and therapeutic treatments to ensure fresh breath for greeting guests and that first kiss.",
      benefits: "Total confidence close-up",
      timeline: "1 week before",
      icon: Smile,
      image: "https://images.unsplash.com/photo-1580821810660-5486b8e980a6"
    },
    {
      title: "Photo Prep Polish",
      description: "A final high-gloss polish right before the wedding to make your teeth sparkle under camera flashes.",
      benefits: "Maximum shine & reflection",
      timeline: "2-3 days before",
      icon: Camera,
      image: "https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      date: "Wedding: Dec 2024",
      quote: "I was so self-conscious about my gap. JB Dental fixed it in two visits! My wedding photos are absolutely perfect.",
      rating: 5,
      image: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/fcddfcec326db091c6c42563cf568fdb.jpg" 
    },
    {
      name: "Grace K.",
      date: "Wedding: Oct 2024",
      quote: "The whitening package was exactly what I needed. My smile looked radiant against my white dress.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1610047520958-b42ebcd2f6cb"
    },
    {
      name: "Amina L.",
      date: "Wedding: Jan 2025",
      quote: "They treated me like a queen. The pre-wedding assessment caught a small issue that could have been a disaster.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1558642843-d6351b0ccf51"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Exclusive Bridal Dentistry | JB Dental Clinic Kampala</title>
        <meta name="description" content="The ONLY clinic in Kampala offering specialized bridal dentistry packages. Teeth whitening, smile makeovers, and emergency care for your wedding day." />
      </Helmet>

      <div className="min-h-screen bg-[#0F0F0F] text-white">
        
        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0"> {/* Added py-20 for smaller screens */}
          <div className="absolute inset-0 z-0">
            <LazyImage 
              src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/fcddfcec326db091c6c42563cf568fdb.jpg" 
              alt="Beautiful African Bride with Radiant Smile and Gold Jewelry" 
              className="w-full h-full"
              style={{ objectPosition: 'center top' }}
            />
            {/* Added a more robust gradient overlay for text readability across different image details */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/90 via-transparent to-[#0F0F0F]/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0F0F0F]/90 via-transparent to-[#0F0F0F]/40 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left w-full mt-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#7FD856]/20 text-[#7FD856] font-bold text-sm tracking-wider mb-6 border border-[#7FD856]/30 backdrop-blur-md">
                EXCLUSIVE SERVICE
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Poppins'] leading-tight">
                The <span className="text-[#7FD856]">ONLY Clinic</span> Offering <br />
                Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C19A6B] via-[#F4E2D8] to-[#C19A6B]">Bridal Dentistry</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl font-light leading-relaxed">
                Your wedding day is one of the most photographed days of your life. Ensure your smile captures the joy of the moment with our specialized bridal care packages.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/appointment?service=Bridal+Dentistry">
                  <Button className="w-full sm:w-auto bg-[#7FD856] hover:bg-[#6FC745] text-black font-bold px-8 py-7 text-lg rounded-xl shadow-[0_0_20px_rgba(127,216,86,0.4)] transition-all hover:scale-105">
                    Book Your Bridal Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 px-8 py-7 text-lg rounded-xl backdrop-blur-sm">
                    Contact for Custom Plans
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Introduction & Assurance */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-['Poppins']">
                Why <span className="text-[#7FD856]">Bridal Dentistry?</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                A wedding isn't just another event; it's a milestone. Every eye is on you, and cameras will be capturing your expressions from every angle. Regular dentistry focuses on health, but <strong>Bridal Dentistry</strong> focuses on the aesthetics, timing, and perfection required for high-definition photography and videography.
              </p>
              <div className="p-6 bg-zinc-900/50 rounded-2xl border border-[#7FD856]/20">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                  <Gem className="w-5 h-5 text-[#7FD856] mr-2" />
                  Our Professional Assurance
                </h3>
                <p className="text-gray-400 text-sm">
                  JB Dental Clinic has prepared hundreds of brides for their special day. We understand the tight timelines and high stakes of wedding planning. We guarantee timely results and treatments that settle perfectly before your big day—no swollen gums or sensitivity on your wedding morning.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#7FD856]/20 to-transparent rounded-3xl rotate-3 transform transition-transform group-hover:rotate-0"></div>
              <LazyImage 
                src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/ac43370b3805a6abaff3f1baa1d29c51.jpg" 
                alt="African couple in elegant white wedding attire with beautiful smiles" 
                className="relative z-10 rounded-3xl shadow-2xl w-full h-[500px]"
              />
            </motion.div>
          </div>
        </div>

        {/* Sub-Services Grid */}
        <div className="py-20 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-['Poppins']">The <span className="text-[#7FD856]">Bridal Collection</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Comprehensive services curated specifically for the bride-to-be.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-[#7FD856]/10 hover:border-[#7FD856]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden relative">
                    <LazyImage 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#7FD856] font-mono border border-[#7FD856]/30 z-10">
                      {service.timeline}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-[#7FD856]/10 text-[#7FD856]">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{service.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{service.description}</p>
                    <div className="flex items-start gap-2 pt-4 border-t border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-[#7FD856] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-300 font-medium">{service.benefits}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link to="/appointment?service=Bridal+Dentistry">
                <Button className="bg-transparent border border-[#7FD856] text-[#7FD856] hover:bg-[#7FD856] hover:text-black font-semibold px-8 py-6 rounded-xl transition-all">
                  Schedule Your Bridal Smile Package
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Real <span className="text-[#7FD856]">Brides</span>, Real Smiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 relative"
              >
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-full border-2 border-[#7FD856] overflow-hidden bg-zinc-800">
                   <LazyImage src={t.image} alt={t.name} className="w-full h-full" />
                </div>
                <div className="flex mb-4 mt-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Sparkles key={i} className="w-4 h-4 text-[#C19A6B] fill-[#C19A6B]" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6">"{t.quote}"</p>
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-[#7FD856] text-xs uppercase tracking-wide">{t.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-20 px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#7FD856]/20 to-[#C19A6B]/20 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-[#7FD856]/30">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">Don't Leave Your Smile to Chance</h2>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto relative z-10">
              Slots for bridal packages are limited each month to ensure personalized attention. Secure your date today.
            </p>
            <Link to="/appointment?service=Bridal+Dentistry" className="relative z-10">
              <Button className="bg-[#7FD856] hover:bg-[#6FC745] text-black font-bold px-12 py-8 text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform">
                Book Your Transformation Now <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </>
  );
};

export default BridalDentistry;
