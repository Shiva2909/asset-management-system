const { sql } = require('../db');

// 1. Get All Categories (Dropdown ke liye)
const getCategories = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Categories');
        res.status(200).json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 2. Add New Category (Admin use ke liye)
const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;

        if (!categoryName) {
            return res.status(400).json({ success: false, message: 'Category name is required.' });
        }

        const request = new sql.Request();

        // 1. APPLICATION LEVEL CHECK: 
        request.input('CategoryName', sql.VarChar, categoryName);
        const checkQuery = `SELECT * FROM Categories WHERE CategoryName = @CategoryName`;
        const existingCategory = await request.query(checkQuery);

        if (existingCategory.recordset.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'This category already exists. Duplicate entries are not allowed.' 
            });
        }

        // 2. INSERT QUERY:
        const insertQuery = `INSERT INTO Categories (CategoryName) VALUES (@CategoryName)`;
        await request.query(insertQuery);

        res.status(201).json({ success: true, message: 'Category added successfully.' });

    } catch (error) {
        // 3. SAFETY NET: If DB constraints error like -  (jaise error 2627 / 2601)
        if (error.number === 2627 || error.number === 2601) {
            return res.status(400).json({ 
                success: false, 
                message: 'Database constraint error: Category already exists.' 
            });
        }

        console.error('Error adding category:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports = {
    getCategories,
    createCategory
};