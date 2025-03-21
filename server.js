const dotenv = require("dotenv");
const express = require("express");
const mysql = require("mysql2"); 
const nunjucks = require("nunjucks");

dotenv.config();
let PORT = process.env.PORT || 5000;

const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const env = nunjucks.configure(__dirname, {
    autoescape: true,
    express: app,
});


const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "scuola",
});

app.get("/loadDB/:table", (req, res) => {
    const table = req.params.table;

    pool.getConnection((err, conn) => {
        if (err) throw err;

        conn.query(`SELECT * FROM ${table}`,
        (error, results, fields) => {
            console.log(results);
            res.status(200).send(JSON.stringify(results));

            conn.release();
            if (error) throw error;
        })
    })
});

app.get("/insert", (req, res) => {
    res.status(200).sendFile(__dirname + "/insert_form.html");
});
app.get("/delete", (req, res) => {
    res.status(200).sendFile(__dirname + "/delete_request.html");
});

app.post("/updateDB", (req, res) => {
    const data = req.body;
    const {CF, Nome, Cognome, Età, Telefono, IDClasse} = data;

    pool.getConnection((err, conn) => {
        if (err) throw err;
        
        conn.query(`INSERT INTO studente VALUES('${CF}', '${Nome}', '${Cognome}', ${Età}, '${Telefono}', ${IDClasse})`,
        (error, results, fields) => {
            conn.release();
            if (error) throw error;
        })
    })
    res.status(200).redirect("/");
})
app.post("/deleteFromDB", (req, res) => {
    const data = req.body;
    console.log(data);

    pool.getConnection((err, conn) => {
        if (err) throw err;
        
        conn.query(`DELETE FROM studente WHERE CF = '${data.CF}'`,
        (error, results, fields) => {
            conn.release();
            if (error) throw error;
        })
    })
    res.status(200).redirect("/");
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
})

app.get("/", (req, res) => {
    res.render(__dirname + "/index.html");
})