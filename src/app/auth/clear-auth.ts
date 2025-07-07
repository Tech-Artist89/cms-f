// Helper function to completely clear authentication state
export function clearAuthState(): void {
  console.log('Clearing authentication state...');
  
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear any cookies if they exist
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log('Authentication state cleared');
}

// Function to debug current auth state
export function debugAuthState(): void {
  console.log('=== AUTH DEBUG INFO ===');
  console.log('localStorage:', localStorage);
  console.log('access_token:', localStorage.getItem('access_token'));
  console.log('refresh_token:', localStorage.getItem('refresh_token'));
  console.log('user:', localStorage.getItem('user'));
  console.log('sessionStorage:', sessionStorage);
  console.log('cookies:', document.cookie);
  console.log('=== END DEBUG INFO ===');
}