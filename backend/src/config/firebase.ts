import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Missing Firebase credentials in environment variables');
}

if (process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE')) {
  throw new Error('You are using the placeholder Firebase private key. Please update backend/.env with your actual private key from the Firebase Console.');
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Check if we are running with placeholder credentials
const isMockMode = !process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY.includes('YOUR_PRIVATE_KEY_HERE');

if (isMockMode) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  WARNING: Running in MOCK mode for Firebase. Authentication and Storage will NOT work securely.');
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  Please update backend/.env with your actual Firebase private key to enable real functionality.');
}

// Initialize Firebase Admin
if (!admin.apps.length && !isMockMode) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin, falling back to mock mode:', error);
  }
}

// Mock auth object if in mock mode
export const firebaseAuth = isMockMode ? {
  verifyIdToken: async (token: string) => {
    console.log('[MOCK] Verifying token:', token.substring(0, 10) + '...');
    return {
      uid: 'mock-user-123',
      email: 'mock@example.com',
      name: 'Mock User',
      picture: 'https://via.placeholder.com/150'
    };
  },
  getUser: async (uid: string) => ({
    uid,
    email: 'mock@example.com',
    displayName: 'Mock User'
  })
} : getAuth();

// Mock storage object if in mock mode
export const firebaseStorage = isMockMode ? {
  bucket: () => ({
    file: (path: string) => ({
      save: async (buffer: Buffer) => console.log(`[MOCK] Saved file to ${path}`),
      getSignedUrl: async () => ['https://mock-storage-url.com/file.mp4'],
      exists: async () => [true],
      delete: async () => console.log(`[MOCK] Deleted file ${path}`)
    })
  })
} : getStorage();

export default admin;

