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
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
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
  let resultatoutput = document.getElementById("resultat");
  resultatoutput.innerHTML = `<h2>temp i ${geoname}: ${väder.current.temperature_2m}</h2>`;
}
