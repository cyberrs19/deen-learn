import { createClient } from '@supabase/supabase-js';

// এই দুটি publishable key — কোডে রাখা নিরাপদ
// আপনার Self-hosted Supabase এর URL ও Anon Key দিন
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const isConfigured = SUPABASE_URL !== 'https://placeholder.supabase.co';

if (!isConfigured) {
  console.warn('⚠️ Supabase কনফিগার করা হয়নি। VITE_SUPABASE_URL ও VITE_SUPABASE_ANON_KEY সেট করুন অথবা src/lib/supabase.ts ফাইলে সরাসরি দিন।');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
