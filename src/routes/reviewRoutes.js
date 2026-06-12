const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(verifyToken);

const {
    createReview,
    getAllReviews,
    getReviewById,
    deleteReview,
    restoreReview,
} = require(
    "../controllers/reviewController"
);

const upload =
    require(
        "../middleware/uploadMiddleware"
    );

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Mengambil semua review
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       customer_id:
 *                         type: integer
 *                       rating:
 *                         type: integer
 *                       deskripsi:
 *                         type: string
 *                       image_url:
 *                         type: string
 *                         nullable: true
 *                       is_delete:
 *                         type: boolean
 *                       submitted_at:
 *                         type: string
 *                         format: date-time
 *                       customer_name:
 *                         type: string
 *                       nama_bisnis:
 *                         type: string
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Mengambil detail review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID review
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     customer_id:
 *                       type: integer
 *                     rating:
 *                       type: integer
 *                     deskripsi:
 *                       type: string
 *                     image_url:
 *                       type: string
 *                       nullable: true
 *                     is_delete:
 *                       type: boolean
 *                     submitted_at:
 *                       type: string
 *                       format: date-time
 *                     customer_name:
 *                       type: string
 *                     nama_bisnis:
 *                       type: string
 *       404:
 *         description: Review tidak ditemukan
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Membuat review merchant
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               merchant_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               deskripsi:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Review berhasil dibuat
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Soft delete review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review berhasil dihapus
 */

/**
 * @swagger
 * /api/reviews/restore/{id}:
 *   put:
 *     summary: Memulihkan review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review berhasil dipulihkan
 */

// GET ALL REVIEWS
router.get(
    "/",
    getAllReviews
);


// GET REVIEW BY ID
router.get(
    "/:id",
    getReviewById
);

// CREATE REVIEW
router.post(
    "/",
    upload.single("image"),
    createReview
);

// DELETE REVIEW
router.delete(
    "/:id",
    deleteReview
);

// RESTORE REVIEW
router.put(
    "/restore/:id",
    restoreReview
);

module.exports = router;