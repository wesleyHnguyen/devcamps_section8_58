const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();


// Route files  
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');


const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// app.use(logger);
// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);



app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
    });

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});