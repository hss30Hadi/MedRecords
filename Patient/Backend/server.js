const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
require('dotenv').config();
const cors = require('cors');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'fyp_medrecords'
  });
  
  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err.stack);
      return;
    }
    console.log('Connected to MySQL database.');
  });
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
  
const app = express();
app.use(express.json());
app.use(cors());



function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); //6-digit code
  }

  //login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    db.query('SELECT * FROM patients WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ message: 'Server error' });
      }
      
      //checks if user exists
      if (results.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const patient = results[0];
      if (patient.is_verified === 0) {
        return res.status(403).json({
          message: 'Your account is not verified. Please verify your account to continue.',
          redirectTo: '../login_sign up/verification.html'
        });
      }
      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      res.status(200).json({ message: 'Login successful', patient: { id: patient.id, email: patient.email } });
    });
  });
  
  app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    //check if the user already exists
    db.query('SELECT * FROM patients WHERE email = ?', [email], async (error, results) => {
      if (error) return res.status(500).json({ error });
      if (results.length > 0) return res.status(400).json({ message: 'User already exists' });
  
      //hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const verificationCode = generateVerificationCode();
  
      db.query(
        'INSERT INTO patients (name, email, password, verification_code) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, verificationCode],
        (error, results) => {
          if (error) return res.status(500).json({ error });
  
          //sends verification code via email
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your MedRecords Account',
            text: `Thank you for signing up to MedRecords Application!\n Please use the following verification code to activate your account:\t ${verificationCode}`
          };
  
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.error('Error sending email:', err);
              return res.status(500).json({ message: 'Error sending verification email' });
            }
            console.log('Verification email sent:', info.response);
  
            res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.', redirectTo: '/verify' });
          });
        }
      );
    });
  });

 

  app.post('/verify', (req, res) => {
    const { email, verificationCode } = req.body; 
  
    db.query(
      'SELECT * FROM patients WHERE email = ? AND verification_code = ?',
      [email, verificationCode],
      (error, results) => {
        if (error) {
          console.error('Database error during verification:', error);
          return res.status(500).json({ message: 'Server error during verification' });
        }
  
        if (results.length === 0) {
          return res.status(400).json({ message: 'Invalid verification code' });
        }
  
        //if verification code matches, update the user's status to "verified"
        db.query(
          'UPDATE patients SET is_verified = 1 WHERE email = ?',
          [email],
          (updateError) => {
            if (updateError) {
              console.error('Error updating user verification status:', updateError);
              return res.status(500).json({ message: 'Error verifying account' });
            }
  
            res.status(200).json({ message: 'Account verified successfully!' });
          }
        );
      }
    );
  });

app.use(express.static(path.join(__dirname, "../Frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/build", "index.html"));
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
