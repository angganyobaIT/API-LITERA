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

router.use(verifyToken);

const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
} = require(
    "../controllers/userController"
);

// GET ALL USERS
router.get(
    "/",
    getAllUsers
);

// GET USER BY ID
router.get(
    "/:id",
    getUserById
);

// UPDATE USER (ADMIN)
router.put(
    "/:id",
    updateUser
);

// UPDATE PROFILE + FOTO
router.put(
    "/profile/:id",
    upload.single(
        "profile_picture"
    ),
    updateProfile
);

// DELETE USER
router.delete(
    "/:id",
    deleteUser
);

// RESTORE USER
router.put(
    "/restore/:id",
    restoreUser
);


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Mengambil semua data user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
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
 *                       username:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: integer
 *                       is_active:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 */

/**
 * @swagger
 * /api/users/profile/{id}:
 *   put:
 *     summary: Update profile customer/merchant dan foto profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama customer
 *               nama_bisnis:
 *                 type: string
 *                 description: Nama bisnis merchant
 *               deskripsi:
 *                 type: string
 *                 description: Deskripsi merchant
 *               tahun_berdiri:
 *                 type: integer
 *                 description: Tahun berdiri merchant
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile berhasil diupdate
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update profile user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Profile berhasil diupdate
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Soft delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 */

/**
 * @swagger
 * /api/users/restore/{id}:
 *   put:
 *     summary: Mengaktifkan kembali user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user
 *     responses:
 *       200:
 *         description: User berhasil diaktifkan kembali
 */

module.exports = router;