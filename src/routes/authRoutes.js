const express = require("express");

const router = express.Router();

const {
    register,
    login,
    sendResetOtp,
    resetPassword,
    } = require(
        "../controllers/authController"
    );

router.get(
    "/test",
    (req, res) => {

        console.log(
            "TEST ROUTE HIT"
        );

        return res.json({
            success: true,
            message: "Auth route berjalan"
        });
    }
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

module.exports = router;