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

    getAllMerchants,
    getMerchantById,

} = require(
    "../controllers/merchantController"
);


/**
 * @swagger
 * /api/merchants:
 *   get:
 *     summary: Mengambil semua merchant
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua merchant
 */

/**
 * @swagger
 * /api/merchants/{id}:
 *   get:
 *     summary: Mengambil detail merchant berdasarkan id
 *     tags: [Merchants]
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
 *         description: Berhasil mengambil detail merchant
 */


// GET ALL
router.get(
    "/",
    getAllMerchants
);

// GET BY ID
router.get(
    "/:id",
    getMerchantById
);

module.exports =
    router;