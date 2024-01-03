import React, { useState, useEffect } from 'react';
import '../../../App.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

axios.defaults.baseURL = 'http://localhost:3001';

const socket = io('ws://localhost:3001', {
  transports: ['websocket'],
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

 function UserVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const {email} = useParams();
  console.log(email,'my email')
  const verifyOTP = async () => {
    if (otp) {
      const userData ={ otp, email};
        const response = await axios.post('/api/verify',userData);
        console.log(userData,response,'ussus')
        if (response.status === 201) {
          alert('you have been successfullly verified')
          socket.emit('verify', { username: email });
          navigate(`/login`, { replace: true });
        }
        return response;
    }
  };

  useEffect(() => {
    // Listen for a login success event from the server
    socket.on('user_action', (data) => {
      if (data.action === 'login_success') {
        console.log(`User ${data.username} logged in successfully`);
        // Do something on successful signup
      }
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div className="App">
      <div className="otp-container">
        <h2>OTP Verification</h2>
        <p>Enter the OTP sent to your email/mobile:</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength="6"
        />
        <button onClick={verifyOTP}>Verify OTP</button>
      </div>
    </div>
  );
}

export default UserVerification;
