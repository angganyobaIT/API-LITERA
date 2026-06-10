const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(verifyToken);

const {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
} = require(
    "../controllers/merchantLocationController"
);

/**
 * @swagger
 * /api/merchant-locations:
 *   get:
 *     summary: Mengambil semua lokasi merchant
 *     tags: [Merchant Locations]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data lokasi merchant
 */

/**
 * @swagger
 * /api/merchant-locations/{id}:
 *   get:
 *     summary: Mengambil detail lokasi merchant
 *     tags: [Merchant Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail lokasi merchant
 */

/**
 * @swagger
 * /api/merchant-locations:
 *   post:
 *     summary: Menambahkan lokasi merchant
 *     tags: [Merchant Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: integer
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               alamat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lokasi merchant berhasil ditambahkan
 */

/**
 * @swagger
 * /api/merchant-locations/{id}:
 *   put:
 *     summary: Mengubah lokasi merchant
 *     tags: [Merchant Locations]
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
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               alamat:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lokasi merchant berhasil diupdate
 */

// GET ALL LOCATIONS
router.get(
    "/",
    getAllLocations
);


// GET LOCATION BY ID
router.get(
    "/:id",
    getLocationById
);

// CREATE LOCATION
router.post(
    "/",
    createLocation
);

// UPDATE LOCATION
router.put(
    "/:id",
    updateLocation
);

module.exports = router;