/**
 * @file allocationController.js
 * @description Handles asset assignments, returns, and tracking using SQL Transactions.
 */

const { sql } = require('../db');

/**
 * @function allocateAsset
 * @description Assigns an asset to an employee securely using SQL Transactions.
 */
const allocateAsset = async (req, res) => { 
    const transaction = new sql.Transaction();

    try {
        // Extracted 'remarks' to match the database schema
        const { assetID, employeeID, assignedDate, remarks } = req.body;

        if (!assetID || !employeeID) {
            return res.status(400).json({ success: false, message: 'AssetID and EmployeeID are required.' });
        }

        await transaction.begin();
        const request = new sql.Request(transaction);

        // 1. Verify if the asset is currently available
        request.input('CheckAssetID', sql.Int, assetID);
        const checkQuery = `SELECT Status FROM Assets WHERE AssetID = @CheckAssetID`;
        const checkResult = await request.query(checkQuery);

        if (checkResult.recordset.length === 0 || checkResult.recordset[0].Status !== 'Available') {
            throw new Error('Asset is not available for allocation.');
        }

        // 2. Insert record into AssetAllocations table
        request.input('AssetID', sql.Int, assetID);
        request.input('EmployeeID', sql.Int, employeeID);
        request.input('AssignedDate', sql.Date, assignedDate || new Date());
        request.input('Remarks', sql.Text, remarks || null);

        const insertQuery = `
            INSERT INTO AssetAllocations (AssetID, EmployeeID, AssignedDate, Remarks) 
            VALUES (@AssetID, @EmployeeID, @AssignedDate, @Remarks)
        `;
        await request.query(insertQuery);

        // 3. Update the asset status in Assets table
        const updateQuery = `
            UPDATE Assets 
            SET Status = 'Assigned' 
            WHERE AssetID = @AssetID
        `;
        await request.query(updateQuery);

        // 4. Commit transaction if both queries succeed
        await transaction.commit();

        res.status(201).json({ success: true, message: 'Asset allocated successfully.' });

    } catch (error) {
        console.error('Allocation Transaction Error:', error.message);
        
        // Rollback on any failure to maintain data integrity
        if (transaction) await transaction.rollback();

        if (error.message === 'Asset is not available for allocation.') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/**
 * @function returnAsset
 * @description Processes an asset return by updating ReturnDate and setting Asset Status to 'Available'.
 */
const returnAsset = async (req, res) => {
    try {
        // 1. URL params se allocationId nikalna
        const { allocationId } = req.params;

        const request = new sql.Request();
        
        // SQL injection se bachne ke liye parameter add karna
        request.input('AllocationID', sql.Int, allocationId);

        // 2. Pehle check karo ki ye record exist karta hai aur uska AssetID kya hai
        const checkQuery = `SELECT AssetID, ReturnDate FROM AssetAllocations WHERE AllocationID = @AllocationID`;
        const checkResult = await request.query(checkQuery);

        // Agar record nahi mila
        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Allocation record not found.' });
        }

        // Agar ReturnDate pehle se daali hui hai, iska matlab asset already returned hai
        if (checkResult.recordset[0].ReturnDate !== null) {
            return res.status(400).json({ success: false, message: 'This asset has already been returned.' });
        }

        const assetId = checkResult.recordset[0].AssetID;
        request.input('AssetID', sql.Int, assetId);

        // 3. AssetAllocations table mein ReturnDate ko aaj ki date (GETDATE) se update karna
        await request.query(`
            UPDATE AssetAllocations 
            SET ReturnDate = GETDATE() 
            WHERE AllocationID = @AllocationID
        `);

        // 4. Assets table mein us asset ka Status wapas 'Available' kar dena
        await request.query(`
            UPDATE Assets 
            SET Status = 'Available' 
            WHERE AssetID = @AssetID
        `);

        res.status(200).json({ success: true, message: 'Asset returned successfully and marked as available.' });

    } catch (error) {
        console.error('Return Asset Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

/**
 * @function getAllocations
 * @description Fetches all asset allocations with joined Employee and Asset details.
 */
const getAllocations = async (req, res) => {
    try {
        // Naya JOIN lagaya gaya hai Types aur Categories table ko fetch karne ke liye
        const query = `
            SELECT al.AllocationID, al.AssignedDate, al.ReturnDate, al.Remarks,
                   a.AssetTag, a.AssetName, 
                   t.TypeName, c.CategoryName, -- Added from new structure
                   e.empid, e.emp_name, e.emp_dept
            FROM AssetAllocations al
            LEFT JOIN Assets a ON al.AssetID = a.AssetID
            LEFT JOIN AssetTypes t ON a.TypeID = t.TypeID -- New JOIN
            LEFT JOIN Categories c ON t.CategoryID = c.CategoryID -- New JOIN
            INNER JOIN Employees e ON al.EmployeeID = e.id
            ORDER BY al.AssignedDate DESC
        `;
        const result = await sql.query(query);

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Fetch Allocations Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getAllocationsById = async (req, res) => {
    try {
        const { allocationId } = req.params;

        const request = new sql.Request();
        request.input('AllocationID', sql.Int, allocationId);

        // Yahan bhi naya JOIN lagaya gaya hai
        const query = `
            SELECT al.AllocationID, al.AssignedDate, al.ReturnDate, al.Remarks,
                   a.AssetTag, a.AssetName, 
                   t.TypeName, c.CategoryName, -- Added from new structure
                   e.empid, e.emp_name, e.emp_dept
            FROM AssetAllocations al
            LEFT JOIN Assets a ON al.AssetID = a.AssetID
            LEFT JOIN AssetTypes t ON a.TypeID = t.TypeID -- New JOIN
            LEFT JOIN Categories c ON t.CategoryID = c.CategoryID -- New JOIN
            INNER JOIN Employees e ON al.EmployeeID = e.id
            WHERE al.AllocationID = @AllocationID
            ORDER BY al.AssignedDate DESC
        `;
        
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Allocation record not found.' });
        }

        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Fetch Allocations Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// This function basically use to get asset history with curent and past status
const getAssetHistory = async (req, res) => {
    try {
        const { assetId } = req.params;

        const request = new sql.Request();
        request.input('AssetID', sql.Int, assetId);

        // DATEDIFF function jo total din calculate karega!
        const query = `
            SELECT al.AllocationID, al.AssignedDate, al.ReturnDate, al.Remarks,
                   e.empid, e.emp_name, e.emp_dept,
                   DATEDIFF(day, al.AssignedDate, ISNULL(al.ReturnDate, GETDATE())) AS DaysUsed
            FROM AssetAllocations al
            JOIN Employees e ON al.EmployeeID = e.id
            WHERE al.AssetID = @AssetID
            ORDER BY al.AssignedDate DESC
        `;
        
        const result = await request.query(query);
        const allRecords = result.recordset;

        let currentAssignee = null;
        let pastAssignees = [];

        // Data ko Current aur Past mein alag karna
        allRecords.forEach(record => {
            if (record.ReturnDate === null) {
                currentAssignee = record;
            } else {
                pastAssignees.push(record);
            }
        });

        res.status(200).json({
            success: true,
            assetId: assetId,
            timelineSummary: {
                totalTimesAssigned: allRecords.length,
                isCurrentlyAssigned: currentAssignee !== null
            },
            currentStatus: currentAssignee,
            historyLog: pastAssignees
        });
    } catch (error) {
        console.error('Asset History Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { allocateAsset, returnAsset, getAllocations, getAllocationsById, getAssetHistory };