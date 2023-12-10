const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://kasojushravya:shravya178@cluster0.si7kjs2.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Create Transaction model
const Transaction = mongoose.model('Transaction', {
  description: String,
  amount: Number,
  type: String, // 'expense' or 'income'
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Render home page with transactions
app.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ _id: 'desc' });
    res.render('index', { transactions });
  } catch (error) {
    res.send('Error fetching transactions');
  }
});

// Handle new transaction submission
app.post('/add-transaction', async (req, res) => {
  const { description, amount, type } = req.body;

  // Create a new transaction
  const transaction = new Transaction({ description, amount, type });

  try {
    // Save transaction to the database
    await transaction.save();
    res.redirect('/');
  } catch (error) {
    res.send('Error adding transaction');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
