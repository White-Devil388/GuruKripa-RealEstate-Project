import mongoose from 'mongoose';

const floorPlanSchema = new mongoose.Schema(
  {
    planType: { type: String, default: '' },
    type: { type: String, default: '' },
    area: { type: String, default: '' },
    price: { type: String, default: '' }
  },
  { _id: false }
);

const amenitySchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    icon: { type: String, default: '' },
    category: { type: String, default: '' }
  },
  { _id: false }
);

const connectivitySchema = new mongoose.Schema(
  {
    spot: { type: String, default: '' },
    distance: { type: String, default: '' }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'Premium Apartments'
    },
    status: {
      type: String,
      default: 'Ready to Move'
    },
    price: {
      type: String,
      default: '₹35 Lakh - ₹70 Lakh'
    },
    pricingVisibility: {
      type: String,
      default: 'Visible'
    },
    location: {
      type: String,
      default: 'Indore'
    },
    city: {
      type: String,
      default: 'Indore'
    },
    state: {
      type: String,
      default: 'Madhya Pradesh'
    },
    heroImage: {
      type: String,
      default: ''
    },
    gallery: {
      type: [String],
      default: []
    },
    shortDesc: {
      type: String,
      default: ''
    },
    longDesc: {
      type: String,
      default: ''
    },
    highlights: {
      type: [String],
      default: []
    },
    specifications: {
      projectArea: { type: String, default: '' },
      towers: { type: String, default: '' },
      totalUnits: { type: String, default: '' },
      configurations: { type: String, default: '' },
      possession: { type: String, default: '' }
    },
    amenities: [amenitySchema],
    floorPlans: [floorPlanSchema],
    connectivity: [connectivitySchema],
    reraNumber: {
      type: String,
      default: ''
    },
    legalDisclosure: {
      type: String,
      default: ''
    },
    hasVirtualTour: {
      type: Boolean,
      default: true
    },
    hasVideo: {
      type: Boolean,
      default: true
    },
    brochureUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
