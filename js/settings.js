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

// --- toggle mute
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
