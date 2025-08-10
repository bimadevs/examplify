// Test script untuk register dan login
// Jalankan dengan: node test-auth.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables tidak ditemukan!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  console.log('🔄 Testing Authentication...');
  
  const testEmail = 'test@example.com';
  const testPassword = 'password123';
  const testName = 'Test User';
  const testRole = 'teacher';
  
  try {
    // Test 1: Register
    console.log('\n1. Testing Register...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
          role: testRole
        }
      }
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('✅ User already exists, skipping register test');
      } else {
        console.error('❌ Register failed:', signUpError.message);
        return;
      }
    } else {
      console.log('✅ Register successful!');
      console.log('User ID:', signUpData.user?.id);
    }
    
    // Wait a bit for trigger to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Check if user profile was created
    console.log('\n2. Testing User Profile Creation...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail);
    
    if (usersError) {
      console.error('❌ Error checking user profile:', usersError.message);
    } else if (users && users.length > 0) {
      console.log('✅ User profile created successfully!');
      console.log('Profile:', users[0]);
    } else {
      console.log('⚠️ User profile not found, trigger might not be working');
    }
    
    // Test 3: Login
    console.log('\n3. Testing Login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.error('❌ Login failed:', signInError.message);
    } else {
      console.log('✅ Login successful!');
      console.log('User metadata:', signInData.user?.user_metadata);
    }
    
    // Test 4: Get current user
    console.log('\n4. Testing Get Current User...');
    const { data: { user: currentUser }, error: currentUserError } = await supabase.auth.getUser();
    
    if (currentUserError) {
      console.error('❌ Get current user failed:', currentUserError.message);
    } else if (currentUser) {
      console.log('✅ Get current user successful!');
      
      // Get user profile from database
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (profileError) {
        console.error('❌ Get user profile failed:', profileError.message);
      } else {
        console.log('✅ User profile retrieved successfully!');
        console.log('Profile:', userProfile);
      }
    }
    
    // Cleanup: Sign out
    await supabase.auth.signOut();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAuth();