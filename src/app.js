const dns =
    require("dns");

dns.setDefaultResultOrder(
    "ipv4first"
);

require("dotenv").config();

const express = require("express");

const cors = require("cors");

const authRoutes =
    require("./routes/authRoutes");

const {
    swaggerUi,
    specs,
} = require("./docs/swagger");

const app = express();
const userRoutes =
    require("./routes/userRoutes");
const reviewRoutes =
    require("./routes/reviewRoutes");

const merchantLocationRoutes =
    require(
        "./routes/merchantLocationRoutes"
    );

const productRoutes =
    require("./routes/productRoutes");

const promotionRoutes =
    require(
        "./routes/promotionRoutes"
    );

const customerVoucherRoutes =
    require(
        "./routes/customerVoucherRoutes"
    );

const thematicRouteRoutes =
    require(
        "./routes/thematicRouteRoutes"
    );

const routeDetailRoutes =
    require(
        "./routes/routeDetailRoutes"
    );

const customerRoutes =
    require("./routes/customerRoutes");

const merchantRoutes =
    require("./routes/merchantRoutes");

const categoryProductRoutes =
    require(
        "./routes/categoryProductRoutes"
    );
const transporter =
    require("./config/mail");

app.use(cors());

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "API Litera running"
    });
});

// swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);


// routes
app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/reviews",
    reviewRoutes
);

app.use(
    "/api/merchant-locations",
    merchantLocationRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/promotions",
    promotionRoutes
);

app.use(
    "/api/customer-vouchers",
    customerVoucherRoutes
);

app.use(
    "/api/thematic-routes",
    thematicRouteRoutes
);

app.use(
    "/api/route-details",
    routeDetailRoutes
);


app.use(
    "/api/customers",
    customerRoutes
);

app.use(
    "/api/merchants",
    merchantRoutes
);

app.use(
    "/api/category-products",
    categoryProductRoutes
);

app.get("/smtp-test", async (req, res) => {

    console.log("===== SMTP TEST =====");

    console.log(
        "BREVO_USER:",
        process.env.BREVO_USER
    );

    console.log(
        "BREVO_SMTP_KEY EXISTS:",
        !!process.env.BREVO_SMTP_KEY
    );

    try {

        const result =
            await Promise.race([

                transporter.verify(),

                new Promise(
                    (_, reject) =>
                        setTimeout(
                            () =>
                                reject(
                                    new Error(
                                        "VERIFY TIMEOUT 10 DETIK"
                                    )
                                ),
                            10000
                        )
                ),
            ]);

        return res.json({
            success: true,
            result,
        });

    } catch (err) {

        console.error(err);

        return res.json({
            success: false,
            error: err.message,
        });
    }
});

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "PBM Litera API is running",
        docs: "/api-docs"
    });
});

module.exports = app;