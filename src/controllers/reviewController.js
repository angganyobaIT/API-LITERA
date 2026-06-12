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

// GET ALL REVIEWS
const getAllReviews = async (
    req,
    res
) => {

    try {

        const reviews =
        await pool.query(
            `
            SELECT
                reviews.id,
                reviews.customer_id,
                reviews.rating,
                reviews.deskripsi,
                reviews.image_url,
                reviews.is_delete,
                reviews.submitted_at,

                customers.name AS customer_name,

                merchants.nama_bisnis

                customers.name
                AS customer_name,

                merchants.nama_bisnis

            FROM reviews

            JOIN customers
            ON customers.id =
            reviews.customer_id

            JOIN merchants
            ON merchants.id =
            reviews.merchant_id

            ORDER BY reviews.id DESC
            `
        );

        return successResponse(
            res,
            "Berhasil mengambil data review",
            reviews.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// GET REVIEW BY ID
const getReviewById = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const review =
        await pool.query(
            `
            SELECT
            reviews.id,
            reviews.customer_id,
            reviews.rating,
            reviews.deskripsi,
            reviews.image_url,
            reviews.is_delete,
            reviews.submitted_at,

            customers.name AS customer_name,

            merchants.nama_bisnis

            FROM reviews

            JOIN customers
            ON customers.id =
            reviews.customer_id

            JOIN merchants
            ON merchants.id =
            reviews.merchant_id

            WHERE reviews.id = $1
            `,
            [id]
        );

        // review tidak ditemukan
        if (
            review.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Review tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail review",
            review.rows[0]
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// CREATE REVIEW
const createReview = async (
    req,
    res
) => {

    try {

        const {
            customer_id,
            merchant_id,
            rating,
            deskripsi,
        } = req.body;

        // validasi
        if (
            !customer_id ||
            !merchant_id ||
            !rating
        ) {

            return errorResponse(
                res,
                "Field wajib diisi"
            );
        }

        // validasi rating
        if (
            rating < 1 ||
            rating > 5
        ) {

            return errorResponse(
                res,
                "Rating harus 1 sampai 5"
            );
        }

        // cek customer
        const customerCheck =
            await pool.query(
                `
                SELECT *
                FROM customers
                WHERE id = $1
                `,
                [customer_id]
            );

        if (
            customerCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Customer tidak ditemukan"
            );
        }

        // cek merchant
        const merchantCheck =
            await pool.query(
                `
                SELECT *
                FROM merchants
                WHERE id = $1
                `,
                [merchant_id]
            );

        if (
            merchantCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Merchant tidak ditemukan"
            );
        }

        // cek review duplicate
        const reviewCheck =
            await pool.query(
                `
                SELECT *
                FROM reviews
                WHERE customer_id = $1
                AND merchant_id = $2
                `,
                [
                    customer_id,
                    merchant_id,
                ]
            );

        if (
            reviewCheck.rows.length > 0
        ) {

            return errorResponse(
                res,
                "Review sudah pernah dibuat"
            );
        }

        let imageUrl = null;

        // upload image jika ada
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
                                        "review_images",
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

        // insert review
        await pool.query(
            `
            INSERT INTO reviews (
                customer_id,
                merchant_id,
                rating,
                deskripsi,
                image_url
            )
            VALUES ($1, $2, $3, $4, $5)
            `,
            [
                customer_id,
                merchant_id,
                rating,
                deskripsi,
                imageUrl,
            ]
        );

        return successResponse(
            res,
            "Review berhasil dibuat"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// DELETE REVIEW
const deleteReview = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        // cek review
        const reviewCheck =
            await pool.query(
                `
                SELECT *
                FROM reviews
                WHERE id = $1
                `,
                [id]
            );

        if (
            reviewCheck.rows[0].is_delete
        ) {

            return errorResponse(
                res,
                "Review sudah dihapus"
            );
        }

        // soft delete
        await pool.query(
            `
            UPDATE reviews
            SET is_delete = true
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "Review berhasil dihapus"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};


// RESTORE REVIEW
const restoreReview = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        // cek review
        const reviewCheck =
            await pool.query(
                `
                SELECT *
                FROM reviews
                WHERE id = $1
                `,
                [id]
            );

        // review tidak ditemukan
        if (
            reviewCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Review tidak ditemukan"
            );
        }

        if (
            !reviewCheck.rows[0].is_delete
        ) {

            return errorResponse(
                res,
                "Saat ini review tersebut masih aktif"
            );
        }

        // restore review
        await pool.query(
            `
            UPDATE reviews
            SET is_delete = false
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "Review berhasil dipulihkan"
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
    getAllReviews,
    getReviewById,
    createReview,
    deleteReview,
    restoreReview,
};