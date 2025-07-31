import connectDB from './mongodb';
import Job from '../models/Job';
import { Job as JobType } from '../types/job';

export class JobService {
  static async createJob(jobData: Partial<JobType>): Promise<JobType> {
    await connectDB();
    const job = new Job(jobData);
    const savedJob = await job.save();
    return this.formatJob(savedJob);
  }

  static async getJobsByUser(userId: string): Promise<JobType[]> {
    await connectDB();
    const jobs = await Job.find({ userId }).sort({ order: 1, createdAt: -1 });
    return jobs.map(this.formatJob);
  }

  static async updateJob(jobId: string, updates: Partial<JobType>): Promise<JobType | null> {
    await connectDB();
    const job = await Job.findByIdAndUpdate(jobId, updates, { new: true });
    return job ? this.formatJob(job) : null;
  }

  static async deleteJob(jobId: string): Promise<boolean> {
    await connectDB();
    const result = await Job.findByIdAndDelete(jobId);
    return !!result;
  }

  static async updateJobOrder(jobId: string, newOrder: number, newColumn: string): Promise<JobType | null> {
    await connectDB();
    const job = await Job.findByIdAndUpdate(
      jobId, 
      { order: newOrder, column: newColumn }, 
      { new: true }
    );
    return job ? this.formatJob(job) : null;
  }

  private static formatJob(job: any): JobType {
    return {
      id: job._id.toString(),
      company: job.company,
      position: job.position,
      appliedDate: job.appliedDate,
      status: job.status,
      source: job.source,
      fromUrl: job.fromUrl,
      salary: job.salary,
      location: job.location,
      notes: job.notes,
      events: job.events || [],
      userId: job.userId,
      createdAt: job.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: job.updatedAt?.toISOString() || new Date().toISOString(),
      order: job.order || 0,
      column: job.column || job.status
    };
  }
}