// Utility function to test authentication

// Helper function to get auth token (copied from auth.js to avoid circular dependency)
const getAuthToken = () => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith('teqtak-admin-token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

export const testAuth = () => {
  console.log('🔍 Testing Authentication Setup');
  console.log('============================');
  
  // Test 1: Check if token exists
  const token = getAuthToken();
  console.log('📋 Token exists:', !!token);
  console.log('📋 Token length:', token?.length || 0);
  
  if (token) {
    console.log('✅ Token found:', token.substring(0, 20) + '...');
  } else {
    console.log('❌ No token found - user needs to login');
  }
  
  // Test 2: Check cookie
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith('teqtak-admin-token='));
  console.log('🍪 Token cookie exists:', !!tokenCookie);
  
  // Test 3: Check API base URL
  console.log('🌐 API Base URL:', process.env.REACT_APP_BACK_URL);
  
  // Test 4: Show all cookies for debugging
  console.log('🍪 All cookies:', document.cookie);
  
  return {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    hasCookie: !!tokenCookie,
    apiUrl: process.env.REACT_APP_BACK_URL,
    allCookies: document.cookie
  };
};

// Helper function to test login response structure
export const debugLoginResponse = (response) => {
  console.log('🔍 Debugging Login Response');
  console.log('==========================');
  console.log('📦 Full response:', response);
  console.log('🔑 Response.token:', response.token);
  console.log('🔑 Response.authtoken:', response.authtoken);
  console.log('🔑 Response.data?.token:', response.data?.token);
  console.log('🔑 Response.data?.authtoken:', response.data?.authtoken);
  
  // Try to find token in common locations
  const possibleTokens = [
    response.token,
    response.authtoken,
    response.data?.token,
    response.data?.authtoken,
    response.message?.token,
    response.result?.token,
    response.user?.token
  ].filter(Boolean);
  
  console.log('🎯 Possible tokens found:', possibleTokens);
  
  return possibleTokens;
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAuth = testAuth;
  window.debugLoginResponse = debugLoginResponse;
  console.log('💡 You can test authentication by running: testAuth() in the console');
  console.log('💡 Debug login response with: debugLoginResponse(response)');
}
