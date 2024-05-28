const myNav = document.querySelectorAll(".mybut");
const fileInput = document.getElementById("select");
const fileNames = document.getElementById("fileName");
console.log(myNav);
console.log(fileInput);
const container1 = document.getElementById("pricipal_container");
const container0 = document.querySelectorAll(".container");
const container3 = document.getElementById("my_formPath");
console.log(container3);

function recup(route) {
    let datajson = [0, 0, 0];
    fetch(route)
        .then(response => response.json())
        .then(data => {
            // Convertir les données en une chaîne JSON



            return data;

        })
    return datajson
}
console.log(container0)
const Button0 = myNav[0];
const Button2 = myNav[2];
const Button1 = myNav[1];
const Button3 = myNav[3];
const Button4 = myNav[4];
console.log(container3.display);
Button2.display = "";
console.log(Button0);
function getFileName() {
    fileInput.addEventListener("change", () => {
        const files = fileInput.files;
        if (files.length > 0) {
            console.log(files);
            fileNames.innerHTML = "nom de fichier : " + files[0].name;
        }
    })
}

function imports() {


    Button1.addEventListener("click", () => {
        if (container1.style.display === "none") {
            container1.style.display = "block";
            container2.style.display = "none";
            container0.forEach(Element => Element.style.display = "none");
            container3.style.display = "none";
            Button1.style.boxShadow = '0px 0px 20px rgb(72,235, 66)';
        }
    });
}

imports();
getFileName();
const container2 = document.getElementById("container2");
console.log(container2)





function animation() {
    let circularProgress = document.querySelectorAll(".circular-progress");
    let progressValue = document.querySelectorAll(".progress-value");
    let speed = 20;

    fetch("/age")
        .then(response => response.json())
        .then(daj => {
            let progressEndValues = daj.slice(0, 3); // Assuming daj is an array
            progressEndValues.forEach((endValue, index) => {
                let startValue = 0;
                console.log(daj)
                let progress = setInterval(() => {

                    progressValue[index].textContent = `${startValue}%`;
                    circularProgress[index].style.background = `conic-gradient(green ${startValue * 3.6}deg, #ededed 0deg)`;
                    if (startValue == endValue) {
                        clearInterval(progress);
                    }
                    startValue++;
                }, speed);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
animation();
Button0.addEventListener("click", () => {
    container0.forEach(Element => {
        console.log(container0)

        console.log(Element.style.display);
        if (Element.style.display === "") {
            console.log("ssss")
            Element.style.display = "flex";
            container1.style.display = "none";
            container2.style.display = "none";
            console.log(Element.style.display);
            animation();

        }
    });
})
// Récupérer le contexte du canvas
var ctx = document.getElementById('polarChart').getContext('2d');
let djeson = 0;

fetch('/score')
    .then(response => response.json())
    .then(data => {
        djeson = data;

        const chartData = {
            labels: [
                'Neoplasm',
                'Phonotrauma',
                'Vocal Palsy',
                'none'
            ],
            datasets: [{
                label: 'result',
                data: [djeson[0], djeson[1], djeson[2], djeson[3]],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)',
                    'rgb(255, 70, 20)',
                ]
            }]
        };

        // Configurer les options du graphique
        var options = {
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        };

        // Créer le graphique en secteurs polaires
        var polarChart = new Chart(ctx, {
            type: 'polarArea',
            data: chartData,
            options: options
        });
        document.getElementById("result").innerHTML = "le nombre des scans effectués : \n" + `${djeson[0] + djeson[1] + djeson[2] + djeson[3]}`;

    });




function envoyerFichier() {




    // Récupérer le fichier depuis l'élément input
    event.preventDefault();
    const fichierInput = document.getElementById('select');
    const fichier = fichierInput.files[0];

    // Créer un objet FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('fichier', fichier);

    // Envoi du fichier via une requête POST avec fetch
    fetch('/importML', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            console.log(response);
            if (response.status == 200) {
                alert("ajouter avec susser");
            }
            if (response.status == 203) {
                alert("fichier vide")
            }
            throw new Error('Erreur lors de l\'envoi du fichier.');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
/*function remplirTableau(data) {
    var table = document.getElementsByTagName("table")[0]; // Sélectionne la première table dans le document
    var tbody = document.createElement("tbody"); // Crée un élément tbody pour contenir les données

    // Boucle à travers les données et crée une ligne <tr> pour chaque entrée
    data.forEach(rowData => {
        var tr = document.createElement("tr"); // Crée une nouvelle ligne <tr>

        // Boucle à travers les propriétés de chaque élément de données et crée une cellule <td> pour chaque propriété
        for (var key in rowData) {
            if (rowData.hasOwnProperty(key)) {
                var td = document.createElement("td"); // Crée une nouvelle cellule <td>
                td.innerHTML = rowData[key]; // Définit le contenu de la cellule avec la valeur de la propriété
                tr.appendChild(td); // Ajoute la cellule à la ligne
            }
        }

        tbody.appendChild(tr); // Ajoute la ligne au corps du tableau
    });

    // Ajoute le corps du tableau à la table
    table.appendChild(tbody);
}*/

// Exemple d'








function fetchData() {
    fetch('/dare')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            // Check if data is an array and not empty
            if (!Array.isArray(data) || data.length === 0) {
                console.log('No data available to convert to CSV');
                return;
            }

            // Convert JSON data to CSV
            const headers = Object.keys(data[0]);
            const csvRows = [];

            // Add the header row
            csvRows.push(headers.join(','));

            // Add the data rows
            data.forEach(row => {
                const values = headers.map(header => {
                    const escapedValue = String(row[header]).replace(/"/g, '""'); // Escape double quotes
                    return `"${escapedValue}"`;
                });
                csvRows.push(values.join(','));
            });

            const csvString = csvRows.join('\n');

            // Name of the file
            const nomFichier = "export.csv";

            // MIME type for CSV data
            const type = "text/csv";

            // Create a Blob object
            const blob = new Blob([csvString], { type: type });

            // Create a URL from the Blob
            const url = URL.createObjectURL(blob);

            // Create an <a> element for the download
            const a = document.createElement('a');
            a.href = url;
            a.download = nomFichier;

            // Append the <a> element to the document body
            document.body.appendChild(a);

            // Trigger the download by clicking the <a> element
            a.click();

            // Remove the <a> element from the document body
            document.body.removeChild(a);

            // Revoke the URL to free memory
            URL.revokeObjectURL(url);

            console.log('CSV file generated and downloaded');
        })
        .catch(error => {
            console.log('Erreur :', error);
        });
}
let datajson = 0;

Button0.addEventListener("click", () => {
    if (container2.style.display === "none") {
        console.log("ok");
        container2.style.display = "block";
        container1.style.display = "none"
        container3.style.display = "none";
        container0.forEach(Element => Element.style.display = "");
        fetch('/dare')
            .then(response => response.json())
            .then(data => {
                // Convertir les données en une chaîne JSON



                //  remplirTableau(data);


            })
    }
});

Button2.addEventListener("click", () => {

    if (container3.style.display === "none" || container3.style.display === undefined) {
        console.log("ss");
        container1.style.display = "none";
        container2.style.display = "none";
        container3.style.display = "block";
        console.log(container3);

        container0.forEach(Element => Element.style.display = "none");
        Button1.style.boxShadow = '0px 0px 20px rgb(72,235, 66)';
    }
})



function fetch_path() {



    document.getElementById('my_button2').addEventListener('click', function (event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        // Récupère les valeurs des champs
        var Nom_Pathologie = document.getElementById('nom_path').value;
        var des_Pathologie = document.getElementById('description').value;

        // Envoie la requête POST au serveur
        fetch('/addPathologie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nom: Nom_Pathologie,
                description: des_Pathologie,
            })
        })
            .then(response => {
                console.log(response);
                if (response.status == 200) {
                    alert("pathologie exist");
                }
                if (response.status == 203) {
                    alert("ajouter avec succes")
                }
            }).catch(error => {
                console.error('Error:', error);
            });

    })

}

fetch_path()

function get_symt() {
    var symt = document.getElementById("symptoms").value;
    var cat = document.getElementById("category").value;
    var container = document.getElementById("cont2");
    Button3.addEventListener("click", () => {
        if (container.style.display === "none" || container3.style.display === undefined) {
            console.log("ss");
            container1.style.display = "none";
            container2.style.display = "none";
            container3.style.display = "none";
            container.style.display = "block"
            console.log(container3);

            container0.forEach(Element => Element.style.display = "none");
            Button1.style.boxShadow = '0px 0px 20px rgb(72,235, 66)';
        }
    })
}
get_symt();


function fetch_symts() {



    document.getElementById('sumt_bit').addEventListener('click', function (event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        // Récupère les valeurs des champs
        var Nom_symmt = document.getElementById('symptoms').value;
        var cat_symmt = document.getElementById('category').value;
        console.log(cat_symmt);

        // Envoie la requête POST au serveur
        fetch('/add_symptom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: Nom_symmt,
                label: cat_symmt,
            })

        })
            .then(response => {
                console.log(response);
                if (response.status == 201) {
                    alert("ajouter avec succes");
                }
                if (response.status == 200) {
                    alert("ajouter avec su")
                }
                if (response.status == 300) {
                    alert("symtoms d'eja existe dans cette cetegorie")
                }
            }).catch(error => {
                console.error('Error:', error);
            });


    })

}
fetch_symts()

function switchs() {


    const BUtton4 = document.getElementById("click1");

    if (BUtton4) {

        BUtton4.addEventListener("click", () => {

            window.location.href = '/';
        });
    } else {
        console.log("Element with id 'BUtton4' not found.");
    }
}

switchs();

function del_symts() {
    document.getElementById('suprimer').addEventListener('click', function (event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        // Récupère les valeurs des champs
        var Nom_symmt = document.getElementById('symptoms').value;
        var cat_symmt = document.getElementById('category').value;


        // Envoie la requête POST au serveur
        fetch('/delete_symptom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: Nom_symmt,
                label: cat_symmt,

            })
        })
            .then(response => {
                console.log(response);
                if (response.status == 404) {
                    alert("symthoms n'exist pas");
                }
                if (response.status == 200) {
                    alert("suprimer avec succes")
                }
            }).catch(error => {
                console.error('Error:', error);
            });

    })

}
del_symts()