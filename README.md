# BingNews

## Descrição

BingNews é um projeto desenvolvido em **Node.js** que utiliza o **Puppeteer** para coletar títulos de notícias do **Bing** e processá-los com a **API do Google Gemini**.

## Funcionalidades

- **Scrapping:** Coleta uma lista de títulos de notícias do Bing. 
- **Reescrita Inteligente:** Utiliza a API do Google Gemini para reescrever os títulos de forma criativa e concisa.
- **Automatização Git:** Adiciona, commita e realiza push das atualizações automaticamente para um repositório Git.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Git](https://git-scm.com/)
- Conta e chave de API para o [Google Gemini](https://developers.google.com/generative-ai)

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/luk4w/BingNews.git
   ```
2. Acesse o Diretório do Projeto
   ```bash
    cd BingNews
   ```
3. Instale as Dependências
   ```bash
    npm install
   ```
4. Configure o arquivo config.json
   ```json
    {
    "api_key": YOUR_API_KEY
    }
   ```
6. Execute o script
   ```bash
    node script.js
   ``` 
