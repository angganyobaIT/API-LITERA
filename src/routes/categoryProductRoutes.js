const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(
    verifyToken
);

const {

    getAllCategoryProducts,

    getCategoryProductById,

} = require(
    "../controllers/categoryProductController"
);

// GET ALL
router.get(
    "/",
    getAllCategoryProducts
);


// GET BY ID
router.get(
    "/:id",
    getCategoryProductById
);


/**
 * @swagger
 * /api/category-products:
 *   get:
 *     summary: Mengambil semua kategori produk
 *     tags: [Category Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua kategori produk
 */

/**
 * @swagger
 * /api/category-products/{id}:
 *   get:
 *     summary: Mengambil detail kategori produk
 *     tags: [Category Products]
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
 *         description: Berhasil mengambil detail kategori produk
 */

module.exports =
    router;