let mongoose = require('mongoose');

let expenseModel = mongoose.Schema({
    title: String,        // e.g., "Subway", "Campus Cafe"
    vendor: String,       // Vendor/Restaurant name
    cost: Number,         // Cost in dollars
    category: String,     // e.g., "Meal", "Snack", "Drink"
    date: {
        type: Date,
        default: Date.now
    }
},
{
    collection: "expenses"  // MongoDB collection name
});

module.exports = mongoose.model('Expense', expenseModel);