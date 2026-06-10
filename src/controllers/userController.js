const pool =
    require("../config/db");

const cloudinary =
    require("../config/cloudinary");

const streamifier =
    require("streamifier");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");


// GET ALL USERS
const getAllUsers = async (
    req,
    res
) => {

    try {

        const users =
            await pool.query(
                `
                SELECT
                    users.id,
                    users.username,
                    users.email,
                    users.role,
                    users.profile_picture,
                    users.is_active,
                    users.created_at,

                    customers.name,

                    merchants.nama_bisnis

                FROM users

                LEFT JOIN customers
                ON customers.user_id = users.id

                LEFT JOIN merchants
                ON merchants.user_id = users.id

                ORDER BY users.id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data user",
            users.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};


// GET USER BY ID
const getUserById = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const user =
            await pool.query(
                `
                SELECT
                    users.id,
                    users.username,
                    users.email,
                    users.role,
                    users.profile_picture,
                    users.is_active,
                    users.created_at,

                    customers.name,

                    merchants.nama_bisnis,
                    merchants.tahun_berdiri,
                    merchants.deskripsi

                FROM users

                LEFT JOIN customers
                ON customers.user_id = users.id

                LEFT JOIN merchants
                ON merchants.user_id = users.id

                WHERE users.id = $1
                `,
                [id]
            );

        // user tidak ditemukan
        if (
            user.rows.length === 0
        ) {

            return errorResponse(
                res,
                "User tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail user",
            user.rows[0]
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// UPDATE PROFILE
const updateUser = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const {
            username,
            email,
            role,
        } = req.body;

        // validasi
        if (
            !username ||
            !email ||
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

        // cek user
        const userCheck =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE id = $1
                `,
                [id]
            );

        if (
            userCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "User tidak ditemukan"
            );
        }

        // cek username duplicate
        const usernameCheck =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE username = $1
                AND id != $2
                `,
                [username, id]
            );

        if (
            usernameCheck.rows.length > 0
        ) {

            return errorResponse(
                res,
                "Username sudah digunakan"
            );
        }

        // cek email duplicate
        const emailCheck =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE email = $1
                AND id != $2
                `,
                [email, id]
            );

        if (
            emailCheck.rows.length > 0
        ) {

            return errorResponse(
                res,
                "Email sudah digunakan"
            );
        }

        // update user
        await pool.query(
            `
            UPDATE users
            SET
                username = $1,
                email = $2,
                role = $3
            WHERE id = $4
            `,
            [
                username,
                email,
                role,
                id,
            ]
        );

        return successResponse(
            res,
            "Profile berhasil diupdate"
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};

const updateProfile = async (req, res) => {

    try {

        const { id } = req.params;

        const { name } = req.body;

        const userCheck =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE id = $1
                `,
                [id]
            );

        if (userCheck.rows.length === 0) {

            return errorResponse(
                res,
                "User tidak ditemukan"
            );
        }

        const user =
            userCheck.rows[0];

        let profilePicture =
            user.profile_picture;

        // upload foto jika ada
        if (req.file) {

            const result =
                await new Promise(
                    (resolve, reject) => {

                        const stream =
                            cloudinary.uploader.upload_stream(
                                {
                                    folder:
                                        "profile_picture",
                                },
                                (error, result) => {

                                    if (error)
                                        reject(error);

                                    else
                                        resolve(result);
                                }
                            );

                        streamifier
                            .createReadStream(
                                req.file.buffer
                            )
                            .pipe(stream);
                    }
                );

            profilePicture =
                result.secure_url;
        }

        // update foto
        await pool.query(
            `
            UPDATE users
            SET profile_picture = $1
            WHERE id = $2
            `,
            [
                profilePicture,
                id,
            ]
        );

        // update nama customer
        if (
            user.role === 2 &&
            name
        ) {

            await pool.query(
                `
                UPDATE customers
                SET
                    name = $1,
                    updated_at = NOW()
                WHERE user_id = $2
                `,
                [
                    name,
                    id,
                ]
            );
        }

        return successResponse(
            res,
            "Profile berhasil diupdate",
            {
                profile_picture:
                    profilePicture,
            }
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};

// SOFT DELETE USER
const deleteUser = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        // cek user
        const userCheck =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE id = $1
                AND is_active = true
                `,
                [id]
            );

        // user tidak ditemukan
        if (
            userCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "User tidak ditemukan"
            );
        }

        // soft delete
        await pool.query(
            `
            UPDATE users
            SET is_active = false
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "User berhasil dihapus"
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};

// RESTORE USER
const restoreUser = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        // cek user
        const userCheck =
            await pool.query(
                `
                SELECT *
                FROM users
                WHERE id = $1
                AND is_active = false
                `,
                [id]
            );

        // user tidak ditemukan
        if (
            userCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "User tidak ditemukan atau sudah aktif"
            );
        }

        // restore user
        await pool.query(
            `
            UPDATE users
            SET is_active = true
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "User berhasil diaktifkan kembali"
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
    getAllUsers,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser,
    restoreUser,
};