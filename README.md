# Find Jesus - A Palavra de Deus para qualquer momento

Um aplicativo web cristão que oferece acesso à Bíblia Sagrada e uma funcionalidade especial para encontrar versículos relevantes baseados nas situações da vida.

## Funcionalidades

### 🏠 Tela Inicial
- Design profissional com cenário do Sermão do Monte
- Interface limpa e acolhedora

### 📖 Seções Bíblicas
- **Bíblia Completa**: Acesso a todos os livros
- **Antigo Testamento**: Livros do AT com busca
- **Novo Testamento**: Livros do NT com busca
- Funcionalidade de busca por palavras, frases, livros e capítulos

### ✨ Find Jesus (Funcionalidade Principal)
- Campo para o usuário descrever sua situação (até 2000 caracteres)
- Algoritmo inteligente que encontra versículos relevantes
- Compartilhamento via:
  - Cópia de texto
  - Download de imagem (formato 9:16 para stories)

### 🎨 Design
- Imagens de fundo desfocadas e opacas para melhor legibilidade
- Interface responsiva para desktop e mobile
- Cruz luminosa no menu principal
- Gradientes e efeitos visuais modernos

## Como Hospedar no GitHub Pages

### Passo 1: Criar Repositório
1. Acesse [GitHub.com](https://github.com)
2. Clique em "New repository"
3. Nome sugerido: `find-jesus-app`
4. Marque como "Public"
5. Clique em "Create repository"

### Passo 2: Upload dos Arquivos
1. Clique em "uploading an existing file"
2. Arraste todos os arquivos desta pasta:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `bible-data.js`
   - `README.md`
3. Adicione uma mensagem de commit: "Initial commit - Find Jesus App"
4. Clique em "Commit changes"

### Passo 3: Ativar GitHub Pages
1. No seu repositório, vá em "Settings"
2. Role para baixo até "Pages" no menu lateral
3. Em "Source", selecione "Deploy from a branch"
4. Escolha "main" branch e "/ (root)"
5. Clique em "Save"

### Passo 4: Acessar o App
- Aguarde alguns minutos
- Seu app estará disponível em: `https://seuusuario.github.io/find-jesus-app`

## Estrutura do Projeto

```
find-jesus-app/
├── index.html          # Página principal
├── styles.css          # Estilos e design
├── script.js           # Funcionalidades JavaScript
├── bible-data.js       # Dados bíblicos
└── README.md           # Este arquivo
```

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com gradientes e animações
- **JavaScript**: Funcionalidades interativas
- **Canvas API**: Geração de imagens para compartilhamento
- **Responsive Design**: Compatível com todos os dispositivos

## Funcionalidades Técnicas

### Busca Inteligente
- Busca por palavras-chave em todo o texto bíblico
- Destaque dos termos encontrados
- Resultados organizados por livro, capítulo e versículo

### Find Jesus Algorithm
- Análise de palavras-chave na descrição do usuário
- Categorização por temas (medo, amor, paz, força, esperança, etc.)
- Seleção de versículos relevantes para cada categoria

### Geração de Imagens
- Canvas HTML5 para criar imagens personalizadas
- Formato otimizado para stories (1080x1920)
- Marca d'água discreta
- Download automático

## Personalização

### Adicionar Mais Livros Bíblicos
Edite o arquivo `bible-data.js` para incluir mais livros e capítulos.

### Modificar Versículos do Find Jesus
No arquivo `script.js`, na função `findRelevantVerse()`, você pode:
- Adicionar novas categorias
- Incluir mais versículos em cada categoria
- Modificar as palavras-chave de detecção

### Alterar Design
Modifique o arquivo `styles.css` para personalizar:
- Cores e gradientes
- Fontes e tamanhos
- Animações e efeitos

## Suporte

Este aplicativo foi desenvolvido para funcionar em:
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Dispositivos móveis (iOS/Android)
- ✅ Tablets e desktops

## Licença

Este projeto é de uso livre para fins religiosos e educacionais.

---

**Desenvolvido com ❤️ para espalhar a Palavra de Deus**

*"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." - Salmos 119:105*