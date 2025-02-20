require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./schema');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Ensure MongoDB Connection is Established  
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to database'))
.catch(err => console.error('Error connecting to database:', err));

// ✅ POST API Route  
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 🔍 Validate Fields  
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Validation error: Missing required fields' });
        }

        // 🔍 Check if user already exists  
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // ✅ Save user  
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Start Server  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
