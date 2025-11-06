import React, { useState, useEffect } from "react";
import "./Gestatie.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const Gestatie = () => {
  const [vaci, setVaci] = useState(() => {
    const data = localStorage.getItem("vaci");
    return data ? JSON.parse(data) : [];
  });
  const [nume, setNume] = useState("");
  const [dataMontare, setDataMontare] = useState("");

  useEffect(() => {
  localStorage.setItem("vaci", JSON.stringify(vaci));
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  verificaNotificari();
}, [vaci]);

  const calculeazaDataFatare = (dataMontare) => {
    const data = new Date(dataMontare);
    data.setDate(data.getDate() + 283);
    return data.toISOString().split("T")[0];
  };

  const adaugaVaca = (e) => {
    e.preventDefault();
    if (!nume || !dataMontare) return;

    const nouaVaca = {
      id: Date.now(),
      nume,
      dataMontare,
      dataFatare: calculeazaDataFatare(dataMontare),
    };

    setVaci([...vaci, nouaVaca]);
    setNume("");
    setDataMontare("");
  };

  const stergeVaca = (id) => {
    setVaci(vaci.filter((v) => v.id !== id));
  };

  const exportaExcel = () => {
  if (vaci.length === 0) return alert("Nu există date de exportat!");

  const dateExport = vaci.map((v) => ({
    "Vacă": v.nume,
    "Data montării": v.dataMontare,
    "Data estimată fătare": v.dataFatare,
    "Zile rămase":
      Math.ceil((new Date(v.dataFatare) - new Date()) / (1000 * 60 * 60 * 24)) > 0
        ? Math.ceil((new Date(v.dataFatare) - new Date()) / (1000 * 60 * 60 * 24))
        : "Termen depășit",
  }));

  const ws = XLSX.utils.json_to_sheet(dateExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gestație");

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, "gestatie_vaci.xlsx");
};

const verificaNotificari = () => {
  vaci.forEach((v) => {
    const zileRamase = Math.ceil(
      (new Date(v.dataFatare) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (zileRamase <= 7 && zileRamase > 0) {
      new Notification("Atenție - Gestație", {
        body: `⚠️ Vaca ${v.nume} este aproape de termen (${zileRamase} zile rămase)!`,
      });
    } else if (zileRamase <= 0) {
      new Notification("Termen depășit", {
        body: `❗Vaca ${v.nume} a depășit termenul de fătare!`,
      });
    }
  });
};

  return (
    <div className="gestatie-container">
      <h2>Monitorizare Gestație Vacă</h2>

      <form onSubmit={adaugaVaca} className="form-section">
        <input
          type="text"
          placeholder="Nume / număr vacă"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
        />
        <input
          type="date"
          value={dataMontare}
          onChange={(e) => setDataMontare(e.target.value)}
        />
        <button type="submit">Adaugă</button>
      </form>
      <button onClick={exportaExcel} className="export-button">
        📊 Exportă în Excel
      </button>


      <div className="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Vacă</th>
        <th>Data montării</th>
        <th>Data estimată fătare</th>
        <th>Zile rămase</th>
        <th>Acțiuni</th>
      </tr>
    </thead>
    <tbody>
      {vaci.map((v) => {
        const zileRamase = Math.ceil(
          (new Date(v.dataFatare) - new Date()) / (1000 * 60 * 60 * 24)
        );

        let backgroundColor = "";
        if (zileRamase <= 0) backgroundColor = "#ffcccc"; // roșu deschis
        else if (zileRamase <= 7) backgroundColor = "#fff3cd"; // galben
        else backgroundColor = "white"; // normal

        return (
          <tr key={v.id} style={{ backgroundColor }}>
            <td>{v.nume}</td>
            <td>{v.dataMontare}</td>
            <td>{v.dataFatare}</td>
            <td>{zileRamase > 0 ? zileRamase : "Termen depășit"}</td>
            <td>
              <button onClick={() => stergeVaca(v.id)}>Șterge</button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Gestatie;
