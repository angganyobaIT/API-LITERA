const pool =
    require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");


// GET ALL CATEGORY PRODUCTS
const getAllCategoryProducts =
async (req, res) => {

    try {

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    category_name
                FROM category_products
                ORDER BY id ASC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data kategori produk",
            result.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};


// GET CATEGORY PRODUCT BY ID
const getCategoryProductById =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const result =
            await pool.query(
                `
                SELECT
                    id,
                    category_name
                FROM category_products
                WHERE id = $1
                `,
                [id]
            );

        if (
            result.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Kategori produk tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail kategori produk",
            result.rows[0]
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

    getAllCategoryProducts,

    getCategoryProductById,
};