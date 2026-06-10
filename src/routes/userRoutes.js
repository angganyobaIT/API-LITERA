const express =
    require("express");

const router =
    express.Router();

const verifyToken =
    require("../middleware/auth");

router.use(verifyToken);

const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    uploadProfilePicture,
} = require(
    "../controllers/userController"
);

const upload =
    require(
        "../middleware/uploadMiddleware"
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

// UPDATE USER
router.put(
    "/:id",
    updateUser
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

// UPLOAD PROFILE PICTURE
router.put(
    "/upload-profile/:id",
    upload.single("profile_picture"),
    uploadProfilePicture
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
 *         description: ID user
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail user
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
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: integer
 *                     is_active:
 *                        type: boolean
 *                     created_at:
 *                       type: string
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

/**
 * @swagger
 * /api/users/upload-profile/{id}:
 *   put:
 *     summary: Upload foto profile user
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto profile berhasil diupload
 */

module.exports = router;