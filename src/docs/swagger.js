const swaggerJsdoc =
    require("swagger-jsdoc");

const swaggerUi =
    require("swagger-ui-express");

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title:
                "PBM Litera API",

            version:
                "1.0.0",

            description:
                "API documentation PBM Litera",
        },

            servers: [
            {
                url: process.env.API_URL,
            },
        ],

        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT",

                    description:
                        "Masukkan JWT Token dengan format: Bearer {token}",
                },
            },
        },

        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    apis: [
        "./src/routes/*.js",
    ],
};

const specs =
    swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};