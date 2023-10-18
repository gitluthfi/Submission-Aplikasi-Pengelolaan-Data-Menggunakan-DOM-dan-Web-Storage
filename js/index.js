const RENDER_EVENT = 'render-event'
const storageKey = 'BOOKSHELF_APP'
const books = []

function checkStorage () {
    if(typeof Storage !== undefined) {
        return true
    } else {
        return false
    }
}

function saveData() {
    if(checkStorage()){
        const dataStringfy = JSON.stringify(books)
        localStorage.setItem(storageKey, dataStringfy)
    }
}

function loadData() {
    const dataParsed = JSON.parse(localStorage.getItem(storageKey))

    if(dataParsed !== null){
        for (const data of dataParsed){
            books.push(data)
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT))
}

document.addEventListener(RENDER_EVENT, function() {
    const unfinished = document.getElementById('unfinished-read')
    unfinished.innerHTML = ''

    const finished = document.getElementById('finished-read')
    finished.innerHTML = ''

    for (const bookData of books) {
        const bookElement = createBookElement(bookData)
        if (bookData.isComplete === true) {
            finished.append(bookElement)
        } else {
            unfinished.append(bookElement)
        }
    }
})

// function generateNewBook(id,title, author,year, isComplete) {
//     return {
//         id,
//         title,
//         author,
//         year,
//         isComplete
//     }
// }

function addBook () {
    const id = +new Date
    const judul = document.getElementById('title').value
    const penulis = document.getElementById('author').value
    const rilis = parseInt(document.getElementById('date').value)
    const status = document.getElementById('isRead')
    let statusRead 
    if (status.checked){
        statusRead = true
    } else {
        statusRead = false
    }

    // const bookObject = generateNewBook(id, judul, penulis, rilis, statusRead)
    books.push({
        id: id,
        title: judul,
        author: penulis,
        year: rilis,
        isComplete: statusRead
    })
    saveData()
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function searchBook() {
    const searchResult = document.getElementById('searchResult')
        searchResult.innerHTML = ''
        const searchItem = document.getElementById('pencarian').value
        const bookData = findSearchBook(searchItem)
        if (bookData === -1) {
            const handleNotFound = document.createElement('h3')
            handleNotFound.innerText = 'Buku Tidak ditemukan'
            searchResult.append(handleNotFound)
        } else {
            for (const dataSearch of bookData) {
                const bookElement = createSearchBookElement(dataSearch)
                searchResult.append(bookElement)
            }
        }
}

function resetSearchBook() {
    const searchContainer = document.getElementById('bookResult')
    searchContainer.remove()
}

function createBookElement(bookData) {
    const textJudul = document.createElement('h2')
    textJudul.innerText = bookData.title

    const textPenulis = document.createElement('p')
    textPenulis.innerText = `Penulis : ${bookData.author}`

    const numberTerbit = document.createElement('p')
    numberTerbit.innerText = `Tahun Terbit : ${bookData.year}`

    const textContainer = document.createElement('div')
    textContainer.classList.add('item-container')
    textContainer.append(textJudul, textPenulis, numberTerbit)

    const container = document.createElement('div')
    container.classList.add('container')
    container.setAttribute('id', `bookId ${bookData.id}`)
    container.append(textContainer)

    if (bookData.isComplete == true) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('undoButton')

        undoButton.addEventListener('click', function() {
            undoBookFromCompleted(bookData.id)
        })
        
        const removeButton =document.createElement('button')
        removeButton.classList.add('removeButton')

        removeButton.addEventListener('click', function() {
            removeConfirm(bookData)
        })

        const containerButton = document.createElement('div')
        containerButton.classList.add('containerButton')
        containerButton.append(undoButton, removeButton)

        container.append(containerButton)
    } else {
        const finishButton = document.createElement('button')
        finishButton.classList.add('finishButton')

        finishButton.addEventListener('click', function () {
            addBookToCompleted(bookData.id)
        })

        const removeButton =document.createElement('button')
        removeButton.classList.add('removeButton')

        removeButton.addEventListener('click', function() {
            removeConfirm(bookData)
        })

        const containerButton = document.createElement('div')
        containerButton.classList.add('containerButton')
        containerButton.append(finishButton, removeButton)

        container.append(containerButton)
    }

    return container
}

function createSearchBookElement(bookData) {
    const textJudul = document.createElement('h2')
    textJudul.innerText = bookData.title

    const textPenulis = document.createElement('p')
    textPenulis.innerText = `Penulis : ${bookData.author}`

    const numberTerbit = document.createElement('p')
    numberTerbit.innerText = `Tahun Terbit : ${bookData.year}`

    const statusBook = document.createElement('p')

    const textContainer = document.createElement('div')
    textContainer.classList.add('item-container')
    textContainer.append(textJudul, textPenulis, numberTerbit, statusBook)

    const container = document.createElement('div')
    container.classList.add('searchContainer')
    container.setAttribute('id', `bookResult`)

    if(bookData.isComplete === true) {
        statusBook.innerText = 'status: Sudah dibaca'
    } else {
        statusBook.innerText = 'status: Belum dibaca'
    }

    container.append(textContainer)

    return container
}
function addBookToCompleted(bookId) {
    for (const booksData of books) {
        if (booksData.id === bookId) {
            booksData.isComplete = true
        }
    }
    saveData()
    document.dispatchEvent(new Event(RENDER_EVENT))    
}

function undoBookFromCompleted(bookId) {
    for (const booksData of books) {
        if(booksData.id === bookId)
        booksData.isComplete = false
    }
    saveData()
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function findSearchBook(bookKey) {
    const matchingBooks = []
    for (const bookData of books) {
        if (bookKey === bookData.title || bookKey === bookData.author || bookKey === bookData.year) {
            matchingBooks.push(bookData)
        }
    }
    if (matchingBooks.length > 0) {
        return matchingBooks
    }
    return -1
}

function removeBookfromShelf(bookId) {
    const target = findBookIndex(bookId)
    if (target === -1) return;
    books.splice(target, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

function findBookIndex(bookId) {
    for (const index of books) {
        if (index.id === bookId) {
            return books.indexOf(index)
        }
    }
    return -1
}

function removeConfirm(bookData) {
    let valueConfirm = prompt('Silahkan tulis judul buku untuk menghapus buku')
    if (valueConfirm === bookData.title) {
        removeBookfromShelf(bookData.id)
        alert('Buku berhasil dihapus, Happy Reading :)')
    } else {
        alert('Konfirmasi Gagal')
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form')
    const searchForm = document.getElementById('formSearch')
    const submitButton = document.getElementById('submitButton')
    const searchButton = document.getElementById('searchButton')
    const resetSearchButton = document.getElementById('resetSearchButton')
    loadData()
    
    submitButton.addEventListener('click', function() {
    event.preventDefault()
    addBook()
    submitForm.reset()
    })

    searchButton.addEventListener('click', function () {
        event.preventDefault()
        searchBook()
    })

    resetSearchButton.addEventListener('click', function() {
        event.preventDefault()
        searchForm.reset()
        resetSearchBook()
    })
})