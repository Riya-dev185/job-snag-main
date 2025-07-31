import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { Job } from '../types/job';
import Layout from './Layout';
import JobCard from './JobCard';
import JobForm from './JobForm';

const Dashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    if (!auth.currentUser) return;

    try {
      const q = query(
        collection(db, 'jobs'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedJobs: Job[] = [];
      
      querySnapshot.forEach((doc) => {
        fetchedJobs.push({ id: doc.id, ...doc.data() } as Job);
      });
      
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
      const newJob = {
        ...jobData,
        userId: auth.currentUser.uid,
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'jobs'), newJob);
      setJobs(prev => [{ id: docRef.id, ...newJob } as Job, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleEditJob = async (jobData: Partial<Job>) => {
    if (!editingJob?.id) return;

    try {
      const updatedJob = {
        ...jobData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'jobs', editingJob.id), updatedJob);
      setJobs(prev => prev.map(job => 
        job.id === editingJob.id ? { ...job, ...updatedJob } : job
      ));
      setEditingJob(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
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

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => job.status === filter);
  const statusCounts = getStatusCounts();

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

  if (showForm) {
    return (
      <Layout>
        <JobForm
          job={editingJob}
          onSubmit={editingJob ? handleEditJob : handleAddJob}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Applications</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Add Job
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            Sign Out
          </button>
        </div>
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

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm font-medium text-foreground">Filter:</span>
        {['all', 'applied', 'interview', 'offer', 'rejected', 'pending'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-foreground mb-2">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            {filter === 'all' 
              ? "Start tracking your job applications by adding your first job."
              : `No jobs found with status "${filter}".`
            }
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
          >
            Add Your First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={(job) => {
                setEditingJob(job);
                setShowForm(true);
              }}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;