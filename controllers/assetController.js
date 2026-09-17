const { sql } = require('../db'); // DB Connection

// 1. Get All Assets with Search, Filtering, and Pagination
const getAssets = async (req, res) => {
    try {
        let { page, limit, search, category, status } = req.query;

        // Default pagination values
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const request = new sql.Request();
        
        // Base query updated: Added a.SerialNumber
        let baseQuery = `
            SELECT a.AssetID, a.AssetTag, a.SerialNumber, a.AssetName, a.VendorName, 
                   a.PurchaseDate, a.Price, a.WarrantyExpiryDate, a.Status, 
                   t.TypeID, t.TypeName, c.CategoryID, c.CategoryName,
                   a.RAM, a.Processor, a.Storage, a.MAC_Address,
                   a.PhoneNumber, a.ServiceProvider, a.IMEI_Number,
                   a.Material, a.Color, a.Dimensions
            FROM Assets a
            LEFT JOIN AssetTypes t ON a.TypeID = t.TypeID
            LEFT JOIN Categories c ON t.CategoryID = c.CategoryID
            WHERE 1=1
        `;

        let countQuery = `
            SELECT COUNT(*) AS total 
            FROM Assets a
            LEFT JOIN AssetTypes t ON a.TypeID = t.TypeID
            LEFT JOIN Categories c ON t.CategoryID = c.CategoryID
            WHERE 1=1
        `;

        // 1. Search filter
        if (search) {
            request.input('Search', sql.VarChar, `%${search}%`);
            const searchCondition = ` AND (a.AssetName LIKE @Search OR a.AssetTag LIKE @Search OR a.SerialNumber LIKE @Search)`;
            baseQuery += searchCondition;
            countQuery += searchCondition;
        }

        // 2. Category filter
        if (category) {
            request.input('Category', sql.Int, category);
            const catCondition = ` AND t.CategoryID = @Category`;
            baseQuery += catCondition;
            countQuery += catCondition;
        }

        // 3. Status filter
        if (status) {
            request.input('Status', sql.VarChar, status);
            const statusCondition = ` AND a.Status = @Status`;
            baseQuery += statusCondition;
            countQuery += statusCondition;
        }

        baseQuery += ` ORDER BY a.AssetID DESC OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`;
        
        request.input('Offset', sql.Int, offset);
        request.input('Limit', sql.Int, limit);

        const result = await request.query(baseQuery);
        
        const countRequest = new sql.Request();
        if (search) countRequest.input('Search', sql.VarChar, `%${search}%`);
        if (category) countRequest.input('Category', sql.Int, category);
        if (status) countRequest.input('Status', sql.VarChar, status);
        
        const countResult = await countRequest.query(countQuery);
        const totalRecords = countResult.recordset[0].total;

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            totalRecords: totalRecords,
            count: result.recordset.length,
            data: result.recordset
        });

    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 2. Add New Asset (AssetTag Auto-Generated Here)
const createAsset = async (req, res) => {
    try {
        // req.body me se AssetTag hata diya hai aur SerialNumber add kiya hai
        const { 
            AssetName, SerialNumber, TypeID, VendorName, PurchaseDate, Price, WarrantyExpiryDate, Status,
            RAM, Processor, Storage, MAC_Address,
            PhoneNumber, ServiceProvider, IMEI_Number,
            Material, Color, Dimensions
        } = req.body;

        if (!AssetName || !TypeID) {
            return res.status(400).json({ success: false, message: 'AssetName and TypeID are required.' });
        }

        const request = new sql.Request();
        
        // 🚨 1. ASSET TAG AUTO-GENERATE LOGIC 🚨
        const tagQuery = 'SELECT ISNULL(MAX(AssetID), 0) AS maxId FROM Assets';
        const tagResult = await request.query(tagQuery);
        const nextId = tagResult.recordset[0].maxId + 1;
        const generatedAssetTag = `PDPLAST-${1000 + nextId}`; // Example: AST-1001
        
        // 🚨 2. Bind parameters (Including generated Tag and new SerialNumber) 🚨
        request.input('AssetTag', sql.VarChar, generatedAssetTag);
        request.input('SerialNumber', sql.VarChar, SerialNumber || null);
        request.input('AssetName', sql.VarChar, AssetName);
        request.input('TypeID', sql.Int, TypeID); 
        request.input('VendorName', sql.VarChar, VendorName || null);
        request.input('PurchaseDate', sql.Date, PurchaseDate || null);
        request.input('Price', sql.Decimal(10,2), Price || null);
        request.input('WarrantyExpiryDate', sql.Date, WarrantyExpiryDate || null);
        request.input('Status', sql.VarChar, Status || 'Available');

        request.input('RAM', sql.VarChar, RAM || null);
        request.input('Processor', sql.VarChar, Processor || null);
        request.input('Storage', sql.VarChar, Storage || null);
        request.input('MAC_Address', sql.VarChar, MAC_Address || null);
        
        request.input('PhoneNumber', sql.VarChar, PhoneNumber || null);
        request.input('ServiceProvider', sql.VarChar, ServiceProvider || null);
        request.input('IMEI_Number', sql.VarChar, IMEI_Number || null);
        
        request.input('Material', sql.VarChar, Material || null);
        request.input('Color', sql.VarChar, Color || null);
        request.input('Dimensions', sql.VarChar, Dimensions || null);

        // 🚨 3. Insert query updated 🚨
        const query = `
            INSERT INTO Assets (
                AssetTag, SerialNumber, AssetName, TypeID, VendorName, PurchaseDate, Price, WarrantyExpiryDate, Status,
                RAM, Processor, Storage, MAC_Address,
                PhoneNumber, ServiceProvider, IMEI_Number,
                Material, Color, Dimensions
            ) 
            VALUES (
                @AssetTag, @SerialNumber, @AssetName, @TypeID, @VendorName, @PurchaseDate, @Price, @WarrantyExpiryDate, @Status,
                @RAM, @Processor, @Storage, @MAC_Address,
                @PhoneNumber, @ServiceProvider, @IMEI_Number,
                @Material, @Color, @Dimensions
            )
        `;

        await request.query(query);
        res.status(201).json({ 
            success: true, 
            message: 'Asset added successfully', 
            assetTag: generatedAssetTag 
        });

    } catch (error) {
        console.error('Add Asset Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 3. Update details of an existing asset
const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 🚨 SerialNumber yahan bhi add kiya hai 🚨
        const { 
            AssetTag, SerialNumber, AssetName, TypeID, VendorName, PurchaseDate, Price, WarrantyExpiryDate, Status,
            RAM, Processor, Storage, MAC_Address,
            PhoneNumber, ServiceProvider, IMEI_Number,
            Material, Color, Dimensions
        } = req.body;

        const request = new sql.Request();
        
        request.input('AssetID', sql.Int, parseInt(id, 10)); 
        
        request.input('AssetTag', sql.VarChar, AssetTag);
        request.input('SerialNumber', sql.VarChar, SerialNumber || null); // Naya field bind kiya
        request.input('AssetName', sql.VarChar, AssetName);
        request.input('TypeID', sql.Int, TypeID); 
        request.input('VendorName', sql.VarChar, VendorName || null);
        request.input('PurchaseDate', sql.Date, PurchaseDate || null);
        request.input('Price', sql.Decimal(10, 2), Price || null);
        request.input('WarrantyExpiryDate', sql.Date, WarrantyExpiryDate || null);
        request.input('Status', sql.VarChar, Status || 'Available');
        
        request.input('RAM', sql.VarChar, RAM || null);
        request.input('Processor', sql.VarChar, Processor || null);
        request.input('Storage', sql.VarChar, Storage || null);
        request.input('MAC_Address', sql.VarChar, MAC_Address || null);
        
        request.input('PhoneNumber', sql.VarChar, PhoneNumber || null);
        request.input('ServiceProvider', sql.VarChar, ServiceProvider || null);
        request.input('IMEI_Number', sql.VarChar, IMEI_Number || null);
        
        request.input('Material', sql.VarChar, Material || null);
        request.input('Color', sql.VarChar, Color || null);
        request.input('Dimensions', sql.VarChar, Dimensions || null);

        // 🚨 Update query mein SerialNumber set kiya 🚨
        const query = `
            UPDATE Assets 
            SET AssetTag = @AssetTag,
                SerialNumber = @SerialNumber,
                AssetName = @AssetName, 
                TypeID = @TypeID, 
                VendorName = @VendorName,
                PurchaseDate = @PurchaseDate, 
                Price = @Price, 
                WarrantyExpiryDate = @WarrantyExpiryDate,
                Status = @Status,
                RAM = @RAM, Processor = @Processor, Storage = @Storage, MAC_Address = @MAC_Address,
                PhoneNumber = @PhoneNumber, ServiceProvider = @ServiceProvider, IMEI_Number = @IMEI_Number,
                Material = @Material, Color = @Color, Dimensions = @Dimensions
            WHERE AssetID = @AssetID
        `;
        
        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: 'Asset not found.' });
        }

        res.status(200).json({ success: true, message: 'Asset updated successfully.' });
    } catch (error) {
        if (error.number === 2627) {
            return res.status(400).json({ success: false, message: 'This AssetTag already exists!' });
        }
        console.error('Error updating asset:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// 4. Soft delete an asset (No changes needed)
const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Safety check lagaya jo humne pehle discuss kiya tha
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ success: false, message: 'Invalid Asset ID received.' });
        }

        const request = new sql.Request();
        request.input('AssetID', sql.Int, parsedId);

        const query = `
            UPDATE Assets 
            SET Status = 'Decommissioned' 
            WHERE AssetID = @AssetID
        `;
        
        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: 'Asset not found.' });
        }

        res.status(200).json({ success: true, message: 'Asset decommissioned (soft deleted) successfully.' });
    } catch (error) {
        console.error('Error deleting asset:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { getAssets, createAsset, updateAsset, deleteAsset };