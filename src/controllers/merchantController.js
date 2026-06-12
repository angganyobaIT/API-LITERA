const pool =
    require("../config/db");

const cloudinary =
    require("../config/cloudinary");

const streamifier =
    require("streamifier");         

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
                    m.image_url,
                    m.status,

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
                    m.image_url,
                    m.status,

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

const getMerchantByUserId =
async (req, res) => {

    try {

        const { user_id } =
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
                    m.image_url,
                    m.status,

                    u.profile_picture,

                    ml.latitude,
                    ml.longitude

                FROM merchants m

                LEFT JOIN users u
                    ON u.id = m.user_id

                LEFT JOIN merchant_locations ml
                    ON ml.merchant_id = m.id

                WHERE
                    m.user_id = $1
                    AND ml.is_active = true
                `,
                [user_id]
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
            "Berhasil mengambil data merchant",
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

const updateMerchantInformation =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const {
            nama_bisnis,
            tahun_berdiri,
            deskripsi,
        } = req.body;

        if (
            !nama_bisnis ||
            !tahun_berdiri ||
            !deskripsi
        ) {

            return errorResponse(
                res,
                "Field wajib diisi"
            );
        }

        const merchantCheck =
            await pool.query(
                `
                SELECT *
                FROM merchants
                WHERE id = $1
                `,
                [id]
            );

        if (
            merchantCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Merchant tidak ditemukan"
            );
        }

        let imageUrl =
            merchantCheck.rows[0]
                .image_url;

        if (req.file) {

            const result =
                await new Promise(
                    (
                        resolve,
                        reject
                    ) => {

                        const stream =
                            cloudinary.uploader.upload_stream(

                                {
                                    folder:
                                        "merchant_images",
                                },

                                (
                                    error,
                                    result
                                ) => {

                                    if (error)
                                        reject(error);

                                    else
                                        resolve(result);
                                }
                            );

                        streamifier
                            .createReadStream(
                                req.file.buffer
                            )
                            .pipe(stream);
                    }
                );

            imageUrl =
                result.secure_url;
        }

        const merchant =
            await pool.query(
                `
                UPDATE merchants
                SET
                    nama_bisnis = $1,
                    tahun_berdiri = $2,
                    deskripsi = $3,
                    image_url = $4,
                    updated_at = NOW()
                WHERE id = $5
                RETURNING *
                `,
                [
                    nama_bisnis,
                    tahun_berdiri,
                    deskripsi,
                    imageUrl,
                    id,
                ]
            );

        return successResponse(
            res,
            "Informasi bisnis berhasil diperbarui",
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

const updateMerchantStatus =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const { status } =
            req.body;

        if (
            !["Buka", "Tutup"]
                .includes(status)
        ) {

            return errorResponse(
                res,
                "Status harus Buka atau Tutup"
            );
        }

        const merchantCheck =
            await pool.query(
                `
                SELECT *
                FROM merchants
                WHERE id = $1
                `,
                [id]
            );

        if (
            merchantCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Merchant tidak ditemukan"
            );
        }

        const merchant =
            await pool.query(
                `
                UPDATE merchants
                SET
                    status = $1,
                    updated_at = NOW()
                WHERE id = $2
                RETURNING *
                `,
                [
                    status,
                    id,
                ]
            );

        return successResponse(
            res,
            "Status merchant berhasil diperbarui",
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
    getMerchantByUserId,
    updateMerchantInformation,
    updateMerchantStatus,
};