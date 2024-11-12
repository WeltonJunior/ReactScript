// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    socket.on('executeCode', (code) => {
        // Cria um arquivo temporário para o código do usuário
        const tempFilePath = path.join(__dirname, 'tempCode.js');

        // Escreve o código no arquivo temporário
        fs.writeFile(tempFilePath, code, (err) => {
            if (err) {
                socket.emit('output', 'Erro ao escrever o código no arquivo temporário.');
                return;
            }

            // Executa o arquivo temporário com Node.js
            exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
                const result = error ? stderr : stdout;

                // Envia o resultado da execução de volta para o cliente
                socket.emit('output', result);

                // Remove o arquivo temporário após a execução
                fs.unlink(tempFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Erro ao deletar o arquivo temporário:', unlinkErr);
                    }
                });
            });
        });
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
