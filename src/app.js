// Calculator + cheat-sheet search. No frameworks, no build-time deps.
(function () {
  var unit = "F";

  function $(id) { return document.getElementById(id); }

  function convert() {
    var tempEl = $("oven-temp"), timeEl = $("oven-time");
    if (!tempEl) return; // not on the calculator page
    var temp = parseFloat(tempEl.value);
    var time = parseFloat(timeEl.value);
    var convection = $("convection").checked;

    // Rule of thumb: drop temp 25°F (15°C) and cut time ~20%. Convection
    // ovens already run "hotter", so the adjustment is smaller from there.
    var tempDrop = unit === "F" ? (convection ? 10 : 25) : (convection ? 5 : 15);
    var timeFactor = convection ? 0.9 : 0.8;

    var outTemp = $("out-temp"), outTime = $("out-time");
    if (isNaN(temp) || temp <= 0) {
      outTemp.textContent = "—";
    } else {
      var t = temp - tempDrop;
      // Snap to the 5-degree marks most air fryer dials use.
      t = Math.round(t / 5) * 5;
      outTemp.textContent = t + "°" + unit;
    }
    if (isNaN(time) || time <= 0) {
      outTime.textContent = "—";
    } else {
      var m = Math.round(time * timeFactor);
      outTime.textContent = m + " min";
    }
  }

  function setUnit(u) {
    var tempEl = $("oven-temp");
    var cur = parseFloat(tempEl.value);
    if (!isNaN(cur) && unit !== u) {
      tempEl.value = u === "C" ? Math.round((cur - 32) * 5 / 9) : Math.round(cur * 9 / 5 + 32);
    }
    unit = u;
    $("btn-f").classList.toggle("on", u === "F");
    $("btn-c").classList.toggle("on", u === "C");
    convert();
  }

  if ($("oven-temp")) {
    ["oven-temp", "oven-time"].forEach(function (id) { $(id).addEventListener("input", convert); });
    $("convection").addEventListener("change", convert);
    $("btn-f").addEventListener("click", function () { setUnit("F"); });
    $("btn-c").addEventListener("click", function () { setUnit("C"); });
    convert();
  }

  // Cheat-sheet live filter
  var search = $("food-search");
  if (search) {
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      document.querySelectorAll("table.foods tbody tr").forEach(function (row) {
        row.style.display = row.dataset.name.indexOf(q) === -1 ? "none" : "";
      });
      // Hide category headers whose tables are fully filtered out
      document.querySelectorAll(".cat-block").forEach(function (block) {
        var visible = block.querySelectorAll("tbody tr:not([style*='none'])").length;
        block.style.display = visible ? "" : "none";
      });
    });
  }

  // Tiny self-hosted analytics beacon (D1-backed, no cookies, no fingerprinting).
  try {
    var payload = JSON.stringify({ path: location.pathname, ref: document.referrer || "" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/hit", new Blob([payload], { type: "application/json" }));
    }
  } catch (e) { /* analytics must never break the page */ }
})();
