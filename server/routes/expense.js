// server/routes/expense.js
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// Connect to our expense model
let Expense = require('../model/expense');

// GET route for displaying all expenses from DB --> Read Operation
router.get('/', async(req, res, next) => {
    try {
        const ExpenseList = await Expense.find().sort({ date: -1 }); // Sort by newest first
        
        // Calculate total expenses
        let totalExpenses = 0;
        ExpenseList.forEach(expense => {
            totalExpenses += expense.cost;
        });

        res.render('Expenses/list', {
            title: 'All Expenses',
            ExpenseList: ExpenseList,
            totalExpenses: totalExpenses.toFixed(2)
        });
    }
    catch(err) {
        console.log(err);
        res.render('Expenses/list', {
            error: 'Error on the Server'
        });
    }
});

// GET route for displaying the Add Expense Page --> Create Operation
router.get('/add', async(req, res, next) => {
    try {
        res.render('Expenses/add', {
            title: 'Add New Expense'
        });
    }
    catch(err) {
        console.log(err);
        res.render('Expenses/list', {
            error: 'Error on the Server'
        });
    }
});

// POST route for processing the Add Page --> Create Operation
router.post('/add', async(req, res, next) => {
    try {
        let newExpense = Expense({
            "title": req.body.title,
            "vendor": req.body.vendor,
            "cost": req.body.cost,
            "category": req.body.category,
            "date": req.body.date
        });
        
        Expense.create(newExpense).then(() => {
            res.redirect('/expenses');
        });
    }
    catch(err) {
        console.log(err);
        res.render('Expenses/list', {
            error: 'Error on the Server'
        });
    }
});

// GET route for displaying the Edit Page --> Update Operation
router.get('/edit/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        const expenseToEdit = await Expense.findById(id);
        res.render("Expenses/edit", {
            title: 'Edit Expense',
            Expense: expenseToEdit
        });
    }
    catch(err) {
        console.log(err);
        next(err);
    }
});

// POST route for processing the Edit Page --> Update Operation
router.post('/edit/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let updatedExpense = Expense({
            "_id": id,
            "title": req.body.title,
            "vendor": req.body.vendor,
            "cost": req.body.cost,
            "category": req.body.category,
            "date": req.body.date
        });
        
        Expense.findByIdAndUpdate(id, updatedExpense).then(() => {
            res.redirect("/expenses");
        });
    }
    catch(err) {
        console.log(err);
        next(err);
    }
});

// GET route to perform Delete Operation with confirmation
router.get('/delete/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        Expense.deleteOne({_id: id}).then(() => {
            res.redirect("/expenses");
        });
    }
    catch(err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;