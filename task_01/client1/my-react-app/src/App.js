import logo from './logo.svg';
import './App.css';
import SignUp from './pages/users/users.signup/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminSignup from './pages/admin/admin.signup/Signup'
import SignIn from './pages/users/login/Login';
import AdminSignIn from './pages/admin/login/Login';
import AdminHome from './pages/admin/Home/AdminHome.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/users/Home.js/home.js';
import UserVerification from './pages/users/Verifiction/Verifications.js';
function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
     {/* <Route
            path="/login"
            element={<SignIn />}
          /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/verify/:email" element={<UserVerification />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/admin/Home" element={<AdminHome />} />
    </Routes>
    </Router>
    </div>
  );
}

export default App;
