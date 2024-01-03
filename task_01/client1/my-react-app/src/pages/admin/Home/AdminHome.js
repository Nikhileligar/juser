import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

export default function AdminHome() {
  const [userData, setUserData] = useState([]);

 
useEffect(() => {
  const fetchData = async () => {
    try {
      // Retrieve the token from localStorage
      const storedToken = localStorage.getItem('authToken');
      console.log(storedToken,'stored token')
      // Check if the token is available
      if (!storedToken) {
        console.error('Token not found in localStorage');
        return;
      }

      // Make the axios request with the stored token
      const response = await axios.get('/api/admin/getUsers', {
        headers: {
          Authorization: `${storedToken}`,
        },
      });

      setUserData(response.data.body.users);
      console.log(userData,'userdatatata')
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []); // The empty dependency array ensures the effect runs once when the component mounts

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">name</th>
          <th scope="col">phone</th>
          <th scope="col">email</th>
          <th scope="col">profile</th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {userData.map((user, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{user.name}</td>
            <td>{user.phone}</td>
            <td>{user.email}</td>
            <td>
            <Stack direction="row" spacing={2}>
            <img alt="profile" src={`/uploads/${user.file}`} />
              </Stack>
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
