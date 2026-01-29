import React, { useState, useEffect } from 'react';
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { Shield, Lock, Eye, FileText, Globe } from 'lucide-react';
import isAuth from '../../components/isAuth';

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const router = useRouter();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'sv', label: 'Swedish', flag: '🇸🇪' },
  ];

  const getPrivacyPolicy = (lan) => {
    setLoading(true);
    Api("get", `content/getContentForUser?type=privacyPolicy&language=${lan}`, router).then(
      (res) => {
        setLoading(false);
        console.log("API Response =>", res.data);

        if (res?.status) {
          setPrivacyPolicy(res?.data?.content || '');
        } else {
          toast.error(res?.data?.message || "Failed to load privacy policy");
        }
      },
      (err) => {
        setLoading(false);
        console.log("API Error =>", err);
        toast.error(err?.message || "An error occurred");
      }
    );
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    // Update URL query parameter
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, type: langCode }
      },
      undefined,
      { shallow: true }
    );
    getPrivacyPolicy(langCode);
  };

  useEffect(() => {
    if (!router.isReady) return;
    
    const t = router.query.type || "en";
    console.log("type", t);
    setCurrentLanguage(t);
    getPrivacyPolicy(t);
  }, [router.isReady]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-300 to-sky-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full opacity-20 blur-3xl animate-pulse delay-2000"></div>
      </div>
     
     <div className="inline-flex items-center bg-gray-200 rounded-full p-1 shadow-md flex absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  relative px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ease-in-out
                  ${currentLanguage === lang.code
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-black shadow-lg'
                    : 'bg-transparent text-gray-600 hover:text-gray-800'
                  }
                `}
                disabled={loading}
                title={lang.code === 'en' ? 'English' : 'Swedish'}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="text-xs">{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
              </button>
            ))}
          </div>

      {/* Floating Icons */}
      <div className="absolute top-24 left-4 sm:top-20 sm:left-10 opacity-10">
        <Shield className="w-16 h-16 sm:w-24 sm:h-24 text-sky-500 animate-bounce" style={{ animationDuration: '3s' }} />
      </div>
      <div className="absolute top-40 right-20 opacity-10">
        <Lock className="w-16 h-16 sm:w-20 sm:h-20 text-sky-500 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-40 left-1/4 opacity-10">
        <Eye className="w-12 h-12 sm:w-16 sm:h-16 text-sky-500 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
      </div>

      <main className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10 mt-15">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
              <FileText className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 bg-clip-text text-transparent mb-4 tracking-tight">
             {currentLanguage === 'en' ? 'Privacy Policy' : 'Integritetspolicy'}
            </h1>
            
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent to-sky-400 rounded-full"></div>
              <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 rounded-full"></div>
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <div className="w-16 h-1 bg-gradient-to-l from-transparent to-sky-500 rounded-full"></div>
            </div>
            
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-700">
                {currentLanguage === 'en' ? 'Last updated:' : 'Senast uppdaterad:'} {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden transform hover:shadow-3xl transition-all duration-300">
            <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 h-2"></div>
            
            <div className="p-8 md:p-12 lg:p-16">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-sky-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-sky-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="mt-6 text-gray-600 font-medium">{currentLanguage === 'en' ? 'Loading privacy policy...' : 'Laddar integritetspolicy...'}</p>
                </div>
              ) : (
                <div 
                  className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-sky-900 prose-headings:font-bold prose-a:text-sky-500 prose-a:no-underline hover:prose-a:text-sky-600 prose-strong:text-sky-800"
                  dangerouslySetInnerHTML={{ __html: privacyPolicy }} 
                />
              )}
            </div>
          </div>

        
          <div className="text-center mt-16 mb-8">
            <div className="inline-flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-gray-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">{currentLanguage === 'en' ? 'Your privacy is protected' : 'Din integritet är skyddad'}</span>
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

 export default isAuth(PrivacyPolicy);
