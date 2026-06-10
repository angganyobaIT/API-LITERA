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

// GET ALL PRODUCTS
const getAllProducts = async (
    req,
    res
) => {

    try {

        const products =
            await pool.query(
                `
                SELECT
                    products.id,
                    products.nama_produk,
                    products.harga_produk,
                    products.deskripsi,
                    products.image_url,
                    products.is_available,
                    products.created_at,
                    products.updated_at,
                    merchants.nama_bisnis,
                    category_products.id
                        AS category_id,
                    category_products.category_name

                FROM products

                JOIN merchants ON merchants.id = products.merchant_id
                JOIN category_products ON category_products.id = products.category_id
                ORDER BY products.id DESC
                `
            );

        return successResponse(
            res,
            "Berhasil mengambil data produk",
            products.rows
        );
    } catch (error) {
        console.log(error);
        return errorResponse(
            res,
            error.message
        );
    }
};

// GET PRODUCT BY ID
const getProductById = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const product =
            await pool.query(
                `
                SELECT
                    products.id,
                    products.nama_produk,
                    products.harga_produk,
                    products.deskripsi,
                    products.image_url,
                    products.is_available,
                    products.created_at,
                    products.updated_at,
                    merchants.nama_bisnis,
                    category_products.id
                        AS category_id,
                    category_products.category_name

                FROM products

                JOIN merchants ON merchants.id = products.merchant_id
                JOIN category_products ON category_products.id = products.category_id
                
                WHERE products.id = $1
                AND products.is_available = true
                `,
                [id]
            );

        // produk tidak ditemukan
        if (
            product.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Produk tidak ditemukan"
            );
        }

        return successResponse(
            res,
            "Berhasil mengambil detail produk",
            product.rows[0]
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// CREATE PRODUCT
const createProduct = async (
    req,
    res
) => {

    try {

        const {
            merchant_id,
            category_id,
            nama_produk,
            harga_produk,
            deskripsi,
        } = req.body;

        // validasi
        if (
            !merchant_id ||
            !category_id ||
            !nama_produk ||
            !harga_produk
        ) {

            return errorResponse(
                res,
                "Field wajib diisi"
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

        const categoryCheck =
            await pool.query(
                `
                SELECT *
                FROM category_products
                WHERE id = $1
                `,
                [category_id]
            );

        if (
            categoryCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Kategori produk tidak ditemukan"
            );
        }

        let imageUrl = null;

        // upload image jika ada
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
                                        "product_images",
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

        // insert product
        await pool.query(
        `
        INSERT INTO products (
            merchant_id,
            category_id,
            nama_produk,
            harga_produk,
            deskripsi,
            image_url
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
            merchant_id,
            category_id,
            nama_produk,
            harga_produk,
            deskripsi,
            imageUrl,
        ]
    );

        return successResponse(
            res,
            "Produk berhasil ditambahkan"
        );

    } catch (error) {

        console.log(error);

        return errorResponse(
            res,
            error.message
        );
    }
};

// UPDATE PRODUCT
const updateProduct = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const {
            category_id,
            nama_produk,
            harga_produk,
            deskripsi,
            is_available,
        } = req.body;

        // validasi
        if (
            !category_id ||
            !nama_produk ||
            !harga_produk ||
            is_available === undefined
        ) {

            return errorResponse(
                res,
                "Field wajib diisi"
            );
        }

        // cek product
        const productCheck =
            await pool.query(
                `
                SELECT *
                FROM products
                WHERE id = $1
                `,
                [id]
            );

        // product tidak ditemukan
        if (
            productCheck.rows.length === 0
        ) {

            return errorResponse(
                res,
                "Produk tidak ditemukan"
            );
        }

        let imageUrl =
            productCheck.rows[0]
                .image_url;

        // upload image baru
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
                                        "product_images",
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

        // update product
        await pool.query(
            `
            UPDATE products
            SET
                category_id = $1,
                nama_produk = $2,
                harga_produk = $3,
                deskripsi = $4,
                image_url = $5,
                is_available = $6,
                updated_at = NOW()
            WHERE id = $7
            `,
            [
                category_id,
                nama_produk,
                harga_produk,
                deskripsi,
                imageUrl,
                is_available,
                id,
            ]
        );

        return successResponse(
            res,
            "Produk berhasil diupdate"
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
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
};