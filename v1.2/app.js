const express = require('express');
const path = require('path');
const session = require('express-session');
const { testConnection } = require('./models/db'); // Import the testConnection function
const routes = require('./routes/index'); // Import the main routes
const fabricRoutes = require('./routes/fabricRoutes'); // Import the fabric routes
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images/uploads', express.static('uploads')); // Ensure this path is correct
app.use('/fabrics', fabricRoutes); // Use fabric routes

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
}));



// Middleware to set user information in res.locals
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    next();
});

// Use main routes
app.use('/', routes);
app.use('/cart', cartRoutes);

// Use the auth routes
app.use('/auth', authRoutes);


app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true // Allow credentials to be sent with the request
}));


// Start the server
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await testConnection(); // Test the database connection when the server starts
});