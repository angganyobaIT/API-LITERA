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
    createRouteDetail,
    getAllRouteDetails,
    getRouteDetailById,
    getRouteDetailsByThematicRoute,
    deleteRouteDetail,

} = require(
    "../controllers/routeDetailController"
);

// CREATE
router.post(
    "/",
    createRouteDetail
);

// GET ALL
router.get(
    "/",
    getAllRouteDetails
);

// GET BY THEMATIC ROUTE
router.get(
    "/thematic-route/:id",
    getRouteDetailsByThematicRoute
);

// GET BY ID
router.get(
    "/:id",
    getRouteDetailById
);

// DELETE
router.delete(
    "/:id",
    deleteRouteDetail
);

/**
 * @swagger
 * /api/route-details:
 *   post:
 *     summary: Menambahkan route detail
 *     tags: [Route Details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchant_id
 *               - thematic_route_id
 *             properties:
 *               merchant_id:
 *                 type: integer
 *                 example: 1
 *               thematic_route_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Route detail berhasil ditambahkan
 */

/**
 * @swagger
 * /api/route-details:
 *   get:
 *     summary: Mengambil semua route detail
 *     tags: [Route Details]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil semua route detail
 */

/**
 * @swagger
 * /api/route-details/{id}:
 *   get:
 *     summary: Mengambil detail route berdasarkan id
 *     tags: [Route Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Route Detail
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail route
 */

/**
 * @swagger
 * /api/route-details/{id}:
 *   delete:
 *     summary: Menghapus route detail
 *     tags: [Route Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Route Detail
 *     responses:
 *       200:
 *         description: Route detail berhasil dihapus
 */

module.exports =
    router;