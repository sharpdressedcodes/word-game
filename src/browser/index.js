import moment from 'moment';
import get from 'lodash.get';
import config from '../config/main';
import sanitiseString from './modules/Sanitize';
import Game from './modules/Game';
import Player from './modules/Player';
import Timer from './modules/Timer';

(function run() {
    const onLoad = () => {
        let game = null;
        let players = [];
        let currentPlayer = null;
        let timer = null;
        const FLASHING = 'flashing';
        const useCountdown = get(config, 'game.useCountdown', false);
        const stages = Array.from(document.querySelectorAll('.stage'));
        const startForm = stages[0].querySelector('form');
        const playForm = stages[1].querySelector('form');
        const gameWordsInput = document.getElementById('game-words');
        const gamePlayersInput = document.getElementById('game-players');
        const playerWordsInput = document.getElementById('player-words');
        const playerIndexHeading = stages[1].querySelector('.heading__value');
        const winnersHeading = stages[2].querySelector('.heading__value');
        const restartButton = stages[2].querySelector('button');
        const timerElement = stages[1].querySelector('.timer > span');
        const ensureLeadingZero = num => (num.toString().length === 1 ? `0${num}` : num);
        const getWordsFromInput = element => (element.value.length === 0
            ? []
            : sanitiseString(element.value).split(',').map(word => word.trim()));
        const changeStage = (oldIndex, newIndex) => {
            stages[oldIndex].style.display = 'none';
            stages[newIndex].style.display = 'block';
        };
        const showWinners = () => {
            winnersHeading.textContent = game.winners.length === 0
                ? 'No winners'
                : game.winners
                    .map(winner => winner.index + 1)
                    .join(', ');
            changeStage(1, 2);
        };
        const doTimer = start => {
            if (useCountdown) {
                timer[start ? 'start' : 'stop']();
            }
        };
        const onTimeout = () => {

            if (timerElement.classList.contains(FLASHING)) {
                timerElement.classList.remove(FLASHING);
            }

            alert('Timed out!');
            playerWordsInput.value = '';

            const nextPlayer = game.forcePlayerMove();

            if (!nextPlayer) {
                showWinners();
                return;
            }

            playerIndexHeading.textContent = `${nextPlayer.index + 1}`;
            timer.start();
        };
        const onInterval = count => {
            const remaining = Player.MAX_TIME - (count || 0);
            const duration = moment.duration(remaining, 'milliseconds');
            const time = [
                duration.hours(),
                duration.minutes(),
                duration.seconds()
            ];
            const timeString = time.map(ensureLeadingZero);
            const shouldFlash = time[0] === 0 && time[1] === 0 && time[2] <= 30;

            timerElement.textContent = timeString.join(':');

            if (shouldFlash && !timerElement.classList.contains(FLASHING)) {
                timerElement.classList.add(FLASHING);
            } else if (!shouldFlash && timerElement.classList.contains(FLASHING)) {
                timerElement.classList.remove(FLASHING);
            }
        };
        const onStart = event => {
            event.preventDefault();

            const words = getWordsFromInput(gameWordsInput);

            if (words.length === 0) {
                alert('Invalid value for Game words.');
                return;
            }

            const numPlayers = parseInt(gamePlayersInput.value, 10);

            players = [];

            for (let i = 0; i < numPlayers; i++) {
                players.push(new Player(i));
            }

            try {
                game = new Game();
                currentPlayer = game.start(players, words);

                playerIndexHeading.textContent = `${currentPlayer.index + 1}`;

                changeStage(0, 1);
                playerWordsInput.focus();

                if (useCountdown) {
                    timer = new Timer(1000, Player.MAX_TIME, onInterval, onTimeout);
                    timer.start();
                    onInterval();
                }
            } catch (err) {
                doTimer(false);
                alert(err.message);
                doTimer(true);
            }
        };
        const onPlay = async event => {
            event.preventDefault();

            doTimer(false);

            const words = getWordsFromInput(playerWordsInput);

            try {
                const nextPlayer = await game.play(words);

                playerWordsInput.value = '';

                if (!nextPlayer) {
                    showWinners();
                    return;
                }

                playerIndexHeading.textContent = `${nextPlayer.index + 1}`;
                doTimer(true);
            } catch (err) {
                doTimer(false);
                alert(err.message);
                doTimer(true);
            }
        };
        const onRestart = () => {
            gameWordsInput.value = '';
            changeStage(2, 0);
            gameWordsInput.focus();
        };

        startForm.addEventListener('submit', onStart, false);
        playForm.addEventListener('submit', onPlay, false);
        restartButton.addEventListener('click', onRestart, false);

        gameWordsInput.focus();
    };

    window.addEventListener('load', onLoad, false);
}());
