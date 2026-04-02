import pool from "../config/db.js";
import { haversineKm } from "../utils/geo.js";
import { validateAddSchool, validateListQuery } from "../utils/schoolValidation.js";

export async function addSchool(req, res) {
  const validation = validateAddSchool(req.body ?? {});
  if (!validation.ok) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validation.errors });
  }

  const { name, address, latitude, longitude } = validation.data;

  try {
    const [existing] = await pool.execute(
      `SELECT id, name, address, latitude, longitude
       FROM school
       WHERE LOWER(name) = LOWER(?)
         AND (
           LOWER(address) = LOWER(?)
           OR (ABS(latitude - ?) < 0.000001 AND ABS(longitude - ?) < 0.000001)
         )
       LIMIT 1`,
      [name, address, latitude, longitude],
    );
    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(409).json({
        error: "Duplicate school",
        message: "A school with the same name already exists at this location.",
        existingSchool: existing[0],
      });
    }
    const [result] = await pool.execute(
      "INSERT INTO school (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude],
    );
    return res.status(201).json({
      message: "School added successfully",
      school: { name, address, latitude, longitude },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add school" });
  }
}

export async function listSchools(req, res) {
  const validation = validateListQuery(req.query ?? {});
  if (!validation.ok) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: validation.errors });
  }

  const { latitude: userLat, longitude: userLon } = validation.data;

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, address, latitude, longitude FROM school",
    );

    const sorted = rows
      .map((row) => ({
        ...row,
        distanceKm: haversineKm(userLat, userLon, row.latitude, row.longitude),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return res.json({ schools: sorted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to list schools" });
  }
}
