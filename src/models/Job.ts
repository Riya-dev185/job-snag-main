import mongoose from 'mongoose';

const JobEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  date: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['applied', 'interview', 'email', 'call', 'offer', 'rejection', 'other'],
    required: true 
  },
  notes: { type: String }
});

const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  appliedDate: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['applied', 'interview', 'offer', 'rejected', 'pending'],
    default: 'applied'
  },
  source: { 
    type: String, 
    enum: ['extension', 'manual'],
    default: 'manual'
  },
  fromUrl: { type: String },
  salary: { type: String },
  location: { type: String },
  notes: { type: String },
  events: [JobEventSchema],
  userId: { type: String, required: true },
  order: { type: Number, default: 0 },
  column: { type: String, default: 'applied' }
}, {
  timestamps: true
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);