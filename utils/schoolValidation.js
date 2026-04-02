function parseFiniteNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateAddSchool(body) {
  const errors = [];
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const latitude = parseFiniteNumber(body.latitude);
  const longitude = parseFiniteNumber(body.longitude);

  if (!name) errors.push("name is required and must be a non-empty string");
  if (!address)
    errors.push("address is required and must be a non-empty string");
  if (latitude === null)
    errors.push("latitude is required and must be a finite number");
  else if (latitude < -90 || latitude > 90) {
    errors.push("latitude must be between -90 and 90");
  }
  if (longitude === null)
    errors.push("longitude is required and must be a finite number");
  else if (longitude < -180 || longitude > 180) {
    errors.push("longitude must be between -180 and 180");
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { name, address, latitude, longitude } };
}

export function validateListQuery(query) {
  const errors = [];
  const latitude = parseFiniteNumber(query.latitude);
  const longitude = parseFiniteNumber(query.longitude);

  if (latitude === null)
    errors.push(
      "latitude query parameter is required and must be a finite number",
    );
  else if (latitude < -90 || latitude > 90) {
    errors.push("latitude must be between -90 and 90");
  }
  if (longitude === null)
    errors.push(
      "longitude query parameter is required and must be a finite number",
    );
  else if (longitude < -180 || longitude > 180) {
    errors.push("longitude must be between -180 and 180");
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { latitude, longitude } };
}
