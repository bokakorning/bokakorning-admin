import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { Api } from '@/services/service';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { userContext } from './_app';
import { toast } from 'react-toastify';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
const editorConfig = {
    height: 400,
    toolbarAdaptive: false,
    buttons: [
        'bold',
        'italic',
        'underline',
        'ul',
        'ol',
        'font',
        'fontsize',
        'paragraph',
        'link',
        'table',
        'image',
        'hr',
        'source'
    ]
};

function ContentManagement(props) {

const [selectedLanguage, setSelectedLanguage] = useState('en');

const [contentData, setContentData] = useState({
  privacyPolicy: {
    en: { content: '', id: '' },
    sv: { content: '', id: '' },
  },
  termsAndConditions: {
    en: { content: '', id: '' },
    sv: { content: '', id: '' },
  },
});


    const [user] = useContext(userContext);
    const router = useRouter();

    useEffect(() => {
        getContent();
    }, []);

    const getContent = () => {
        props.loader(true);
        Api("get", "content/getContent", router).then(
            (res) => {
                props.loader(false);
                if (res?.status && res?.data?.length) {
        const updated = { ...contentData };

        res.data.forEach(item => {
          updated[item?.type][item?.language] = {
            content: item.content,
            id: item._id,
          };
        });

        setContentData(updated);
      } else {
                    toast.error(res?.data?.message || "Failed to fetch content");
                }
            },
            (err) => {
                props.loader(false);
                toast.error(err?.data?.message || err?.message || "An error occurred")
            }
        );
    };

    const updateContent = (type,name) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to update it!",
            showCancelButton: true,
            confirmButtonColor: "#4EB0CF",
            cancelButtonColor: "#4EB0CF",
            confirmButtonText: "Yes, update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                props.loader(true);
                const data = contentData[type][selectedLanguage];
console.log("Updating content:", data);
  const payload = {
    id: data.id,
    type,
    name,
    language: selectedLanguage,
    content: data.content,
  };

                Api("post", "content/updateContent", payload, router).then(
                    (res) => {
                        props.loader(false);
                        toast.success(res?.message || "Updated successfully")
                        getContent()
                    },
                    (err) => {
                        props.loader(false);
                        toast.error(err?.data?.message || err?.message || "An error occurred")
                    }
                );
            }
        });
    };

   const handleContentChange = (type, value) => {
  setContentData(prev => ({
    ...prev,
    [type]: {
      ...prev[type],
      [selectedLanguage]: {
        ...prev[type][selectedLanguage],
        content: value,
      },
    },
  }));
};

    return (
        <div className="w-full mx-auto p-4 bg-gray-50">
            <div className="max-h-[90vh] h-full overflow-y-scroll scrollbar-hide overflow-scroll pb-20">
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="p-6  flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full text-center md:text-left mb-4 md:mb-0">
                            <p className="text-gray-500 font-medium">
                                {moment(new Date()).format('dddd, DD MMM YYYY')}
                            </p>
                            <h2 className="text-2xl md:text-3xl text-black font-bold mt-1">
                                Welcome, <span className="text-sky-400">{user?.role || 'Admin'}</span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                className={`py-2 px-6 rounded-lg transition-all duration-300 font-medium bg-custom-blue text-white shadow-lg shadow-sky-200 `}
                            >
                                Content Management
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mb-4 justify-end w-full">
  {['en', 'sv'].map(lang => (
    <button
      key={lang}
      onClick={() => setSelectedLanguage(lang)}
      className={`px-4 py-2 rounded ${
        selectedLanguage === lang
          ? 'bg-custom-blue text-white'
          : 'bg-gray-200 text-black'
      }`}
    >
      {lang === 'en' ? 'English' : 'Swedish'}
    </button>
  ))}
</div>

                    <ContentSection
                    title={`Privacy Policy (${selectedLanguage.toUpperCase()})`}
                    value={contentData.privacyPolicy[selectedLanguage].content}
                    onChange={(val) => handleContentChange('privacyPolicy', val)}
                    onSubmit={() => updateContent('privacyPolicy', 'Privacy Policy')}
                  />
                    <ContentSection
                    title={`Terms & Conditions (${selectedLanguage.toUpperCase()})`}
                    value={contentData.termsAndConditions[selectedLanguage].content}
                    onChange={(val) => handleContentChange('termsAndConditions', val)}
                    onSubmit={() => updateContent('termsAndConditions', 'Terms & Conditions')}
                  />
            </div>
        </div>
    );
}

const ContentSection = ({ title, value, onChange, onSubmit, isLast = false }) => {
    return (
        <div className={`mb-${isLast ? '20' : '8'}`}>
            <div className="bg-white rounded-t-xl shadow-md">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-xl text-black md:text-2xl font-bold flex items-center">
                        {title}
                    </h3>
                </div>

                <div className="p-4 md:p-6">
                    <div className="border rounded-lg overflow-hidden">

                        <div className="p-1 text-black">
                            <JoditEditor
                                className="editor text-black"
                                rows={8}
                                value={value}
                                config={editorConfig}
                                onBlur={(newContent) => {
                                    // newContent = HTML string
                                    onChange(newContent);
                                }}
                            />

                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={onSubmit}
                            className="flex items-center gap-2 bg-custom-blue hover:bg-sky-500 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;