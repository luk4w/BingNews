const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { exec } = require('child_process');

// Função para pausar a execução por um determinado tempo (em milissegundos)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para carregar a chave da API do arquivo config.json
function loadApiKey() {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath);
        const config = JSON.parse(configContent);
        return config.api_key; // Retorna a chave da API
    }
    throw new Error("Arquivo config.json não encontrado ou chave da API não definida.");
}

// Função para interagir com a API Generative Language do Google
async function processWithGemini(titles) {
    const apiKey = loadApiKey();

    if (!apiKey) {
        console.error("Chave da API não foi fornecida!");
        return;
    }

    // Inicializa o SDK do Google Generative AI com a chave de API
    const genAI = new GoogleGenerativeAI(apiKey);

    // Formatar o prompt com base nos títulos fornecidos
    const promptText = `Aqui estão os títulos de algumas notícias: ${titles.join(", ")}. 
    Faça uma reescrita diferente desses titulos de maneira breve e direta, use a criatividade.
    Não use pontos finais ou vírgulas, deixe parecido com uma pesquisa aleatória.

    Seguindo o formato json a seguir:
    [
    "Titulo1",
    "Titulo2",
    ]`;

    try {
        // Inicializa o modelo Gemini 1.5
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Gera o conteúdo baseado no prompt
        const result = await model.generateContent(promptText);

        // Pega a resposta gerada
        const response = result.response;

        // Extrai o texto gerado
        let generatedText = response.text();

        console.log("Resposta gerada pelo Gemini: ", generatedText);

        // Remover as marcações de bloco de código Markdown (```json e ```)
        generatedText = generatedText.replace(/```json\n|```/g, '').trim();

        // Converter a string para JSON
        const json = JSON.parse(generatedText);

        console.log("Títulos reescritos (array):", json);

        return json;

    } catch (error) {
        console.error("Erro ao processar com a API:", error.message);
        if (error.response) {
            console.error("Detalhes do erro:", error.response.data);
        }
    }
}

// Função para salvar os títulos em um arquivo JSON (sobrescrevendo)
function saveTitlesToFile(filePath, titles) {
    fs.writeFileSync(filePath, JSON.stringify(titles, null, 2));
    console.log(`Títulos salvos em: ${filePath}`);
}

// Função para capturar títulos de uma categoria específica
async function captureTitlesByCategory(page, category) {
    console.log(`Capturando títulos da categoria: ${category}...`);

    try {
        // Clica na categoria
        const categoryClicked = await page.evaluate((category) => {
            const categoryElement = Array.from(document.querySelectorAll('span.category-name'))
                .find(el => el.innerText.trim() === category);
            if (categoryElement) {
                categoryElement.click();
                return true;
            }
            return false;
        }, category);

        if (!categoryClicked) {
            console.error(`Categoria não encontrada: ${category}`);
            return [];
        }

        // Aguarda o carregamento da página
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        // Simular rolagem da página
        await smoothScroll(page);

        // Captura os títulos das notícias
        const titles = await page.evaluate(() => {
            const newsElements = Array.from(document.querySelectorAll('.title, .news-card-title'));
            return newsElements.map(news => news.innerText.replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, '').trim());
        });

        console.log(`Títulos capturados (${category}):`, titles);

        // Aguarda um pequeno intervalo antes de continuar
        await sleep(3000);

        return titles;
    } catch (error) {
        console.error(`Erro ao capturar títulos na categoria ${category}:`, error.message);
        return [];
    }
}

// Função para capturar títulos de todas as categorias
async function captureTitles(page) {
    console.log("Iniciando captura de notícias por categorias...");

    const categories = [
        'Fatos Principais',
        'Brasil',
        'Mundo',
        'Tecnologia',
        'Entretenimento',
        'Esportes',
        'Política',
        'Negócios'
    ];

    let allTitles = [];

    for (const category of categories) {
        const titles = await captureTitlesByCategory(page, category);
        allTitles = allTitles.concat(titles);
    }

    console.log("Todos os títulos capturados:", allTitles);

    return allTitles;
}

// Função para rolar a página suavemente
async function smoothScroll(page) {
    console.log("Iniciando rolagem contínua...");

    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 50;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= 3000) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });

    console.log("Rolagem concluída.");
}

// Função principal
async function fetchAndSaveNews() {
    try {
        // // Inicializa o Puppeteer
        // const browser = await puppeteer.launch({ headless: false });
        // const page = await browser.newPage();

        // // Acessa a página de notícias do Bing
        // await page.goto('https://www.bing.com/news', { waitUntil: 'domcontentloaded' });

        // // Capturar títulos de todas as categorias
        // const titles = await captureTitles(page);

        // // Reescrever os títulos com a API Gemini
        // const updatedTitles = await processWithGemini(titles);

        // // Salvar os títulos reescritos no arquivo JSON
        const filePath = path.join(__dirname, 'news.json');
        // saveTitlesToFile(filePath, updatedTitles || titles);

        // console.log(`Arquivo de notícias atualizado em: ${filePath}`);

        // // Fecha o navegador
        // await browser.close();

        exec('git add .', (addError, stdout, stderr) => {
            if (addError) {
                console.error(`Erro ao adicionar os arquivos: ${stderr || addError.message}`);
                return;
            }
            console.log(stdout || 'Todos os arquivos modificados foram adicionados ao stage com sucesso.');
        
            exec('git commit -m "Atualização do repositório"', (commitError, stdout, stderr) => {
                if (commitError) {
                    console.error(`Erro ao fazer o commit: ${stderr || commitError.message}`);
                    return;
                }
                console.log(stdout || 'Commit realizado com sucesso.');
        
                exec('git push', (pushError, stdout, stderr) => {
                    if (pushError) {
                        console.error(`Erro ao fazer o push: ${stderr || pushError.message}`);
                        return;
                    }
                    console.log(stdout || 'Push realizado com sucesso.');
                });
            });
        });

    } catch (error) {
        console.error("Erro durante a execução:", error.message);
    }



}

// Executa a função principal
fetchAndSaveNews();
