import express from "express";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json({ limit: "10mb" })); // wir speichern Bilddaten als Base64/JSON
app.use(express.static("public"));

// In-Memory (nur Demo!). Für Produktion -> DB (z.B. MongoDB Atlas)
const store = new Map();

// POST /api/save  -> gibt eine ID zurück
app.post("/api/save", (req, res) => {
  const { palette, grid, width, height } = req.body;
  if (!palette || !grid) return res.status(400).json({ error: "invalid" });
  const id = nanoid(8);
  store.set(id, { palette, grid, width, height });
  res.json({ id });
});

// GET /api/load/:id -> liefert gespeicherte Daten
app.get("/api/load/:id", (req, res) => {
  const data = store.get(req.params.id);
  if (!data) return res.status(404).json({ error: "not found" });
  res.json(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on", port));
