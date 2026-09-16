/**
 * @file billController.js
 * @description Handles adding and fetching asset purchase bills/invoices.
 */

const { sql } = require('../db');

/**
 * @function addBill
 * @description Add a new bill/invoice record for an asset, including the file path.
 */
const addBill = async (req, res) => {
    try {
        const { assetID, billNumber, billDate, amount } = req.body;
        
        // Extract file path if a file was uploaded, standardize slashes for URLs
        const invoiceFilePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

        // Validate required fields
        if (!assetID || !billNumber) {
            return res.status(400).json({ success: false, message: 'AssetID and BillNumber are required.' });
        }

        const request = new sql.Request();
        
        // Bind input parameters to prevent SQL injection
        request.input('AssetID', sql.Int, assetID);
        request.input('BillNumber', sql.VarChar, billNumber);
        request.input('BillDate', sql.Date, billDate || new Date());
        request.input('Amount', sql.Decimal(10, 2), amount || 0.00);
        request.input('InvoiceFilePath', sql.VarChar, invoiceFilePath);

        // Execute insert query
        const query = `
            INSERT INTO AssetBills (AssetID, BillNumber, BillDate, Amount, InvoiceFilePath)
            VALUES (@AssetID, @BillNumber, @BillDate, @Amount, @InvoiceFilePath)
        `;
        await request.query(query);

        res.status(201).json({ 
            success: true, 
            message: 'Bill added successfully.',
            filePath: invoiceFilePath 
        });

    } catch (error) {
        console.error('Error adding bill:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/**
 * @function getAllBills
 * @description Fetch all bills with associated asset details via SQL JOIN.
 */
const getAllBills = async (req, res) => {
    try {
        // Naya Double-JOIN add kiya hai taaki Type aur Category bhi fetch ho jaye
        const query = `
            SELECT b.BillID, b.BillNumber, b.BillDate, b.Amount, b.InvoiceFilePath,
                   a.AssetID, a.AssetTag, a.AssetName,
                   t.TypeName, c.CategoryName -- Naye fields
            FROM AssetBills b
            LEFT JOIN Assets a ON b.AssetID = a.AssetID
            LEFT JOIN AssetTypes t ON a.TypeID = t.TypeID -- Naya JOIN
            LEFT JOIN Categories c ON t.CategoryID = c.CategoryID -- Naya JOIN
            ORDER BY b.BillDate DESC
        `;
        const result = await sql.query(query);

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { addBill, getAllBills };