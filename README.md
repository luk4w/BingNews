# BingNews

## Descrição

**BingNews** é um projeto desenvolvido em Node.js que utiliza o Puppeteer para coletar notícias diretamente do [Bing News](https://www.bing.com/news). Após a coleta, os títulos das notícias são reescritos utilizando a API do [Google Gemini](https://developers.google.com/generative-ai), garantindo títulos únicos e otimizados. O resultado final é salvo em um arquivo JSON e automaticamente commitado e enviado para um repositório Git.

## Funcionalidades

- **Scrapping:** Coleta títulos de notícias de diversas categorias no Bing News.
- **Reescrita Inteligente:** Utiliza a API do Google Gemini para reescrever os títulos de forma criativa e concisa.
- **Automatização Git:** Adiciona, commita e realiza push das atualizações automaticamente para um repositório Git.
- **Configuração Simples:** Fácil configuração através de um arquivo `config.json`.

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
