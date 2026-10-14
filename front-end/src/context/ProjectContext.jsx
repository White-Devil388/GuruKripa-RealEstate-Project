import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProjects, createProjectApi, updateProjectApi, deleteProjectApi } from '../api/projectApi';

const ProjectContext = createContext();

const LOCAL_STORAGE_KEY = 'ga_admin_projects';

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load projects from localStorage:', err);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to localStorage whenever projects state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch (err) {
      console.error('Failed to save projects to localStorage:', err);
    }
  }, [projects]);

  // Attempt backend API fetch on mount if available
  useEffect(() => {
    const fetchApiProjects = async () => {
      try {
        setIsLoading(true);
        const apiData = await getProjects();
        if (Array.isArray(apiData)) {
          setProjects(apiData);
        }
      } catch (err) {
        // Fallback silently to localStorage/initial dataset if API server is not running
        console.log('Using local client project storage');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApiProjects();
  }, []);

  // Add new property card
  const addProject = async (newProjData) => {
    const newId = `proj-${Date.now()}`;
    const slug = newProjData.slug || newProjData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const formattedProj = {
      id: newId,
      slug: slug,
      name: newProjData.name || 'New Property Project',
      category: newProjData.category || 'Premium Apartments',
      status: newProjData.status || 'Ready to Move',
      price: newProjData.price || '₹35 Lakh - ₹70 Lakh',
      pricingVisibility: newProjData.pricingVisibility || 'Visible',
      location: newProjData.location || 'Vijay Nagar',
      city: newProjData.city || 'Indore',
      state: newProjData.state || 'Madhya Pradesh',
      heroImage: newProjData.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      gallery: newProjData.gallery && newProjData.gallery.length > 0 ? newProjData.gallery : [
        newProjData.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'
      ],
      shortDesc: newProjData.shortDesc || `${newProjData.category} in ${newProjData.location}, ${newProjData.city}.`,
      longDesc: newProjData.longDesc || `Luxurious and architectural masterpiece featuring top-tier modern amenities in ${newProjData.location}, ${newProjData.city}.`,
      highlights: newProjData.highlights || ['Clubhouse', '24x7 Security', 'Garden', 'Parking'],
      specifications: {
        projectArea: newProjData.specifications?.projectArea || '5 Acres',
        towers: newProjData.specifications?.towers || '2',
        totalUnits: newProjData.specifications?.totalUnits || '120',
        configurations: newProjData.specifications?.configurations || '2 & 3 BHK',
        possession: newProjData.specifications?.possession || '2027'
      },
      amenities: newProjData.amenities || [
        { name: 'Gym', icon: 'Dumbbell', category: 'Fitness' },
        { name: 'Swimming Pool', icon: 'Waves', category: 'Leisure' },
        { name: 'Garden', icon: 'Tree', category: 'Eco' }
      ],
      floorPlans: newProjData.floorPlans || [
        { type: '2 BHK', area: '1050 Sq Ft', price: '₹35 Lakh' },
        { type: '3 BHK', area: '1450 Sq Ft', price: '₹55 Lakh' }
      ],
      connectivity: newProjData.connectivity || [
        { spot: 'Railway Station', distance: '10 Min' },
        { spot: 'Airport', distance: '15 Min' },
        { spot: 'Main Market', distance: '5 Min' }
      ],
      reraNumber: newProjData.reraNumber || `RERA-MP-${Math.floor(1000 + Math.random() * 9000)}`,
      legalDisclosure: newProjData.legalDisclosure || 'RERA Approved Property.',
      hasVirtualTour: newProjData.hasVirtualTour ?? true,
      hasVideo: newProjData.hasVideo ?? true,
      brochureUrl: newProjData.brochureUrl || '#download-brochure'
    };

    // Try API creation
    try {
      const createdApi = await createProjectApi(formattedProj);
      const result = createdApi && createdApi.id ? createdApi : formattedProj;
      setProjects((prev) => [result, ...prev]);
      return result;
    } catch (e) {
      console.error('Failed to create project on server:', e);
      setProjects((prev) => [formattedProj, ...prev]);
      return formattedProj;
    }
  };

  // Update existing property card
  const updateProject = async (id, updatedFields) => {
    let updatedObj = null;

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === id) {
          updatedObj = {
            ...proj,
            ...updatedFields,
            specifications: {
              ...proj.specifications,
              ...(updatedFields.specifications || {})
            }
          };
          return updatedObj;
        }
        return proj;
      })
    );

    // Try API update
    try {
      await updateProjectApi(id, updatedFields);
    } catch (e) {
      console.error('API update failed:', e);
    }

    return updatedObj;
  };

  // Delete property card
  const deleteProject = async (id) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));

    try {
      await deleteProjectApi(id);
    } catch (e) {
      console.error('API delete failed:', e);
    }
  };

  // Reset inventory back to API data
  const resetProjects = async () => {
    try {
      const apiData = await getProjects();
      if (Array.isArray(apiData)) {
        setProjects(apiData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apiData));
      }
    } catch (e) {
      setProjects([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        addProject,
        updateProject,
        deleteProject,
        resetProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
