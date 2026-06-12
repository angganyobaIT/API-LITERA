const express = require("express");

const router = express.Router();

const verifyToken =
    require("../middleware/auth");

const {
    register,
    login,
    sendResetOtp,
    resetPassword,
    changePassword,
    updateBiometricStatus,
    } = require(
        "../controllers/authController"
    );

    router.post(
        "/register",
        register
    );

    router.post(
        "/login",
        login
    );

    // SEND OTP
    router.post(
        "/send-reset-otp",
        sendResetOtp
    );


    // RESET PASSWORD
    router.post(
        "/reset-password",
        resetPassword
    );

    router.put(
    "/change-password/:id",
    verifyToken,
    changePassword
);

router.put(
    "/biometric/:id",
    verifyToken,
    updateBiometricStatus
);

// REGISTER
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Auth]
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
 *               password:
 *                 type: string
 *               role:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Register berhasil
 */


// LOGIN
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 */

/**
 * @swagger
 * /api/auth/send-reset-otp:
 *   post:
 *     summary: Mengirim OTP reset password ke email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim ke email
 *       400:
 *         description: Email tidak ditemukan
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password menggunakan OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - new_password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               new_password:
 *                 type: string
 *                 example: passwordBaru123
 *     responses:
 *       200:
 *         description: Password berhasil direset
 *       400:
 *         description: OTP salah atau expired
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Mengubah password user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: passwordLama123
 *               new_password:
 *                 type: string
 *                 example: passwordBaru123
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 */

/**
 * @swagger
 * /api/auth/change-password/{id}:
 *   put:
 *     summary: Mengubah password user berdasarkan ID
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user yang akan diubah passwordnya
 *         schema:
 *           type: integer
 *           example: 34
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: passwordLama123
 *               new_password:
 *                 type: string
 *                 example: passwordBaru123
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 */
module.exports = router;