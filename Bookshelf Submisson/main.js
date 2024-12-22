document.addEventListener('DOMContentLoaded', function() {
  const inputBookForm = document.getElementById('inputBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');
 
  inputBookForm.addEventListener('submit', function(event) {
    event.preventDefault();
 
    const titleInput = document.getElementById('inputBookTitle').value;
    const authorInput = document.getElementById('inputBookAuthor').value;
    const yearInput = document.getElementById('inputBookYear').value;
    const isCompleteInput = document.getElementById('inputBookIsComplete').checked;
 
    const book = createBook(titleInput, authorInput, yearInput, isCompleteInput);
    addBookToShelf(book);
  });
 
  function createBook(title, author, year, isComplete) {
    return {
      id: +new Date(),
      title,
      author,
      year: parseInt(year),
      isComplete,
    };
  }
 
  function addBookToShelf(book) {
    const shelf = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
    const bookElement = createBookElement(book);
    shelf.appendChild(bookElement);
    updateLocalStorage();
  }
 
  function createBookElement(book) {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');
    bookItem.dataset.id = book.id;
 
    const bookInfo = `
      <h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p>
      <p>Tahun: ${book.year}</p>
    `;
 
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action');
 
    const changeStatusButton = document.createElement('button');
    changeStatusButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    changeStatusButton.classList.add(book.isComplete ? 'green' : 'red');
    changeStatusButton.addEventListener('click', function() {
      moveBook(book);
    });
 
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus buku';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', function() {
      deleteBook(book);
    });
 
    actionButtons.appendChild(changeStatusButton);
    actionButtons.appendChild(deleteButton);
 
    bookItem.innerHTML = bookInfo;
    bookItem.appendChild(actionButtons);
 
    return bookItem;
  }
 
  function getBookInfo(bookElement) {
    return {
      id: parseInt(bookElement.dataset.id),
      title: bookElement.querySelector('h3').textContent,
      author: bookElement.querySelectorAll('p')[0].textContent.split(': ')[1],
      year: parseInt(bookElement.querySelectorAll('p')[1].textContent.split(': ')[1]),
      isComplete: !bookElement.querySelector('button').classList.contains('green'),
    };
  }
 
  function deleteBook(book) {
    const bookElement = document.querySelector(`[data-id="${book.id}"]`);
    bookElement.remove();
    updateLocalStorage();
  }
  function moveBook(book) {
    const shelf = book.isComplete ? incompleteBookshelfList : completeBookshelfList;
    const bookElement = document.querySelector(`[data-id="${book.id}"]`);
   
    shelf.appendChild(bookElement);
    book.isComplete = !book.isComplete;
   
    bookElement.querySelector('button').classList.remove(book.isComplete ? 'green' : 'red');
    bookElement.querySelector('button').classList.add(book.isComplete ? 'red' : 'green');
   
    bookElement.querySelector('button').textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
   
    updateLocalStorage();
   }
 
 
  function updateLocalStorage() {
    const incompleteBooks = Array.from(incompleteBookshelfList.children).map(book => getBookInfo(book));
    const completeBooks = Array.from(completeBookshelfList.children).map(book => getBookInfo(book));
    const bookshelf = { incomplete: incompleteBooks, complete: completeBooks };
    localStorage.setItem('bookshelf', JSON.stringify(bookshelf));
  }
 
  function loadBooksFromStorage() {
    const storedBookshelf = localStorage.getItem('bookshelf');
    if (storedBookshelf) {
      const bookshelf = JSON.parse(storedBookshelf);
      bookshelf.incomplete.forEach(book => {
        const bookElement = createBookElement(book);
        incompleteBookshelfList.appendChild(bookElement);
      });
      bookshelf.complete.forEach(book => {
        const bookElement = createBookElement(book);
        completeBookshelfList.appendChild(bookElement);
      });
    }
  }
 
  loadBooksFromStorage();
});