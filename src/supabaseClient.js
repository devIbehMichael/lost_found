import { createClient } from '@supabase/supabase-js'

// Replace these with your own values
const supabaseUrl = "https://yppsgcqlfigjyfyhfowo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwcHNnY3FsZmlnanlmeWhmb3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTMxNDIsImV4cCI6MjA3MjQ4OTE0Mn0.TKdcvY4-257Xp753l_77CIJyFUTlbZH7I_6gGzq_kNI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
