import React from "react";
import "./LagredeKumlokk.scss";

const LagredeKumlokk = () => {
  // Hente data fra localStorage
  const storedData = localStorage.getItem("manholeData");
  const manholeData = storedData ? JSON.parse(storedData) : [];

  return (
    <div>
      <h2>Lagrede Kumlokk</h2>
      {manholeData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Navn</th>
              <th>Fylke</th>
              <th>Type</th>
              <th>Srid</th>
            </tr>
          </thead>
          <tbody>
            {manholeData.map((manhole, index) => (
              <tr key={index}>
                <td>{manhole.id}</td>
                <td>{manhole.name}</td>
                <td>{manhole.county}</td>
                <td>{manhole.type}</td>
                <td>{manhole.srid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Ingen lagrede kumlokk funnet.</p>
      )}
    </div>
  );
};

export default LagredeKumlokk;
