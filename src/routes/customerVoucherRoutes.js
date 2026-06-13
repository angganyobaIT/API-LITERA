const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(verifyToken);

const {
    claimVoucher,
    getAllCustomerVouchers,
    getVouchersByCustomer,
    useVoucher,
} = require(
    "../controllers/customerVoucherController"
);

/**
 * @swagger
 * /api/customer-vouchers:
 *   get:
 *     summary: Mengambil semua voucher customer
 *     tags: [Customer Vouchers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua voucher customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       customer_id:
 *                         type: integer
 *                       promotion_id:
 *                         type: integer
 *                       voucher_code:
 *                         type: string
 *                       status:
 *                         type: string
 *                         example: ACTIVE
 *                       claimed_at:
 *                         type: string
 *                         format: date-time
 *                       used_at:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       customer_name:
 *                         type: string
 *                       tipe_promo:
 *                         type: string
 *                       diskon:
 *                         type: number
 *                       tanggal_berlaku:
 *                         type: string
 *                         format: date
 *                       tanggal_expired:
 *                         type: string
 *                         format: date
 *                       product_id:
 *                         type: integer
 *                       nama_produk:
 *                         type: string
 *                       merchant_id:
 *                         type: integer
 *                       nama_bisnis:
 *                         type: string
 */

/**
 * @swagger
 * /api/customer-vouchers/customer/{customerId}:
 *   get:
 *     summary: Mengambil voucher customer
 *     tags: [Customer Vouchers]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil voucher customer
 */

/**
 * @swagger
 * /api/customer-vouchers:
 *   post:
 *     summary: Claim voucher promo
 *     tags: [Customer Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               promotion_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Voucher berhasil diklaim
 */

/**
 * @swagger
 * /api/customer-vouchers/use/{id}:
 *   put:
 *     summary: Menggunakan voucher customer
 *     tags: [Customer Vouchers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID voucher
 *     responses:
 *       200:
 *         description: Voucher berhasil digunakan
 */


// GET ALL CUSTOMER VOUCHERS
router.get(
    "/",
    getAllCustomerVouchers
);

// GET VOUCHERS BY CUSTOMER
router.get(
    "/customer/:customerId",
    getVouchersByCustomer
);

// CLAIM VOUCHER
router.post(
    "/",
    claimVoucher
);

// USE VOUCHER
router.put(
    "/use/:id",
    useVoucher
);

module.exports = router;