import React from "react";
import "./LagredeKumlokk.scss";

const LagredeKumlokk = () => {
  // Hente data fra localStorage
  const storedData = localStorage.getItem("manholeData");
  const manholeData = storedData ? JSON.parse(storedData) : [];

  return (
    <div className="container">
      <h2>Lagrede Kumlokk</h2>
      <div className="cards">
        {manholeData.length > 0 ? (
          manholeData.map((manhole, index) => (
            <div className="card" key={index}>
              <div className="card-content">
                <h3>Kumlokk ({manhole.id})</h3>
                <div>Id: {manhole.id}</div>
                <div>FeatureTypeId: {manhole.featureTypeId}</div>
                <div>SubSection: {manhole.subSection}</div>
                <div>County: {manhole.county}</div>
                <div>Srid: {manhole.srid}</div>
                <div>Wkt: {manhole.wkt}</div>
                <div>Type: {manhole.type}</div>
                <div>SistModifisert: {manhole.sistModifisert}</div>
              </div>
            </div>
          ))
        ) : (
          <p>Ingen lagrede kumlokk funnet.</p>
        )}
      </div>
    </div>
  );
};

export default LagredeKumlokk;
