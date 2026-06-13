const pool =
    require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");

// GET ALL PROMOTIONS
const getAllPromotions = async (
    req,
    res
) => {

    try {

        const promotions =
            await pool.query(
                `
                SELECT
                    promotions.id,
                    promotions.product_id,

                    promotions.tipe_promo,
                    promotions.diskon,
                    promotions.kuota,
                    promotions.tanggal_berlaku,
                    promotions.tanggal_expired,
                    promotions.created_at,
                    promotions.updated_at,
                    promotions.is_delete,

                    products.nama_produk,

                    merchants.id
                    AS merchant_id,

                    merchants.nama_bisnis

                FROM promotions

                JOIN products
                ON products.id =
                promotions.product_id

                JOIN merchants
                ON merchants.id =
                products.merchant_id

                ORDER BY promotions.id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data promo",
            promotions.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// GET PROMOTION BY ID
const getPromotionById = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const promotion =
            await pool.query(
                `
                SELECT
                    promotions.id,
                    promotions.product_id,

                    promotions.tipe_promo,
                    promotions.diskon,
                    promotions.kuota,
                    promotions.tanggal_berlaku,
                    promotions.tanggal_expired,
                    promotions.created_at,
                    promotions.updated_at,
                    promotions.is_delete,

                    products.nama_produk,

                    merchants.id
                    AS merchant_id,

                    merchants.nama_bisnis

                FROM promotions

                JOIN products
                ON products.id =
                promotions.product_id

                JOIN merchants
                ON merchants.id =
                products.merchant_id

                WHERE promotions.id = $1
                `,
                [id]
            );

        // promo tidak ditemukan
        if (
            promotion.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Promo tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail promo",
            promotion.rows[0]
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// GET PROMOTIONS BY PRODUCT
const getPromotionsByProduct =
    async (req, res) => {

    try {

        const { productId } =
            req.params;

        const promotions =
            await pool.query(
                `
                SELECT
                    promotions.id,
                    promotions.product_id,

                    promotions.tipe_promo,
                    promotions.diskon,
                    promotions.kuota,
                    promotions.tanggal_berlaku,
                    promotions.tanggal_expired,
                    promotions.created_at,
                    promotions.updated_at,
                    promotions.is_delete,

                    products.nama_produk,

                    merchants.id
                    AS merchant_id,

                    merchants.nama_bisnis

                FROM promotions

                JOIN products
                ON products.id =
                promotions.product_id

                JOIN merchants
                ON merchants.id =
                products.merchant_id

                WHERE promotions.product_id = $1

                ORDER BY promotions.id DESC
                `,
                [productId]
            );

        return successResponse(
            res,
            "Berhasil mengambil promo produk",
            promotions.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// CREATE PROMOTION
const createPromotion = async (
    req,
    res
) => {

    try {

        const {
            product_id,
            tipe_promo,
            diskon,
            kuota,
            tanggal_berlaku,
            tanggal_expired,
        } = req.body;

        // validasi
        if (
            !product_id ||
            !tipe_promo ||
            !diskon ||
            !tanggal_berlaku ||
            !tanggal_expired
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
            );
        }

        // validasi tipe promo
        const allowedPromo =
            [
                "FLASH_SALE",
            ];

        if (
            !allowedPromo.includes(
                tipe_promo
            )
        ) {

            return errorResponse(
                res,
                "Tipe promo tidak valid"
            );
        }

        // validasi tanggal
        if (
            new Date(
                tanggal_expired
            ) <=
            new Date(
                tanggal_berlaku
            )
        ) {

            return errorResponse(
                res,
                "Tanggal expired harus lebih besar"
            );
        }

        // cek product
        const productCheck =
            await pool.query(
                `
                SELECT *
                FROM products
                WHERE id = $1
                `,
                [product_id]
            );

        // product tidak ditemukan
        if (
            productCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Produk tidak ditemukan"
            );
        }

        // insert promotion
        await pool.query(
            `
            INSERT INTO promotions (
                product_id,
                tipe_promo,
                diskon,
                kuota,
                tanggal_berlaku,
                tanggal_expired
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [
                product_id,
                tipe_promo,
                diskon,
                kuota,
                tanggal_berlaku,
                tanggal_expired,
            ]
        );

        return successResponse(
            res,
            "Promo berhasil ditambahkan"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// UPDATE PROMOTION
const updatePromotion = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const {
            tipe_promo,
            diskon,
            kuota,
            tanggal_berlaku,
            tanggal_expired,
        } = req.body;

        // validasi
        if (
            !tipe_promo ||
            !diskon ||
            !tanggal_berlaku ||
            !tanggal_expired
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
            );
        }

        // cek promotion
        const promotionCheck =
            await pool.query(
                `
                SELECT *
                FROM promotions
                WHERE id = $1
                `,
                [id]
            );

        // promo tidak ditemukan
        if (
            promotionCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Promo tidak ditemukan"
            );
        }

        // validasi tanggal
        if (
            new Date(
                tanggal_expired
            ) <=
            new Date(
                tanggal_berlaku
            )
        ) {

            return errorResponse(
                res,
                "Tanggal expired harus lebih besar"
            );
        }

        // update promotion
        await pool.query(
            `
            UPDATE promotions
            SET
                tipe_promo = $1,
                diskon = $2,
                kuota = $3,
                tanggal_berlaku = $4,
                tanggal_expired = $5,
                updated_at = NOW()
            WHERE id = $6
            `,
            [
                tipe_promo,
                diskon,
                kuota,
                tanggal_berlaku,
                tanggal_expired,
                id,
            ]
        );

        return successResponse(
            res,
            "Promo berhasil diupdate"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// DELETE PROMOTION
const deletePromotion = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        // cek promo
        const promotionCheck =
            await pool.query(
                `
                SELECT *
                FROM promotions
                WHERE id = $1
                AND is_delete = false
                `,
                [id]
            );

        // promo tidak ditemukan
        if (
            promotionCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Promo tidak ditemukan"
            );
        }

        // soft delete
        await pool.query(
            `
            UPDATE promotions
            SET
                is_delete = true,
                updated_at = NOW()
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "Promo berhasil dihapus"
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
    createPromotion,
    getAllPromotions,
    getPromotionById,
    getPromotionsByProduct,
    updatePromotion,
    deletePromotion,
};