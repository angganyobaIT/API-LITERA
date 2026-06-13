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

                ORDER BY m.id DESC;
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

                WHERE m.id = $1;
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

                WHERE m.user_id = $1;
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
        } = req.body;

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
        // Validasi ada perubahan
        // =========================

        const adaPerubahan =

            nama_bisnis ||
            usaha_didirikan ||
            jam_buka ||
            jam_tutup ||
            deskripsi ||
            req.files?.image_url?.[0] ||
            req.files?.image_qr?.[0];

        if (!adaPerubahan) {

            return errorResponse(
                res,
                "Tidak ada data yang diubah"
            );
        }

        // =========================
        // Ambil data lama jika kosong
        // =========================

        let namaBisnis =
            nama_bisnis ??
            merchantData.nama_bisnis;

        let usahaDidirikan =
            usaha_didirikan ??
            merchantData.usaha_didirikan;

        let jamBuka =
            jam_buka ??
            merchantData.jam_buka;

        let jamTutup =
            jam_tutup ??
            merchantData.jam_tutup;

        let deskripsiUsaha =
            deskripsi ??
            merchantData.deskripsi;

        let imageUrl =
            merchantData.image_url;

        let imageQr =
            merchantData.image_qr;

        // =========================
        // Upload Foto Merchant
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
        // Upload QRIS
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
        // Update Merchant
        // =========================

        const merchant =
            await pool.query(
                `
                UPDATE merchants
                SET
                    nama_bisnis = $1,
                    usaha_didirikan = $2,
                    jam_buka = $3,
                    jam_tutup = $4,
                    deskripsi = $5,
                    image_url = $6,
                    image_qr = $7,
                    updated_at = NOW()
                WHERE id = $8
                RETURNING *
                `,
                [
                    namaBisnis,
                    usahaDidirikan,
                    jamBuka,
                    jamTutup,
                    deskripsiUsaha,
                    imageUrl,
                    imageQr,
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