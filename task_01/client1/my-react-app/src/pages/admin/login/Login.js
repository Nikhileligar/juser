import  React,{useState, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import '@fontsource/roboto/700.css';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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




export default function AdminSignIn() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email:'',
    password:''
  });

  const login = async () => {
    const response = await axios.post('api/admin/signIn', user);
    const authToken = response.data.token;

    // Store the token in localStorage
    localStorage.setItem('authToken', authToken);

    console.log(authToken,'ke ejj')
    if (response.status === 201) {
      alert('you have been successfullly logged in')
      socket.emit('login', { username: user.email });
    }
    return response;
  }
  const defaultTheme = createTheme();
  
  const signup = () =>{
    return navigate('/admin/signup', {replace: true});
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  useEffect(() => {
    // Listen for a login success event from the server
    socket.on('user_action', (data) => {
      if (data.action === 'admin_login_success') {
        console.log(`User ${data.username} logged in successfully`);
        navigate(`/home`, { replace: true });
      }
    });

    socket.on('login_response', (data) => {
      console.log('Received login response from the server:', data.message);
      
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return (
    <div className='m-Container'>
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
          <div className='text1'>
            Sign in
          </div>
          <Box component="form" className= "form-component" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="Email Address"
              name="email"
              autoFocus
              variant="outlined"
              autoComplete="off"
              value={user.email}
                  onChange = { 
                    ((e) => {setUser({...user, email: e.target.value})})
                  }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant='outlined'
              className='text'
              value={user.password}
                  onChange = { 
                    ((e) => {setUser({...user, password: e.target.value})})
                  }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
              className='button-submit'
              onClick={login}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={signup}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </div>
    
  );
}