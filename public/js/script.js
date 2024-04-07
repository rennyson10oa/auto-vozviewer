document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('arquivo').addEventListener('change', handleFileSelect);
    document.getElementById('teste').addEventListener('click', handleServerFileSelect);
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvText = event.target.result;
        processData(csvText);
    };

    reader.readAsText(file);
}

function handleServerFileSelect() {
    fetch('csv/csv-g.csv')
        .then(response => response.text())
        .then(csvText => readAndProcessFile(csvText))
        .catch(error => console.error('Erro ao carregar o arquivo CSV:', error));
}

function readAndProcessFile(fileOrText) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvText = event ? event.target.result : fileOrText;
        processData(csvText);
    };

    if (typeof fileOrText === 'string') {
        reader.onload(); // Simulate onload event if fileOrText is already text
    } else {
        reader.readAsText(fileOrText);
    }
}

function processData(csvText) {
    const results = Papa.parse(csvText, { header: true }).data;
    console.log(results);

    const labels = [];
    const dataValues = [];

    const citationCountByAuthor = new Map();
    results.forEach(citation => {
        const author = citation['Authors'];
        if (author && author.trim() !== '') { // Verifica se 'Authors' está definido e não está vazio
            if (citationCountByAuthor.has(author)) {
                citationCountByAuthor.set(author, citationCountByAuthor.get(author) + 1);
            } else {
                citationCountByAuthor.set(author, 1);
            }
        }
    });

    citationCountByAuthor.forEach((count, author) => {
        labels.push(author);
        dataValues.push(count);
    });

    console.log(labels);
    console.log(dataValues);

    createChart(labels, dataValues);
}

function createChart(labels, dataValues) {
    const ctx = document.getElementById('graph').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Citações por Autor',
                data: dataValues,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}