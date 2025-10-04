import React, { useState, useEffect } from 'react';
import { Api } from '@/services/service';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import isAuth from '../../components/isAuth';

const TermsAndConditions = () => {
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getTermsAndConditions = () => {
    setLoading(true);
    Api("get", "content/getContent", router).then(
      (res) => {
        setLoading(false);
        console.log("API Response =>", res.data);

        if (res?.status) {
          setTermsAndConditions(res?.data[0]?.termsAndConditions || '');
        } else {
          toast.error(res?.data?.message || "Failed to load terms and conditions");
        }
      },
      (err) => {
        setLoading(false);
        console.log("API Error =>", err);
        toast.error(err?.message || "An error occurred");
      }
    );
  };

  useEffect(() => {
    getTermsAndConditions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-100 to-sky-200 relative overflow-hidden">
      

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-sky-300 to-sky-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-br from-sky-400 to-sky-500 rounded-full opacity-20 blur-3xl animate-pulse delay-2000"></div>
      </div>

    
      <div className="absolute top-20 left-10 opacity-10">
        <Shield className="w-24 h-24 text-sky-500 animate-bounce" style={{ animationDuration: '3s' }} />
      </div>
      <div className="absolute top-40 right-20 opacity-10">
        <Lock className="w-20 h-20 text-sky-500 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-40 left-1/4 opacity-10">
        <Eye className="w-16 h-16 text-sky-500 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
      </div>

      <main className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
       
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
              <FileText className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 bg-clip-text text-transparent mb-4 tracking-tight">
              Terms and Conditions
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
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden transform hover:shadow-3xl transition-all duration-300">
            <div className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 h-2"></div>
            
            <div className="p-8 md:p-12 lg:p-16">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-sky-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-sky-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="mt-6 text-gray-600 font-medium">Loading terms and conditions...</p>
                </div>
              ) : (
                <div 
                  className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-sky-900 prose-headings:font-bold prose-a:text-sky-500 prose-a:no-underline hover:prose-a:text-sky-600 prose-strong:text-sky-800"
                  dangerouslySetInnerHTML={{ __html: termsAndConditions }} 
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
              <span className="text-sm font-medium">Your agreement is protected</span>
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default isAuth(TermsAndConditions);
