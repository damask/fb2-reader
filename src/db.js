import {openDB} from 'idb';

const BOOKS = 'books';
const SECTIONS = 'sections';
const ELEMENTS = 'elements';

let db;

const openedDb = openDB('fb2-reader', 1, {
    upgrade(db) {
        // Create a store of objects
        const books = db.createObjectStore(BOOKS, {
            keyPath: 'hashHex', autoIncrement: true
        });
        books.createIndex('author', 'author');

        const sections = db.createObjectStore(SECTIONS, {
            keyPath: 'id', autoIncrement: true
        });
        sections.createIndex('parent', 'parent');

        const elements = db.createObjectStore(ELEMENTS, {
            keyPath: ['sectionId', 'ordinal']
        });
        elements.createIndex('sectionId', 'sectionId');

    }
});

openedDb.then(x => db = x);

export function addBook(book) {
    return db.add(BOOKS, book);
}

export function bookExists(book) {
    return db.count(BOOKS, book.hashHex);
}

export function addSection(section) {
    return db.add(SECTIONS, section);
}

export function addElement(element) {
    return db.add(ELEMENTS, element);
}

export function getAllBooks() {
    if (db) {
        return db.getAll(BOOKS);
    }
    return openedDb.then(() => db.getAll(BOOKS));
}

export function getBook(hash) {
    if (db) {
        return db.get(BOOKS, hash);
    }
    return openedDb.then(() => db.get(BOOKS, hash));
}

export function getRootSection() {
    if (db) {
        return db.getFromIndex(SECTIONS, 'parent', -1);
    }
    return openedDb.then(() => db.getFromIndex(SECTIONS, 'parent', -1));
}

export function getSections(parent) {
    return db.getAllFromIndex(SECTIONS, 'parent', parent);
}
