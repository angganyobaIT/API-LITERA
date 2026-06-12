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
        getMerchantByUserId,
        updateMerchantInformation,
        updateMerchantStatus,
    } = require(
        "../controllers/merchantController"
    );

    const upload =
        require(
            "../middleware/uploadMiddleware"
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
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               nama_bisnis:
     *                 type: string
     *               tahun_berdiri:
     *                 type: integer
     *               deskripsi:
     *                 type: string
     *               image:
     *                 type: string
     *                 format: binary
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
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 enum:
     *                   - Buka
     *                   - Tutup
     *     responses:
     *       200:
     *         description: Status merchant berhasil diperbarui
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
        upload.single("image"),
        updateMerchantInformation
    );

    // UPDATE STATUS
    router.put(
        "/:id/status",
        updateMerchantStatus
    );

    module.exports =
        router;