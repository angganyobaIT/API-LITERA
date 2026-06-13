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
                    m.usaha_didirikan,
                    m.jam_buka,
                    m.jam_tutup,
                    m.deskripsi,
                    m.image_url,
                    m.image_qr,
                    m.status,

                    u.profile_picture,

                    ml.latitude,
                    ml.longitude

                FROM merchants m

                LEFT JOIN users u
                    ON u.id = m.user_id

                LEFT JOIN LATERAL (
                    SELECT
                        latitude,
                        longitude
                    FROM merchant_locations
                    WHERE
                        merchant_id = m.id
                        AND is_active = true
                    ORDER BY id DESC
                    LIMIT 1
                ) ml ON true

                ORDER BY m.id DESC
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
                    m.usaha_didirikan,
                    m.jam_buka,
                    m.jam_tutup,
                    m.deskripsi,
                    m.image_url,
                    m.image_qr,
                    m.status,

                    u.profile_picture,

                    ml.latitude,
                    ml.longitude

                FROM merchants m

                LEFT JOIN users u
                    ON u.id = m.user_id

                LEFT JOIN LATERAL (
                    SELECT
                        latitude,
                        longitude
                    FROM merchant_locations
                    WHERE
                        merchant_id = m.id
                        AND is_active = true
                    ORDER BY id DESC
                    LIMIT 1
                ) ml ON true

                WHERE m.id = $1
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
                    m.usaha_didirikan,
                    m.jam_buka,
                    m.jam_tutup,
                    m.deskripsi,
                    m.image_url,
                    m.image_qr,
                    m.status,

                    u.profile_picture,

                    ml.latitude,
                    ml.longitude

                FROM merchants m

                LEFT JOIN users u
                    ON u.id = m.user_id

                LEFT JOIN LATERAL (
                    SELECT
                        latitude,
                        longitude
                    FROM merchant_locations
                    WHERE
                        merchant_id = m.id
                        AND is_active = true
                    ORDER BY id DESC
                    LIMIT 1
                ) ml ON true

                WHERE m.user_id = $1

                LIMIT 1
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
            usaha_didirikan,
            jam_buka,
            jam_tutup,
            deskripsi,
            latitude,
            longitude,
            alamat,
        } = req.body;

        // =========================
        // CEK MERCHANT
        // =========================

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

        const merchantData =
            merchantCheck.rows[0];

        // =========================
        // CEK ADA PERUBAHAN
        // =========================

        const adaPerubahan =

            nama_bisnis !== undefined ||
            usaha_didirikan !== undefined ||
            jam_buka !== undefined ||
            jam_tutup !== undefined ||
            deskripsi !== undefined ||
            latitude !== undefined ||
            longitude !== undefined ||
            alamat !== undefined ||
            req.files?.image_url?.[0] ||
            req.files?.image_qr?.[0];

        if (!adaPerubahan) {

            return errorResponse(
                res,
                "Tidak ada data yang diubah"
            );
        }

        // =========================
        // DATA LAMA
        // =========================

        let imageUrl =
            merchantData.image_url;

        let imageQr =
            merchantData.image_qr;

        // =========================
        // UPLOAD FOTO MERCHANT
        // =========================

        if (
            req.files?.image_url?.[0]
        ) {

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
                                req.files
                                    .image_url[0]
                                    .buffer
                            )
                            .pipe(stream);
                    }
                );

            imageUrl =
                result.secure_url;
        }

        // =========================
        // UPLOAD QRIS
        // =========================

        if (
            req.files?.image_qr?.[0]
        ) {

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
                                        "merchant_qr",
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
                                req.files
                                    .image_qr[0]
                                    .buffer
                            )
                            .pipe(stream);
                    }
                );

            imageQr =
                result.secure_url;
        }

        // =========================
        // UPDATE MERCHANT
        // =========================

        const merchant =
            await pool.query(
                `
                UPDATE merchants
                SET
                    nama_bisnis =
                        COALESCE($1, nama_bisnis),

                    usaha_didirikan =
                        COALESCE($2, usaha_didirikan),

                    jam_buka =
                        COALESCE($3, jam_buka),

                    jam_tutup =
                        COALESCE($4, jam_tutup),

                    deskripsi =
                        COALESCE($5, deskripsi),

                    image_url = $6,

                    image_qr = $7,

                    updated_at = NOW()

                WHERE id = $8

                RETURNING *
                `,
                [
                    nama_bisnis,
                    usaha_didirikan,
                    jam_buka,
                    jam_tutup,
                    deskripsi,
                    imageUrl,
                    imageQr,
                    id,
                ]
            );

        // =========================
        // UPDATE LOCATION
        // =========================

        if (
            latitude !== undefined ||
            longitude !== undefined ||
            alamat !== undefined
        ) {

            const locationCheck =
                await pool.query(
                    `
                    SELECT *
                    FROM merchant_locations
                    WHERE merchant_id = $1
                    AND is_active = true
                    ORDER BY id DESC
                    LIMIT 1
                    `,
                    [id]
                );

            if (
                locationCheck.rows.length > 0
            ) {

                const location =
                    locationCheck.rows[0];

                await pool.query(
                    `
                    UPDATE merchant_locations
                    SET
                        latitude =
                            COALESCE($1, latitude),

                        longitude =
                            COALESCE($2, longitude),

                        alamat =
                            COALESCE($3, alamat),

                        updated_at = NOW()

                    WHERE id = $4
                    `,
                    [
                        latitude,
                        longitude,
                        alamat,
                        location.id,
                    ]
                );

            } else {

                await pool.query(
                    `
                    INSERT INTO merchant_locations (
                        merchant_id,
                        latitude,
                        longitude,
                        alamat,
                        is_active
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        true
                    )
                    `,
                    [
                        id,
                        latitude,
                        longitude,
                        alamat,
                    ]
                );
            }
        }

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