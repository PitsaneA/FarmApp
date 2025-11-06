import React, { useState } from "react";
import "./Meteo.css";

const API_KEY = "b678ca498603680cbc8fc2cb4ce7f052"; 

const Meteo = () => {
  const [oras, setOras] = useState("");
  const [vreme, setVreme] = useState(null);
  const [eroare, setEroare] = useState("");

  const traduceri = {
    "clear sky": "cer senin",
    "few clouds": "câțiva nori",
    "scattered clouds": "nori împrăștiați",
    "broken clouds": "nori fragmentați",
    "shower rain": "averse",
    "rain": "ploaie",
    "thunderstorm": "furtună",
    "snow": "ninsoare",
    "mist": "ceață",
  };

  const cautaVremea = async (e) => {
  e.preventDefault();
  if (!oras) return;

  try {
    setEroare("");
    setVreme(null);

    // Căutăm coordonatele orașului
    const coordRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${oras}&limit=1&appid=${API_KEY}`
    );

    if (!coordRes.ok) throw new Error("Eroare la conexiune cu serverul OpenWeatherMap");

    const coordData = await coordRes.json();
    if (!coordData[0]) throw new Error("Orașul nu a fost găsit");

    const { lat, lon } = coordData[0];

    // Cerem prognoza
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=ro&exclude=minutely,hourly,alerts&appid=${API_KEY}`
    );

    if (!res.ok) throw new Error("Nu s-au putut obține datele meteo");

    const data = await res.json();

    if (!data.daily) throw new Error("Răspuns incomplet de la server");

    setVreme(data);
  } catch (err) {
    console.error("Eroare meteo:", err);
    setEroare(err.message || "A apărut o eroare necunoscută.");
  }
};


  const traduceDescriere = (text) => {
    return traduceri[text] || text;
  };

  return (
    <div className="meteo-container">
      <h2>Prognoză Meteo - 7 Zile</h2>

      <form onSubmit={cautaVremea} className="meteo-form">
        <input
          type="text"
          placeholder="Introdu un oraș (ex: București)"
          value={oras}
          onChange={(e) => setOras(e.target.value)}
        />
        <button type="submit">Caută</button>
      </form>

      {eroare && <p className="eroare">{eroare}</p>}

      {vreme && (
        <div className="vreme-rezultate">
          <h3>
            {oras.charAt(0).toUpperCase() + oras.slice(1)} - {traduceDescriere(vreme.daily[0].weather[0].description)}
          </h3>
          <p>
            🌡️ {vreme.current.temp.toFixed(1)}°C | 💨 {vreme.current.wind_speed} m/s | 💧 {vreme.current.humidity}%
          </p>

          <div className="prognoza">
            {vreme.daily.slice(0, 7).map((zi, index) => {
              const data = new Date(zi.dt * 1000);
              const numeZi = data.toLocaleDateString("ro-RO", {
                weekday: "long",
              });

              return (
                <div key={index} className="zi-card">
                  <h4>{numeZi}</h4>
                  <img
                    src={`https://openweathermap.org/img/wn/${zi.weather[0].icon}@2x.png`}
                    alt="icon"
                  />
                  <p>{traduceDescriere(zi.weather[0].description)}</p>
                  <p>
                    🌡️ {Math.round(zi.temp.min)}°C - {Math.round(zi.temp.max)}°C
                  </p>
                  <p>💧 {Math.round(zi.pop * 100)}% șanse de ploaie</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Meteo;
