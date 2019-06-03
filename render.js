/*jslint browser: true*/

/*global console, alert, $, jQuery, hamburger_cross*/

$(window).on("load", () => {
  var music = document.getElementById("music"); // id for audio element
  var duration = music.duration; // Duration of audio clip, calculated here for embedding purposes
  var pButton = document.getElementById("pButton"); // play button
  var playhead = document.getElementById("playhead"); // playhead
  var timeline = document.getElementById("timeline"); // timeline
  const imgElem = document.getElementById("waves");
  const audioElem = document.getElementById("music");
  const songNameElem = document.getElementById("songName");
  const songsList = document.getElementById("songsList");

  document.addEventListener("drop", e => {
    e.preventDefault();
    e.stopPropagation();
    for (const f of e.dataTransfer.files) {
      audioElem.setAttribute("src", f.path);
      songNameElem.innerHTML = f.name;
      const li = document.createElement("li");
      const pathInput = document.createElement("input");
      pathInput.setAttribute("type", "hidden");
      pathInput.setAttribute("value", f.path);
      pathInput.setAttribute("name", f.name);

      $(".sample").fadeOut();
      li.append(f.name);
      //   li.append(pathInput);
      songsList.append(li);
      $(li).on("click", pathInput, () => {
        let src = pathInput.value;
        audioElem.setAttribute("src", src);
        songNameElem.innerHTML = pathInput.name;
        play();
      });
    }
    console.log(music.currentTime);
  });

  document.addEventListener("dragover", e => {
    e.preventDefault();
    e.stopPropagation();
  });

  // timeline width adjusted for playhead
  var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

  // play button event listenter
  pButton.addEventListener("click", play);

  // timeupdate event listener
  music.addEventListener("timeupdate", timeUpdate, false);

  // makes timeline clickable
  timeline.addEventListener(
    "click",
    function(event) {
      moveplayhead(event);
      music.currentTime = duration * clickPercent(event);
    },
    false
  );

  // returns click as decimal (.77) of the total timelineWidth
  function clickPercent(event) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
  }

  // makes playhead draggable
  playhead.addEventListener("mousedown", mouseDown, false);
  window.addEventListener("mouseup", mouseUp, false);

  // Boolean value so that audio position is updated only when the playhead is released
  var onplayhead = false;

  // mouseDown EventListener
  function mouseDown() {
    onplayhead = true;
    window.addEventListener("mousemove", moveplayhead, true);
    music.removeEventListener("timeupdate", timeUpdate, false);
  }

  // mouseUp EventListener
  // getting input from all mouse clicks
  function mouseUp(event) {
    if (onplayhead == true) {
      moveplayhead(event);
      window.removeEventListener("mousemove", moveplayhead, true);
      // change current time
      music.currentTime = duration * clickPercent(event);
      music.addEventListener("timeupdate", timeUpdate, false);
    }
    onplayhead = false;
  }
  // mousemove EventListener
  // Moves playhead as user drags
  function moveplayhead(event) {
    var newMargLeft = event.clientX - getPosition(timeline);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
      playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
      playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
      playhead.style.marginLeft = timelineWidth + "px";
    }
  }

  // timeUpdate
  // Synchronizes playhead position with current point in audio
  function timeUpdate() {
    var playPercent = timelineWidth * (music.currentTime / duration);
    playhead.style.marginLeft = playPercent + "px";
    if (music.currentTime == duration) {
      pButton.className = "";
      pButton.className = "play";
    }
  }

  //Play and Pause
  function play() {
    // start music
    if (music.paused) {
      music.play();
  
      // remove play, add pause
      imgElem.setAttribute(
        "src",
        "https://media.giphy.com/media/7lsZsFdEijZrW/giphy.gif"
      );
      pButton.className = "";
      pButton.className = "pause";
    } else {
      // pause music
      music.pause();
      // remove pause, add play
      imgElem.setAttribute("src", "waves.svg");
      pButton.className = "";
      pButton.className = "play";
    }
  }

  // Gets audio file duration
  music.addEventListener(
    "canplaythrough",
    function() {
      duration = music.duration;
    },
    false
  );

  // getPosition
  // Returns elements left position relative to top-left of viewport
  function getPosition(el) {
    return el.getBoundingClientRect().left;
  }
});
