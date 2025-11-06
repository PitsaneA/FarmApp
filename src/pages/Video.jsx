import React, { useState, useEffect } from "react";
import "./Video.css";

const Video = () => {
  const [camere, setCamere] = useState(() => {
    const data = localStorage.getItem("camere");
    return data ? JSON.parse(data) : [];
  });
  const [nume, setNume] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    localStorage.setItem("camere", JSON.stringify(camere));
  }, [camere]);

  const adaugaCamera = (e) => {
    e.preventDefault();
    if (!nume || !link) return alert("Completează toate câmpurile!");

    const nouaCamera = {
      id: Date.now(),
      nume,
      link,
    };

    setCamere([...camere, nouaCamera]);
    setNume("");
    setLink("");
  };

  const stergeCamera = (id) => {
    setCamere(camere.filter((c) => c.id !== id));
  };

  return (
    <div className="video-container">
      <h2>Monitorizare Video</h2>

      <form onSubmit={adaugaCamera} className="form-section">
        <input
          type="text"
          placeholder="Nume cameră (ex: Grajd)"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
        />
        <input
          type="text"
          placeholder="Link video / flux (ex: https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit">Adaugă</button>
      </form>

      <div className="video-grid">
        {camere.length === 0 && <p>Nu există camere adăugate.</p>}
        {camere.map((camera) => (
          <div key={camera.id} className="video-card">
            <h3>{camera.nume}</h3>
            <div className="video-wrapper">
              <iframe
                src={camera.link}
                title={camera.nume}
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
            <button onClick={() => stergeCamera(camera.id)}>Șterge</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Video;
