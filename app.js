const element = (e) => document.querySelector(e);

// DOM elements
const title = document.getElementById("title");
const slider = document.getElementById("slider");
const playIcon = document.getElementById("play-icon");

// variables
let isPlaying = false;
let duration = 0;
let currentTime = 0;

// prettier-ignore
let playList = [
  { title: "Time",            artist: "Alan Walker & Hans Zimmer",  src: "music/Time.m4a",            cover: "img/cover/Time.jpg"             },
  { title: "In The End",      artist: "Fleurie",                    src: "music/In-The-End.mp3",      cover: "img/cover/In-The-End.jpg"       },
  { title: "Algorithm",       artist: "Muse",                       src: "music/Algorithm.mp3",       cover: "img/cover/Algorithm.jpg"        },
  { title: "Never Fade Away", artist: "Olga Jankowska",             src: "music/Never-Fade-Away.mp3", cover: "img/cover/Never-Fade-Away.jpg"  },
  { title: "Death Stranding", artist: "CHVRCHES",                   src: "music/Death-Stranding.m4a", cover: "img/cover/time-fall.jpg"  },
];

let track = 0;
let nowPlaying = playList[track];

let song = new Audio();
song.volume = 0.5;

// change volume
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

song.src = nowPlaying.src;
let currentSrc = nowPlaying.src;

song.onloadeddata = () => {
  duration = song.duration;
  slider.max = duration;
};

// functions
function nowPlayingBorder() {
  // highlight current playing song in track menu
  const trackLists = document.querySelectorAll(".track-list");
  for (let i = 0; i < trackLists.length; i++) {
    trackLists[i].style.outline = "none";
    trackLists[i].addEventListener("click", () => {
      nowPlaying = playList[i];
      track = i;
      isPlaying = false;
      playSong();
    });
  }
  trackLists[track].style.outline = "3px solid hsl(214, 44%, 80%)";
}

const playSong = () => {
  if (currentSrc != nowPlaying.src) {
    // change song.src if only track has changed
    song.src = nowPlaying.src;
    currentSrc = nowPlaying.src;

    element("#cover").classList.remove("effect");
    void element("#cover").offsetWidth;
    element("#cover").classList.add("effect");
  }

  nowPlayingBorder();

  if (!isPlaying) {
    // update music info
    element("#cover").src = nowPlaying.cover;
    title.innerHTML = nowPlaying.title;
    element("#artist").innerHTML = nowPlaying.artist;
    playIcon.className = "fa fa-pause";
    playIcon.style.transform = "translateX(0%)";
    song.play();
    isPlaying = true;
  } else {
    song.pause();
    playIcon.className = "fa fa-play";
    playIcon.style.transform = "translateX(10%)";
    isPlaying = false;
  }
};

// Control Buttons
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

// Range slider events ---
slider.addEventListener("change", () => {
  song.currentTime = slider.value;
});

const secondsToMinutes = (sec) => {
  return (
    Math.floor(sec / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    Math.floor(sec % 60)
      .toString()
      .padStart(2, "0")
  );
};

let touch = false;
slider.addEventListener("mousedown", () => (touch = true));
slider.addEventListener("mouseup", () => (touch = false));

// ---- Song events
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

// --- Buttons events
const menuBtn = document.getElementById("menu-btn");
const trackContainer = element(".tracks-container");
trackContainer.style.bottom = "101%"; // fix working for first time

menuBtn.addEventListener("click", (e) => {
  if (trackContainer.style.height == "380px") {
    trackContainer.style.opacity = "0";
    trackContainer.style.height = "0";
    e.target.style.color = "grey";
  } else {
    trackContainer.style.visibility = "visible";
    trackContainer.style.opacity = "1";
    trackContainer.style.height = "380px";
    e.target.style.color = "#5a86bf";
  }
});

// toggle settings
let settings_elem = element(".settings-container");

element("#settings-btn").addEventListener("click", (e) => {
  if (settings_elem.style.height == "380px") {
    settings_elem.style.opacity = "0";
    settings_elem.style.height = "0";
    e.target.style.color = "grey";
  } else {
    settings_elem.style.visibility = "visible";
    settings_elem.style.opacity = "1";
    settings_elem.style.height = "380px";
    e.target.style.color = "#5a86bf";
  }
});

// play|pause with [spacebar] key
document.body.addEventListener("keydown", (event) => {
  if (event.keyCode == 32) playSong();
});

// get user music
const inputFile = element("#file");
inputFile.addEventListener("change", () => {
  // get media metadata
  let jsmediatags = window.jsmediatags;

  jsmediatags.read(inputFile.files[0], {
    onSuccess: function (tag) {
      let file = inputFile.files[0];
      let path = window.URL.createObjectURL(file);

      const { data, format } = tag.tags.picture;
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      const image = `data:${format};base64,${window.btoa(base64String)}`;

      let userMusic = {
        title: tag.tags.title,
        artist: tag.tags.artist,
        src: path,
        cover: image,
      };

      playList = [...playList, userMusic];

      createTrackNode(image, userMusic.title);
    },
    onError: function (error) {
      console.log(":(", error.type, error.info);
    },
  });
});

// creates a track component in tracks section
function createTrackNode(cover, title) {
  const div = document.createElement("div");
  div.className = "track-list";

  let img = document.createElement("img");
  img.setAttribute("src", cover);
  div.appendChild(img);

  let p = document.createElement("p");
  let text = document.createTextNode(title);
  p.appendChild(text);
  div.appendChild(p);

  let icon = "<i class='fas fa-ellipsis-h'></i>";
  div.innerHTML += icon;

  element(".tracks-container").appendChild(div);
}

// create track list component
playList.forEach((track) => {
  createTrackNode(track.cover, track.title);
});

// volume Toggle Switch
element("#toggle-mute").addEventListener("change", function () {
  if (this.checked) {
    volumeIcon.style.color = "lightcoral";
    volumeIcon.className = "fas fa-volume-mute";
  } else if (song.volume < 0.7) {
    volumeIcon.style.color = "grey";
    volumeIcon.className = "fa fa-volume-down";
  } else {
    volumeIcon.className = "fas fa-volume-up";
    volumeIcon.style.color = "grey";
  }
});

// show audio buffered progress and time progress
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
