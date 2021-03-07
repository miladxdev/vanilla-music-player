// dom elements
const progress = document.getElementById('progress');
const playBtn = document.getElementById('play');

let isPlaying = false;
let duration = 0;
let currentTime = 0;

let song = new Audio('music/01. Algorithm.mp3');

function playSong() {
    if (!isPlaying) {
        song.play();
        isPlaying = true;
    } else {
        song.pause();
        isPlaying = false;
    }
}

playBtn.addEventListener("click", playSong);