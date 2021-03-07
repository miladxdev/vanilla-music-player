// dom elements
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');

const progress = document.getElementById('progress');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const nextBtn = document.getElementById('next');

let isPlaying = false;
let duration = 0;
let currentTime = 0;

let playList = [
    {title: 'The Dark side', artist: 'Muse', album:'Simulation Theory', src: 'music/The Dark Side.mp3', cover: 'cover/simulation-theory.jpg'},
    {title: 'Born to Die', artist: 'Lana Del Rey', album:'Born to Die', src: 'music/Born to Die.mp3', cover: 'cover/born-to-die.jpg'},
];
let track = 0;
let nowPlaying = playList[track];
console.log(nowPlaying);

let song = new Audio('music/The Dark Side.mp3');



function playSong() {
    song.src = nowPlaying.src;
    // update music info
    cover.src = nowPlaying.cover;
    title.innerHTML = nowPlaying.title;
    artist.innerHTML = nowPlaying.artist;
   

    if (!isPlaying) {
        song.play();
        isPlaying = true;
        duration = song.duration;
         console.log(song.duration);
        progress.max = duration;
        playIcon.className = "fa fa-pause";
    } else {
        song.pause();
        isPlaying = false;

        playIcon.className = "fa fa-play";
    }
}

// function nextSong() {
//     track = 1;
//     song.play();
//     cover.src = nowPlaying.cover;
//     title.innerHTML = nowPlaying.title;
//     artist.innerHTML = nowPlaying.artist;
// }


playBtn.addEventListener("click", playSong);
nextBtn.addEventListener("click", () => {
    if (track == 0) {
        track = 1;
    } else {
        track = 0;
    }
    nowPlaying = playList[track];
    isPlaying = false;
    playSong();
});


let touch = false;
progress.addEventListener("mousedown", function() {
    touch = true;
    
});
progress.addEventListener("mouseup", function() {
    touch = false;
    
});
progress.addEventListener("change", function() {
    song.currentTime = progress.value;
    
});
song.addEventListener("timeupdate", function() {
    if (touch == false) { // if user not clicking on [input:range] match song current time to [input:range] 
        progress.value = song.currentTime;
    }
});
song.addEventListener("ended", function() {
    song.pause();
    isPlaying = false;
    song.currentTime = 0;
    progress.value = 0;
    playIcon.className = "fa fa-play";
});

