export class ManholeModel {
  constructor({
    id,
    featureTypeId,
    name,
    subSection,
    county,
    srid,
    wkt,
    lat,
    long,
  }) {
    this.id = id;
    this.featureTypeId = featureTypeId;
    this.name = name;
    this.subSection = subSection;
    this.county = county;
    this.srid = srid;
    this.wkt = wkt;
    this.lat = lat;
    this.long = long;
  }

  // Her kan du legge til metoder som beregner avstand, eller andre hjelpefunksjoner
}
