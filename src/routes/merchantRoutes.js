const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

const upload =
    require(
        "../middleware/uploadMiddleware"
    );

router.use(
    verifyToken
);

const {
    getAllMerchants,
    getMerchantById,
    getMerchantByUserId,
    updateMerchantInformation,
    updateMerchantStatus,
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

/**
 * @swagger
 * /api/merchants/user/{user_id}:
 *   get:
 *     summary: Mengambil merchant berdasarkan user id
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil data merchant
 */

/**
 * @swagger
 * /api/merchants/{id}/information:
 *   put:
 *     summary: Update informasi bisnis merchant
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID merchant
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *
 *               nama_bisnis:
 *                 type: string
 *                 example: Kedai Kopi Litera
 *
 *               usaha_didirikan:
 *                 type: string
 *                 format: date
 *                 example: 2023-10-19
 *
 *               jam_buka:
 *                 type: string
 *                 example: "08:00"
 *
 *               jam_tutup:
 *                 type: string
 *                 example: "22:00"
 *
 *               deskripsi:
 *                 type: string
 *                 example: Tempat nongkrong nyaman dan menyediakan kopi lokal.
 *
 *               image_url:
 *                 type: string
 *                 format: binary
 *                 description: Foto utama merchant
 *
 *               image_qr:
 *                 type: string
 *                 format: binary
 *                 description: QRIS pembayaran merchant
 *
 *     responses:
 *       200:
 *         description: Informasi bisnis berhasil diperbarui
 */

/**
 * @swagger
 * /api/merchants/{id}/status:
 *   put:
 *     summary: Update status merchant
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID merchant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - Buka
 *                   - Tutup
 *                 example: Buka
 *     responses:
 *       200:
 *         description: Status merchant berhasil diperbarui
 *       400:
 *         description: Status tidak valid
 *       404:
 *         description: Merchant tidak ditemukan
 */


    // GET ALL
    router.get(
        "/",
        getAllMerchants
    );

    // GET BY USER ID
    router.get(
        "/user/:user_id",
        getMerchantByUserId
    );

    // GET BY ID
    router.get(
        "/:id",
        getMerchantById
    );

    // UPDATE INFORMASI BISNIS
    router.put(
        "/:id/information",

        upload.fields([
            {
                name: "image_url",
                maxCount: 1,
            },
            {
                name: "image_qr",
                maxCount: 1,
            },
        ]),

        updateMerchantInformation
    );

    // UPDATE STATUS
    router.put(
        "/:id/status",
        updateMerchantStatus
    );


    module.exports =
        router;