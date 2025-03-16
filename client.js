window.addEventListener("DOMContentLoaded", e => {
    const [insertBtn, deleteBtn] = document.querySelectorAll("button");
    const table = document.getElementById("DB_display");

    const buildHTMLTable = data => {
        let HTMLTable = `<table>
        <tr>
            <th>CF</th>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Età</th>
            <th>Telefono</th>
            <th>IDClasse</th>
        </tr>`
            
        data.forEach(row => {
            const {CF, Nome, Cognome, Età, Telefono, IDClasse} = row;
            let HTMLRow = `
            <tr>
                <td>${CF}</td>
                <td>${Nome}</td>
                <td>${Cognome}</td>
                <td>${Età}</td>
                <td>${Telefono}</td>
                <td>${IDClasse}</td>
            </tr>`
            HTMLTable += HTMLRow;
        });

        return HTMLTable;
    }

    const DBRequest = () => {
        fetch("http://localhost:5000/loadDB")
        .then(response => response.json())
        .then(message => {
            console.log(message);
            table.innerHTML = buildHTMLTable(message);
        })
        .catch(err => console.error(err))
    }
    DBRequest();

    insertBtn.addEventListener("click", e => {
        console.log(`Click on ${e.target.innerText}`);
        fetch("http://localhost:5000/insert")
        .then(() => {
            window.location.href = "/insert_form.html"
        })
        .catch(err => console.error(err))
    })

    deleteBtn.addEventListener("click", e => {
        console.log(`Click on ${e.target.innerText}`);
        fetch("http://localhost:5000/delete")
        .then(() => {
            window.location.href = "/delete_request.html"
        })
        .catch(err => console.error(err))
    })
})