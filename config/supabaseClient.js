require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_API_URL; // Replace with your actual URL
const supabaseKey = process.env.SUPABASE_API_ANNON_KEY; // Replace with your actual anon key
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
