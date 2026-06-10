require("dotenv").config();

const app = require("./src/app");

const pool =
    require("./src/config/db");

const PORT =
    process.env.PORT || 3000;


// test database
pool.connect((err, client, release) => {

    if (err) {

        return console.log(
            "Database gagal connect",
            err.message
        );
    }

    console.log("Database connected");

    release();
});


app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server running on port ${PORT}`
    );
});