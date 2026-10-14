import React, { createContext, useContext, useState, useEffect } from 'react';

// API services
import { getBlogs } from '../api/blogApi';
import { getCareers } from '../api/careerApi';
import { getCompanyInfo } from '../api/companyApi';
import { getMedia } from '../api/mediaApi';

const DataContext = createContext();

const EMPTY_COMPANY = {
  stats: [],
  achievements: [],
  achievementImages: [],
  coreValues: [],
  testimonials: [],
  leadershipTeam: [],
  faqItems: [],
  blogCategories: ['Real Estate Trends', 'Legal & RERA', 'Investment Guides', 'Architecture & Design'],
  mediaCategories: ['Project Images', 'Videos', 'Events', 'Company Activities', 'News & Press'],
  projectCategories: ['Premium Apartments', 'Affordable Housing', 'Luxury Villas', 'Premium Township', 'Commercial Complex', 'Residential Plots'],
  projectStatuses: ['Ready to Move', 'Under Construction', 'Launching Soon']
};

export const DataProvider = ({ children }) => {
  // Blogs
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);

  // Careers
  const [careers, setCareers] = useState([]);
  const [careersLoading, setCareersLoading] = useState(false);

  // Company data
  const [companyData, setCompanyData] = useState(EMPTY_COMPANY);
  const [companyLoading, setCompanyLoading] = useState(false);

  // Media
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // Fetch all data from MongoDB Atlas on mount
  useEffect(() => {
    const fetchAll = async () => {
      // Fetch Blogs
      setBlogsLoading(true);
      try {
        const apiBlogs = await getBlogs();
        if (Array.isArray(apiBlogs)) {
          setBlogs(apiBlogs);
        }
      } catch (err) {
        console.error('Failed to fetch blogs from API:', err);
      } finally {
        setBlogsLoading(false);
      }

      // Fetch Careers
      setCareersLoading(true);
      try {
        const apiCareers = await getCareers();
        if (Array.isArray(apiCareers)) {
          setCareers(apiCareers);
        }
      } catch (err) {
        console.error('Failed to fetch careers from API:', err);
      } finally {
        setCareersLoading(false);
      }

      // Fetch Company Info
      setCompanyLoading(true);
      try {
        const apiCompany = await getCompanyInfo();
        if (apiCompany) {
          setCompanyData({
            stats: apiCompany.stats || [],
            achievements: apiCompany.achievements || [],
            achievementImages: apiCompany.achievementImages || [],
            coreValues: apiCompany.coreValues || [],
            testimonials: apiCompany.testimonials || [],
            leadershipTeam: apiCompany.leadershipTeam || [],
            faqItems: apiCompany.faqItems || [],
            blogCategories: apiCompany.blogCategories && apiCompany.blogCategories.length > 0
              ? apiCompany.blogCategories
              : EMPTY_COMPANY.blogCategories,
            mediaCategories: apiCompany.mediaCategories && apiCompany.mediaCategories.length > 0
              ? apiCompany.mediaCategories
              : EMPTY_COMPANY.mediaCategories,
            projectCategories: apiCompany.projectCategories && apiCompany.projectCategories.length > 0
              ? apiCompany.projectCategories
              : EMPTY_COMPANY.projectCategories,
            projectStatuses: apiCompany.projectStatuses && apiCompany.projectStatuses.length > 0
              ? apiCompany.projectStatuses
              : EMPTY_COMPANY.projectStatuses
          });
        }
      } catch (err) {
        console.error('Failed to fetch company info from API:', err);
      } finally {
        setCompanyLoading(false);
      }

      // Fetch Media
      setMediaLoading(true);
      try {
        const apiMedia = await getMedia();
        if (Array.isArray(apiMedia)) {
          setMediaItems(apiMedia);
        }
      } catch (err) {
        console.error('Failed to fetch media from API:', err);
      } finally {
        setMediaLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <DataContext.Provider
      value={{
        // Blogs
        blogs,
        blogsLoading,
        setBlogs,

        // Careers
        careers,
        careersLoading,
        setCareers,

        // Company
        companyData,
        companyLoading,
        setCompanyData,

        // Media
        mediaItems,
        mediaLoading,
        setMediaItems
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
