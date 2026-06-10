const pool =
    require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");


// GET ALL MERCHANTS
const getAllMerchants =
async (req, res) => {

    try {

        const merchants =
            await pool.query(
                `
                SELECT

                    m.id,
                    m.user_id,
                    m.nama_bisnis,
                    m.tahun_berdiri,
                    m.deskripsi,

                    u.profile_picture,

                    ml.latitude,
                    ml.longitude

                FROM merchants m

                LEFT JOIN users u
                    ON u.id = m.user_id

                LEFT JOIN merchant_locations ml
                    ON ml.merchant_id = m.id

                WHERE
                    ml.is_active = true

                ORDER BY
                    m.id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data merchant",
            merchants.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};


// GET MERCHANT BY ID
const getMerchantById =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const merchant =
            await pool.query(
                `
                SELECT

                    m.id,
                    m.user_id,
                    m.nama_bisnis,
                    m.tahun_berdiri,
                    m.deskripsi,

                    u.profile_picture,

                    ml.latitude,
                    ml.longitude

                FROM merchants m

                LEFT JOIN users u
                    ON u.id = m.user_id

                LEFT JOIN merchant_locations ml
                    ON ml.merchant_id = m.id

                WHERE
                    m.id = $1
                    AND ml.is_active = true
                `,
                [id]
            );

        if (
            merchant.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Merchant tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail merchant",
            merchant.rows[0]
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

    getAllMerchants,
    getMerchantById,
};