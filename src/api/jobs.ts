// API endpoint to receive job data from Chrome extension
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function createJobFromExtension(jobData: any, userId: string) {
  try {
    const newJob = {
      ...jobData,
      userId,
      events: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'extension'
    };

    const docRef = await addDoc(collection(db, 'jobs'), newJob);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating job from extension:', error);
    return { success: false, error: error.message };
  }
}

// CORS handler for Chrome extension
export function enableCORS() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}