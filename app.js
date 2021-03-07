// dom elements
const progress = document.getElementById('progress');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');

let isPlaying = false;
let duration = 0;
let currentTime = 0;

let song = new Audio('music/01. Algorithm.mp3');

function playSong() {
    if (!isPlaying) {
        song.play();
        
        isPlaying = true;
        duration = song.duration;
        progress.max = duration;
        playIcon.className = "fa fa-pause";
        
    } else {
        song.pause();
        isPlaying = false;

        playIcon.className = "fa fa-play";
    }
}

playBtn.addEventListener("click", playSong);

progress.addEventListener("change", function() {
    song.currentTime = progress.value;
});

song.addEventListener("timeupdate", function() {
    progress.value = song.currentTime;
});

