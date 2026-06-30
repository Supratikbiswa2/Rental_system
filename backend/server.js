const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://rental-system-three-ashy.vercel.apphttps://rental-system-three-ashy.vercel.app',
  ],
}));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

// Health check
app.get('/', (req, res) => res.send('VeloRide API running'));

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });