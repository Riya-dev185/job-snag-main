import React, { useState, useEffect } from 'react';
import { Job } from '../types/job';

interface JobFormProps {
  job?: Job;
  onSubmit: (jobData: Partial<Job>) => void;
  onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<{
    company: string;
    position: string;
    appliedDate: string;
    status: 'applied' | 'interview' | 'offer' | 'rejected' | 'pending';
    source: 'manual' | 'extension';
    fromUrl: string;
    salary: string;
    location: string;
    notes: string;
  }>({
    company: '',
    position: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'applied',
    source: 'manual',
    fromUrl: '',
    salary: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        position: job.position,
        appliedDate: job.appliedDate.split('T')[0],
        status: job.status,
        source: job.source,
        fromUrl: job.fromUrl || '',
        salary: job.salary || '',
        location: job.location || '',
        notes: job.notes || ''
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      appliedDate: new Date(formData.appliedDate).toISOString()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        {job ? 'Edit Job Application' : 'Add New Job Application'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
              Company *
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-foreground mb-2">
              Position *
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              placeholder="Enter job position"
              required
            />
          </div>

          <div>
            <label htmlFor="appliedDate" className="block text-sm font-medium text-foreground mb-2">
              Applied Date *
            </label>
            <input
              id="appliedDate"
              name="appliedDate"
              type="date"
              value={formData.appliedDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              placeholder="Enter job location"
            />
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-foreground mb-2">
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="text"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              placeholder="e.g., $80,000 - $100,000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fromUrl" className="block text-sm font-medium text-foreground mb-2">
            Job URL
          </label>
          <input
            id="fromUrl"
            name="fromUrl"
            type="url"
            value={formData.fromUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
            placeholder="Enter job posting URL"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
            placeholder="Add any notes about this application..."
          />
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors font-medium"
          >
            {job ? 'Update Job' : 'Add Job'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-border text-foreground rounded-md hover:bg-muted transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;