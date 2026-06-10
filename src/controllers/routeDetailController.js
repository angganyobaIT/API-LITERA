const pool =
    require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");


// CREATE ROUTE DETAIL
const createRouteDetail =
async (req, res) => {

    try {

        const {
            merchant_id,
            thematic_route_id,
        } = req.body;

        if (
            !merchant_id ||
            !thematic_route_id
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
            );
        }

        const result =
            await pool.query(
                `
                INSERT INTO route_details
                (
                    merchant_id,
                    thematic_route_id
                )
                VALUES ($1,$2)
                RETURNING *
                `,
                [
                    merchant_id,
                    thematic_route_id,
                ]
            );

        return successResponse(
            res,
            "Route detail berhasil ditambahkan",
            result.rows[0]
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};


// GET ALL ROUTE DETAILS
const getAllRouteDetails =
async (req, res) => {

    try {

        const result =
            await pool.query(
                `
                SELECT

                    rd.id,

                    rd.merchant_id,

                    rd.thematic_route_id,

                    m.nama_bisnis,

                    ml.latitude,

                    ml.longitude,

                    tr.judul_rute

                FROM route_details rd

                INNER JOIN merchants m
                    ON m.id =
                    rd.merchant_id

                INNER JOIN merchant_locations ml
                    ON ml.merchant_id =
                    m.id

                INNER JOIN thematic_routes tr
                    ON tr.id =
                    rd.thematic_route_id

                WHERE
                    ml.is_active = true

                ORDER BY
                    rd.id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil route detail",
            result.rows
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};


// GET ROUTE DETAIL BY ID
const getRouteDetailById =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const result =
            await pool.query(
                `
                SELECT

                    rd.id,

                    rd.merchant_id,

                    rd.thematic_route_id,

                    m.nama_bisnis,

                    ml.latitude,

                    ml.longitude,

                    tr.judul_rute

                FROM route_details rd

                INNER JOIN merchants m
                    ON m.id =
                    rd.merchant_id

                INNER JOIN merchant_locations ml
                    ON ml.merchant_id =
                    m.id

                INNER JOIN thematic_routes tr
                    ON tr.id =
                    rd.thematic_route_id

                WHERE
                    rd.id = $1
                    AND ml.is_active = true
                `,
                [id]
            );

        if (
            result.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Route detail tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail route",
            result.rows[0]
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};


// GET BY THEMATIC ROUTE
const getRouteDetailsByThematicRoute =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const result =
            await pool.query(
                `
                SELECT

                    rd.id,

                    rd.merchant_id,

                    m.nama_bisnis,

                    ml.latitude,

                    ml.longitude,

                    tr.judul_rute

                FROM route_details rd

                INNER JOIN merchants m
                    ON m.id =
                    rd.merchant_id

                INNER JOIN merchant_locations ml
                    ON ml.merchant_id =
                    m.id

                INNER JOIN thematic_routes tr
                    ON tr.id =
                    rd.thematic_route_id

                WHERE
                    rd.thematic_route_id = $1
                    AND ml.is_active = true

                ORDER BY
                    rd.id ASC
                `,
                [id]
            );

        return successResponse(
            res,
            "Berhasil mengambil merchant pada rute",
            result.rows
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};

// HARD DELETE ROUTE DETAIL
const deleteRouteDetail =
async (req, res) => {

    try {

        const { id } =
            req.params;

        const check =
            await pool.query(
                `
                SELECT *
                FROM route_details
                WHERE id = $1
                `,
                [id]
            );

        if (
            check.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Route detail tidak ditemukan"
            );
        }

        await pool.query(
            `
            DELETE FROM route_details
            WHERE id = $1
            `,
            [id]
        );

        return successResponse(
            res,
            "Route detail berhasil dihapus"
        );

    } catch (error) {

        return errorResponse(
            res,
            error.message
        );
    }
};

module.exports = {
    createRouteDetail,
    getAllRouteDetails,
    getRouteDetailById,
    getRouteDetailsByThematicRoute,
    deleteRouteDetail,
};