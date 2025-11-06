import React, { useState, useEffect } from "react";
import "./Culturi.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Culturi = () => {
  const [culturi, setCulturi] = useState(() => {
    const data = localStorage.getItem("culturi");
    return data ? JSON.parse(data) : [];
  });

  const [cultura, setCultura] = useState("");
  const [suprafata, setSuprafata] = useState("");
  const [dataSemanat, setDataSemanat] = useState("");
  const [costuri, setCosturi] = useState("");
  const [tratament, setTratament] = useState("");
  const [dataRecoltat, setDataRecoltat] = useState("");

  // Salvează datele și verifică permisiunea pentru notificări
  useEffect(() => {
    localStorage.setItem("culturi", JSON.stringify(culturi));
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    verificaNotificari();
  }, [culturi]);

  // Durate estimative pentru culturi comune
  const durate = {
    grau: 270,
    porumb: 150,
    orz: 240,
    lucerna: 365,
    cartofi: 120,
  };

  const calculeazaDataRecoltare = (nume, dataSemanat) => {
    const durata = durate[nume.toLowerCase()] || 180;
    const data = new Date(dataSemanat);
    data.setDate(data.getDate() + durata);
    return data.toISOString().split("T")[0];
  };

  const adaugaCultura = (e) => {
    e.preventDefault();
    if (!cultura || !suprafata || !dataSemanat) return;

    const nouaCultura = {
      id: Date.now(),
      cultura,
      suprafata,
      dataSemanat,
      dataEstimataRecoltare: calculeazaDataRecoltare(cultura, dataSemanat),
      costuri: costuri || "-",
      tratament: tratament || "-",
      dataRecoltat: dataRecoltat || "",
    };

    setCulturi([...culturi, nouaCultura]);
    setCultura("");
    setSuprafata("");
    setDataSemanat("");
    setCosturi("");
    setTratament("");
    setDataRecoltat("");
  };

  const stergeCultura = (id) => {
    setCulturi(culturi.filter((c) => c.id !== id));
  };

  const actualizeazaCamp = (id, camp, valoare) => {
    setCulturi((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [camp]: valoare } : c))
    );
  };

  const exportaExcel = () => {
    if (culturi.length === 0) return alert("Nu există date de exportat!");

    const dateExport = culturi.map((c) => ({
      "Cultură": c.cultura,
      "Suprafață (ha)": c.suprafata,
      "Data semănatului": c.dataSemanat,
      "Data estimată recoltare": c.dataEstimataRecoltare,
      "Data recoltatului": c.dataRecoltat || "-",
      "Costuri (lei)": c.costuri,
      "Tratament": c.tratament,
    }));

    const ws = XLSX.utils.json_to_sheet(dateExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Culturi");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "culturi.xlsx");
  };

  // 🔔 Verificare notificări
  const verificaNotificari = () => {
    if (Notification.permission !== "granted") return;

    culturi.forEach((c) => {
      if (c.dataRecoltat) return; // deja recoltat

      const azi = new Date();
      const dataRecoltare = new Date(c.dataEstimataRecoltare);
      const diferentaZile = Math.ceil(
        (dataRecoltare - azi) / (1000 * 60 * 60 * 24)
      );

      if (diferentaZile === 7) {
        new Notification("Atenție - Recoltare Aproape!", {
          body: `🌾 Cultură ${c.cultura}: Recoltare în ${diferentaZile} zile!`,
        });
      } else if (diferentaZile === 0) {
        new Notification("Ziua Recoltării!", {
          body: `✅ Azi este ziua estimată pentru recoltarea culturii ${c.cultura}!`,
        });
      }
    });
  };

  return (
    <div className="culturi-container">
      <h2>Gestionare Culturi Agricole</h2>

      <form onSubmit={adaugaCultura} className="form-section">
        <select
          value={cultura}
          onChange={(e) => setCultura(e.target.value)}
          required
        >
          <option value="">Selectează cultura</option>
          <option value="Grâu">Grâu</option>
          <option value="Porumb">Porumb</option>
          <option value="Orz">Orz</option>
          <option value="Lucernă">Lucernă</option>
          <option value="Cartofi">Cartofi</option>
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Suprafață (ha)"
          value={suprafata}
          onChange={(e) => setSuprafata(e.target.value)}
        />
        <label className="calendar-label">Selectare data semănatului:</label>
        <input
          type="date"
          value={dataSemanat}
          onChange={(e) => setDataSemanat(e.target.value)}
        />
        <input
          type="number"
          placeholder="Costuri (lei)"
          value={costuri}
          onChange={(e) => setCosturi(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tratament"
          value={tratament}
          onChange={(e) => setTratament(e.target.value)}
        />
        <button type="submit">Adaugă</button>
      </form>

      <div className="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Cultură</th>
        <th>Suprafață (ha)</th>
        <th>Data semănatului</th>
        <th>Data estimată recoltare</th>
        <th>Data recoltatului</th>
        <th>Costuri (lei)</th>
        <th>Tratament</th>
        <th>Acțiuni</th>
      </tr>
    </thead>
    <tbody>
      {culturi.map((c) => {
        const zileRamase = Math.ceil(
          (new Date(c.dataEstimataRecoltare) - new Date()) /
            (1000 * 60 * 60 * 24)
        );

        const culoareRand = c.dataRecoltat
          ? "#d4edda" // verde deschis dacă e recoltat
          : zileRamase <= 7
          ? "#fff3cd" // galben dacă e aproape de termen
          : "white"; // altfel normal

        return (
          <tr key={c.id} style={{ backgroundColor: culoareRand }}>
            <td>{c.cultura}</td>
            <td>{c.suprafata}</td>
            <td>{c.dataSemanat}</td>
            <td>{c.dataEstimataRecoltare}</td>
            <td>
              {c.dataRecoltat ? (
                c.dataRecoltat
              ) : (
                <input
                  type="date"
                  value={c.dataRecoltat}
                  onChange={(e) =>
                    actualizeazaCamp(c.id, "dataRecoltat", e.target.value)
                  }
                />
              )}
            </td>
            <td>
              <input
                type="number"
                value={c.costuri}
                onChange={(e) =>
                  actualizeazaCamp(c.id, "costuri", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={c.tratament}
                onChange={(e) =>
                  actualizeazaCamp(c.id, "tratament", e.target.value)
                }
              />
            </td>
            <td>
              <button onClick={() => stergeCultura(c.id)}>Șterge</button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


      <button onClick={exportaExcel} className="export-btn">
        📊 Exportă în Excel
      </button>
    </div>
  );
};

export default Culturi;
