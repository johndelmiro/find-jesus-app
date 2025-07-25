// Variáveis globais
let currentBibleType = 'complete';
let currentBook = null;
let currentChapter = null;
let searchResults = [];

// Navegação entre telas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showHome() {
    showScreen('home-screen');
}

function showMenu() {
    showScreen('menu-screen');
}

function showBible(type) {
    currentBibleType = type;
    const titles = {
        'complete': 'Bíblia Completa',
        'old': 'Antigo Testamento',
        'new': 'Novo Testamento'
    };
    
    document.getElementById('bible-title').textContent = titles[type];
    loadBibleBooks(type);
    showScreen('bible-screen');
}

function showFindJesus() {
    showScreen('find-jesus-screen');
    // Limpar campos
    document.getElementById('user-situation').value = '';
    document.getElementById('char-count').textContent = '0';
    document.getElementById('verse-result').classList.add('hidden');
}

// Contador de caracteres
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('user-situation');
    const charCount = document.getElementById('char-count');
    
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
});

// Carregar livros da Bíblia
function loadBibleBooks(type) {
    const booksContainer = document.getElementById('bible-books');
    const chaptersContainer = document.getElementById('bible-chapters');
    const textContainer = document.getElementById('bible-text');
    
    booksContainer.innerHTML = '';
    chaptersContainer.innerHTML = '';
    textContainer.innerHTML = '';
    booksContainer.style.display = 'grid';
    chaptersContainer.style.display = 'none';
    textContainer.style.display = 'none';

    let books = [];
    const oldTestamentBookNames = ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester", "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"];
    const correctedOldTestamentBooks = oldTestamentBooks.filter(book => oldTestamentBookNames.includes(book.name));

    if (type === 'complete') {
        books = [...correctedOldTestamentBooks, ...newTestamentBooks];
    } else if (type === 'old') {
        books = correctedOldTestamentBooks;
    } else if (type === 'new') {
        books = newTestamentBooks;
    }
    
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-item';
        bookElement.textContent = book.name;
        bookElement.onclick = () => loadBook(book);
        booksContainer.appendChild(bookElement);
    });
}

// Carregar livro específico
function loadBook(book) {
    currentBook = book;
    const booksContainer = document.getElementById('bible-books');
    const chaptersContainer = document.getElementById('bible-chapters');
    const textContainer = document.getElementById('bible-text');

    booksContainer.style.display = 'none';
    textContainer.innerHTML = '';
    textContainer.style.display = 'none';

    chaptersContainer.innerHTML = book.chapters.map((_, index) => 
        `<div class="chapter-item" onclick="loadChapter(${index + 1})">${index + 1}</div>`
    ).join('');
    
    chaptersContainer.style.display = 'grid';
    chaptersContainer.scrollIntoView({ behavior: 'smooth' });
}

// Carregar capítulo específico
function loadChapter(chapterNumber) {
    currentChapter = chapterNumber;
    const chaptersContainer = document.getElementById('bible-chapters');
    const textContainer = document.getElementById('bible-text');
    const chapter = currentBook.chapters[chapterNumber - 1];
    
    chaptersContainer.style.display = 'none';

    textContainer.innerHTML = `
        <h4>${currentBook.name} ${chapterNumber}</h4>
        <div class="verses">
            ${chapter.map((verse, index) => 
                `<div class="verse">
                    <span class="verse-number">${index + 1}</span>
                    ${verse}
                </div>`
            ).join('')}
        </div>
    `;
    textContainer.style.display = 'block';
    textContainer.scrollIntoView({ behavior: 'smooth' });
}

// Busca na Bíblia
function searchBible() {
    const searchTerm = document.getElementById('bible-search').value.toLowerCase().trim();
    if (!searchTerm) return;

    const booksContainer = document.getElementById('bible-books');
    const chaptersContainer = document.getElementById('bible-chapters');
    const textContainer = document.getElementById('bible-text');
    const results = [];

    booksContainer.style.display = 'none';
    chaptersContainer.style.display = 'none';

    const oldTestamentBookNames = ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester", "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"];
    const correctedOldTestamentBooks = oldTestamentBooks.filter(book => oldTestamentBookNames.includes(book.name));

    let booksToSearch = [];
    if (currentBibleType === 'complete') {
        booksToSearch = [...correctedOldTestamentBooks, ...newTestamentBooks];
    } else if (currentBibleType === 'old') {
        booksToSearch = correctedOldTestamentBooks;
    } else if (currentBibleType === 'new') {
        booksToSearch = newTestamentBooks;
    }

    booksToSearch.forEach(book => {
        book.chapters.forEach((chapter, chapterIndex) => {
            chapter.forEach((verse, verseIndex) => {
                if (verse.toLowerCase().includes(searchTerm)) {
                    results.push({
                        book: book.name,
                        chapter: chapterIndex + 1,
                        verse: verseIndex + 1,
                        text: verse
                    });
                }
            });
        });
    });

    if (results.length === 0) {
        textContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    } else {
        textContainer.innerHTML = `
            <h3>Resultados da busca: "${searchTerm}" (${results.length} encontrados)</h3>
            <div class="search-results">
                ${results.slice(0, 100).map(result => 
                    `<div class="verse" onclick="goToChapter('${result.book}', ${result.chapter})">
                        <div class="verse-reference" style="font-weight: bold; margin-bottom: 5px; cursor: pointer;">
                            ${result.book} ${result.chapter}:${result.verse}
                        </div>
                        <div>${highlightSearchTerm(result.text, searchTerm)}</div>
                    </div>`
                ).join('')}
                ${results.length > 100 ? '<p style="text-align: center; color: var(--text-color-dark);">Mostrando os primeiros 100 resultados...</p>' : ''}
            </div>
        `;
    }
    
    textContainer.style.display = 'block';
    textContainer.scrollIntoView({ behavior: 'smooth' });
}

// Destacar termo de busca
function highlightSearchTerm(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark style="background: var(--primary-color); color: white; padding: 2px 4px; border-radius: 4px;">$1</mark>');
}

function goToChapter(bookName, chapterNumber) {
    const book = [...oldTestamentBooks, ...newTestamentBooks].find(b => b.name === bookName);
    if (book) {
        loadBook(book);
        loadChapter(chapterNumber);
    }
}

// Find Jesus - Encontrar versículo
async function findVerse() {
    const userSituation = document.getElementById('user-situation').value.trim();
    if (!userSituation) {
        alert('Por favor, compartilhe o que está em seu coração.');
        return;
    }

    const verseResult = document.getElementById('verse-result');
    const verseTextElement = verseResult.querySelector('.verse-text');
    const verseReferenceElement = verseResult.querySelector('.verse-reference');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Mostrar carregamento e esconder resultado anterior
    loadingIndicator.classList.remove('hidden');
    verseResult.classList.add('hidden');

    const apiKey = 'AIzaSyAtYrhZu8uX-oFCcQXsl9jnzLs7yHIAObI';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `Você é um mecanismo de resposta bíblica. Quando alguém escrever um texto, pergunta, desabafo ou reflexão, sua tarefa é retornar apenas um ou dois versículos bíblicos curtos e diretamente relacionados ao conteúdo recebido.
⚠️ Responda apenas com os versículos, em português brasileiro. Não inclua explicações, interpretações, comentários, saudações ou qualquer outro tipo de texto. Nada além dos versículos.
O formato da resposta deve ser sempre este:
[Texto do versículo]
[Nome do livro] [Capítulo]:[Versículo]
Exemplo:
Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.
João 3:16
⚠️ Não quebre esta regra. A resposta deve ser apenas o(s) versículo(s) em português e a referência bíblica. Nunca explique, nunca adicione nada além disso.`;
    
    const prompt = `${systemPrompt}\n\nSolicitação do usuário: "${userSituation}"`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "contents": [{
                    "parts": [
                        { "text": prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro da API:', errorText);
            throw new Error(`Erro ao chamar a API do Gemini: ${response.status}`);
        }

        const data = await response.json();
        const fullVerse = data.candidates[0].content.parts[0].text.trim();

        // Extrair referência e texto do versículo (novo formato)
        const lines = fullVerse.split('\n').filter(line => line.trim() !== '');
        let text, reference;
        
        if (lines.length >= 2) {
            // Última linha é a referência, o resto é o texto do versículo
            reference = lines[lines.length - 1].trim();
            text = lines.slice(0, -1).join(' ').trim();
        } else {
            // Fallback para formato antigo
            const match = fullVerse.match(/(.*) \((.*)\)/);
            if (match) {
                text = match[1].trim();
                reference = match[2].trim();
            } else {
                text = fullVerse.trim();
                reference = "";
            }
        }

        verseTextElement.textContent = `"${text}"`;
        verseReferenceElement.textContent = reference;

        // Armazenar para compartilhamento
        window.currentVerse = { text, reference };

        verseResult.classList.remove('hidden');

    } catch (error) {
        console.error('Erro:', error);
        verseTextElement.textContent = 'Não foi possível obter um versículo. Tente novamente mais tarde.';
        verseReferenceElement.textContent = '';
        verseResult.classList.remove('hidden');
    } finally {
        // Esconder carregamento
        loadingIndicator.classList.add('hidden');
    }
}


// Copiar versículo
function copyVerse() {
    if (!window.currentVerse) return;
    
    const text = `"${window.currentVerse.text}"\n\n${window.currentVerse.reference}\n\nCompartilhado via Find Jesus - A Palavra de Deus para qualquer momento`;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Versículo copiado para a área de transferência!');
    }).catch(() => {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Versículo copiado para a área de transferência!');
    });
}

// Baixar imagem
function downloadImage() {
    if (!window.currentVerse) return;
    
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas para formato 9:16 (1080x1920)
    canvas.width = 1080;
    canvas.height = 1920;
    
    // Carregar imagem de fundo
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.onload = function() {
        // Desenhar fundo
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        
        // Adicionar overlay escuro
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Configurar texto
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Desenhar versículo (texto principal)
        const verseText = window.currentVerse.text;
        const maxWidth = canvas.width - 120; // Margem de 60px de cada lado
        const lineHeight = 60;
        const startY = canvas.height / 2 - 100;
        
        ctx.font = 'bold 48px Arial';
        const lines = wrapText(ctx, verseText, maxWidth);
        
        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
        });
        
        // Desenhar referência
        ctx.font = 'bold 36px Arial';
        ctx.fillText(window.currentVerse.reference, canvas.width / 2, startY + (lines.length * lineHeight) + 80);
        
        // Adicionar texto de crédito
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Find Jesus - by John Delmiro APP', canvas.width / 2, canvas.height - 80);
        
        // Baixar imagem
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'find-jesus-verse.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    };
    
    bgImage.src = 'https://i.postimg.cc/pdLyZVdj/75a4cbd3-cbf8-4cbf-bcab-9fcad2809d9b.png';
}

// Função auxiliar para quebrar texto em linhas
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar tela inicial
    showHome();
});