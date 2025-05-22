import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqamtavoeneqrvfmgkhs.supabase.co'; // Thay bằng URL của bạn
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xYW10YXZvZW5lcXJ2Zm1na2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTU3ODksImV4cCI6MjA2MzM5MTc4OX0.411YypeND036CcDUwVKs7zuDALQtKXAGjRbt-ISHxTQ'; // Thay bằng ANON KEY của bạn

export const supabase = createClient(supabaseUrl, supabaseKey);