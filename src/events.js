export const DB_READY = 'db-ready';
export const BOOK_ALREADY_ADDED = 'book-already-added';
export const BOOK_ADDING = 'book-adding';
export const BOOK_ADDED = 'book-added';

export function dispatch(type, detail) {
    document.dispatchEvent(new CustomEvent(type, { detail }));
}

export function on(...types) {
    return {
        do (subscription) {
            types.forEach(type => document.addEventListener(type, subscription));
        }
    };
}


