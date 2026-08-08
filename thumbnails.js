// Managed via admin.html — do not edit manually.
const THUMBNAILS = {
  track1: [
    { src: "thumbnails/Pi7_image_tool.jpeg" , title: "Thumbnail 1" },
    { src: "thumbnails/final (1).jpg" , title: "Thumbnail 2" },
    { src: "thumbnails/2df_1_optimized_1000.jpg" , title: "Thumbnail 3" },
    { src: "thumbnails/boxes (1).jpg" , title: "Thumbnail 4" },
    { src: "thumbnails/hujhub (1).jpg" , title: "Thumbnail 5" },
    { src: "thumbnails/6.jpg" , title: "Thumbnail 6" },
    { src: "thumbnails/7.jpg" , title: "Thumbnail 7" },
    { src: "thumbnails/bnm (1).jpg" , title: "Thumbnail 8" },
    { src: "thumbnails/9.jpg" , title: "Thumbnail 9" },
    { src: "thumbnails/10.jpg" , title: "Thumbnail 10" }
  ],
  track2: [
    { src: "thumbnails/11.jpg" , title: "Thumbnail 11" },
    { src: "thumbnails/bachar (2).jpg" , title: "Thumbnail 12" },
    { src: "thumbnails/vb (1).jpg" , title: "Thumbnail 13" },
    { src: "thumbnails/14.jpg" , title: "Thumbnail 14" },
    { src: "thumbnails/15.jpg" , title: "Thumbnail 15" },
    { src: "thumbnails/16.jpg" , title: "Thumbnail 16" },
    { src: "thumbnails/17.jpg" , title: "Thumbnail 17" },
    { src: "thumbnails/the final thumbnail 1.jpg" , title: "Thumbnail 18" },
    { src: "thumbnails/19.jpg" , title: "Thumbnail 19" },
    { src: "thumbnails/20.jpg" , title: "Thumbnail 20" }
  ],
  track3: [
    { src: "thumbnails/mnnbn.jpg" , title: "Thumbnail 21" },
    { src: "thumbnails/practsthumbnail_11zon.jpg" , title: "Thumbnail 22" },
    { src: "thumbnails/23.jpg" , title: "Thumbnail 23" },
    { src: "thumbnails/24.jpg" , title: "Thumbnail 24" },
    { src: "thumbnails/25.jpg" , title: "Thumbnail 25" },
    { src: "thumbnails/26.png" , title: "Thumbnail 26" },
    { src: "thumbnails/27.jpg" , title: "Thumbnail 27" },
    { src: "thumbnails/uggh_optimized_1000 (1).jpg" , title: "Thumbnail 28" },
    { src: "thumbnails/mrbeast thumbnail_11zon.jpg" , title: "Thumbnail 29" },
    { src: "thumbnails/3.jpg" , title: "Thumbnail 30" }
  ],
};
(function buildTracks(){
  ["track1","track2","track3"].forEach(function(id){
    var t=document.getElementById(id); if(!t) return;
    t.innerHTML="";
    THUMBNAILS[id].concat(THUMBNAILS[id]).forEach(function(item){
      var c=document.createElement("div"); c.className="thumbnail-card";
      var i=document.createElement("img"); i.loading="lazy"; i.className="thumbnail";
      i.src=item.src; if(item.title) i.alt=item.title;
      c.appendChild(i); t.appendChild(c);
    });
  });
})();