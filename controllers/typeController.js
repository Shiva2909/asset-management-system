/**
 * @file typeController.js
 * @description Handles fetching, adding, editing, and deleting Asset Types for dynamic frontend dropdowns.
 */

const { sql } = require('../db');

// ==========================================
// 1. Add New Asset Type (Bulletproof Code)
// ==========================================
const addType = async (req, res) => {
    try {
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

// ==========================================
// 2. Get Asset Types 
// ==========================================
const getTypes = async (req, res) => {
    try {
        const { categoryId } = req.query; 
        
        const request = new sql.Request();
        
        let query = `
            SELECT t.TypeID, t.TypeName, t.CategoryID, c.CategoryName 
            FROM AssetTypes t
            INNER JOIN Categories c ON t.CategoryID = c.CategoryID
        `;

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

// ==========================================
// 3. Edit / Update Asset Type 
// ==========================================
const editType = async (req, res) => {
    try {
        // Handle ID from URL params or request body
        const typeID = req.params.id || req.body.typeID || req.body.TypeID;
        const typeName = req.body.typeName || req.body.TypeName;
        const categoryID = req.body.categoryID || req.body.CategoryID;

        if (!typeID || !typeName || !categoryID) {
            return res.status(400).json({ 
                success: false, 
                message: 'TypeID, TypeName, and CategoryID are required for update.' 
            });
        }

        const request = new sql.Request();
        request.input('TypeID', sql.Int, typeID);
        request.input('TypeName', sql.VarChar, typeName);
        request.input('CategoryID', sql.Int, categoryID);

        // Check if ANOTHER type exists with the same name and category (excluding current TypeID)
        const checkQuery = `SELECT * FROM AssetTypes WHERE TypeName = @TypeName AND CategoryID = @CategoryID AND TypeID != @TypeID`;
        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Another Sub Category with this name already exists in the selected Category.' 
            });
        }

        const updateQuery = `
            UPDATE AssetTypes 
            SET TypeName = @TypeName, CategoryID = @CategoryID 
            WHERE TypeID = @TypeID
        `;
        const result = await request.query(updateQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: 'Asset Type not found.' });
        }

        res.status(200).json({ success: true, message: 'Asset Type updated successfully.' });
    } catch (error) {
        if (error.number === 2627 || error.number === 2601) {
            return res.status(400).json({ 
                success: false, 
                message: 'Database constraint error: This Sub Category already exists.' 
            });
        }
        console.error('Edit Type Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// ==========================================
// 4. Delete Asset Type 
// ==========================================
const deleteType = async (req, res) => {
    try {
        // Handle ID from URL params or request body
        const typeID = req.params.id || req.body.typeID || req.body.TypeID;

        if (!typeID) {
            return res.status(400).json({ success: false, message: 'TypeID is required for deletion.' });
        }

        const request = new sql.Request();
        request.input('TypeID', sql.Int, typeID);

        const deleteQuery = `DELETE FROM AssetTypes WHERE TypeID = @TypeID`;
        const result = await request.query(deleteQuery);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: 'Asset Type not found.' });
        }

        res.status(200).json({ success: true, message: 'Asset Type deleted successfully.' });
    } catch (error) {
        // Foreign Key Constraint Violation
        if (error.number === 547) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete this Sub Category because it is currently assigned to one or more assets.' 
            });
        }

        console.error('Delete Type Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { addType, getTypes, editType, deleteType };