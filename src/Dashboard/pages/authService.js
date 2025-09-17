export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  if (!refreshToken) {
    console.error('No refresh token found. User needs to re-login.');
    return null; // Indicate failure
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }), // Send refresh token
    });

    const data = await response.json();
    console.log('Token Refresh Response:', data);

    if (response.ok && data.access_token) {
      localStorage.setItem('authToken', data.access_token); // Update stored access token
      return data.access_token; // Return the new access token
    } else {
      console.error('Failed to refresh token:', data.message || data.error || 'Unknown error');
      // If refresh fails, it means the refresh token itself is invalid/expired
      // Force logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userType');
      // You might want to trigger a global logout state here if using context
      window.location.reload(); // Force a full page reload to go back to login
      return null;
    }
  } catch (error) {
    console.error('Network error during token refresh:', error);
    // Force logout on network error during refresh
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
    window.location.reload();
    return null;
  }
};

// Generic function to make authenticated API requests with token refresh logic
export const authenticatedFetch = async (url, options = {}) => {
  let authToken = localStorage.getItem('authToken');
  // The 'userType' variable declaration that caused the warning has been removed from here.

  // Add Authorization header
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${authToken}`,
  };

  try {
    let response = await fetch(url, { ...options, headers });

    // If 401 Unauthorized and message indicates token expiration
    if (response.status === 401 && (await response.clone().json()).msg === 'Token has expired') {
      console.warn('Access token expired. Attempting to refresh...');
      const newAuthToken = await refreshAccessToken();

      if (newAuthToken) {
        // Retry the original request with the new token
        headers['Authorization'] = `Bearer ${newAuthToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        // Refresh failed, user is already logged out by refreshAccessToken
        return response; // Return the 401 response
      }
    }

    return response; // Return the (potentially retried) response
  } catch (error) {
    console.error('Error in authenticatedFetch:', error);
    throw error; // Re-throw the error for the calling component to handle
  }
};

// Function to handle user logout
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userType');
  // If you have a global state management (like Context or Redux),
  // you'd dispatch a logout action here.
  // For now, we'll rely on DashboardApp's handleLogout prop.
};
