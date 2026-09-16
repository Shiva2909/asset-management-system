
const { sql } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Hidden Signup API (Only for backend/Admin use via Postman)
const signup = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Validate request data
        if (!username || !password || !role) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        // Check if the user already exists in the database using parameterized query
        const checkRequest = new sql.Request();
        checkRequest.input('Username', sql.VarChar, username);
        
        const checkUser = await checkRequest.query('SELECT * FROM Users WHERE Username = @Username');
        
        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'User Already Exists' });
        }        
        
        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert new user into the database
        const request = new sql.Request();
        request.input('Username', sql.VarChar, username);
        request.input('Password', sql.VarChar, hashedPassword);
        request.input('Role', sql.VarChar, role);
        
        await request.query('INSERT INTO Users (Username, Password, Role) VALUES (@Username, @Password, @Role)');
        
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 2. Login API (Frontend will use this)
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        
        // Find user in the database
        const request = new sql.Request();
        request.input('Username', sql.VarChar, username);
        const result = await request.query('SELECT * FROM Users WHERE Username = @Username');
        
        const user = result.recordset[0];
        
        // If user not found
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Generate JWT Token
        console.log("frontend se ye data aaya",req.body);
        const payload = {
            userId: user.UserID,
            role: user.Role
        };
        
        // Use a secret key from environment variables
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                userId: user.UserID,
                username: user.Username,
                role: user.Role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
       
module.exports = {
    signup,
    login
};