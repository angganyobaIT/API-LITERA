const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter =
    require("../config/mail");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");


// REGISTER
const register = async (req, res) => {

    try {

        const {
            username,
            name,
            email,
            password,
            role,
        } = req.body;

        // validasi
        if (
            !username ||
            !name ||
            !email ||
            !password ||
            role === undefined
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
            );
        }

        // validasi role
        if (![1, 2].includes(role)) {

            return errorResponse(
                res,
                "Role tidak valid"
            );
        }

        // cek email
        const checkEmail =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE email = $1
                `,
                [email]
            );

        if (
            checkEmail.rows.length > 0
        ) {

            return errorResponse(
                res,
                "Email sudah digunakan"
            );
        }

        // cek username
        const checkUsername =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE username = $1
                `,
                [username]
            );

        if (
            checkUsername.rows.length > 0
        ) {

            return errorResponse(
                res,
                "Username sudah digunakan"
            );
        }

        // hash password
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // insert users
        const newUser =
            await pool.query(
                `
                INSERT INTO users (
                    username,
                    email,
                    password,
                    role
                )
                VALUES ($1, $2, $3, $4)
                RETURNING id
                `,
                [
                    username,
                    email,
                    hashedPassword,
                    role,
                ]
            );

        // ambil user id
        const userId =
            newUser.rows[0].id;

        // jika customer
        if (role === 2) {

            await pool.query(
                `
                INSERT INTO customers (
                    user_id,
                    name
                )
                VALUES ($1, $2)
                `,
                [
                    userId,
                    name,
                ]
            );
        }

        // jika merchant
        if (role === 1) {

            await pool.query(
                `
                INSERT INTO merchants (
                    user_id,
                    nama_bisnis
                )
                VALUES ($1, $2)
                `,
                [
                    userId,
                    name,
                ]
            );
        }

        return successResponse(
            res,
            "Register berhasil"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};


const login = async (req, res) => {

    try {

        const {
            username,
            password,
        } = req.body;

        // validasi
        if (!username || !password){

            return errorResponse(
                res,
                "Username dan password wajib diisi"
            );
        }

        // cek user
        const userResult =
            await pool.query(
                "SELECT * FROM users WHERE username = $1",
                [username]
            );

        // user tidak ditemukan
        if (userResult.rows.length === 0) {

            return errorResponse(
                res,
                "Username tidak ditemukan"
            );
        }

        const user =
            userResult.rows[0];

        // cek password
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return errorResponse(
                res,
                "Password salah"
            );
        }

        // generate token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return successResponse(
            res,
            "Login berhasil",
            {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};

// SEND OTP RESET PASSWORD
const sendResetOtp = async (
    req,
    res
) => {

    try {

        const { email } = req.body;

        console.log(
            "================================"
        );

        console.log(
            "REQUEST OTP MASUK"
        );

        console.log(
            "EMAIL:",
            email
        );

        // validasi
        if (!email) {

            return errorResponse(
                res,
                "Email wajib diisi"
            );
        }

        // cek user
        const user =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE email = $1
                `,
                [email]
            );

        if (
            user.rows.length === 0
        ) {

            console.log(
                "EMAIL TIDAK DITEMUKAN"
            );

            return errorResponse(
                res,
                "Email tidak ditemukan"
            );
        }

        console.log(
            "USER DITEMUKAN"
        );

        // generate otp
        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();

        const expiredAt =
            new Date(
                Date.now() +
                5 * 60 * 1000
            );

        console.log(
            "OTP:",
            otp
        );

        // simpan otp
        await pool.query(
            `
            UPDATE users
            SET
                otp_code = $1,
                otp_expired_at = $2
            WHERE email = $3
            `,
            [
                otp,
                expiredAt,
                email,
            ]
        );

        console.log(
            "OTP BERHASIL DISIMPAN KE DATABASE"
        );

        console.log(
            "BREVO USER:",
            process.env.BREVO_USER
        );

        console.log(
            "MAIL FROM:",
            process.env.MAIL_FROM
        );

        console.log(
            "MULAI VERIFY SMTP"
        );

        await transporter.verify();

        console.log(
            "SMTP VERIFIED"
        );

        console.log(
            "MULAI SEND EMAIL"
        );

        const info =
            await Promise.race([

                transporter.sendMail({

                    from:
                        `"Litera Support" <${process.env.MAIL_FROM}>`,

                    to: email,

                    subject:
                        "Reset Password OTP",

                    html: `
                        <div style="font-family: Arial, sans-serif">

                            <h2>
                                Reset Password
                            </h2>

                            <p>
                                Gunakan kode OTP berikut
                                untuk melakukan reset password:
                            </p>

                            <div style="
                                background:#f4f4f4;
                                padding:20px;
                                text-align:center;
                                border-radius:8px;
                            ">
                                <h1>
                                    ${otp}
                                </h1>
                            </div>

                            <p>
                                OTP berlaku selama
                                <b>5 menit</b>.
                            </p>

                            <p>
                                Abaikan email ini jika
                                Anda tidak meminta reset password.
                            </p>

                        </div>
                    `,
                }),

                new Promise(
                    (_, reject) =>
                        setTimeout(
                            () =>
                                reject(
                                    new Error(
                                        "SMTP Timeout (10 detik)"
                                    )
                                ),
                            10000
                        )
                )
            ]);

        console.log(
            "EMAIL BERHASIL DIKIRIM"
        );

        console.log(
            "MESSAGE ID:",
            info.messageId
        );

        console.log(
            "RESPONSE:",
            info.response
        );

        console.log(
            "================================"
        );

        return successResponse(
            res,
            "OTP berhasil dikirim ke email"
        );

    } catch (error) {

        console.log(
            "================================"
        );

        console.log(
            "ERROR OTP"
        );

        console.log(error);

        console.log(
            "================================"
        );

        return errorResponse(
            res,
            error.message
        );
    }
};

// RESET PASSWORD
const resetPassword = async (
    req,
    res
) => {

    try {

        const {
            email,
            otp,
            new_password,
        } = req.body;

        // validasi
        if (
            !email ||
            !otp ||
            !new_password
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
            );
        }

        // cek user
        const user =
            await pool.query(
                `
                SELECT * FROM users
                WHERE email = $1
                `,
                [email]
            );

        if (
            user.rows.length === 0
        ) {

            return errorResponse(
                res,
                "User tidak ditemukan"
            );
        }

        const userData =
            user.rows[0];

        // cek otp
        if (
            userData.otp_code !== otp
        ) {

            return errorResponse(
                res,
                "OTP salah"
            );
        }

        // cek expired
        if (
            new Date() >
            userData.otp_expired_at
        ) {

            return errorResponse(
                res,
                "OTP expired"
            );
        }

        // hash password baru
        const hashedPassword =
            await bcrypt.hash(
                new_password,
                10
            );

        // update password
        await pool.query(
            `
            UPDATE users
            SET
                password = $1,
                otp_code = NULL,
                otp_expired_at = NULL
            WHERE email = $2
            `,
            [
                hashedPassword,
                email,
            ]
        );

        return successResponse(
            res,
            "Password berhasil direset"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

module.exports = {
    register,
    login,
    sendResetOtp,
    resetPassword,
};