const pool =
    require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");


// GET ALL CUSTOMERS
const getAllCustomers =
async (req, res) => {

    try {

        const customers =
            await pool.query(
                `
                SELECT

                    c.id,
                    c.user_id,
                    c.name,
                    c.points,

                    u.username,
                    u.email,
                    u.profile_picture,
                    u.created_at

                FROM customers c

                INNER JOIN users u
                    ON u.id = c.user_id

                WHERE
                    u.is_active = true

                ORDER BY
                    c.id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data customer",
            customers.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};


// GET CUSTOMER BY ID
const getCustomerById =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const customer =
            await pool.query(
                `
                SELECT

                    c.id,
                    c.user_id,
                    c.name,
                    c.points,

                    u.username,
                    u.email,
                    u.profile_picture,
                    u.created_at

                FROM customers c

                INNER JOIN users u
                    ON u.id = c.user_id

                WHERE
                    c.id = $1
                    AND u.is_active = true
                `,
                [id]
            );

        if (
            customer.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Customer tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail customer",
            customer.rows[0]
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

module.exports = {

    getAllCustomers,
    getCustomerById,
};