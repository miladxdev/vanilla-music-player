// DOM elements
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');

const progress = document.getElementById('progress');
const timeLeft = document.getElementById('time-left');
const timeRemain = document.getElementById('time-remain');

const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');

// variables
let isPlaying = false;
let duration = 0;
let currentTime = 0;

let playList = [
    {title: 'Time',            artist: 'Alan Walker & Hans Zimmer', src: 'music/Time (Alan Walker Remix).m4a', cover: 'cover/Time.jpg'},
    {title: 'In The End',      artist: 'Mellen Gi',                 src: 'music/In The End (remix).mp3',       cover: 'cover/In The End.jpg'},
    {title: 'Ghost',           artist: 'Au/Ra x Alan Walker',       src: 'music/Ghost.m4a',                    cover: 'cover/time-fall.jpg'},
    {title: 'Never Fade Away', artist: 'Olga Jankowska',            src: 'music/Never Fade Away.mp3',          cover: 'cover/Cyberpunk.jpg'}
];
let track = 0;
let nowPlaying = playList[track];

let song = new Audio();

// default tarck
song.volume = 0.4;
song.src = nowPlaying.src;
currentSrc = nowPlaying.src;
cover.src = nowPlaying.cover;
title.innerHTML = nowPlaying.title;
artist.innerHTML = nowPlaying.artist;
song.onloadeddata = function() {
    duration = song.duration;
    progress.max = duration;
    console.log(duration);
}



function playSong() {
    // change song.src if track has changed
    if(currentSrc != nowPlaying.src) {
        song.src = nowPlaying.src;
        currentSrc = nowPlaying.src;
    }
    if (!isPlaying) {
        // update music info
        song.play();
        cover.src = nowPlaying.cover;
        title.innerHTML = nowPlaying.title;
        artist.innerHTML = nowPlaying.artist;
        playIcon.className = "fa fa-pause";
        playIcon.style.transform = "translateX(0%)";
        isPlaying = true;
    } else {
        song.pause();
        playIcon.className = "fa fa-play";
        playIcon.style.transform = "translateX(10%)"
        isPlaying = false;
    }
}


playBtn.addEventListener("click", playSong);


nextBtn.addEventListener("click", function() {
    track ++;
    if (track > playList.length-1) track = 0;
    
    nowPlaying = playList[track];
    isPlaying = false;
    playSong();
});

backBtn.addEventListener("click", function() {
    track --;
    if (track < 0) track = playList.length-1;

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


function secondsToMinutes(sec) {
    return Math.floor(sec / 60).toString().padStart(2, '0') +':'+
           Math.floor(sec % 60).toString().padStart(2, '0');
}


song.addEventListener("timeupdate", function() {
    if (touch == false) { // if user not clicking on [input:range] match song current time to [input:range] 
        progress.value = song.currentTime;
        timeLeft.innerHTML = secondsToMinutes(song.currentTime);
        timeRemain.innerHTML = secondsToMinutes(song.duration - song.currentTime);
    }

    let x = ((progress.value / progress.max) * 100);
    // console.log(x);
    progress.style.background = `linear-gradient(to right, hsl(214, 45%, 86%) ${x}%, #e5ecf5 0%)`;
});
song.addEventListener("ended", function() {
    song.pause();
    isPlaying = false;
    song.currentTime = 0;
    progress.value = 0;
    playIcon.className = "fa fa-play";
});

