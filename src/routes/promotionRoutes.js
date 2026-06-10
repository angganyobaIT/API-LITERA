const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(verifyToken);

const {
    createPromotion,
    getAllPromotions,
    getPromotionById,
    getPromotionsByProduct,
    updatePromotion,
    deletePromotion,
} = require(
    "../controllers/promotionController"
);


/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Mengambil semua promo
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data promo
 */

/**
 * @swagger
 * /api/promotions/{id}:
 *   get:
 *     summary: Mengambil detail promo
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail promo
 */

/**
 * @swagger
 * /api/promotions/product/{productId}:
 *   get:
 *     summary: Mengambil promo berdasarkan produk
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil promo produk
 */

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Menambahkan promo produk
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               tipe_promo:
 *                 type: string
 *               diskon:
 *                 type: integer
 *               kuota:
 *                 type: integer
 *               tanggal_berlaku:
 *                 type: string
 *               tanggal_expired:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promo berhasil ditambahkan
 */

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Mengubah promo
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipe_promo:
 *                 type: string
 *               diskon:
 *                 type: integer
 *               kuota:
 *                 type: integer
 *               tanggal_berlaku:
 *                 type: string
 *               tanggal_expired:
 *                 type: string
 *     responses:
 *       200:
 *         description: Promo berhasil diupdate
 */

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Soft delete promo
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promo berhasil dihapus
 */

// GET ALL
router.get("/", getAllPromotions);

// GET BY PRODUCT
router.get(
    "/product/:productId",
    getPromotionsByProduct
);

// GET BY ID
router.get(
    "/:id",
    getPromotionById
);

// CREATE PROMOTION
router.post(
    "/",
    createPromotion
);

// UPDATE PROMOTION
router.put(
    "/:id",
    updatePromotion
);

// DELETE PROMOTION
router.delete(
    "/:id",
    deletePromotion
);

module.exports = router;