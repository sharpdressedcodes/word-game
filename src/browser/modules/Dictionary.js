export default class Dictionary {
    words = [];

    constructor(words) {
        this.words = words;
    }

    checkWords(words) {
        return new Promise((resolve, reject) => {
            const result = words.reduce((a, word) => this.words.includes(word) ? a : [...a, word], []);

            if (result.length === 0) {
                resolve(true);
            } else {
                reject(result);
            }
        });
    }
}
