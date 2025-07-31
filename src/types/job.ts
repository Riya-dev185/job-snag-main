export interface Job {
  id?: string;
  company: string;
  position: string;
  appliedDate: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'pending';
  source: 'extension' | 'manual';
  fromUrl?: string;
  salary?: string;
  location?: string;
  notes?: string;
  events: JobEvent[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobEvent {
  id: string;
  label: string;
  date: string;
  type: 'applied' | 'interview' | 'email' | 'call' | 'offer' | 'rejection' | 'other';
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}