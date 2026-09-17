/**
 * @file typeController.js
 * @description Handles fetching and adding Asset Types for dynamic frontend dropdowns.
 */

const { sql } = require('../db');
// 1. Add New Asset Type (Bulletproof Code)
const addType = async (req, res) => {
    try {
        // DONO case handle kar liye: frontend chahe 'typeName' bheje ya 'TypeName'
        const typeName = req.body.typeName || req.body.TypeName;
        const categoryID = req.body.categoryID || req.body.CategoryID;

        if (!typeName || !categoryID) {
            return res.status(400).json({ 
                success: false, 
                message: 'TypeName and CategoryID are required. Received: ' + JSON.stringify(req.body) 
            });
        }

        const request = new sql.Request();
        request.input('TypeName', sql.VarChar, typeName);
        request.input('CategoryID', sql.Int, categoryID);
     
        // 1. APPLICATION LEVEL CHECK: Database me pehle se check karna
        const checkQuery = `SELECT * FROM AssetTypes WHERE TypeName = @TypeName AND CategoryID = @CategoryID`;
        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'This Sub Category already exists in the selected Category. Duplicate entries are not allowed.' 
            });
        }

        // 2. INSERT QUERY
        const insertQuery = `
            INSERT INTO AssetTypes (TypeName, CategoryID) 
            VALUES (@TypeName, @CategoryID)
        `;
        await request.query(insertQuery);

        res.status(201).json({ success: true, message: 'Asset Type added successfully.' });
    } catch (error) {
        // 3. DATABASE LEVEL CHECK
        if (error.number === 2627 || error.number === 2601) {
            return res.status(400).json({ 
                success: false, 
                message: 'Database constraint error: This Sub Category already exists.' 
            });
        }

        console.error('Add Type Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 1. Add New Asset Type (e.g., Tablet, Desk)
/*const addType = async (req, res) => {
    try {
        const { typeName, categoryID } = req.body;

        if (!typeName || !categoryID) {
            return res.status(400).json({ success: false, message: 'TypeName and CategoryID are required.' });
        }

        const request = new sql.Request();
        request.input('TypeName', sql.VarChar, typeName);
        request.input('CategoryID', sql.Int, categoryID);
     
        // 1. APPLICATION LEVEL CHECK: Database me pehle se check karna
        const checkQuery = `SELECT * FROM AssetTypes WHERE TypeName = @TypeName AND CategoryID = @CategoryID`;
        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'This Asset Type already exists in the selected Category. Duplicate entries are not allowed.' 
            });
        }

        // 2. INSERT QUERY
        const insertQuery = `
            INSERT INTO AssetTypes (TypeName, CategoryID) 
            VALUES (@TypeName, @CategoryID)
        `;
        await request.query(insertQuery);

        res.status(201).json({ success: true, message: 'Asset Type added successfully.' });
    } catch (error) {
        // 3. DATABASE LEVEL CHECK: Agar galti se concurrent request chali jaye toh SQL error catch karna
        if (error.number === 2627 || error.number === 2601) {
            return res.status(400).json({ 
                success: false, 
                message: 'Database constraint error: This Asset Type already exists.' 
            });
        }

        console.error('Add Type Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
/** */

// 2. Get Asset Types (With optional Category filter for frontend dropdown)
const getTypes = async (req, res) => {
    try {
        // Frontend chahe toh specific category ke types maang sakta hai (e.g., ?categoryId=1)
        const { categoryId } = req.query; 
        
        const request = new sql.Request();
        
        let query = `
            SELECT t.TypeID, t.TypeName, t.CategoryID, c.CategoryName 
            FROM AssetTypes t
            INNER JOIN Categories c ON t.CategoryID = c.CategoryID
        `;

        // Agar frontend ne CategoryID bheji hai, toh sirf usi category ke types bhejo
        if (categoryId) {
            request.input('CategoryID', sql.Int, categoryId);
            query += ` WHERE t.CategoryID = @CategoryID`;
        }

        query += ` ORDER BY t.TypeName ASC`;

        const result = await request.query(query);

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Fetch Types Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { addType, getTypes };  