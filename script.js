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

// Busca na Bíblia com IA para correção automática
function searchBible() {
    const searchTerm = document.getElementById('bible-search').value.trim();
    if (!searchTerm) return;

    const booksContainer = document.getElementById('bible-books');
    const chaptersContainer = document.getElementById('bible-chapters');
    const textContainer = document.getElementById('bible-text');

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

    // Primeiro tentar busca direta por referência
    const referenceResult = searchByReference(searchTerm, booksToSearch);
    if (referenceResult) {
        textContainer.innerHTML = referenceResult;
        textContainer.style.display = 'block';
        textContainer.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Se não encontrou referência direta, usar IA para interpretar e corrigir
    searchWithAI(searchTerm, textContainer, booksToSearch);

}

// Busca com IA para interpretar e corrigir termos
async function searchWithAI(searchTerm, textContainer, booksToSearch) {
    try {
        textContainer.innerHTML = '<p>Interpretando busca com IA...</p>';
        textContainer.style.display = 'block';
        
        // Prompt para a IA interpretar o termo de busca
        const prompt = `Você é um assistente especializado em busca bíblica. Analise o termo de busca "${searchTerm}" e:

1. Se for uma referência bíblica (livro + capítulo/versículo), corrija qualquer erro de digitação e retorne no formato exato: "LIVRO CAPÍTULO:VERSÍCULO" ou "LIVRO CAPÍTULO" (use os nomes corretos dos livros em português)
2. Se for uma palavra ou frase para buscar no texto, retorne exatamente: "BUSCA: palavra ou frase"

Exemplos:
- "Genesis 1:1" → "Gênesis 1:1"
- "Matheus 5" → "Mateus 5"
- "Joao 3:16" → "João 3:16"
- "amor de deus" → "BUSCA: amor de deus"
- "salmo 23" → "Salmos 23"

Responda APENAS com o formato correto, sem explicações.`;

        const apiKey = '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';
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Find Jesus App',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3.1:free',
                messages: [
                    { role: 'system', content: 'Você é um assistente especializado em busca bíblica que corrige erros de digitação e interpreta termos de busca.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 100
            })
        });

        if (!response.ok) {
            throw new Error('Erro na API');
        }

        const data = await response.json();
        const correctedTerm = data.choices[0].message.content.trim();
        
        // Processar resposta da IA
        if (correctedTerm.startsWith('BUSCA:')) {
            // É uma busca por palavra/frase
            const searchPhrase = correctedTerm.replace('BUSCA:', '').trim();
            performTextSearch(searchPhrase, textContainer, booksToSearch);
        } else {
            // É uma referência bíblica corrigida
            const referenceResult = searchByReference(correctedTerm, booksToSearch);
            if (referenceResult) {
                textContainer.innerHTML = referenceResult;
            } else {
                // Se ainda não encontrou, fazer busca por texto
                performTextSearch(searchTerm, textContainer, booksToSearch);
            }
        }
        
    } catch (error) {
        console.error('Erro na busca com IA:', error);
        // Fallback para busca tradicional
        performTextSearch(searchTerm, textContainer, booksToSearch);
    }
}

// Função para busca por texto tradicional
function performTextSearch(searchTerm, textContainer, booksToSearch) {
    const results = [];
    const searchLower = searchTerm.toLowerCase();
    
    booksToSearch.forEach(book => {
        book.chapters.forEach((chapter, chapterIndex) => {
            chapter.forEach((verse, verseIndex) => {
                if (verse.toLowerCase().includes(searchLower)) {
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

// Buscar por referência específica (ex: "Salmo 41", "Mateus 12:3")
function searchByReference(searchTerm, booksToSearch) {
    // Padrões de busca por referência
    const patterns = [
        // Padrão: "Livro Capítulo:Versículo" (ex: "João 3:16", "Mateus 12:3")
        /^([a-záêçõãàéíóúâôü\s\d]+)\s+(\d+):(\d+)$/i,
        // Padrão: "Livro Capítulo versículo Número" (ex: "João 3 versículo 16")
        /^([a-záêçõãàéíóúâôü\s\d]+)\s+(\d+)\s+vers[íi]culo\s+(\d+)$/i,
        // Padrão: "Livro Capítulo" (ex: "Salmo 41", "Mateus 12")
        /^([a-záêçõãàéíóúâôü\s\d]+)\s+(\d+)$/i
    ];

    for (let pattern of patterns) {
        const match = searchTerm.match(pattern);
        if (match) {
            const bookName = match[1].trim();
            const chapterNum = parseInt(match[2]);
            const verseNum = match[3] ? parseInt(match[3]) : null;

            // Encontrar o livro
            const book = findBookByName(bookName, booksToSearch);
            if (!book) continue;

            // Verificar se o capítulo existe
            if (chapterNum < 1 || chapterNum > book.chapters.length) continue;

            const chapter = book.chapters[chapterNum - 1];

            if (verseNum) {
                // Busca por versículo específico
                if (verseNum < 1 || verseNum > chapter.length) continue;
                const verse = chapter[verseNum - 1];
                return `
                    <h3>Referência encontrada: ${book.name} ${chapterNum}:${verseNum}</h3>
                    <div class="verse" onclick="goToChapter('${book.name}', ${chapterNum})">
                        <div class="verse-reference" style="font-weight: bold; margin-bottom: 10px; cursor: pointer;">
                            ${book.name} ${chapterNum}:${verseNum}
                        </div>
                        <div style="font-size: 1.1em; line-height: 1.6;">${verse}</div>
                    </div>
                `;
            } else {
                // Busca por capítulo inteiro
                const verses = chapter.map((verse, index) => 
                    `<div class="verse" style="margin-bottom: 15px;">
                        <div class="verse-reference" style="font-weight: bold; margin-bottom: 5px;">
                            ${book.name} ${chapterNum}:${index + 1}
                        </div>
                        <div style="line-height: 1.6;">${verse}</div>
                    </div>`
                ).join('');
                
                return `
                    <h3>Capítulo encontrado: ${book.name} ${chapterNum}</h3>
                    <div class="chapter-content">
                        ${verses}
                    </div>
                `;
            }
        }
    }
    
    return null;
}

// Encontrar livro por nome (com tolerância a variações e erros de digitação)
function findBookByName(searchName, booksToSearch) {
    const normalizedSearch = searchName.toLowerCase().trim();
    
    // Mapeamento de nomes alternativos e variações com erros comuns
    const bookAliases = {
        // Salmos - variações
        'salmo': 'salmos',
        'salmos': 'salmos',
        'sl': 'salmos',
        'psalm': 'salmos',
        'psalms': 'salmos',
        
        // Mateus - variações e erros comuns
        'mateus': 'mateus',
        'matheus': 'mateus', // erro comum
        'matheu': 'mateus',  // erro comum
        'mathews': 'mateus', // erro comum
        'mt': 'mateus',
        'matthew': 'mateus',
        
        // Marcos - variações
        'marcos': 'marcos',
        'mc': 'marcos',
        'mark': 'marcos',
        
        // Lucas - variações
        'lucas': 'lucas',
        'lc': 'lucas',
        'luke': 'lucas',
        
        // João - variações e erros comuns
        'joão': 'joão',
        'joao': 'joão',     // sem acento
        'john': 'joão',
        'jo': 'joão',
        
        // Gênesis - variações e erros comuns
        'genesis': 'gênesis',  // erro comum (com z)
        'gênesis': 'gênesis',
        'geneses': 'gênesis',  // erro comum
        'genisis': 'gênesis',  // erro comum
        'gn': 'gênesis',
        
        // Êxodo - variações e erros comuns
        'exodo': 'êxodo',      // sem acento
        'êxodo': 'êxodo',
        'exodus': 'êxodo',
        'ex': 'êxodo',
        
        // Samuel - variações
        '1 samuel': '1 samuel',
        '2 samuel': '2 samuel',
        'primeiro samuel': '1 samuel',
        'segundo samuel': '2 samuel',
        '1samuel': '1 samuel',
        '2samuel': '2 samuel',
        
        // Reis - variações
        '1 reis': '1 reis',
        '2 reis': '2 reis',
        'primeiro reis': '1 reis',
        'segundo reis': '2 reis',
        '1reis': '1 reis',
        '2reis': '2 reis',
        
        // Crônicas - variações e erros comuns
        '1 cronicas': '1 crônicas',  // sem acento
        '1 crônicas': '1 crônicas',
        '2 cronicas': '2 crônicas',  // sem acento
        '2 crônicas': '2 crônicas',
        'primeiro cronicas': '1 crônicas',
        'segundo cronicas': '2 crônicas',
        '1cronicas': '1 crônicas',
        '2cronicas': '2 crônicas',
        
        // Jó - variações
        'jó': 'jó',
        'jo': 'jó',
        'job': 'jó',
        
        // Provérbios - variações e erros comuns
        'proverbios': 'provérbios',  // sem acento
        'provérbios': 'provérbios',
        'proverbio': 'provérbios',   // singular
        'pv': 'provérbios',
        'proverbs': 'provérbios',
        
        // Eclesiastes - variações
        'eclesiastes': 'eclesiastes',
        'ec': 'eclesiastes',
        'ecclesiastes': 'eclesiastes',
        
        // Isaías - variações e erros comuns
        'isaias': 'isaías',    // sem acento
        'isaías': 'isaías',
        'isaia': 'isaías',     // erro comum
        'is': 'isaías',
        'isaiah': 'isaías',
        
        // Jeremias - variações
        'jeremias': 'jeremias',
        'jr': 'jeremias',
        'jeremiah': 'jeremias',
        
        // Ezequiel - variações
        'ezequiel': 'ezequiel',
        'ez': 'ezequiel',
        'ezekiel': 'ezequiel',
        
        // Daniel - variações
        'daniel': 'daniel',
        'dn': 'daniel',
        
        // Atos - variações
        'atos': 'atos',
        'at': 'atos',
        'acts': 'atos',
        
        // Romanos - variações
        'romanos': 'romanos',
        'rm': 'romanos',
        'romans': 'romanos',
        
        // Coríntios - variações e erros comuns
        '1 corintios': '1 coríntios',  // sem acento
        '1 coríntios': '1 coríntios',
        '2 corintios': '2 coríntios',  // sem acento
        '2 coríntios': '2 coríntios',
        'primeiro corintios': '1 coríntios',
        'segundo corintios': '2 coríntios',
        '1corintios': '1 coríntios',
        '2corintios': '2 coríntios',
        '1 corinthians': '1 coríntios',
        '2 corinthians': '2 coríntios',
        
        // Gálatas - variações e erros comuns
        'galatas': 'gálatas',    // sem acento
        'gálatas': 'gálatas',
        'galata': 'gálatas',     // singular
        'gl': 'gálatas',
        'galatians': 'gálatas',
        
        // Efésios - variações e erros comuns
        'efesios': 'efésios',    // sem acento
        'efésios': 'efésios',
        'efesio': 'efésios',     // singular
        'ef': 'efésios',
        'ephesians': 'efésios',
        
        // Filipenses - variações
        'filipenses': 'filipenses',
        'fp': 'filipenses',
        'philippians': 'filipenses',
        
        // Colossenses - variações
        'colossenses': 'colossenses',
        'cl': 'colossenses',
        'colossians': 'colossenses',
        
        // Tessalonicenses - variações
        '1 tessalonicenses': '1 tessalonicenses',
        '2 tessalonicenses': '2 tessalonicenses',
        'primeiro tessalonicenses': '1 tessalonicenses',
        'segundo tessalonicenses': '2 tessalonicenses',
        '1tessalonicenses': '1 tessalonicenses',
        '2tessalonicenses': '2 tessalonicenses',
        '1 thessalonians': '1 tessalonicenses',
        '2 thessalonians': '2 tessalonicenses',
        
        // Timóteo - variações e erros comuns
        '1 timoteo': '1 timóteo',    // sem acento
        '1 timóteo': '1 timóteo',
        '2 timoteo': '2 timóteo',    // sem acento
        '2 timóteo': '2 timóteo',
        'primeiro timoteo': '1 timóteo',
        'segundo timoteo': '2 timóteo',
        '1timoteo': '1 timóteo',
        '2timoteo': '2 timóteo',
        '1 timothy': '1 timóteo',
        '2 timothy': '2 timóteo',
        
        // Hebreus - variações
        'hebreus': 'hebreus',
        'hb': 'hebreus',
        'hebrews': 'hebreus',
        
        // Tiago - variações
        'tiago': 'tiago',
        'tg': 'tiago',
        'james': 'tiago',
        
        // Pedro - variações
        '1 pedro': '1 pedro',
        '2 pedro': '2 pedro',
        'primeiro pedro': '1 pedro',
        'segundo pedro': '2 pedro',
        '1pedro': '1 pedro',
        '2pedro': '2 pedro',
        '1 peter': '1 pedro',
        '2 peter': '2 pedro',
        
        // João (cartas) - variações
        '1 joão': '1 joão',
        '2 joão': '2 joão',
        '3 joão': '3 joão',
        '1 joao': '1 joão',      // sem acento
        '2 joao': '2 joão',      // sem acento
        '3 joao': '3 joão',      // sem acento
        'primeiro joão': '1 joão',
        'segundo joão': '2 joão',
        'terceiro joão': '3 joão',
        '1joão': '1 joão',
        '2joão': '2 joão',
        '3joão': '3 joão',
        '1 john': '1 joão',
        '2 john': '2 joão',
        '3 john': '3 joão',
        
        // Apocalipse - variações
        'apocalipse': 'apocalipse',
        'ap': 'apocalipse',
        'revelation': 'apocalipse',
        'revelacao': 'apocalipse',   // sem acento
        'revelação': 'apocalipse'
    };
    
    // Verificar aliases primeiro
    const aliasName = bookAliases[normalizedSearch];
    if (aliasName) {
        return booksToSearch.find(book => book.name.toLowerCase() === aliasName);
    }
    
    // Busca direta por nome
    return booksToSearch.find(book => 
        book.name.toLowerCase() === normalizedSearch ||
        book.name.toLowerCase().includes(normalizedSearch) ||
        normalizedSearch.includes(book.name.toLowerCase())
    );
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

    const apiKey = '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';
    const url = 'https://openrouter.ai/api/v1/chat/completions';

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
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Find Jesus App'
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-chat-v3.1:free",
                "messages": [
                    {
                        "role": "system",
                        "content": systemPrompt
                    },
                    {
                        "role": "user",
                        "content": userSituation
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro da API:', errorText);
            throw new Error(`Erro ao chamar a API do DeepSeek: ${response.status}`);
        }

        const data = await response.json();
        const fullVerse = data.choices[0].message.content.trim();

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