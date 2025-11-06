import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>👨‍🌾 Bine ai venit în <span className="highlight">FarmApp</span></h1>
      <p className="subtitle">
        Administrează ușor ferma ta — monitorizează gestația, culturile și mai multe.
      </p>

      <div className="cards-container">
        <div className="card-home" onClick={() => navigate("/gestatie")}>
          <h2>🐄 Gestație</h2>
          <p>Monitorizează vacile și primește notificări pentru fătare.</p>
          <button className="card-button">Deschide</button>
        </div>

        <div className="card-home" onClick={() => navigate("/culturi")}>
          <h2>🌾 Culturi</h2>
          <p>Adaugă culturile tale, vezi zilele rămase până la recoltare și costurile.</p>
          <button className="card-button">Deschide</button>
        </div>

        <div className="card-home" onClick={() => navigate("/video")}>
          <h2>📹 Camere (în curând)</h2>
          <p>Monitorizează animalele și terenurile în timp real.</p>
          <button className="card-button">Vezi</button>
        </div>
      </div>

      <footer>
        <p>FarmApp © 2025 — pentru fermieri moderni din România 🇷🇴</p>
      </footer>
    </div>
  );
};

export default Home;
