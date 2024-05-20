import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EmailVerification( ) {
  const { key: token } = useParams();
  const navigate = useNavigate();
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log(token);
        const response = await axios.post(`users/verify_email/${token}/`);
        if (response.data.error === 0) {
          setVerificationMessage('Your email has been successfully verified. You can now log in.');
          navigate('/sign-in');
        } else {
          setVerificationMessage('Failed to verify email. Please try the verification link again or contact support if the problem persists.');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setVerificationMessage('An error occurred during email verification. Please try again or contact support.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <p>{verificationMessage}</p>
    </div>
  );
}
