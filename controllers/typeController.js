/**
 * @file typeController.js
 * @description Handles fetching and adding Asset Types for dynamic frontend dropdowns.
 */

const { sql } = require('../db');

// 1. Add New Asset Type (e.g., Tablet, Desk)
const addType = async (req, res) => {
    try {
        const { typeName, categoryID } = req.body;

        if (!typeName || !categoryID) {
            return res.status(400).json({ success: false, message: 'TypeName and CategoryID are required.' });
        }

        const request = new sql.Request();
        request.input('TypeName', sql.VarChar, typeName);
        request.input('CategoryID', sql.Int, categoryID);

        // Check if type already exists in the same category
        const checkQuery = `SELECT * FROM AssetTypes WHERE TypeName = @TypeName AND CategoryID = @CategoryID`;
        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'This Type already exists in the selected Category.' });
        }

        // Insert new type
        const insertQuery = `
            INSERT INTO AssetTypes (TypeName, CategoryID) 
            VALUES (@TypeName, @CategoryID)
        `;
        await request.query(insertQuery);

        res.status(201).json({ success: true, message: 'Asset Type added successfully.' });
    } catch (error) {
        console.error('Add Type Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

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