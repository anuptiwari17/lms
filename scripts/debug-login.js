// scripts/debug-login.js - Run this to test your setup
// Run with: node scripts/debug-login.js

import bcrypt from 'bcryptjs';

async function testPasswordHashing() {
  console.log('=== PASSWORD HASHING TEST ===\n');
  
  const testPassword = 'admin123';
  const testEmail = 'admin@learnhub.com';
  
  // Test hashing
  console.log('1. Testing password hashing...');
  const hashedPassword = await bcrypt.hash(testPassword, 12);
  console.log('Original password:', testPassword);
  console.log('Hashed password:', hashedPassword);
  console.log('');
  
  // Test verification
  console.log('2. Testing password verification...');
  const isValid1 = await bcrypt.compare(testPassword, hashedPassword);
  const isValid2 = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log(`"${testPassword}" matches hash:`, isValid1);
  console.log(`"wrongpassword" matches hash:`, isValid2);
  console.log('');
  
  // Test with existing hash (if you have one)
  console.log('3. Testing with common hash...');
  const commonHash = '$2b$12$LQv3c1yqBmVVoQeB2dHFqOb7sVeJ9U3K4sHvPKzGfLrNmOhFVhW.K';
  const isValid3 = await bcrypt.compare('admin123', commonHash);
  console.log(`"admin123" matches common hash:`, isValid3);
  console.log('');
  
  console.log('=== SQL TO INSERT TEST USER ===');
  console.log('Copy and run this in your Supabase SQL editor:');
  console.log(`
INSERT INTO users (email, password_hash, name, role) 
VALUES ('${testEmail}', '${hashedPassword}', 'Test Admin', 'admin')
ON CONFLICT (email) 
DO UPDATE SET password_hash = EXCLUDED.password_hash;
  `);
  console.log('');
  
  console.log('=== ENVIRONMENT VARIABLES CHECK ===');
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

testPasswordHashing().catch(console.error);

// Alternative: Create a test page to debug in browser
// pages/debug-login.tsx or app/debug-login/page.tsx
/*
"use client"
import { useState } from 'react';
import { passwordUtils } from '@/lib/auth';

export default function DebugLogin() {
  const [result, setResult] = useState('');

  const testHash = async () => {
    try {
      const password = 'admin123';
      const hash = await passwordUtils.hash(password);
      const isValid = await passwordUtils.verify(password, hash);
      
      setResult(`
Password: ${password}
Hash: ${hash}
Verification: ${isValid}
      `);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1>Login Debug</h1>
      <button onClick={testHash} className="bg-blue-500 text-white px-4 py-2 rounded">
        Test Password Hashing
      </button>
      <pre className="mt-4 p-4 bg-gray-100">{result}</pre>
    </div>
  );
}
*/