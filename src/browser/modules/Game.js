import Dictionary from './Dictionary';
import Player from './Player';

export const GAME_STATE = Object.freeze({
    START: 0,
    PLAYING: 1,
    FINISHED: 2
});

export default class Game {
    static MIN_PLAYERS = 2;
    static MAX_PLAYERS = 4;

    players = [];
    winners = [];
    dictionary = null;
    currentPlayerIndex = -1;
    gameState = GAME_STATE.START;

    findNextPlayerIndex() {
        const index = this.players.findIndex(
            player => player.index > this.currentPlayerIndex && player.canPlay()
        );

        return index > -1 ? index : this.players.findIndex(player => player.canPlay());
    }

    findWinners() {
        const { winners } = this.players.reduce((acc, player) => {
            if (player.correctWords.length > acc.max) {
                return {
                    max: player.correctWords.length,
                    winners: [player]
                };
            } else if (acc.max > 0 && player.correctWords.length === acc.max) {
                return {
                    ...acc,
                    winners: [...acc.winners, player]
                };
            }

            return acc;
        }, { max: 0, winners: [] });

        return winners;
    }

    start(players, words) {

        if (players.length < Game.MIN_PLAYERS) {
            throw new Error(`Not enough players (min ${Game.MIN_PLAYERS})`);
        } else if (players.length > Game.MAX_PLAYERS) {
            throw new Error(`Too many players (max ${Game.MAX_PLAYERS})`);
        }

        players.forEach(player => player.reset());

        this.winners = [];
        this.players = players;
        this.dictionary = new Dictionary(words.reduce((acc, word) => acc.includes(word) ? acc : [...acc, word], []));
        this.gameState = GAME_STATE.PLAYING;
        this.currentPlayerIndex = 0;

        return this.players[this.currentPlayerIndex];
    }

    async play(words) {

        if (this.currentPlayerIndex === -1) {
            throw new Error('No current player, did you call start first?');
        } else if (this.gameState !== GAME_STATE.PLAYING) {
            throw new Error('Did you call start first?');
        } else if (words.length === 0) {
            throw new Error('No words found.');
        } else if (words.length > Player.MAX_WORDS_PER_TRY) {
            throw new Error(`Too many words (max ${Player.MAX_WORDS_PER_TRY})`);
        }

        try {
            const result = await this.dictionary.checkWords(words);

            this.players[this.currentPlayerIndex].play(words);
            const nextPlayerIndex = this.findNextPlayerIndex();

            if (this.players[this.currentPlayerIndex].correctWords.length === this.dictionary.words.length ||
                nextPlayerIndex === -1) {
                this.winners = this.findWinners();
                this.gameState = GAME_STATE.FINISHED;

                return null;
            }

            this.currentPlayerIndex = nextPlayerIndex;

            return this.players[nextPlayerIndex];

        } catch (err) {
            this.players[this.currentPlayerIndex].play();
            throw new Error(`Invalid words detected: (${err.join(', ')})`);
        }
    }

    forcePlayerMove() {
        this.players[this.currentPlayerIndex].play();

        const nextPlayerIndex = this.findNextPlayerIndex();

        if (nextPlayerIndex === -1) {
            this.winners = this.findWinners();
            this.gameState = GAME_STATE.FINISHED;

            return null;
        }

        this.currentPlayerIndex = nextPlayerIndex;

        return this.players[nextPlayerIndex];
    }
}
