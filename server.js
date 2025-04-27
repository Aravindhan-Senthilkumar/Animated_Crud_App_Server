import { configDotenv } from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './src/routes/authRoutes.js';
import memberRoutes from './src/routes/memberRoutes.js';
import cors from 'cors';

// Load environment variables
configDotenv();

const app = express();
const port = process.env.PORT;

//MiddleWares
app.use(express.json());
app.use(cors());    

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


//Routes
app.use('/api/auth', authRoutes);
app.use('/api/member',memberRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
