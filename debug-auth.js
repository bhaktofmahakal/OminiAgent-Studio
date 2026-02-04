// Debug authentication flow
console.log('Testing authentication redirect behavior...\n');

// Test the sign-in page
fetch('http://localhost:3000/sign-in', {
  method: 'GET',
  headers: {
    'Accept': 'text/html',
  }
})
.then(async response => {
  console.log('✅ Sign-in page accessible:', response.status);
  
  // Check if we get proper HTML response
  const html = await response.text();
  if (html.includes('SignIn') || html.includes('clerk')) {
    console.log('✅ Clerk SignIn component is loading');
  } else {
    console.log('⚠️ SignIn component may not be loading properly');
  }
})
.catch(err => {
  console.log('❌ Sign-in page error:', err.message);
});

// Test dashboard protection
fetch('http://localhost:3000/dashboard', {
  method: 'GET',
  redirect: 'manual', // Don't follow redirects
  headers: {
    'Accept': 'text/html',
  }
})
.then(response => {
  console.log('Dashboard response status:', response.status);
  if (response.status === 307 || response.status === 302) {
    console.log('✅ Dashboard properly redirects unauthorized users');
    console.log('Redirect location:', response.headers.get('location'));
  } else if (response.status === 200) {
    console.log('⚠️ Dashboard accessible without auth (may be development mode)');
  }
})
.catch(err => {
  console.log('❌ Dashboard test error:', err.message);
});

console.log('\n📝 Manual Test Instructions:');
console.log('1. Open http://localhost:3000/dashboard in browser');
console.log('2. It should redirect to sign-in page');
console.log('3. Sign in with any email/password');
console.log('4. After sign-in, you should automatically go to /dashboard');
console.log('5. If you try to go back to sign-in while authenticated, it should redirect to dashboard');