const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const mysql = require('mysql2');
const app = express();
const port = 3000;
require('dotenv').config();
app.use(bodyParser.json());


// Serve static files (HTML, CSS, JS)
app.use(cors());
app.use(express.static(__dirname));

// Serve static files from the 'frontend' directory
// Update this line in your server.js
// app.use(express.static('frontend'));

// app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// Serve main HTML page


app.use(bodyParser.text());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Serve main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/userLogin.html'));
});



const dotenv = require('dotenv');
dotenv.config({ path: 'database.env' });

// Your MySQL connection code
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
app.post('/signupUser', (req, res) => {
  const { username, password, firstName, lastName, phone,  email } = req.body;


  // Insert data into the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    // Insert into Customers table
    const queryCustomers = `INSERT INTO users (UserName, FirstName, LastName, Phone, Email) 
                            VALUES (?, ?, ?, ?, ?)`;
    connection.query(queryCustomers, [username, firstName, lastName, phone, email], (err, results) => {
      if (err) {
        console.error('Error inserting into Customers table:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
        connection.release();
        return;
      }
      console.log(results)
      const UserID = results.insertId;

      // Insert into Users table
      const queryUsers = `INSERT INTO userauth (UserID, UserName, Password) VALUES (?, ?, ?)`;
      connection.query(queryUsers, [UserID, username, password], (err) => {
        if (err) {
          console.error('Error inserting into Users table:', err);
          res.status(500).json({ success: false, error: 'Internal server error' });
        } else {
          res.json({ success: true });
          console.log('fail');
          return
        }

        // Release the connection back to the pool
        connection.release();
      });
    });
  });
});

app.post('/loginuser', (req, res) => {
    const { username, password } = req.body;

    // Perform a database query to check the user's credentials
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.status(500).json({ success: false, error: 'Internal server error' });
            return;
        }
        
        const query = 'SELECT UserID FROM userauth WHERE UserName = ? AND Password = ?';

        connection.query(query, [username, password], (err, results) => {


            if (err) {
                console.error('Error querying the database:', err);
                res.status(500).json({ success: false, error: 'Internal server error' });
                return;
            }

            if (results.length > 0) {

                const UserID = results[0].UserID;
                console.log("fff",UserID)
                res.json({ success: true, UserID });
            } else {
                res.json({ success: false });
                
            }

             // Release the connection back to the pool
        connection.release();
        });

    });
    console.log("loginsucess")
});

app.post('/addToUserSessions', (req, res) => {
    const { UserID } = req.body;
    const SessionID = getRandomInt(1000, 9999); 
    // generateRandomNumber(1000, 9999); // Generate a random 4-digit number

    // Assuming the UserSessions table has columns: CustomerID, currTransactionID
    const sql = 'INSERT INTO sessions (UserID, SessionID) VALUES (?, ?)';

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            res.status(500).json({ success: false, error: 'Internal server error' });
            return;
        }

        connection.query(sql, [UserID, SessionID], (err, result) => {
            connection.release(); // Release the connection back to the pool

            if (err) {
                console.error('Error adding to UserSessions:', err);
                res.status(500).json({ success: false, error: 'Internal server error' });
            } else {
                console.log('Added to UserSessions:', result);
                res.json({ success: true });

            }
        });
    });
});
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.get('/api/currentUserLoginID', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            res.status(500).json({ success: false, error: 'Internal server error' });
            return;
        }

        const query = 'SELECT UserID,SessionID FROM sessions LIMIT 1';

        connection.query(query, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error executing database query:', error);
                res.status(500).json({ success: false, error: 'Internal server error' });
            } else {
                const currentUserLoginID = results[0].UserID;
                const SessionID = results[0].SessionID;

                res.json({ success: true, currentUserLoginID, SessionID });
            }
        });
    });
});

app.post('/submitBudget', (req, res) => {
  // Extract data from the request body
  const { userID, amount, from, date, category } = req.body;

  // Acquire a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    // Assuming you have a database connection, you can insert the data into the BudgetTrans table
    // Replace the following lines with your actual database logic

    const transStatus = category; // assuming TransStatus is equivalent to the category

    const insertQuery = 'INSERT INTO budgettrans (UserID, Amount, ForWhat, TransDate, TransStatus, InsertionDateTime) VALUES (?, ?, ?, ?, ?, ?)';
    
    // Get the current timestamp
    const currentTimestamp = new Date();

    // Execute the query
    connection.query(insertQuery, [userID, amount, from, date, transStatus, currentTimestamp], (error, results) => {
      // Release the connection back to the pool
      connection.release();
        
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      }

      res.status(200).json({ success: true });
      console.log("success!");
    });
  });
});


// GET endpoint to get total income and expenses for a given month and year for a given UserID
app.get('/getMonthlyIncomeAndExpenses/:userId/:month/:year', (req, res) => {
  const userId = req.params.userId;
  const month = req.params.month;
  const year = req.params.year;

  // Acquire a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    // Replace the following lines with your actual database logic
    const getMonthlyDataQuery = 'SELECT COALESCE(SUM(CASE WHEN TransStatus = "income" THEN Amount ELSE 0 END), 0) AS totalIncome, COALESCE(SUM(CASE WHEN TransStatus = "expense" THEN Amount ELSE 0 END), 0) AS totalExpenses FROM budgettrans WHERE UserID = ? AND MONTH(TransDate) = ? AND YEAR(TransDate) = ?';

    // Execute the query
    connection.query(getMonthlyDataQuery, [userId, month, year], (error, results) => {
      // Release the connection back to the pool
      connection.release();

      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      }

      const totalIncome = results[0].totalIncome;
      const totalExpenses = results[0].totalExpenses;

      res.status(200).json({ success: true, totalIncome, totalExpenses });
    });
  });
});


app.get('/getTotalBudget/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(userId,"oo")
  // Acquire a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    // Replace the following lines with your actual database logic
    const getTotalIncomeQuery = 'SELECT SUM(Amount) AS totalIncome FROM budgettrans WHERE UserID = ? AND TransStatus = "income"';
    const getTotalExpenseQuery = 'SELECT SUM(Amount) AS totalExpense FROM budgettrans WHERE UserID = ? AND TransStatus = "expense"';

    // Execute the queries
    connection.query(getTotalIncomeQuery, [userId], (error, incomeResults) => {
      if (error) {
        console.error('Error executing query:', error);
        connection.release();
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      }

      connection.query(getTotalExpenseQuery, [userId], (error, expenseResults) => {
        // Release the connection back to the pool
        connection.release();

        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
        }

        const totalIncome = incomeResults[0].totalIncome || 0;
        const totalExpense = expenseResults[0].totalExpense || 0;
        
        res.status(200).json({ success: true, totalIncome, totalExpense });
      });
    });
  });
});

// GET endpoint to get total income and expenses for the present month and last month for a given UserID
app.get('/getMonthlyIncomeAndExpenses/:userId', (req, res) => {
  const userId = req.params.userId;

  // Acquire a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    // Replace the following lines with your actual database logic
    const getCurrentMonthDataQuery = 'SELECT COALESCE(SUM(CASE WHEN TransStatus = "income" THEN Amount ELSE 0 END), 0) AS totalIncome, COALESCE(SUM(CASE WHEN TransStatus = "expense" THEN Amount ELSE 0 END), 0) AS totalExpenses FROM budgettrans WHERE UserID = ? AND MONTH(TransDate) = MONTH(CURDATE()) AND YEAR(TransDate) = YEAR(CURDATE())';
    const getLastMonthDataQuery = 'SELECT COALESCE(SUM(CASE WHEN TransStatus = "income" THEN Amount ELSE 0 END), 0) AS totalIncome, COALESCE(SUM(CASE WHEN TransStatus = "expense" THEN Amount ELSE 0 END), 0) AS totalExpenses FROM budgettrans WHERE UserID = ? AND MONTH(TransDate) = MONTH(NOW() - INTERVAL 1 MONTH) AND YEAR(TransDate) = YEAR(NOW() - INTERVAL 1 MONTH)';

    // Execute the queries
    connection.query(getCurrentMonthDataQuery, [userId], (error, currentMonthResults) => {
      if (error) {
        console.error('Error executing query:', error);
        connection.release();
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      }

      connection.query(getLastMonthDataQuery, [userId], (error, lastMonthResults) => {
        // Release the connection back to the pool
        connection.release();

        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
        }

        const totalCurrentMonthIncome = currentMonthResults[0].totalIncome;
        const totalCurrentMonthExpenses = currentMonthResults[0].totalExpenses;

        const totalLastMonthIncome = lastMonthResults[0].totalIncome;
        const totalLastMonthExpenses = lastMonthResults[0].totalExpenses;

        res.status(200).json({
          success: true,
          totalCurrentMonthIncome,
          totalCurrentMonthExpenses,
          totalLastMonthIncome,
          totalLastMonthExpenses
        });
      });
    });
  });
});


app.get('/budgetTranshistory/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `SELECT * FROM budgettrans WHERE UserID = ? ORDER BY InsertionDateTime`;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    // Use the connection to execute the query
    connection.query(query, [userId], (err, results) => {
      // Release the connection back to the pool  
      connection.release();

      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      }

      res.json(results);
      console.log(results)
    });
  });
});

app.post('/remove-session', (req, res) => {
  const userId = req.body.userId;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    connection.query('DELETE FROM sessions WHERE UserID = ?', [userId], (err, result) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: 'Session not found.' });
        return;
      }

      res.status(200).json({ success: true, message: 'Session removed successfully.' });
    });
  });
});



// API to get record details
app.get('/api/getRecordDetails', (req, res) => {
  const { userID, forWhat } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    connection.query(
      'SELECT * FROM budgettrans WHERE UserID = ? AND ForWhat = ?',
      [userID, forWhat],
      (error, results) => {
        connection.release(); // release the connection back to the pool

        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
        }
        console.log(results[0])
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.json(null);
        }
      }
    );
  });
});

// API to save record details
app.post('/api/saveRecord', (req, res) => {
  const { userID, forWhat, amount } = req.body;
  console.log(req.body)
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    connection.query(
      'UPDATE budgettrans SET Amount = ? WHERE UserID = ? AND ForWhat = ?',
      [parseFloat(amount), userID, forWhat],
      (error, results) => {
        connection.release(); // release the connection back to the pool

        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
        }
        console.log(results)
        res.json({ success: true, message: 'Record updated successfully' });
      }
    );
  });
});
app.delete('/api/deleteRecord', (req, res) => {
  const { userID, forWhat } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
      return;
    }

    connection.query(
      'DELETE FROM budgettrans WHERE UserID = ? AND ForWhat = ?',
      [userID, forWhat],
      (error, results) => {
        connection.release(); // release the connection back to the pool

        if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ success: false, error: 'Internal server error' });
          return;
        }

        res.json({ success: true, message: 'Record deleted successfully' });
      }
    );
  });
});