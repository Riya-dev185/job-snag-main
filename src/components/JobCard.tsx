import React from 'react';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

const statusColors = {
  applied: 'bg-job-applied text-white',
  interview: 'bg-job-interview text-white',
  offer: 'bg-job-offer text-white',
  rejected: 'bg-job-rejected text-white',
  pending: 'bg-job-pending text-white'
};

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{job.position}</h3>
          <p className="text-muted-foreground font-medium">{job.company}</p>
          {job.location && (
            <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
          <div className="relative">
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Applied:</span>
          <span className="text-foreground font-medium">{formatDate(job.appliedDate)}</span>
        </div>
        {job.salary && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Salary:</span>
            <span className="text-foreground font-medium">{job.salary}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Source:</span>
          <span className={`text-xs px-2 py-1 rounded ${job.source === 'extension' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
            {job.source === 'extension' ? 'Extension' : 'Manual'}
          </span>
        </div>
      </div>

      {job.notes && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{job.notes}</p>
        </div>
      )}

      {job.events.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Recent Events</h4>
          <div className="space-y-1">
            {job.events.slice(0, 2).map((event) => (
              <div key={event.id} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{event.label}</span>
                <span className="text-muted-foreground">{formatDate(event.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 pt-4 border-t border-border">
        <button
          onClick={() => onEdit?.(job)}
          className="flex-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 border border-border rounded-md transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(job.id!)}
          className="px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 border border-border rounded-md transition-colors"
        >
          Delete
        </button>
        {job.fromUrl && (
          <a
            href={job.fromUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors"
          >
            View
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;