import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.static("public")); // index.html, edit.html usw.

const store = new Map(); // { id -> { palette, grid, width, height } }

// ✅ Speichern
app.post("/api/save", (req, res) => {
  const { palette, grid, width, height } = req.body;
  if (!palette || !grid) return res.status(400).json({ error: "invalid" });
  const id = nanoid(8);
  store.set(id, { palette, grid, width, height });
  res.json({ id, link: `/edit/${id}` }); // Link direkt mitgeben
});

// ✅ Laden
app.get("/api/load/:id", (req, res) => {
  const data = store.get(req.params.id);
  if (!data) return res.status(404).json({ error: "not found" });
  res.json(data);
});

// ✅ Neue Route: Bearbeitungsseite ausliefern
app.get("/edit/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "edit.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on", port));
