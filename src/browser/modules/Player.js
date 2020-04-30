export default class Player {
    static MAX_TRIES = 10;
    static MAX_WORDS_PER_TRY = 5;
    static MAX_TIME = 120000;

    correctWords = [];
    tries = 0;
    index = 0;

    constructor(index = 0) {
        this.index = index;
    }

    reset() {
        this.correctWords = [];
        this.tries = 0;
    }

    canPlay() {
        return this.tries < Player.MAX_TRIES;
    }

    play(words = []) {
        this.tries++;

        if (words.length > 0) {
            this.correctWords = [
                ...this.correctWords,
                ...words.reduce((acc, word) => this.correctWords.includes(word) ? acc : [
                    ...acc,
                    word
                ], [])
            ];
        }
    }
}
