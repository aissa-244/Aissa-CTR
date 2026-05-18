const THUMBNAILS = {
  track1: [
    { src: "thumbnails/1.jpg",  title: "Thumbnail 1"  },
    { src: "thumbnails/2.jpg",  title: "Thumbnail 2"  },
    { src: "thumbnails/3.jpg",  title: "Thumbnail 3"  },
    { src: "thumbnails/4.jpg",  title: "Thumbnail 4"  },
    { src: "thumbnails/5.jpg",  title: "Thumbnail 5"  },
    { src: "thumbnails/6.jpg",  title: "Thumbnail 6"  },
    { src: "thumbnails/7.jpg",  title: "Thumbnail 7"  },
    { src: "thumbnails/8.jpg",  title: "Thumbnail 8"  },
    { src: "thumbnails/9.jpg",  title: "Thumbnail 9"  },
    { src: "thumbnails/10.jpg", title: "Thumbnail 10" },
  ],
  track2: [
    { src: "thumbnails/11.jpg", title: "Thumbnail 11" },
    { src: "thumbnails/12.jpg", title: "Thumbnail 12" },
    { src: "thumbnails/13.jpg", title: "Thumbnail 13" },
    { src: "thumbnails/14.jpg", title: "Thumbnail 14" },
    { src: "thumbnails/15.jpg", title: "Thumbnail 15" },
    { src: "thumbnails/16.jpg", title: "Thumbnail 16" },
    { src: "thumbnails/17.jpg", title: "Thumbnail 17" },
    { src: "thumbnails/18.jpg", title: "Thumbnail 18" },
    { src: "thumbnails/19.jpg", title: "Thumbnail 19" },
    { src: "thumbnails/20.jpg", title: "Thumbnail 20" },
  ],
  track3: [
    { src: "thumbnails/21.jpg", title: "Thumbnail 21" },
    { src: "thumbnails/22.jpg", title: "Thumbnail 22" },
    { src: "thumbnails/23.jpg", title: "Thumbnail 23" },
    { src: "thumbnails/24.jpg", title: "Thumbnail 24" },
    { src: "thumbnails/25.jpg", title: "Thumbnail 25" },
    { src: "thumbnails/26.png", title: "Thumbnail 26" },
    { src: "thumbnails/27.jpg", title: "Thumbnail 27" },
    { src: "thumbnails/28.jpg", title: "Thumbnail 28" },
    { src: "thumbnails/29.jpg", title: "Thumbnail 29" },
    { src: "thumbnails/3.jpg",  title: "Thumbnail 30" },
  ],
};

(function buildTracks() {
  ["track1", "track2", "track3"].forEach(function(trackId) {
    var track = document.getElementById(trackId);
    if (!track) return;
    track.innerHTML = "";
    var items = THUMBNAILS[trackId];
    var doubled = items.concat(items);
    doubled.forEach(function(item) {
      var card = document.createElement("div");
      card.className = "thumbnail-card";
      var img = document.createElement("img");
      img.loading = "lazy";
      img.className = "thumbnail";
      img.src = item.src;
      if (item.title) img.alt = item.title;
      card.appendChild(img);
      track.appendChild(card);
    });
  });
})();