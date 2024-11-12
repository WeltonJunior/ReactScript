// Função debounce para limitar a frequência de atualização
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Configuração do editor com CodeMirror
const editor = CodeMirror(document.getElementById("editor-container"), {
    mode: "javascript",
    lineNumbers: true,
    theme: "default",
    value: "// Escreva seu código aqui"
});

// Função para atualizar a pré-visualização ao vivo
function updatePreview() {
    const code = editor.getValue();
    const previewFrame = document.getElementById("preview");

    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    previewDocument.write(`
        <html>
        <body>
            <div id="output"></div>
            <script>
                // Redireciona console.log para exibir na página
                const originalConsoleLog = console.log;
                console.log = function(message) {
                    const outputDiv = document.getElementById("output");
                    if (outputDiv) {
                        outputDiv.innerHTML += "<p>" + message + "</p>";
                    }
                    originalConsoleLog.apply(console, arguments);
                };

                try {
                    ${code}
                } catch (error) {
                    document.body.innerHTML = "<pre>Erro: " + error + "</pre>";
                }
            </script>
        </body>
        </html>
    `);
    previewDocument.close();
}

// Adiciona o evento de input com debounce para atualização em tempo real
editor.on("change", debounce(updatePreview, 300));
