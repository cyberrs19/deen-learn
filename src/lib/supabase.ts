import { createClient } from '@supabase/supabase-js';

// এই দুটি publishable key — কোডে রাখা নিরাপদ
// আপনার Self-hosted Supabase এর URL ও Anon Key দিন
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.warn('⚠️ Supabase URL কনফিগার করা হয়নি। src/lib/supabase.ts ফাইলে আপনার URL দিন।');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
