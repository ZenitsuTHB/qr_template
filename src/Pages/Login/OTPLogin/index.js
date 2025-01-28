import React, { useEffect } from 'react';
import useApi from '../../../Hooks/useApi';

const OTPLogin = () => {
  const api = useApi();

  useEffect(() => {
    const loginWithOTP = async () => {
      try {
        // Extract otp and username from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const otp = urlParams.get('otp');
        const username = urlParams.get('username');

        if (!otp || !username) {
          throw new Error('OTP or username not provided in URL parameters');
        }

        const data = {
          otp: otp,
        };

        const response = await api.post(window.baseDomain + 'api/auth/login/one-time-password/' + username, data);

		console.log(response);
		
        const { accessToken, refreshToken } = response;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('loginSuccessful', true);
          localStorage.setItem('username', username); // Use username from URL params

          // Set the JWT as a cookie based on the environment
          const cookieDomain = window.isProduction ? '.reservaties.net' : 'localhost';
          const cookieSettings = `authToken=${accessToken}; path=/; ${
            window.isProduction ? `domain=${cookieDomain}; Secure; SameSite=None` : ''
          }`;
          document.cookie = cookieSettings;

          console.log('OTP login successful. Current document cookies:', document.cookie);

          // Remove OTP and username from URL
          window.history.replaceState({}, document.title, window.location.pathname);

          // Redirect to main app
          window.location.href = '/';
        } else {
          throw new Error('Token not received');
        }
      } catch (err) {
        console.error('OTP Login failed:', err);

        // Redirect to login page if OTP login fails
        window.location.href = '/login';
      }
    };

    loginWithOTP();
  }, [api]);

  return (
    <div className="otp-login-container">
      
    </div>
  );
};

export default OTPLogin;
