import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Job } from '../types/job';
import JobCard from './JobCard';
import JobForm from './JobForm';

interface JobsPageProps {
  jobs: Job[];
  onAddJob: (jobData: Partial<Job>) => void;
  onEditJob: (jobData: Partial<Job>) => void;
  onDeleteJob: (jobId: string) => void;
  onJobOrderUpdate: (jobId: string, newOrder: number, newColumn: string) => void;
}

const JobsPage: React.FC<JobsPageProps> = ({
  jobs,
  onAddJob,
  onEditJob,
  onDeleteJob,
  onJobOrderUpdate
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const columns = {
    applied: { title: 'Applied', color: 'bg-job-applied' },
    interview: { title: 'Interview', color: 'bg-job-interview' },
    offer: { title: 'Offer', color: 'bg-job-offer' },
    rejected: { title: 'Rejected', color: 'bg-job-rejected' },
    pending: { title: 'Pending', color: 'bg-job-pending' }
  };

  const getJobsByColumn = (columnId: string) => {
    return jobs
      .filter(job => (job.column || job.status) === columnId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    onJobOrderUpdate(draggableId, destination.index, destination.droppableId);
  };

  const getStatusCounts = () => {
    const counts = {
      total: jobs.length,
      applied: jobs.filter(j => j.status === 'applied').length,
      interview: jobs.filter(j => j.status === 'interview').length,
      offer: jobs.filter(j => j.status === 'offer').length,
      rejected: jobs.filter(j => j.status === 'rejected').length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (showForm) {
    return (
      <JobForm
        job={editingJob}
        onSubmit={editingJob ? onEditJob : onAddJob}
        onCancel={() => {
          setShowForm(false);
          setEditingJob(null);
        }}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Applications</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
        >
          Add Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">{statusCounts.total}</div>
          <div className="text-sm text-muted-foreground">Total Applications</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-job-applied">{statusCounts.applied}</div>
          <div className="text-sm text-muted-foreground">Applied</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-job-interview">{statusCounts.interview}</div>
          <div className="text-sm text-muted-foreground">Interviews</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-job-offer">{statusCounts.offer}</div>
          <div className="text-sm text-muted-foreground">Offers</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-job-rejected">{statusCounts.rejected}</div>
          <div className="text-sm text-muted-foreground">Rejected</div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color} mr-2`}></div>
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="ml-auto text-sm text-muted-foreground">
                  {getJobsByColumn(columnId).length}
                </span>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-3 ${
                      snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg' : ''
                    }`}
                  >
                    {getJobsByColumn(columnId).map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id!} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                            }`}
                          >
                            <JobCard
                              job={job}
                              onEdit={(job) => {
                                setEditingJob(job);
                                setShowForm(true);
                              }}
                              onDelete={onDeleteJob}
                              compact={true}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-foreground mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking your job applications by adding your first job.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Add Your First Job
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsPage;