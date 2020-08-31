import {openDB} from 'idb';
import * as Events from "./events";

const BOOKS = 'books';
const SECTIONS = 'sections';
const ELEMENTS = 'elements';

let db;

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

openDB('fb2-reader', 1, {
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
}).then(x => {
    db = x;
    Events.dispatch(Events.DB_READY);
});


export function addBook(book) {
    return db.add(BOOKS, book);
}

export function bookExists(book) {
    return db.count(BOOKS, book.hashHex );
}

export function addSection(section) {
    return db.add(SECTIONS, section);
}

export function addElement(element) {
    return db.add(ELEMENTS, element);
}

export function getAllBooks() {
    return db.getAll(BOOKS);
}
