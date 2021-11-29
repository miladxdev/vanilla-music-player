// toggle track list
const trackContainer = element(".tracks-container");

element("#menu-btn").addEventListener("click", (e) => {
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

// get user music
const inputFile = element("#file");
inputFile.addEventListener("change", function () {
  console.log("changed");
  // get media metadata
  let jsmediatags = window.jsmediatags;

  jsmediatags.read(inputFile.files[0], {
    onSuccess: function (tag) {
      let file = inputFile.files[0];
      let path = window.URL.createObjectURL(file);

      let { data, format } = tag.tags.picture;
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      let image = `data:${format};base64,${window.btoa(base64String)}`;

      let userMusic = {
        title: tag.tags.title,
        artist: tag.tags.artist,
        album: tag.tags.album,
        src: path,
        cover: image,
      };

      playList = [...playList, userMusic];
      console.log(playList);
      createTrackNode(userMusic);
    },
    onError: function (error) {
      console.log(":(", error.type, error.info);
    },
  });
});

// creates a track component in track menu
function createTrackNode(metadata) {
  const container = `
    <div class="track-list">
      <img src="${metadata.cover}">

      <div>
        <p>${metadata.title}</p>
        <small class="track-meta">${metadata.artist} - ${metadata.album}</small>
      </div>

      <i class='fas fa-ellipsis-h'></i>
    </div>
  `;

  element("#track-list-container").innerHTML += container;
}

// create track list component
playList.forEach((track) => {
  createTrackNode(track);
});

// --- highlight current playing song in track menu
function nowPlayingBorder() {
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
