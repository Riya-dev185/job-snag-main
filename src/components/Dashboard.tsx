import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { JobService } from '../lib/jobService';
import { Job } from '../types/job';
import Layout from './Layout';
import JobsPage from './JobsPage';
import AnalyticsPage from './AnalyticsPage';

const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState<'jobs' | 'analytics'>('jobs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    if (!auth.currentUser) return;

    try {
      const fetchedJobs = await JobService.getJobsByUser(auth.currentUser.uid);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData: Partial<Job>) => {
    if (!auth.currentUser) return;

    try {
      const newJobData = {
        ...jobData,
        userId: auth.currentUser.uid,
        events: [],
        appliedDate: jobData.appliedDate || new Date().toISOString()
      };

      const newJob = await JobService.createJob(newJobData);
      setJobs(prev => [newJob, ...prev]);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleEditJob = async (jobData: Partial<Job>) => {
    if (!jobData.id) return;

    try {
      const updatedJob = await JobService.updateJob(jobData.id, jobData);
      if (!updatedJob) return;
      
      setJobs(prev => prev.map(job => 
        job.id === jobData.id ? updatedJob : job
      ));
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await JobService.deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleJobOrderUpdate = async (jobId: string, newOrder: number, newColumn: string) => {
    try {
      const updatedJob = await JobService.updateJobOrder(jobId, newOrder, newColumn);
      if (updatedJob) {
        setJobs(prev => prev.map(job => 
          job.id === jobId ? updatedJob : job
        ));
      }
    } catch (error) {
      console.error('Error updating job order:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      onSignOut={handleSignOut}
    >
      {currentPage === 'jobs' ? (
        <JobsPage 
          jobs={jobs}
          onAddJob={handleAddJob}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
          onJobOrderUpdate={handleJobOrderUpdate}
        />
      ) : (
        <AnalyticsPage jobs={jobs} />
      )}
    </Layout>
  );
};

export default Dashboard;