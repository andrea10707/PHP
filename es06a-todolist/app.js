// ============================================
// COSTANTI E CONFIGURAZIONE
// ============================================
// 💡 Usa const per valori che non cambiano mai
const STORAGE_KEY = 'todoListData';  // Chiave per localStorage

// ============================================
// STATO APPLICAZIONE (Dati)
// ============================================
// 💡 Questi sono i dati "in memoria" dell'applicazione
let todosData = {
    todos: [],      // Array di oggetti task
    nextId: 1       // Prossimo ID da assegnare
};

let currentFilter = 'all'; // Filtro attivo: 'all', 'active', 'completed'

// ============================================
// INIZIALIZZAZIONE
// ============================================
// 💡 Aspetta che tutto l'HTML sia caricato
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('🚀 Applicazione avviata');
    
    // STEP 1: Carica dati salvati
    loadTodos();
    
    // STEP 2: Attiva pulsanti e form
    setupEventListeners();
    
    // STEP 3: Mostra task (se ce ne sono)
    renderTodos();
}

// ============================================
// FUNZIONI DA IMPLEMENTARE
// ============================================

// TODO: Implementa tutte le funzioni qui sotto
/**
 * Carica i dati salvati da localStorage e li deserializza
 * Viene chiamata all'avvio dell'applicazione
 */
 function loadTodos() {
    try {
        // STEP 1: Recupera stringa JSON da localStorage
        const jsonString = localStorage.getItem(STORAGE_KEY);
        // localStorage.getItem() ritorna:
        // - stringa JSON se chiave exists
        // - null se chiave non esiste
        
        console.log('📖 Lettura localStorage:', jsonString ? 'Dati trovati' : 'Nessun dato');
        
        // STEP 2: Se esistono dati, deserializza JSON
        if (jsonString) {
            todosData = JSON.parse(jsonString);
            // JSON.parse() converte:
            // '{"todos":[],"nextId":1}' → { todos: [], nextId: 1 }
            
            console.log('✅ Dati caricati:', todosData.todos.length + ' task');
        } else {
            console.log('ℹ️ Nessun dato salvato, uso dati vuoti');
            // Prima apertura app → todosData resta { todos: [], nextId: 1 }
        }
    } catch (error) {
        // STEP 3: Gestisci errori (es. JSON corrotto)
        console.error('❌ Errore caricamento:', error);
        alert('⚠️ Errore nel caricamento dei dati. Verrà creata una nuova lista.');
        
        // Reset a dati vuoti
        todosData = { todos: [], nextId: 1 };
    }
}

/**
 * Serializza i dati e li salva in localStorage
 * Viene chiamata dopo ogni modifica (add, delete, toggle)
 */
 function saveTodos() {
    try {
        // STEP 1: Serializza oggetto in stringa JSON
        const jsonString = JSON.stringify(todosData);
        // JSON.stringify() converte:
        // { todos: [], nextId: 1 } → '{"todos":[],"nextId":1}'
        
        // STEP 2: Salva in localStorage
        localStorage.setItem(STORAGE_KEY, jsonString);
        // localStorage.setItem(key, value) salva:
        // key: 'todoListData'
        // value: la stringa JSON
        
        console.log('💾 Dati salvati (' + jsonString.length + ' caratteri)');
    } catch (error) {
        // STEP 3: Gestisci errori (es. quota superata ~5-10MB)
        console.error('❌ Errore salvataggio:', error);
        alert('⚠️ Errore nel salvataggio dei dati! Lo storage potrebbe essere pieno.');
    }
}

/**
 * Aggiunge una nuova task alla lista
 * @param {string} title - Titolo task (obbligatorio)
 * @param {string} description - Descrizione task (opzionale)
 * @returns {boolean} true se aggiunta con successo, false se errore
 */
 function addTodo(title, description = '') {
    // STEP 1: VALIDAZIONE input
    // Controlla che il titolo non sia vuoto o solo spazi
    if (!title || title.trim() === '') {
        alert('⚠️ Il titolo è obbligatorio!');
        return false; // Blocca esecuzione
    }
    
    // STEP 2: CREA nuovo oggetto task
    const newTodo = {
        id: todosData.nextId,              // ID univoco incrementale (1, 2, 3, ...)
        title: title.trim(),                // Rimuovi spazi inizio/fine
        description: description.trim(),    // Opzionale
        completed: false,                   // Inizialmente NON completata
        createdAt: new Date().toISOString() // Data/ora ISO: "2024-03-14T10:30:00.000Z"
    };
    
    console.log('➕ Creando task:', newTodo);
    
    // STEP 3: AGGIUNGI all'array todos
    todosData.todos.push(newTodo);
    // push() aggiunge elemento alla fine dell'array
    
    // STEP 4: INCREMENTA ID per prossima task
    todosData.nextId++;
    // Così ogni task ha ID univoco: 1, 2, 3, 4, ...
    
    // STEP 5: SALVA in localStorage
    saveTodos();
    // IMPORTANTE: Sempre salvare dopo modifiche!
    
    // STEP 6: AGGIORNA interfaccia
    renderTodos();
    // Rigenera HTML per mostrare nuova task
    
    console.log('✅ Task aggiunta! Totale:', todosData.todos.length);
    return true; // Successo
}

/**
 * Elimina una task dall'array
 * @param {number} id - ID della task da eliminare
 */
 function deleteTodo(id) {
    // STEP 1: CONFERMA eliminazione (UX migliore)
    if (!confirm('🗑️ Sei sicuro di voler eliminare questa task?')) {
        console.log('❌ Eliminazione annullata');
        return; // Utente ha cliccato "Annulla"
    }
    
    console.log('🗑️ Eliminando task con id:', id);
    
    // STEP 2: RIMUOVI task dall'array
    // filter() crea nuovo array escludendo elementi che non rispettano condizione
    const lengthBefore = todosData.todos.length;
    
    todosData.todos = todosData.todos.filter(todo => todo.id !== id);
    // Tiene SOLO le task con id DIVERSO da quello da eliminare
    
    const lengthAfter = todosData.todos.length;
    console.log(`📊 Task eliminate: ${lengthBefore - lengthAfter}`);
    
    // STEP 3: SALVA e AGGIORNA UI
    saveTodos();
    renderTodos();
    
    console.log('✅ Task eliminata, rimanenti:', todosData.todos.length);
}

/**
 * Inverte lo stato completed di una task (true ↔ false)
 * @param {number} id - ID della task da modificare
 */
 function toggleTodo(id) {
    console.log('🔄 Toggle task id:', id);
    
    // STEP 1: TROVA task nell'array
    const todo = todosData.todos.find(t => t.id === id);
    // find() ritorna:
    // - primo elemento che rispetta condizione
    // - undefined se nessun elemento trovato
    
    // STEP 2: Se trovata, INVERTI stato completed
    if (todo) {
        // Operatore NOT (!) inverte booleano
        todo.completed = !todo.completed;
        // false → true (diventa completata)
        // true  → false (diventa attiva)
        
        console.log(`✓ Task ${id} → ${todo.completed ? 'COMPLETATA ✅' : 'ATTIVA ⏳'}`);
        
        // STEP 3: SALVA e AGGIORNA UI
        saveTodos();
        renderTodos();
    } else {
        console.warn('⚠️ Task non trovata:', id);
    }
}

/**
 * Renderizza (visualizza) la lista di task filtrate
 * Viene chiamata ogni volta che i dati cambiano o il filtro cambia
 */
 function renderTodos() {
    console.log('🎨 Rendering task, filtro:', currentFilter);
    
    // STEP 1: RECUPERA container dal DOM
    const todoList = document.getElementById('todoList');
    // getElementById() trova elemento con id="todoList"
    
    // STEP 2: PULISCI contenuto precedente
    todoList.innerHTML = '';
    // Svuota completamente il container
    // IMPORTANTE: Rimuove tutti gli elementi HTML dentro
    
    // STEP 3: FILTRA task in base al filtro attivo
    const filteredTodos = getFilteredTodos();
    // Ritorna array filtrato (all/active/completed)
    
    console.log(`📊 Mostrando ${filteredTodos.length} di ${todosData.todos.length} task`);
    
    // STEP 4: Controlla se lista è vuota
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<p class="empty-message">📝 Nessuna task da visualizzare</p>';
        updateCounter();
        return; // STOP - non c'è nient'altro da fare
    }
    
    // STEP 5: CREA elemento DOM per ogni task
    filteredTodos.forEach((todo, index) => {
        const todoElement = createTodoElement(todo);
        // createTodoElement() genera <div> completo della task
        
        todoList.appendChild(todoElement);
        // appendChild() aggiunge elemento come figlio
        
        console.log(`  ${index + 1}. Task renderizzata: ${todo.title}`);
    });
    
    // STEP 6: AGGIORNA contatore task attive
    updateCounter();
}

/**
 * Crea elemento DOM HTML per una singola task
 * @param {Object} todo - Oggetto task da visualizzare
 * @returns {HTMLElement} Elemento <div> della task
 */
 function createTodoElement(todo) {
    // STEP 1: CREA elemento div container
    const div = document.createElement('div');
    // createElement('div') → <div></div>
    
    // STEP 2: AGGIUNGI classi CSS
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    // Se completed=true: class="todo-item completed"
    // Se completed=false: class="todo-item"
    
    // STEP 3: SALVA ID come data attribute
    div.dataset.id = todo.id;
    // dataset.id → <div data-id="1">
    // Utile per identificare task negli event handler
    
    // STEP 4: COSTRUISCI HTML interno con template literal
    div.innerHTML = `
        <!-- Checkbox per completare/riattivare -->
        <input type="checkbox" 
               class="todo-checkbox" 
               ${todo.completed ? 'checked' : ''}>
        
        <!-- Contenuto task -->
        <div class="todo-content">
            <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
            ${todo.description ? `<p class="todo-description">${escapeHtml(todo.description)}</p>` : ''}
            <small class="todo-date">${formatDate(todo.createdAt)}</small>
        </div>
        
        <!-- Pulsante elimina -->
        <div class="todo-actions">
            <button class="btn-delete">🗑️ Elimina</button>
        </div>
    `;
    
    // STEP 5: AGGIUNGI event listeners agli elementi
    
    // Event: Checkbox cliccata
    const checkbox = div.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', () => {
        console.log(`☑️ Checkbox cliccata per task ${todo.id}`);
        toggleTodo(todo.id);
    });
    
    // Event: Pulsante elimina cliccato
    const btnDelete = div.querySelector('.btn-delete');
    btnDelete.addEventListener('click', () => {
        console.log(`🗑️ Elimina cliccato per task ${todo.id}`);
        deleteTodo(todo.id);
    });
    
    return div; // Ritorna elemento completo
}

/**
 * Filtra array task in base al filtro corrente
 * @returns {Array} Array di task filtrate
 */
 function getFilteredTodos() {
    // Usa switch per gestire 3 casi
    switch (currentFilter) {
        case 'active':
            // Ritorna SOLO task NON completate
            return todosData.todos.filter(t => !t.completed);
            // !t.completed → true se completed=false
            
        case 'completed':
            // Ritorna SOLO task completate
            return todosData.todos.filter(t => t.completed);
            // t.completed → true se completed=true
            
        default: // 'all'
            // Ritorna TUTTE le task
            return todosData.todos;
    }
}

/**
 * Aggiorna il contatore delle task attive nel footer
 */
 function updateCounter() {
    // STEP 1: CONTA task attive (completed=false)
    const activeCount = todosData.todos.filter(t => !t.completed).length;
    // filter().length → conta elementi che rispettano condizione
    
    // STEP 2: TROVA elemento contatore
    const countElement = document.getElementById('activeCount');
    
    // STEP 3: AGGIORNA testo
    // Usa singolare/plurale corretto
    countElement.textContent = `${activeCount} task ${activeCount === 1 ? 'attiva' : 'attive'}`;
    // activeCount=1 → "1 task attiva"
    // activeCount!=1 → "N task attive"
    
    console.log(`📊 Contatore aggiornato: ${activeCount} attive`);
}

/**
 * Escape HTML per prevenire XSS (Cross-Site Scripting)
 * Converte caratteri speciali HTML in entità sicure
 * @param {string} text - Testo da rendere sicuro
 * @returns {string} Testo con caratteri HTML escapati
 */
 function escapeHtml(text) {
    // TRICK: Usa textContent per escape automatico
    const div = document.createElement('div');
    div.textContent = text; // textContent NON interpreta HTML
    return div.innerHTML;   // innerHTML ritorna HTML escapato
}

/**
 * Formatta data ISO in formato leggibile italiano
 * @param {string} isoString - Data ISO (es. "2024-03-14T10:30:00.000Z")
 * @returns {string} Data formattata (es. "14/03/2024, 10:30")
 */
 function formatDate(isoString) {
    // STEP 1: Crea oggetto Date da stringa ISO
    const date = new Date(isoString);
    // "2024-03-14T10:30:00.000Z" → Date object
    
    // STEP 2: Formatta data in italiano
    const dateStr = date.toLocaleDateString('it-IT');
    // → "14/03/2024"
    
    // STEP 3: Formatta ora in italiano
    const timeStr = date.toLocaleTimeString('it-IT', {
        hour: '2-digit',   // 2 cifre per ora (01, 02, ..., 23)
        minute: '2-digit'  // 2 cifre per minuti
    });
    // → "10:30"
    
    // STEP 4: Combina data + ora
    return `${dateStr}, ${timeStr}`;
    // → "14/03/2024, 10:30"
}

/**
 * Configura tutti gli event listeners dell'applicazione
 * Viene chiamata una sola volta all'inizializzazione
 */
 function setupEventListeners() {
    console.log('🎮 Configurazione event listeners');
    
    // ══════════════════════════════════════
    // EVENT 1: Click su pulsante "Aggiungi"
    // ══════════════════════════════════════
    const addBtn = document.getElementById('addBtn');
    addBtn.addEventListener('click', handleAddTodo);
    console.log('✓ Event listener: Pulsante Aggiungi');
    
    // ══════════════════════════════════════
    // EVENT 2: Tasto ENTER nel campo titolo
    // ══════════════════════════════════════
    const titleInput = document.getElementById('todoTitle');
    titleInput.addEventListener('keypress', (e) => {
        // Controlla se tasto premuto è ENTER
        if (e.key === 'Enter') {
            handleAddTodo(); // Stesso effetto del pulsante
        }
    });
    console.log('✓ Event listener: Enter su titolo');
    
    // ══════════════════════════════════════
    // EVENT 3: Click sui pulsanti filtro
    // ══════════════════════════════════════
    const filterButtons = document.querySelectorAll('.filter-btn');
    // querySelectorAll() trova TUTTI gli elementi con classe
    // Ritorna NodeList (simile ad array)
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
    console.log(`✓ Event listener: ${filterButtons.length} pulsanti filtro`);
}

/**
 * Handler per aggiungere una nuova task
 * Chiamato da: click pulsante "Aggiungi" OPPURE tasto ENTER
 */
 function handleAddTodo() {
    console.log('➕ Handler: Aggiungi task');
    
    // STEP 1: RECUPERA elementi input dal DOM
    const titleInput = document.getElementById('todoTitle');
    const descInput = document.getElementById('todoDescription');
    
    // STEP 2: LEGGI valori
    const title = titleInput.value;
    const description = descInput.value;
    
    console.log(`📝 Tentativo aggiunta: "${title}"`);
    
    // STEP 3: CHIAMA funzione addTodo()
    const success = addTodo(title, description);
    // addTodo() ritorna true se successo, false se errore
    
    // STEP 4: Se successo, PULISCI form
    if (success) {
        titleInput.value = '';     // Svuota campo titolo
        descInput.value = '';      // Svuota campo descrizione
        titleInput.focus();        // Riporta focus su titolo (UX)
        
        console.log('✅ Task aggiunta e form resettato');
    } else {
        // Errore (validazione fallita)
        titleInput.focus(); // Focus su titolo per correzione
        console.log('❌ Aggiunta fallita (validazione)');
    }
}

/**
 * Handler per aggiungere una nuova task
 * Chiamato da: click pulsante "Aggiungi" OPPURE tasto ENTER
 */
 function handleAddTodo() {
    console.log('➕ Handler: Aggiungi task');
    
    // STEP 1: RECUPERA elementi input dal DOM
    const titleInput = document.getElementById('todoTitle');
    const descInput = document.getElementById('todoDescription');
    
    // STEP 2: LEGGI valori
    const title = titleInput.value;
    const description = descInput.value;
    
    console.log(`📝 Tentativo aggiunta: "${title}"`);
    
    // STEP 3: CHIAMA funzione addTodo()
    const success = addTodo(title, description);
    // addTodo() ritorna true se successo, false se errore
    
    // STEP 4: Se successo, PULISCI form
    if (success) {
        titleInput.value = '';     // Svuota campo titolo
        descInput.value = '';      // Svuota campo descrizione
        titleInput.focus();        // Riporta focus su titolo (UX)
        
        console.log('✅ Task aggiunta e form resettato');
    } else {
        // Errore (validazione fallita)
        titleInput.focus(); // Focus su titolo per correzione
        console.log('❌ Aggiunta fallita (validazione)');
    }
}

/**
 * Handler per il cambio di filtro
 * Chiamato quando utente clicca su pulsante filtro
 * @param {Event} e - Oggetto evento del click
 */
 function handleFilterChange(e) {
    console.log('🔍 Handler: Cambio filtro');
    
    // STEP 1: RIMUOVI classe 'active' da TUTTI i pulsanti
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Tutti i pulsanti diventano inattivi
    
    // STEP 2: AGGIUNGI classe 'active' al pulsante CLICCATO
    e.target.classList.add('active');
    // e.target → elemento che ha scatenato evento (pulsante cliccato)
    
    // STEP 3: AGGIORNA variabile filtro corrente
    currentFilter = e.target.dataset.filter;
    // dataset.filter legge attributo data-filter
    // <button data-filter="active"> → currentFilter = 'active'
    
    console.log(`🔍 Nuovo filtro: ${currentFilter}`);
    
    // STEP 4: RI-RENDERIZZA lista con nuovo filtro
    renderTodos();
    // renderTodos() chiama getFilteredTodos() che usa currentFilter
}

