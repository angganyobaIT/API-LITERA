const pool =
    require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");


// GENERATE RANDOM CODE
const generateVoucherCode =
    () => {

    return Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
};

// GET VOUCHERS BY CUSTOMER
const getVouchersByCustomer =
    async (req, res) => {

    try {

        const { customerId } =
            req.params;

        // cek customer
        const customerCheck =
            await pool.query(
                `
                SELECT *
                FROM customers
                WHERE id = $1
                `,
                [customerId]
            );

        if (
            customerCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Customer tidak ditemukan"
            );
        }

        // ambil voucher customer
        const vouchers =
            await pool.query(
                `
                SELECT

                    customer_vouchers.id,
                    customer_vouchers.voucher_code,
                    customer_vouchers.status,
                    customer_vouchers.claimed_at,
                    customer_vouchers.used_at,

                    customers.name
                    AS customer_name,

                    promotions.tipe_promo,
                    promotions.diskon,
                    promotions.tanggal_berlaku,
                    promotions.tanggal_expired,

                    products.nama_produk,

                    merchants.nama_bisnis

                FROM customer_vouchers

                JOIN customers
                ON customers.id =
                customer_vouchers.customer_id

                JOIN promotions
                ON promotions.id =
                customer_vouchers.promotion_id

                JOIN products
                ON products.id =
                promotions.product_id

                JOIN merchants
                ON merchants.id =
                products.merchant_id

                WHERE customer_vouchers.customer_id = $1

                ORDER BY customer_vouchers.id DESC
                `,
                [customerId]
            );

        return successResponse(
            res,
            "Berhasil mengambil voucher customer",
            vouchers.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// CLAIM VOUCHER
const claimVoucher = async (
    req,
    res
) => {

    try {

        const {
            customer_id,
            promotion_id,
        } = req.body;

        // validasi
        if (
            !customer_id ||
            !promotion_id
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
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

        // cek promotion
        const promotionCheck =
            await pool.query(
                `
                SELECT *
                FROM promotions
                WHERE id = $1
                AND is_delete = false
                `,
                [promotion_id]
            );

        if (
            promotionCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Promo tidak ditemukan"
            );
        }

        const promotion =
            promotionCheck.rows[0];

        // cek kuota
        if (
            promotion.kuota <= 0
        ) {

            return errorResponse(
                res,
                "Kuota promo habis"
            );
        }

        // cek tanggal promo
        const now =
            new Date();

        if (
            now <
            promotion.tanggal_berlaku
        ) {

            return errorResponse(
                res,
                "Promo belum berlaku"
            );
        }

        if (
            now >
            promotion.tanggal_expired
        ) {

            return errorResponse(
                res,
                "Promo sudah expired"
            );
        }

        // generate voucher code
        const voucherCode =
            generateVoucherCode();

        // insert voucher
        await pool.query(
            `
            INSERT INTO customer_vouchers (
                customer_id,
                promotion_id,
                voucher_code
            )
            VALUES ($1, $2, $3)
            `,
            [
                customer_id,
                promotion_id,
                voucherCode,
            ]
        );

        // kurangi kuota promo
        await pool.query(
            `
            UPDATE promotions
            SET kuota = kuota - 1
            WHERE id = $1
            `,
            [promotion_id]
        );

        return successResponse(
            res,
            "Voucher berhasil diklaim",
            {
                voucher_code:
                    voucherCode,
            }
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// CANCEL VOUCHER
const cancelVoucher = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        // cek voucher
        const voucherCheck =
            await pool.query(
                `
                SELECT *
                FROM customer_vouchers
                WHERE id = $1
                `,
                [id]
            );

        // voucher tidak ditemukan
        if (
            voucherCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Voucher tidak ditemukan"
            );
        }

        const voucher =
            voucherCheck.rows[0];

        // voucher sudah digunakan
        if (
            voucher.status === "USED"
        ) {

            return errorResponse(
                res,
                "Voucher sudah digunakan"
            );
        }

        // voucher sudah dibatalkan
        if (
            voucher.status === "CANCELLED"
        ) {

            return errorResponse(
                res,
                "Voucher sudah dibatalkan"
            );
        }

        // update status voucher
        await pool.query(
            `
            UPDATE customer_vouchers
            SET
                status = 'CANCELLED',
                updated_at = NOW()
            WHERE id = $1
            `,
            [id]
        );

        // kembalikan kuota promo
        await pool.query(
            `
            UPDATE promotions
            SET kuota = kuota + 1
            WHERE id = $1
            `,
            [voucher.promotion_id]
        );

        return successResponse(
            res,
            "Voucher berhasil dibatalkan"
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
    claimVoucher,
    getVouchersByCustomer,
    cancelVoucher,
};