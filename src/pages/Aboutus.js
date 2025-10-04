import React, { useState, useEffect } from 'react';
import { Calendar, UserCheck, CheckCircle, GraduationCap, Wallet, Users, Award, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

const AboutUs = () => {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const processSteps = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Student Schedules a Booking",
      description: "Students book sessions with their preferred instructor at their convenience. Our platform provides an easy and fast booking process for everyone.",
      color: "from-sky-300 to-sky-400"
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: "Admin Assigns the Booking",
      description: "Our admin team intelligently assigns the most suitable and nearby instructor based on your location and requirements for optimal service.",
      color: "from-sky-400 to-sky-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Student Gets Confirmation",
      description: "Students receive instant confirmation with all session details including time, location, and instructor information for complete transparency.",
      color: "from-sky-500 to-cyan-400"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Instructor Provides Session",
      description: "Qualified instructors personally provide high-quality teaching to students and help them in their learning journey with expert guidance.",
      color: "from-cyan-400 to-blue-400"
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Wallet Balance Deducted",
      description: "After the session is complete, payment is automatically deducted from your wallet. The entire process is secure and transparent.",
      color: "from-blue-400 to-sky-500"
    }
  ];

  const features = [
    {
      icon: <Users className="w-10 h-10" />,
      title: "Verified Instructors",
      description: "All instructors are professionally trained and verified"
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Quality Assured",
      description: "Guaranteed high-quality teaching and personalized attention"
    },
    {
      icon: <Clock className="w-10 h-10" />,
      title: "Flexible Timing",
      description: "Book sessions according to your convenient schedule"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Secure Payments",
      description: "100% secure and transparent payment system"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
      {/* Hero Section */}
<div className='flex  flex-col justify-center items-center'> 
      <h1 className='md:pt-16 pt-10  text-center text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-300 via-sky-400 to-sky-400 bg-clip-text text-transparent mb-4 tracking-tight'> About Us</h1>
      <p className='md:w-56 w-40 h-[6px] bg-sky-400 rounded'></p>
      </div>
      <section className="container mx-auto px-4 py-6 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div
            id="hero-text"
            data-animate
            className={`space-y-6 transition-all duration-1000 ${
              visibleSections['hero-text']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
                Bokakorning
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              <strong>Bokakorning</strong> is a revolutionary platform that connects students with expert instructors. We make education accessible, efficient, and enjoyable for everyone.
            </p>
            <p className="text-md md:text-lg text-gray-600">
              On our platform, you can easily book sessions with qualified instructors. Whether you want to learn driving, take music lessons, or develop any skill - Bokakorning is the perfect solution for you.
            </p>
            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
              <p className="text-gray-700 italic">
                "Quality education, right at your doorstep - the right instructor, at the right time!"
              </p>
            </div>
            <button className="bg-gradient-to-r from-sky-300 to-blue-400 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Get Started Now
            </button>
          </div>

          {/* Image */}
          <div
            id="hero-image"
            data-animate
            className={`transition-all duration-1000 delay-300 ${
              visibleSections['hero-image']
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-500 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop"
                alt="Student learning with instructor"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div
            id="features-header"
            data-animate
            className={`text-center mb-12 transition-all duration-1000 ${
              visibleSections['features-header']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="md:text-4xl text-2xl font-bold text-gray-900 mb-2">
              Why Choose Bokakorning?
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Why we are your best choice for learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`bg-gradient-to-br from-sky-50 to-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  visibleSections[`feature-${index}`]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="bg-gradient-to-br from-sky-300 to-blue-400 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-16 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div
              id="about-content"
              data-animate
              className={`space-y-8 transition-all duration-1000 ${
                visibleSections['about-content']
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
                About Bokakorning
              </h2>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-sky-400 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bokakorning's mission is to make quality education accessible to everyone. We believe that learning is a continuous journey and with the right guidance, anyone can achieve their goals.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our platform creates a seamless connection between students and instructors, making the learning experience professional, convenient, and effective for all parties involved.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-sky-400 mb-3">For Students</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Easy booking process</li>
                    <li>✓ Verified and experienced instructors</li>
                    <li>✓ Flexible scheduling options</li>
                    <li>✓ Transparent pricing</li>
                    <li>✓ Secure payment system</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-sky-400 mb-3">For Instructors</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Reach students in your area</li>
                    <li>✓ Flexible working hours</li>
                    <li>✓ Guaranteed payments</li>
                    <li>✓ Professional platform</li>
                    <li>✓ Admin support 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div
            id="process-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections['process-header']
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Start your learning journey in just 5 easy steps
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto">
            {processSteps.map((step, index) => (
              <div
                key={index}
                id={`step-${index}`}
                data-animate
                className={`relative transition-all duration-1000 delay-${index * 100} ${
                  visibleSections[`step-${index}`]
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-10'
                }`}
              >
                <div className="flex items-start md:mb-12 mb-4 group">
                  {/* Icon Circle */}
                  <div className="flex-shrink-0 relative">
                    <div className={`md:w-16 md:h-16 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="absolute md:top-16 top-13 md:left-8 left-5 w-0.5 h-20 bg-gradient-to-b from-sky-300 to-sky-100"></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="md:ml-8 ml-4 flex-1 bg-gradient-to-br from-sky-50 to-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-sky-600">STEP {index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      <footer className="bg-sky-400 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-md">
           
            <Link href="/PrivacyPolicy" className=" transition-colors duration-300">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/TermsandConditions" className=" transition-colors duration-300">
              Terms & Conditions
            </Link>
          </div>
          <p className="mt-4 text-sm">
            © 2025 Bokakorning. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;