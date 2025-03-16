const dotenv = require("dotenv");
const express = require("express");
const mysql = require("mysql2"); 

dotenv.config();
let PORT = process.env.PORT || 5000;

const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "scuola",
});

con.connect(err => {
    if (err)
        console.error(`error connnecting: ${err.stack}`);
    else
        console.log(`connected as id ${con.threadId}`);
})

app.get("/loadDB", (req, res) => {
    con.query(`SELECT * FROM studente`,
    (error, results, fields) => {
        if (error) { throw error; }
        
        // console.log(results);
        res.status(200).send(JSON.stringify(results));
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
    console.log(data);
    
    const {CF, Nome, Cognome, Età, Telefono, IDClasse} = data;

    con.query(`INSERT INTO studente VALUES('${CF}', '${Nome}', '${Cognome}', ${Età}, '${Telefono}', ${IDClasse})`,
    (error, results, fields) => {
        if (error) { throw error; }
    })
    res.status(200).redirect("/");
})
app.post("/deleteFromDB", (req, res) => {
    const data = req.body;
    console.log(data);

    con.query(`DELETE FROM studente WHERE CF = '${data.CF}'`,
    (error, results, fields) => {
        if (error) { throw error; }
    })
    res.status(200).redirect("/");
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})