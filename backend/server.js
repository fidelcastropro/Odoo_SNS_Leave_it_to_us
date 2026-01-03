const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'globetrotter'
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName, userName, city, state, country } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('INSERT INTO credentials (email, password) VALUES (?, ?)', [email, hashedPassword], (err) => {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      
      db.query('INSERT INTO user_details (user_name, first_name, last_name, state, city, country, email) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [userName, firstName, lastName, state, city, country, email], (err) => {
        if (err) return res.status(400).json({ error: 'Username already exists' });
        
        const token = jwt.sign({ email, userName }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { email, userName, firstName, lastName } });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  db.query('SELECT * FROM credentials WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    db.query('SELECT * FROM user_details WHERE email = ?', [email], (err, userResults) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      
      const user = userResults[0];
      const token = jwt.sign({ email, userName: user.user_name }, process.env.JWT_SECRET || 'secret');
      res.json({ token, user });
    });
  });
});

// Trip routes
app.get('/api/trips', auth, (req, res) => {
  db.query('SELECT * FROM trips WHERE user_name = ? ORDER BY created_at DESC', [req.user.userName], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});

app.post('/api/trips', auth, (req, res) => {
  const { title, startDate, endDate, touristRegion } = req.body;
  
  db.query('INSERT INTO trips (user_name, title, start_date, end_date, tourist_region) VALUES (?, ?, ?, ?, ?)', 
    [req.user.userName, title, startDate, endDate, touristRegion], (err, result) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ tripId: result.insertId, message: 'Trip created successfully' });
  });
});

app.get('/api/trips/:id', auth, (req, res) => {
  db.query('SELECT * FROM trips WHERE trip_id = ? AND user_name = ?', [req.params.id, req.user.userName], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length === 0) return res.status(404).json({ error: 'Trip not found' });
    
    db.query('SELECT * FROM itinerary_section WHERE trip_id = ?', [req.params.id], (err, itinerary) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      res.json({ ...results[0], itinerary });
    });
  });
});

// City and activity routes
app.get('/api/cities', (req, res) => {
  const { search, country, region } = req.query;
  let query = 'SELECT * FROM city_search WHERE 1=1';
  let params = [];
  
  if (search) {
    query += ' AND city_name LIKE ?';
    params.push(`%${search}%`);
  }
  if (country) {
    query += ' AND country = ?';
    params.push(country);
  }
  if (region) {
    query += ' AND region = ?';
    params.push(region);
  }
  
  query += ' ORDER BY popularity DESC';
  
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});

app.get('/api/activities/:cityId', (req, res) => {
  const { type, maxCost } = req.query;
  let query = 'SELECT * FROM activities_search WHERE city_id = ?';
  let params = [req.params.cityId];
  
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  if (maxCost) {
    query += ' AND cost <= ?';
    params.push(maxCost);
  }
  
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(results);
  });
});

// Itinerary routes
// app.post('/api/itinerary', auth, (req, res) => {
//   const { tripId, title, details, startDate, endDate, budgetAmount } = req.body;
  
//   console.log('Adding itinerary item:', { tripId, title, details, startDate, endDate, budgetAmount });
  
//   db.query('INSERT INTO itinerary_section (trip_id, title, details, start_date, end_date, budget_amount) VALUES (?, ?, ?, ?, ?, ?)', 
//     [tripId, title, details, startDate, endDate, budgetAmount], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({ error: 'Database error: ' + err.message });
//     }
//     res.json({ id: result.insertId, message: 'Itinerary item added' });
//   });
// });

// Itinerary routes
app.post('/api/itinerary', auth, (req, res) => {
  const { tripId, title, details, startDate, endDate, budgetAmount } = req.body;
  
  // Convert ISO dates to MySQL format (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  
  db.query('INSERT INTO itinerary_section (trip_id, title, details, start_date, end_date, budget_amount) VALUES (?, ?, ?, ?, ?, ?)', 
    [tripId, title, details, formattedStartDate, formattedEndDate, budgetAmount], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ id: result.insertId, message: 'Itinerary item added' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));