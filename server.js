const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Define a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});