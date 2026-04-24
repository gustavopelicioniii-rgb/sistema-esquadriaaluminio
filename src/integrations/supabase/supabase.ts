import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rxpsjtlludvmwbxasnct.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cHNqdGxsdWR2bXdieGFzbmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTYwMzQsImV4cCI6MjA5MTg3MjAzNH0.AU_0vmUuWCXmCAZjXOTVZls_UhXxUPQBk9k9g6vo-gA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
