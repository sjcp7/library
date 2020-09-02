let myLibrary = JSON.parse(localStorage.getItem('list_books')) || [];

function Book{
    constructor (title, author, pages, wasRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.wasRead = wasRead;
    }

}

function addBookToLibrary(e) {
    document.querySelector('#modal').style.display = 'none'; // After the click event, close the modal
    
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const pages = Number(document.querySelector('#pages').value);
    const wasRead = document.querySelector('#was-read').checked;
    
    const book = new Book(title, author, pages, wasRead);
    myLibrary.push(book);
    render();
    if (storageAvailable('localStorage')) { saveToStorage() }

    //Clear all the fields
    const modal = document.querySelector('#modal-content');
    modal.dispatchEvent(new Event('reset'));
}

function deleteBook(e) {
    const bookId = e.target.dataset.id;
    myLibrary.splice(bookId, 1);
    render();
    if (storageAvailable('localStorage')) { saveToStorage() }
}

function addEventListeners() {
    const submitBtn = document.querySelector('#submit');
    submitBtn.addEventListener('click', addBookToLibrary);
    
    const modal = document.querySelector('#modal');
    const cancelBtn = document.querySelector('#cancel');
    const addBookBtn = document.querySelector('#add-book');
    
    addBookBtn.onclick = () => { modal.style.display = 'block' }
    cancelBtn.onclick = () => { modal.style.display = 'none' }

}

function render() {
    const cardsDisplay = document.querySelector('#cards');
    cardsDisplay.innerHTML = '';

    myLibrary.forEach(book => {
        book.prototype = Object.create(Book.prototype);
        
        const bookId = myLibrary.indexOf(book);
        const bookCard = document.createElement('div');
        bookCard.classList.add("card");

        const titleEl = document.createElement('h2');
        titleEl.classList.add('book-title');
        titleEl.textContent = book.title;        

        const authorEl = document.createElement('h2');
        authorEl.classList.add('book-author');
        authorEl.textContent = book.author;

        const pagesEl = document.createElement('h2');
        pagesEl.classList.add('book-pages');
        pagesEl.textContent = book.pages;

        const statusEl = document.createElement('h2');        
        statusEl.classList.add('book-read');
        if (book.wasRead === true) { statusEl.innerHTML = "<span>Already read</span>" }
        else { statusEl.innerHTML = "<span>Did not read yet</span>" }

        const toggleEl = document.createElement('button')
        
        toggleEl.textContent = 'Toggle'
        toggleEl.onclick = function(e) {
            book.wasRead = !book.wasRead;
            render();
        }        
        statusEl.appendChild(toggleEl);        

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add('delete');
        deleteBtn.setAttribute('data-id', `${bookId}`);
        deleteBtn.addEventListener('click', deleteBook);

        bookCard.appendChild(titleEl);
        bookCard.appendChild(authorEl);
        bookCard.appendChild(pagesEl);
        bookCard.appendChild(statusEl);
        bookCard.appendChild(deleteBtn);

        cardsDisplay.appendChild(bookCard);
    });    
}

function saveToStorage() {
    localStorage.setItem('list_books', JSON.stringify(myLibrary));
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}
addEventListeners();
render();
