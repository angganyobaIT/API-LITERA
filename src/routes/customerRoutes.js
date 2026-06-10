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

    getAllCustomers,
    getCustomerById,

} = require(
    "../controllers/customerController"
);


/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Mengambil semua customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua customer
 */

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Mengambil detail customer berdasarkan id
 *     tags: [Customers]
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
 *         description: Berhasil mengambil detail customer
 */


// GET ALL
router.get(
    "/",
    getAllCustomers
);

// GET BY ID
router.get(
    "/:id",
    getCustomerById
);

module.exports =
    router;