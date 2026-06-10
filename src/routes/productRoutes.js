const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(verifyToken);

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} = require(
    "../controllers/productController"
);

const upload =
    require(
        "../middleware/uploadMiddleware"
    );


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Mengambil semua produk
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data produk
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Mengambil detail produk
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail produk
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Menambahkan produk merchant
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - merchant_id
 *               - category_id
 *               - nama_produk
 *               - harga_produk
 *             properties:
 *               merchant_id:
 *                 type: integer
 *                 example: 1
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               nama_produk:
 *                 type: string
 *                 example: Nasi Goreng Spesial
 *               harga_produk:
 *                 type: integer
 *                 example: 25000
 *               deskripsi:
 *                 type: string
 *                 example: Nasi goreng dengan telur dan ayam
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produk berhasil ditambahkan
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Mengubah produk
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - nama_produk
 *               - harga_produk
 *               - is_available
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               nama_produk:
 *                 type: string
 *                 example: Nasi Goreng Spesial
 *               harga_produk:
 *                 type: integer
 *                 example: 25000
 *               deskripsi:
 *                 type: string
 *                 example: Nasi goreng dengan telur dan ayam
 *               is_available:
 *                 type: boolean
 *                 example: true
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
 */

// GET ALL PRODUCTS
router.get(
    "/",
    getAllProducts
);


// GET PRODUCT BY ID
router.get(
    "/:id",
    getProductById
);

// CREATE PRODUCT
router.post(
    "/",
    upload.single("image"),
    createProduct
);

// UPDATE PRODUCT
router.put(
    "/:id",
    upload.single("image"),
    updateProduct
);

module.exports = router;