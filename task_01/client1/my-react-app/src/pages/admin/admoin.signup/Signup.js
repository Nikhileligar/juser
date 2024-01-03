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

export default function AdminSignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    role:'',
    email:'',
    password:'',
  });


  const signup = async () => {
    const response = await axios.post('/api/admin/signUp', user);
    if (response.status === 201) {
      alert('you have been successfullly signedup')
      socket.emit('admin-signup', { username: user.name });
      navigate(`/admin/signin`, { replace: true });
    }
    return response;
  }

  useEffect(() => {
    // Listen for a signup success event from the server
    socket.on('user_action', (data) => {
      if (data.action === 'admin_signup_success') {
        console.log(`User ${data.username} signed up successfully`);
        // Do something on successful signup
      }
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);


  const login = async () => {
    return navigate('/admin/signin', { replace: true });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

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
            Admin Sign up
          </div>
          <Box component="form" noValidate className='form-component' onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="Name"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  autoFocus
                  variant='filled'
                  value={user.first_name}
                  onChange = { 
                    ((e) => {setUser({...user, name: e.target.value})})
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="role Name"
                  label="Role"
                  name="role"
                  autoComplete="family-name"
                  variant='filled'
                  value={user.role}
                  onChange = { 
                    ((e) => {setUser({...user, role: e.target.value})})
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={signup}
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


