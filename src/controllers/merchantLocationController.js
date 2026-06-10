const pool =
    require("../config/db");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");

// GET ALL LOCATIONS
const getAllLocations = async (
    req,
    res
) => {

    try {

        const locations =
            await pool.query(
                `
                SELECT

                    merchant_locations.id,
                    merchant_locations.latitude,
                    merchant_locations.longitude,
                    merchant_locations.alamat,
                    merchant_locations.is_active,
                    merchant_locations.created_at,
                    merchant_locations.updated_at,

                    merchants.nama_bisnis

                FROM merchant_locations

                JOIN merchants
                ON merchants.id =
                merchant_locations.merchant_id

                WHERE merchant_locations.is_active = true

                ORDER BY merchant_locations.id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data lokasi merchant",
            locations.rows
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// GET LOCATION BY ID
const getLocationById = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const location =
            await pool.query(
                `
                SELECT

                    merchant_locations.id,
                    merchant_locations.latitude,
                    merchant_locations.longitude,
                    merchant_locations.alamat,
                    merchant_locations.is_active,
                    merchant_locations.created_at,
                    merchant_locations.updated_at,

                    merchants.nama_bisnis

                FROM merchant_locations

                JOIN merchants
                ON merchants.id =
                merchant_locations.merchant_id

                WHERE merchant_locations.id = $1
                AND merchant_locations.is_active = true
                `,
                [id]
            );

        // lokasi tidak ditemukan
        if (
            location.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Lokasi merchant tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail lokasi merchant",
            location.rows[0]
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// CREATE LOCATION
const createLocation = async (
    req,
    res
) => {

    try {

        const {
            merchant_id,
            latitude,
            longitude,
            alamat,
        } = req.body;

        // validasi
        if (
            !merchant_id ||
            latitude === undefined ||
            longitude === undefined ||
            !alamat
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
            );
        }

        // cek merchant
        const merchantCheck =
            await pool.query(
                `
                SELECT *
                FROM merchants
                WHERE id = $1
                `,
                [merchant_id]
            );

        // merchant tidak ditemukan
        if (
            merchantCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Merchant tidak ditemukan"
            );
        }

        // insert location
        await pool.query(
            `
            INSERT INTO merchant_locations (
                merchant_id,
                latitude,
                longitude,
                alamat
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                merchant_id,
                latitude,
                longitude,
                alamat,
            ]
        );

        return successResponse(
            res,
            "Lokasi merchant berhasil ditambahkan"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// UPDATE LOCATION
const updateLocation = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const {
            latitude,
            longitude,
            alamat,
            is_active,
        } = req.body;

        // validasi
        if (
            latitude === undefined ||
            longitude === undefined ||
            !alamat ||
            is_active === undefined
        ) {

            return errorResponse(
                res,
                "Semua field wajib diisi"
            );
        }

        // cek lokasi
        const locationCheck =
            await pool.query(
                `
                SELECT *
                FROM merchant_locations
                WHERE id = $1
                `,
                [id]
            );

        // lokasi tidak ditemukan
        if (
            locationCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Lokasi merchant tidak ditemukan"
            );
        }

        // update lokasi
        await pool.query(
            `
            UPDATE merchant_locations
            SET
                latitude = $1,
                longitude = $2,
                alamat = $3,
                is_active = $4,
                updated_at = NOW()
            WHERE id = $5
            `,
            [
                latitude,
                longitude,
                alamat,
                is_active,
                id,
            ]
        );

        return successResponse(
            res,
            "Lokasi merchant berhasil diupdate"
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
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocation,
};