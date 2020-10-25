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
        sections.createIndex('ordinal', 'ordinal');

        const elements = db.createObjectStore(ELEMENTS, {
            keyPath: ['sectionId', 'ordinal']
        });
        elements.createIndex('sectionId', 'sectionId');
        elements.createIndex('ordinal', 'ordinal');

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

function wait(f) {
    if (db) {
        return f(db);
    }
    return openedDb.then(() => f(db));
}

export const getAllBooks = () => wait(db => db.getAll(BOOKS));

export const getBook = hash => wait(db => db.get(BOOKS, hash));

export const getRootSection = hash => wait(db => db.getFromIndex(SECTIONS, 'parent', hash));

export const getChild = (parentSectionId, ordinal = 1) => wait(async db => {
    let item = await db.getFromIndex(ELEMENTS, 'ordinal', ordinal);
    if (!item) {
        item = await db.getFromIndex(SECTIONS, 'ordinal', ordinal);
    }
    if (!item || !(item.parent === parentSectionId  || item.sectionId === parentSectionId) ) {
        return null;
    }
    return item;
})

export function getSections(parent) {
    return db.getAllFromIndex(SECTIONS, 'parent', parent);
}
