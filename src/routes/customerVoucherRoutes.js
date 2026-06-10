const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(verifyToken);

const {
    claimVoucher,
    getVouchersByCustomer,
    cancelVoucher,
} = require(
    "../controllers/customerVoucherController"
);

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
 * /api/customer-vouchers/cancel/{id}:
 *   put:
 *     summary: Membatalkan voucher customer
 *     tags: [Customer Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voucher berhasil dibatalkan
 */

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

// CANCEL VOUCHER
router.put(
    "/cancel/:id",
    cancelVoucher
);

module.exports = router;