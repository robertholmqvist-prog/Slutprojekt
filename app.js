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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum&hourly=temperature_2m&current=temperature_2m,rain,wind_speed_10m`,
      );
    })

    .then((res) => res.json())
    .then((weather) => {
      console.log("Väder data:", weather);
      visaVäder(weather, searchInput);

      console.log("Temp:", weather.current.temperature_2m);
      console.log("Kod:", weather.current.weather_code);
    })

    .catch((err) => {
      console.log("Fel:", err);
    });
}
function visaVäder(väder, geoname) {
  let resultatoutput = document.getElementById("resultat_innehåll");
  let resultatRubrik = document.getElementById("resultat_rubrik");
  let tabell = document.getElementById("tabell");
  resultatRubrik.innerHTML = `<h2>Tempratur i ${geoname}: ${väder.current.temperature_2m} °C</h2>`;

  if (väder.current.temperature_2m < 0) {
    resultatRubrik.style.backgroundColor = "rgb(51, 51, 204)";
  } else if (väder.current.temperature_2m < 15) {
    resultatRubrik.style.backgroundColor = "rgb(123, 123, 123)";
  } else {
    resultatRubrik.style.backgroundColor = "rgb(235, 121, 39)";
  }

  resultatRubrik.style.height = "230px";
  resultatRubrik.style.width = "600px";
  resultatRubrik.style.margin = "50px";
  document.getElementById("resultat").style.height = "750px";
  document.getElementById("resultat").scrollIntoView(true);
  document.getElementById("tabell").style.display = "revert";
}

let sök = document.getElementById("search");
sök.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    sökplats();
  }
});
