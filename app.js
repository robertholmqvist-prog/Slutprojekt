let väder = null;
function sökplats() {
  console.log("Sökplats-funktionen har anropats.");

  let searchInput = document.getElementById("search").value;

  fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${searchInput}`,
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Geoname data:", data);

      let lat = data[0].lat;
      let lon = data[0].lon;

      return fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum&hourly=temperature_2m,wind_speed_10m,rain&current=temperature_2m,rain,wind_speed_10m`,
      );
    })

    .then((res) => res.json())
    .then((weather) => {
      console.log("Väder data:", weather);
      väder = weather;
      visaVäder(weather, searchInput);

      console.log("Temp:", weather.current.temperature_2m);
      console.log("Kod:", weather.current.weather_code);
    })

    .catch((err) => {
      console.log("Fel:", err);
    });
}

console.log("hej", väder);
function visaVäder(väder, geoname) {
  let resultatoutput = document.getElementById("resultat_innehåll");
  let resultatRubrik = document.getElementById("resultat_rubrik");
  let tabell = document.getElementById("tabell");
  resultatRubrik.innerHTML = `<h2>Tempratur i ${geoname}: ${väder.current.temperature_2m} °C</h2>`;

  fylltabell(väder);
  fyllTimtabell("temp");

  if (väder.current.temperature_2m < 0) {
    resultatRubrik.style.backgroundColor = "rgb(51, 51, 204)";
  } else if (väder.current.temperature_2m < 15) {
    resultatRubrik.style.backgroundColor = "rgb(123, 123, 123)";
  } else {
    resultatRubrik.style.backgroundColor = "rgb(235, 121, 39)";
  }

  resultatRubrik.style.height = "230px";
  resultatRubrik.style.width = "600px";
  resultatRubrik.style.margin = "50px auto";
  document.getElementById("resultat").style.height = "300vh";
  document.getElementById("resultat").scrollIntoView(true);
  document.getElementById("tabell").style.display = "revert";
  document.getElementById("timtabell").style.display = "revert";
  document.getElementById("fot").style.display = "revert";
  document.getElementById("timtryck").style.display = "revert";
  document.body.style.overflowY = "auto";
}

function fylltabell(väder) {
  let tabell = document.getElementById("tabell");
  tabell.innerHTML = `
    <tr>
      <th>Dag</th>
      <th>H/L</th>
      <th>Regn</th>
    </tr>
  `;

  for (let i = 0; i < väder.daily.time.length; i++) {
    let rad = document.createElement("tr");
    rad.innerHTML = `
      <td>${väder.daily.time[i]}</td>
      <td>${väder.daily.temperature_2m_max[i]}°C / ${väder.daily.temperature_2m_min[i]}°C</td>
      <td>${väder.daily.rain_sum[i]} mm</td>
    `;
    tabell.appendChild(rad);
  }
}
function fyllTimtabell(typ) {
  let tabell = document.getElementById("timtabell");

  tabell.innerHTML = `
    <tr>
      <th>Tid</th>
      <th>Data</th>
    </tr>
  `;

  for (let i = 0; i < 24; i++) {
    let tid = väder.hourly.time[i].split("T")[1];
    let värde;
    if (typ === "temp") {
      värde = väder.hourly.temperature_2m[i] + "°C";
    } else if (typ === "vind") {
      värde = väder.hourly.wind_speed_10m[i] + " km/h";
    } else if (typ === "regn") {
      värde = väder.hourly.rain[i] + " mm";
    }

    let rad = document.createElement("tr");

    rad.innerHTML = `
      <td>${tid}</td>
      <td>${värde}</td>
    `;

    tabell.appendChild(rad);
  }
}
let sök = document.getElementById("search");
sök.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    sökplats();
  }
});
