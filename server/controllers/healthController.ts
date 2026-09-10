import type { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { getSupabaseAdmin } from '../config/supabase';

export async function getHealthStatus(req: Request, res: Response) {
  const supabase = getSupabaseAdmin();
  let dbStatus = 'not_configured';

  if (supabase) {
    try {
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      dbStatus = error ? `error: ${error.message}` : 'connected';
    } catch (e: any) {
      dbStatus = `exception: ${e.message}`;
    }
  }

  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    version: '1.0.0',
    service: 'SocialMeUp Academy LMS Modular API',
  }, 'API server operational');
}
