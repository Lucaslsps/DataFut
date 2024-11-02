// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://seekkvzumaofvjsmlcsf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZWtrdnp1bWFvZnZqc21sY3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1MTExMDMsImV4cCI6MjA0NjA4NzEwM30.iX_ojYzd32WSEe7zVqtm9p3fVspwDsaYT6zSAY-_-_E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
