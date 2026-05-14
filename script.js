document.addEventListener('DOMContentLoaded', function() {
    const notesContainer=document.getElementById('notesContainer');
    const newNoteInput=document.getElementById('newNote');
    const addNoteBtn=document.getElementById('addNoteBtn');
     // Charger les notes au démarrage
    loadNotes();
    updateStats();
    //Add note event 
    addNoteBtn.addEventListener('click',addNote);
    newNoteInput.addEventListener('keypress',function(e){
        if(e.key==='Enter') addNote();
    });

    //Event delegation for checkboxes and delete buttons
    notesContainer.addEventListener('click',function(e){
        if(e.target.classList.contains('note-checkbox')) {
            const note =e.target.closest('.note');
            note.classList.toggle('completed', e.target.checked);
            saveNotes();
            updateStats();
            showNotification('Statut mis à jour');
        }

    });
    notesContainer.addEventListener('click', function(e) {
        // 1. DELETE button
        if (e.target.classList.contains('btn-delete') || e.target.parentElement.classList.contains('btn-delete')) {
            // find the parent .note
            const note = e.target.closest('.note');
            // delete it from the DOM
            note.remove();
            // update localStorage
            saveNotes();
            updateStats();
            showNotification('Note supprimée');
                }  
        // 2. EDIT button
// Bouton éditer (sans prompt)
if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
    const note = e.target.closest('.note');
    const content = note.querySelector('.note-content');

    // Create an input field to replace the text
    const input = document.createElement('input');
    input.type = 'text';
    input.value = content.textContent;
    input.className = 'edit-input';

    // Replace text with input
    note.replaceChild(input, content);
    input.focus();

    // When user presses Enter or leaves the input
    function saveEdit() {
        if (input.value.trim() !== '') {
            content.textContent = input.value.trim();
        }
        note.replaceChild(content, input);
        saveNotes();
        showNotification('Note modifiée');
    }

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}

    });
    //Functions
    function addNote(){
        // 1. Get the text from the input
        const noteText = newNoteInput.value.trim();
        // 2. If input is empty, stop
        if(noteText==='') return;
         // 3. Create a new <div> for the note
        const noteElement=document.createElement('div');
        noteElement.className='note';
         // 4. Add inner HTML: checkbox, note content, and action buttons
        noteElement.innerHTML=`
         <input type="checkbox" class="note-checkbox">
         <div class="note-content">${noteText}</div>
         <div class="note-actions">
            <button class="note-btn btn-edit"><i class="fas fa-edit"></i> Edit</button>
            <button class="note-btn btn-delete"><i class="fas fa-trash"></i> Delete</button>
         </div>`;
         // 5. Append new note to the container
         notesContainer.appendChild(noteElement);
         // 6. Reset input field
         newNoteInput.value='';
         newNoteInput.focus();
         // 7. Save notes to localStorage
         saveNotes();
         updateStats();
        showNotification('Note ajoutée');
    }
    function saveNotes(){
        const notes=[];
        // 2. Find ALL elements in the page with class "note"
        document.querySelectorAll('.note').forEach(note=>{
             // 3. For each note, extract data and push into the array
            notes.push({
                  // Get the text inside a child element <div class="note-content">
                text: note.querySelector('.note-content').textContent,
                // Get whether the checkbox inside the note is checked
                completed: note.querySelector('.note-checkbox').checked
            });

        });
        // 4. Convert notes array to JSON string and store it in localStorage
        localStorage.setItem('notes',JSON.stringify(notes));
    }
    function loadNotes(){
        // 1. Get the saved notes from localStorage
        // localStorage.getItem('notes') returns a string, so JSON.parse() turns it back into an array of objects.
        const savedNotes=JSON.parse(localStorage.getItem('notes'));
        // 2. Check if there are any saved notes
        if(savedNotes && savedNotes.length > 0){
            // Clear out existing notes in the container
            notesContainer.innerHTML='';
             // 3. Loop through each saved note
            savedNotes.forEach(note=> {
                // 4. Build the note's HTML structure
                const noteElement=document.createElement('div');
                noteElement.className='note';
                noteElement.innerHTML=`
                    <input type="checkbox" class="note-checkbox" ${note.completed ? 'checked' : ''}>
                    <div class="note-content">${note.text}</div>
                    <div class="note-actions">
                        <button class="note-btn btn-edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="note-btn btn-delete"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                `;
                // 5. Add the built note to the container
                notesContainer.appendChild(noteElement);
                if (note.completed) {
                noteElement.classList.add('completed');}
            });
    }
}
function updateStats() {
    const totalTasks = document.querySelectorAll('.note').length;
    const completedTasks = document.querySelectorAll('.note.completed').length;

    document.getElementById('totalTasks').textContent = `Total notes: ${totalTasks}`;
    document.getElementById('completedTasks').textContent = `Complétées: ${completedTasks}`;
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
                
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

});