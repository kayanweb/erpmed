import path from 'path';
import fs from 'fs';
import { startServer } from '../server';

// On Vercel, we need to ensure we don't start the server multiple times
let appPromise: any = null;

export default async function handler(req: any, res: any) {
  // Log request for debugging
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  if (!appPromise) {
    console.log('Initializing Express application...');
    appPromise = startServer().catch(err => {
      console.error('FAILED to initialize Express application:', err);
      appPromise = null; // Allow retry on next request
      throw err;
    });
  }

  try {
    const app = await appPromise;
    
    // Check if the request is for a static asset that might have been missed by Vercel
    // but the Express server is configured to serve them too.
    
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel Function Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      cwd: process.cwd()
    });
  }
}
