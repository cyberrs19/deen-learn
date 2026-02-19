import { createClient } from '@supabase/supabase-js';

// এই দুটি publishable key — কোডে রাখা নিরাপদ
// আপনার Self-hosted Supabase এর URL ও Anon Key দিন
const SUPABASE_URL = 'https://api.rezuwan19.dev';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcxNDM3NjAwLCJleHAiOjE5MjkyMDQwMDB9.Yr4B0afIY4qChnzglToSeZc3ogBI_otw28dAVi6r00c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
