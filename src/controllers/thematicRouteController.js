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

// GET ALL THEMATIC ROUTES
const getAllThematicRoutes =
    async (req, res) => {

    try {

        const routes =
            await pool.query(
                `
                SELECT
                    id,
                    judul_rute,
                    deskripsi,
                    image_url,
                    is_delete,
                    created_at,
                    updated_at
                FROM thematic_routes
                ORDER BY id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data rute thematic",
            routes.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// GET THEMATIC ROUTE BY ID
const getThematicRouteById =
    async (req, res) => {

    try {

        const { id } = req.params;

        const route =
            await pool.query(
                `
                SELECT
                    id,
                    judul_rute,
                    deskripsi,
                    image_url,
                    is_delete,
                    created_at,
                    updated_at
                FROM thematic_routes
                WHERE id = $1
                `,
                [id]
            );

        // route tidak ditemukan
        if (
            route.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Rute thematic tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail rute thematic",
            route.rows[0]
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// CREATE THEMATIC ROUTE
const createThematicRoute =
async (req, res) => {

    try {

        const {
            judul_rute,
            deskripsi,
        } = req.body;

        if (
            !judul_rute ||
            !deskripsi
        ) {

            return errorResponse(
                res,
                "Field wajib diisi"
            );
        }

        let imageUrl = null;

        if (req.file) {

            const result =
                await new Promise(
                    (
                        resolve,
                        reject
                    ) => {

                        const stream =
                            cloudinary.uploader.upload_stream(
                                {
                                    folder:
                                        "thematic_routes",
                                },
                                (
                                    error,
                                    result
                                ) => {

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

            imageUrl =
                result.secure_url;
        }

        await pool.query(
            `
            INSERT INTO thematic_routes (
                judul_rute,
                deskripsi,
                image_url
            )
            VALUES ($1, $2, $3)
            `,
            [
                judul_rute,
                deskripsi,
                imageUrl,
            ]
        );

        return successResponse(
            res,
            "Rute thematic berhasil ditambahkan"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// UPDATE THEMATIC ROUTE
const updateThematicRoute =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const {
            judul_rute,
            deskripsi,
        } = req.body;

        if (
            !judul_rute ||
            !deskripsi
        ) {

            return errorResponse(
                res,
                "Field wajib diisi"
            );
        }

        const routeCheck =
            await pool.query(
                `
                SELECT *
                FROM thematic_routes
                WHERE id = $1
                `,
                [id]
            );

        if (
            routeCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Rute thematic tidak ditemukan"
            );
        }

        let imageUrl =
            routeCheck.rows[0]
                .image_url;

        if (req.file) {

            const result =
                await new Promise(
                    (
                        resolve,
                        reject
                    ) => {

                        const stream =
                            cloudinary.uploader.upload_stream(
                                {
                                    folder:
                                        "thematic_routes",
                                },
                                (
                                    error,
                                    result
                                ) => {

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

            imageUrl =
                result.secure_url;
        }

        await pool.query(
            `
            UPDATE thematic_routes
            SET
                judul_rute = $1,
                deskripsi = $2,
                image_url = $3,
                updated_at = NOW()
            WHERE id = $4
            `,
            [
                judul_rute,
                deskripsi,
                imageUrl,
                id,
            ]
        );

        return successResponse(
            res,
            "Rute thematic berhasil diupdate"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// DELETE THEMATIC ROUTE
const deleteThematicRoute =
    async (req, res) => {

    try {

        const { id } = req.params;

        // cek route
        const routeCheck =
            await pool.query(
                `
                SELECT *
                FROM thematic_routes
                WHERE id = $1
                AND is_delete = false
                `,
                [id]
            );

        // route tidak ditemukan
        if (
            routeCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Rute thematic tidak ditemukan"
            );
        }

        if (
            routeCheck.rows[0].is_delete
        ) {

            return errorResponse(
                res,
                "Rute thematic sudah dihapus"
            );
        }

        // soft delete
        await pool.query(
            `
            UPDATE thematic_routes
            SET
                is_delete = true,
                updated_at = NOW()
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "Rute thematic berhasil dihapus"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// RESTORE THEMATIC ROUTE
const restoreThematicRoute =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const routeCheck =
            await pool.query(
                `
                SELECT *
                FROM thematic_routes
                WHERE id = $1
                `,
                [id]
            );

        if (
            routeCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Rute thematic tidak ditemukan"
            );
        }

        if (
            routeCheck.rows[0].is_delete === false
        ) {

            return errorResponse(
                res,
                "Rute thematic sudah aktif"
            );
        }

        await pool.query(
            `
            UPDATE thematic_routes
            SET
                is_delete = false,
                updated_at = NOW()
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "Rute thematic berhasil direstore"
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
    createThematicRoute,
    getAllThematicRoutes,
    getThematicRouteById,
    updateThematicRoute,
    deleteThematicRoute,
    restoreThematicRoute,
};