import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_company_info',
      unique: true
    },
    stats: [
      {
        label: String,
        value: String,
        sub: String
      }
    ],
    achievements: [
      {
        value: String,
        title: String,
        desc: String
      }
    ],
    achievementImages: [String],
    coreValues: [
      {
        title: String,
        desc: String,
        icon: String,
        image: String
      }
    ],
    testimonials: [
      {
        quote: String,
        name: String,
        detail: String
      }
    ],
    leadershipTeam: [
      {
        name: String,
        role: String,
        bio: String,
        image: String
      }
    ],
    faqItems: [
      {
        q: String,
        a: String
      }
    ],
    blogCategories: {
      type: [String],
      default: ['Real Estate Trends', 'Legal & RERA', 'Investment Guides', 'Architecture & Design']
    },
    mediaCategories: {
      type: [String],
      default: ['Project Images', 'Videos', 'Events', 'Company Activities', 'News & Press']
    },
    projectCategories: {
      type: [String],
      default: ['Premium Apartments', 'Affordable Housing', 'Luxury Villas', 'Premium Township', 'Commercial Complex', 'Residential Plots']
    },
    projectStatuses: {
      type: [String],
      default: ['Ready to Move', 'Under Construction', 'Launching Soon']
    }
  },
  {
    timestamps: true
  }
);

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);

export default Company;
