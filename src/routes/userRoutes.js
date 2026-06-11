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
    updateProfile,
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
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Mengambil detail user berdasarkan id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail user
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update data user (Admin)
 *     tags: [Users]
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User berhasil diupdate
 */

/**
 * @swagger
 * /api/users/profile/{id}:
 *   put:
 *     summary: Update profile customer dan foto profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *                 description: Foto profile
 *     responses:
 *       200:
 *         description: Profile berhasil diupdate
 *       404:
 *         description: User tidak ditemukan
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
 *     responses:
 *       200:
 *         description: User berhasil diaktifkan kembali
 */

module.exports = router;