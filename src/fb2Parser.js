import {addSection, addElement, addBook, bookExists} from "./db.js";

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

export class Fb2Parser {
    xml;
    body;
    book;
    bookExists;

    constructor(xml) {
         this.xml = xml;
    }

    async parseSection(section, parentSectionId, sectionOrdinal) {
        //  <p>, <image>, <poem>, <subtitle>, <cite>, <empty-line/>, <table>

        const title = section.querySelector('title');
        const image = section.querySelector('image');
        const elements = section.querySelectorAll(':scope > *');

        const id = await addSection({parent: parentSectionId, ordinal: sectionOrdinal,
            title: title?.textContent ?? null, image: image?.href ?? null });

        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            if (element.tagName === 'section') {
                await this.parseSection(section, id, i);
            } else {
                await addElement({tag: element.tagName, content: element.innerHTML, sectionId: id, ordinal: i })
            }
        }
    }

    async parseBody() {
        const bookId = await addBook(this.book);

        // image, title, epigraph, section
        const body = this.body;

        const title = body.querySelector('title');
        const image = body.querySelector('image');
        const sections = body.querySelectorAll(':scope > section');

        const id = await addSection({title: title?.textContent ?? null, image: image?.href ?? null, bookId });
        for (let i = 0; i < sections.length; ++i) {
            await this.parseSection(sections[i], id, i);
        }
    }

    async parseDescription() {
        const hash = await window.crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(this.xml));
        const hashHex = buf2hex(hash);

        const parser = new DOMParser();
        const doc = parser.parseFromString(this.xml, "application/xml");
        const description = doc.querySelector('description');

        const author = description.querySelector('author first-name').textContent + ' ' +
            description.querySelector('author last-name').textContent;
        const title = description.querySelector('book-title');

        let annotation = description.querySelector('annotation');
        annotation = annotation && annotation.textContent;

        // image
        let image;
        const imageInfo = description.querySelector('coverpage image');
        if (imageInfo) {
            const imageHref = imageInfo.getAttribute('l:href');
            if (imageHref && /^#/.test(imageHref)) {
                const id = imageHref.slice(1);
                const imageBinary = doc.querySelector(`binary[id="${id}"]`);
                if (imageBinary) {
                    const type = imageBinary.getAttribute('content-type');
                    image = `data:${type};base64,${imageBinary.innerHTML}`;
                }
            }
        }


        const book = {hashHex, author: author, title: title.textContent, annotation, image};

        this.body = doc.querySelector('body');
        this.book = book;
        this.bookExists = await bookExists(book);
        return book;
    }

    get isAlreadyAdded() {
        return this.bookExists;
    }

}

