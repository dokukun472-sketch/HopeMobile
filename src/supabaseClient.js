import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qdvsndvpchzeovlckabo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdnNuZHZwY2h6ZW92bGNrYWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjUzMTAsImV4cCI6MjA5MDY0MTMxMH0.NzysdE2T8M0X47AABsiDlpxIDRLq3Skr83dCSzeaZ8E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
