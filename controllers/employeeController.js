const { sql } = require('../db');

// 1. Get All Employees 
const getAllEmployees = async (req, res) => {
    try {
        // fetch data
        const result = await sql.query('SELECT id, empid, emp_name, emp_code, emp_dept FROM Employees');
        
        res.status(200).json({
            success: true,
            count: result.recordset.length,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

// export get function
module.exports = {
    getAllEmployees
};