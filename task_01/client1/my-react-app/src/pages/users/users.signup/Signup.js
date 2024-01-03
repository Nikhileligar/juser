import  React,{useState, useEffect} from 'react';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import './Signup.css'
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

axios.defaults.baseURL = 'http://localhost:3001';

const socket = io('ws://localhost:3001', {
  transports: ['websocket'],
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});





function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});



const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    phone:'',
    email:'',
    password:'',
    file: ''
  });


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, file: file });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('phone', user.phone);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('file', user.file);

    const response = await axios.post('/api/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 201) {
      alert('you have been successfullly signedup')
      socket.emit('signup', { username: user.name });
      navigate(`/verify/${user.email}`, { replace: true });
    }
    return response;
  }

  useEffect(() => {
    // Listen for a signup success event from the server
    socket.on('user_action', (data) => {
      if (data.action === 'signup_success') {
        console.log(`User ${data.username} signed up successfully`);
        // Do something on successful signup
      }
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);


  const login = async () => {
    return window.location.href = '/login'
  }

  return (
    <div className='n-Container'>
      <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <div component="h1" variant="h5">
            Sign up
          </div>
          <Box component="form" noValidate className='form-component' onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_Name"
                  required
                  fullWidth
                  id="firstName"
                  label="Name"
                  autoFocus
                  variant='filled'
                  value={user.name}
                  onChange = { 
                    ((e) => {setUser({...user, name: e.target.value})})
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="phone"
                  name="phone"
                  autoComplete="family-name"
                  variant='filled'
                  value={user.phone}
                  onChange = { 
                    ((e) => {setUser({...user, phone: e.target.value})})
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  variant='filled'
                  autoComplete="email"
                  value={user.email}
                  onChange = { 
                    ((e) => {setUser({...user, email: e.target.value})})
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant='filled'
                  value={user.password}
                  onChange = { 
                    ((e) => {setUser({...user, password: e.target.value})})
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <br />
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}
                  
                  >
                    Upload file
                    <input type="file" 
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    />
                  </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" onClick={login} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
    </div>
  );
}


