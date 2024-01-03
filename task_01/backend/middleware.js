import express from 'express';
import jwt from 'jsonwebtoken';

const authenticateJwt = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'admin';
    const header = req.header('Authorization');
    const token = header.split("Bearer ")[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err)
        return res.status(403).json({ message: 'Token verification failed' });
    }  
    req.user = user;
    next();
   });
};

export default authenticateJwt;
