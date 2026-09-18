const { sql } = require('../db');

// 1. Add Maintenance Record (with Receipt Upload)
const addMaintenance = async (req, res) => {
    try {
        const { assetID, cost, description, maintenanceDate } = req.body;
        
        // Agar file (receipt) upload hui hai, toh uska path nikal lo
        const receiptPath = req.file ? req.file.path : null;

        if (!assetID || !cost) {
            return res.status(400).json({ success: false, message: 'AssetID and Cost are required.' });
        }

        const request = new sql.Request();
        request.input('AssetID', sql.Int, assetID);
        request.input('Cost', sql.Int, cost);
        request.input('Description', sql.VarChar, description);
        request.input('MaintenanceDate', sql.Date, maintenanceDate || new Date());
        request.input('ReceiptFilePath', sql.VarChar, receiptPath);

        await request.query(`
            INSERT INTO AssetMaintenance (AssetID, Cost, Description, MaintenanceDate, ReceiptFilePath)
            VALUES (@AssetID, @Cost, @Description, @MaintenanceDate, @ReceiptFilePath)
        `);

        res.status(201).json({ success: true, message: 'Maintenance record added successfully!' });
    } catch (error) {
        console.error('Add Maintenance Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 2. Get Maintenance History for a Specific Asset
const getAssetMaintenanceHistory = async (req, res) => {
    try {
        const { assetId } = req.params;

        const request = new sql.Request();
        request.input('AssetID', sql.Int, assetId);

        // 🚨 FIX: Yahan SELECT ke baad AssetID add kar diya hai
        const query = `
            SELECT MaintenanceID, AssetID, MaintenanceDate, Cost, Description, ReceiptFilePath
            FROM AssetMaintenance
            WHERE AssetID = @AssetID
            ORDER BY MaintenanceDate DESC
        `;
        const result = await request.query(query);

        // Sir ki requirement: Kitni baar repair hua aur total kitne paise lage
        const totalRepairs = result.recordset.length;
        const totalCost = result.recordset.reduce((sum, record) => sum + record.Cost, 0);

        res.status(200).json({
            success: true,
            assetId: assetId,
            totalRepairs: totalRepairs, 
            totalCost: totalCost,       
            history: result.recordset   
        });
    } catch (error) {
        console.error('Fetch Maintenance History Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { addMaintenance, getAssetMaintenanceHistory };