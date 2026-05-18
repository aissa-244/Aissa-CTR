var CONFIG = {
    githubToken: "null",
    repo:        "empty-16/aissa-ctr-test",
    branch:      "main",
    filePath:    "thumbnails.js",
  };

  async function unlock() {
  var token = document.getElementById("tokenInput").value.trim();
  if (!token) return;

  CONFIG.githubToken = token;

  try {
    var res = await fetch(
      "https://api.github.com/repos/" + CONFIG.repo + "/contents/" + CONFIG.filePath + "?ref=" + CONFIG.branch,
      { headers: { "Authorization": "Bearer " + token } }
    );

    if (res.ok) {
      sessionStorage.setItem("gh_token", token);
      document.getElementById("lockscreen").style.display = "none";
      init(); 
    } else {
      throw new Error();
    }
  } catch(e) {
    CONFIG.githubToken = null;
    var inp = document.getElementById("tokenInput");
    inp.classList.add("error");
    document.getElementById("lockError").textContent = "Invalid GitHub Token or Repo Access Denied.";
    setTimeout(function(){ inp.classList.remove("error"); }, 400);
  }
}

function logout() {
  sessionStorage.removeItem("gh_token");
  CONFIG.githubToken = null;
  document.getElementById("lockscreen").style.display = "flex";
  document.getElementById("tokenInput").value = "";
}

    document.getElementById("tokenInput").addEventListener("keydown", function(e){    
    if (e.key === "Enter") unlock();
  });

  // ── State ─────────────────────────────────────
  var state = { track1:[], track2:[], track3:[] };

  async function init() {
    // Show loading state in all grids
    ["track1","track2","track3"].forEach(function(id){
      document.getElementById("grid-"+id).innerHTML =
        '<div class="empty-state">Loading from GitHub…</div>';
    });

    try {
      var headers = {
        "Authorization": "Bearer " + CONFIG.githubToken,
        "Accept": "application/vnd.github.v3+json",
      };

      var res = await fetch(
        "https://api.github.com/repos/" + CONFIG.repo + "/contents/" + CONFIG.filePath + "?ref=" + CONFIG.branch,
        { headers: headers }
      );

      if (!res.ok) throw new Error("Could not fetch thumbnails.js");

      var data = await res.json();
      var jsText = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ""))));

      var match = jsText.match(/const THUMBNAILS\s*=\s*(\{[\s\S]*\});/);
      if (!match) throw new Error("Could not parse THUMBNAILS from thumbnails.js");

      var parsed = new Function("return " + match[1])();

      ["track1","track2","track3"].forEach(function(id){
        state[id] = (parsed[id] || []).map(function(t){ return {src:t.src, title:t.title||""}; });
        renderGrid(id);
      });

    } catch(err) {
      ["track1","track2","track3"].forEach(function(id){
        document.getElementById("grid-"+id).innerHTML =
          '<div class="empty-state">⚠ Failed to load: ' + err.message + '</div>';
      });
    }
  }

  function renderGrid(trackId) {
    var grid = document.getElementById("grid-"+trackId);
    grid.innerHTML = "";
    var items = state[trackId];
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state">No thumbnails — click Add to get started.</div>';
      updateCount(trackId); return;
    }
    items.forEach(function(item, index){
      var card = document.createElement("div");
      card.className = "thumb-item";

      var img = document.createElement("img");
      img.src = item.src; img.alt = item.title||"";
      img.onerror = function(){
        var ph = document.createElement("div"); ph.className="no-img"; ph.textContent="🖼";
        this.parentNode.replaceChild(ph,this);
      };
      card.appendChild(img);

      var footer = document.createElement("div"); footer.className="thumb-footer";
      var ti = document.createElement("input"); ti.className="thumb-title-input";
      ti.type="text"; ti.value=item.title||""; ti.placeholder="Title...";
      ti.addEventListener("input",function(){ state[trackId][index].title=this.value; });

      var actions = document.createElement("div"); actions.className="thumb-actions";

      var chg = document.createElement("button"); chg.className="btn-icon btn-change";
      chg.innerHTML="🖼"; chg.title="Change image";
      chg.addEventListener("click",function(){ changeImage(trackId,index); });

      var del = document.createElement("button"); del.className="btn-icon btn-delete";
      del.innerHTML="✕"; del.title="Remove";
      del.addEventListener("click",function(){
        state[trackId].splice(index,1); renderGrid(trackId); toast("Removed");
      });

      actions.appendChild(chg); actions.appendChild(del);
      footer.appendChild(ti); footer.appendChild(actions);
      card.appendChild(footer); grid.appendChild(card);
    });
    updateCount(trackId);
  }

  function updateCount(id){
    var n=state[id].length;
    document.getElementById("count-"+id).textContent=n+(n===1?" thumbnail":" thumbnails");
  }

  // ── Image upload helpers ───────────────────────

  function readFileAsBase64(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() {
        var base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadImageToGitHub(file) {
    var filename = file.name;
    var path = "thumbnails/" + filename;
    var base64 = await readFileAsBase64(file);

    var headers = {
      "Authorization": "Bearer " + CONFIG.githubToken,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };

    var sha = null;
    var checkRes = await fetch(
      "https://api.github.com/repos/" + CONFIG.repo + "/contents/" + path + "?ref=" + CONFIG.branch,
      { headers: headers }
    );
    if (checkRes.ok) {
      sha = (await checkRes.json()).sha;
    }

    var body = {
      message: "Upload " + filename + " via admin panel",
      content: base64,
      branch: CONFIG.branch,
    };
    if (sha) body.sha = sha;

    var putRes = await fetch(
      "https://api.github.com/repos/" + CONFIG.repo + "/contents/" + path,
      { method: "PUT", headers: headers, body: JSON.stringify(body) }
    );

    if (!putRes.ok) {
      var err = await putRes.json();
      throw new Error(err.message || "Upload failed " + putRes.status);
    }

    return path;
  }

  function pickFile(callback) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function() {
      if (input.files && input.files[0]) callback(input.files[0]);
    };
    input.click();
  }

  // ── Add / Change ──────────────────────────────

  function addCard(trackId) {
    pickFile(async function(file) {
      toast("Uploading " + file.name + "…");
      try {
        var path = await uploadImageToGitHub(file);
        state[trackId].push({ src: path, title: "" });
        renderGrid(trackId);
        toast("✓ Uploaded & added");
      } catch(err) {
        toast("✗ " + err.message);
      }
    });
  }

  function changeImage(trackId, index) {
    pickFile(async function(file) {
      toast("Uploading " + file.name + "…");
      try {
        var path = await uploadImageToGitHub(file);
        state[trackId][index].src = path;
        renderGrid(trackId);
        toast("✓ Image replaced");
      } catch(err) {
        toast("✗ " + err.message);
      }
    });
  }

  // ── Generate & Save ───────────────────────────

  function generateJS(){
    function lines(id){
      return state[id].map(function(item){
        return '    { src: "'+item.src.replace(/\\/g,"/")+'" , title: "'+((item.title||"").replace(/"/g,'\\"'))+'" }';
      }).join(",\n");
    }
    return [
      '// Managed via admin.html — do not edit manually.',
      'const THUMBNAILS = {',
      '  track1: [\n'+lines("track1")+'\n  ],',
      '  track2: [\n'+lines("track2")+'\n  ],',
      '  track3: [\n'+lines("track3")+'\n  ],',
      '};',
      '(function buildTracks(){',
      '  ["track1","track2","track3"].forEach(function(id){',
      '    var t=document.getElementById(id); if(!t) return;',
      '    t.innerHTML="";',
      '    THUMBNAILS[id].concat(THUMBNAILS[id]).forEach(function(item){',
      '      var c=document.createElement("div"); c.className="thumbnail-card";',
      '      var i=document.createElement("img"); i.loading="lazy"; i.className="thumbnail";',
      '      i.src=item.src; if(item.title) i.alt=item.title;',
      '      c.appendChild(i); t.appendChild(c);',
      '    });',
      '  });',
      '})();',
    ].join('\n');
  }

  async function saveToGitHub(){
    var btn=document.getElementById("saveBtn");
    var status=document.getElementById("saveStatus");
    btn.disabled=true;
    btn.innerHTML='<div class="spinner"></div> Saving…';
    status.textContent=""; status.className="save-status";

    try {
      var encoded = btoa(unescape(encodeURIComponent(generateJS())));
      var headers = {
        "Authorization":"Bearer "+CONFIG.githubToken,
        "Accept":"application/vnd.github.v3+json",
        "Content-Type":"application/json",
      };

      var getRes = await fetch(
        "https://api.github.com/repos/"+CONFIG.repo+"/contents/"+CONFIG.filePath+"?ref="+CONFIG.branch,
        { headers: headers }
      );
      var sha = null;
      if (getRes.ok) { sha = (await getRes.json()).sha; }

      var body = { message:"Update thumbnails via admin panel", content:encoded, branch:CONFIG.branch };
      if (sha) body.sha = sha;

      var putRes = await fetch(
        "https://api.github.com/repos/"+CONFIG.repo+"/contents/"+CONFIG.filePath,
        { method:"PUT", headers:headers, body:JSON.stringify(body) }
      );

      if (!putRes.ok) {
        var err = await putRes.json();
        throw new Error(err.message || "GitHub error "+putRes.status);
      }

      status.textContent="✓ Saved! Site will update in a few minutes !";
      status.className="save-status success";
      toast("Pushed to GitHub ✓");

    } catch(err) {
      status.textContent="✗ "+err.message;
      status.className="save-status error";
    }

    btn.disabled=false;
    btn.innerHTML="🚀 Save to Site";
  }

  function toast(msg){
    var el=document.getElementById("toast");
    el.textContent=msg; el.classList.add("show");
    setTimeout(function(){ el.classList.remove("show"); },2800);
  }