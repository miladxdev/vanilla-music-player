const element = (e) => document.querySelector(e);

// DOM elements
const slider = element("#slider");
const playIcon = element("#play-icon");

// variables
let isPlaying = false;
let duration = 0;
let currentTime = 0;

// prettier-ignore
let playList = [
  { title: "Time",            artist: "Alan Walker & Hans Zimmer", album: "Time (Remix)",       src: "music/Time.m4a",            cover: "img/cover/Time.jpg"             },
  { title: "In The End",      artist: "Fleurie",                   album: "In the end (Remix)", src: "music/In-The-End.mp3",      cover: "img/cover/In-The-End.jpg"       },
  { title: "Algorithm",       artist: "Muse",                      album: "Simulation Theory",  src: "music/Algorithm.mp3",       cover: "img/cover/Algorithm.jpg"        },
  { title: "Never Fade Away", artist: "Olga Jankowska",            album: "Cyberpunk 2077 OST", src: "music/Never-Fade-Away.mp3", cover: "img/cover/Never-Fade-Away.jpg"  },
  { title: "Death Stranding", artist: "CHVRCHES",                  album: "Timefall OST",       src: "music/Death-Stranding.m4a", cover: "img/cover/time-fall.jpg"        },
];

let track = 0;
let nowPlaying = playList[track];

let song = new Audio();
song.volume = 0.5;

song.src = nowPlaying.src;
let currentSrc = nowPlaying.src;

// set max for slider
song.onloadedmetadata = () => {
  slider.max = song.duration;
};

const playSong = () => {
  if (currentSrc != nowPlaying.src) {
    // change song.src if track has changed
    song.src = nowPlaying.src;
    currentSrc = nowPlaying.src;
    element("#cover").classList.remove("effect");
    void element("#cover").offsetWidth;
    element("#cover").classList.add("effect");
  }

  // update blur background
  element("body").style.backgroundImage = `url(${nowPlaying.cover})`;

  nowPlayingBorder();

  if (!isPlaying) {
    song.play();
    isPlaying = true;
    // update music info
    element("#cover").src = nowPlaying.cover;
    element("#title").innerHTML = nowPlaying.title;
    element("#artist").innerHTML = nowPlaying.artist;

    playIcon.className = "fa fa-pause";
    playIcon.style.transform = "translateX(0%)";
  } else {
    song.pause();
    playIcon.className = "fa fa-play";
    playIcon.style.transform = "translateX(10%)";
    isPlaying = false;
  }
};

// control buttons
element("#play").onclick = () => {
  playSong();
};

element("#next").onclick = () => {
  track++;
  if (track > playList.length - 1) track = 0;

  nowPlaying = playList[track];
  isPlaying = false;
  playSong();
};

element("#back").onclick = () => {
  track--;
  if (track < 0) track = playList.length - 1;

  nowPlaying = playList[track];
  isPlaying = false;
  playSong();
};

// --- volume input
const volumeIcon = element("#volume-btn i");
const inputVolume = element("#input-volume");
inputVolume.addEventListener("input", () => {
  if (!element("#toggle-mute").checked) {
    song.volume = inputVolume.value / 100;
  }

  if (!song.volume) {
    volumeIcon.style.color = "lightcoral";
    volumeIcon.className = "fas fa-volume-mute";
  } else if (song.volume < 0.7) {
    volumeIcon.style.color = "grey";
    volumeIcon.className = "fa fa-volume-down";
  } else {
    volumeIcon.className = "fas fa-volume-up";
  }
});

// range slider event
slider.addEventListener("change", () => {
  song.currentTime = slider.value;
});

let touch = false;
slider.addEventListener("mousedown", () => (touch = true));
slider.addEventListener("mouseup", () => (touch = false));

// song events
song.addEventListener("timeupdate", () => {
  element("#toggle-mute").checked ? (song.volume = 0) : (song.volume = inputVolume.value / 100);

  if (!touch) {
    // if user not clicking on slider, update song time
    slider.value = song.currentTime;
    element("#time-left").innerHTML = song.currentTime ? secondsToMinutes(song.currentTime) : "00:00";
    element("#time-remain").innerHTML = song.currentTime ? secondsToMinutes(song.duration - song.currentTime) : "00:00";
  }
});

song.addEventListener("ended", () => {
  track++;
  isPlaying = false;
  if (element("#repeat-toggle").checked) {
    if (track > playList.length - 1) track = 0;
  } else {
    if (track > playList.length - 1) {
      track = playList.length - 1;
      isPlaying = true;
    }
  }

  nowPlaying = playList[track];
  playSong();
});

function secondsToMinutes(sec) {
  return (
    Math.floor(sec / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    Math.floor(sec % 60)
      .toString()
      .padStart(2, "0")
  );
}

// --- play|pause with [spacebar] key
document.body.addEventListener("keydown", (event) => {
  if (event.keyCode == 32) playSong();
});

// display audio time and buffered progress bar
function bufferedProgress() {
  window.onload = () => {
    song.addEventListener("timeupdate", function () {
      let duration = this.duration;
      element("#progress-amount").style.width = (this.currentTime / duration) * 100 + "%";

      if (duration > 0) {
        for (let i = 0; i < this.buffered.length; i++) {
          if (this.buffered.start(this.buffered.length - 1) < this.currentTime) {
            let width = (this.buffered.end(this.buffered.length - 1) / duration) * 100;
            element("#buffered-amount").style.width = width + "%";
            break;
          }
        }
      }
    });
  };
}

bufferedProgress(); // display buffered audio

// instagram: web.script
// github: github.com/miladxdev
// © 2021 Milad Gharibi
