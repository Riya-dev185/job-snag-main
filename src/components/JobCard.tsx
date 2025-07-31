import React from 'react';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  compact?: boolean;
}

const statusColors = {
  applied: 'bg-job-applied text-white',
  interview: 'bg-job-interview text-white',
  offer: 'bg-job-offer text-white',
  rejected: 'bg-job-rejected text-white',
  pending: 'bg-job-pending text-white'
};

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, compact = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-card border border-border rounded-lg hover:shadow-md transition-shadow ${
      compact ? 'p-4' : 'p-6'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`font-semibold text-foreground mb-1 ${
            compact ? 'text-sm' : 'text-lg'
          }`}>{job.position}</h3>
          <p className={`text-muted-foreground font-medium ${
            compact ? 'text-xs' : 'text-sm'
          }`}>{job.company}</p>
          {job.location && (
            <p className={`text-muted-foreground mt-1 ${
              compact ? 'text-xs' : 'text-sm'
            }`}>{job.location}</p>
          )}
        </div>
        {!compact && (
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        )}
      </div>

      {compact && (
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className={`flex items-center justify-between ${
          compact ? 'text-xs' : 'text-sm'
        }`}>
          <span className="text-muted-foreground">Applied:</span>
          <span className="text-foreground font-medium">{formatDate(job.appliedDate)}</span>
        </div>
        {job.salary && (
          <div className={`flex items-center justify-between ${
            compact ? 'text-xs' : 'text-sm'
          }`}>
            <span className="text-muted-foreground">Salary:</span>
            <span className="text-foreground font-medium">{job.salary}</span>
          </div>
        )}
        <div className={`flex items-center justify-between ${
          compact ? 'text-xs' : 'text-sm'
        }`}>
          <span className="text-muted-foreground">Source:</span>
          <span className={`px-2 py-1 rounded ${
            compact ? 'text-xs' : 'text-xs'
          } ${job.source === 'extension' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
            {job.source === 'extension' ? 'Extension' : 'Manual'}
          </span>
        </div>
      </div>

      {job.notes && (
        <div className="mb-4">
          <p className={`text-muted-foreground line-clamp-2 ${
            compact ? 'text-xs' : 'text-sm'
          }`}>{job.notes}</p>
        </div>
      )}

      {!compact && job.events.length > 0 && (
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
          className={`flex-1 font-medium text-primary hover:bg-primary/5 border border-border rounded-md transition-colors ${
            compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(job.id!)}
          className={`font-medium text-destructive hover:bg-destructive/5 border border-border rounded-md transition-colors ${
            compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'
          }`}
        >
          Delete
        </button>
        {job.fromUrl && (
          <a
            href={job.fromUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors ${
              compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'
            }`}
          >
            View
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;