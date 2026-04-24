function sökplats() {
  console.log("Sökplats-funktionen har anropats.");
  let searchInput = document.getElementById("search").value;
  console.log("Användarens sökinput:", searchInput);

  fetch(
    `https://api.opentripmap.com/0.1/en/places/geoname?name=${searchInput}&apikey=5ae2e3f221c38a28845f05b630fe00001ac2b15a38b8dbec506cdc7a`,
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Geoname data:", data);
      let lat = data.lat;
      let lon = data.lon;
      return fetch(
        `https://api.opentripmap.com/0.1/en/places/bbox?lon_min=${lon - 0.01}&lat_min=${lat - 0.01}&lon_max=${lon + 0.01}&lat_max=${lat + 0.01}&apikey=5ae2e3f221c38a28845f05b630fe00001ac2b15a38b8dbec506cdc7a`,
      );
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Places:", data);
      let gon = data.features[0];
      console.log(gon.properties.xid);
      console.log(gon.properties.name);
      let ko = gon.properties.xid;
      return fetch(
        `https://api.opentripmap.com/0.1/en/places/xid/${ko}?apikey=5ae2e3f221c38a28845f05b630fe00001ac2b15a38b8dbec506cdc7a`,
      );
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      visaResultat(data);
    })

    .catch((error) => {
      console.error("Fel vid hämtning av geoname data:", error);
    });
}
function visaResultat(data) {
  let resultatdiv = document.getElementById("resultat");

  let bild = "";

  if (data.preview && data.preview.source) {
    let url = encodeURI(data.preview.source);

    bild = `<img src="${url}" width="300">`;
  }

  resultatdiv.innerHTML = `
    <h2>${data.name || "Okänd plats"}</h2>
    <p>${data.wikipedia_extracts?.text || "Ingen beskrivning"}</p>
    ${bild}
  `;
}
