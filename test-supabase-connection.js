// Test script untuk memverifikasi koneksi Supabase
// Jalankan dengan: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables tidak ditemukan!');
  console.log('Pastikan .env.local berisi:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Connection successful!');
    
    // Test 2: Check tables exist
    const tables = ['users', 'question_banks', 'exam_results'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ Table '${table}' error:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists`);
        }
      } catch (e) {
        console.log(`❌ Table '${table}' not found`);
      }
    }
    
    console.log('\n🎉 Supabase setup completed successfully!');
    console.log('You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();