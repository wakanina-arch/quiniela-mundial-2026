// Ejecutar en consola del navegador para corregir timestamps
const partidos = [
  { id: "1", ciudad: "San Francisco", hora: 15, zona: "PT" }, // PT = UTC-7
  { id: "2", ciudad: "New Jersey", hora: 18, zona: "ET" },    // ET = UTC-4
  { id: "3", ciudad: "Boston", hora: 21, zona: "ET" },
  { id: "4", ciudad: "Vancouver", hora: 0, zona: "PT" },
  { id: "5", ciudad: "Houston", hora: 12, zona: "CT" },       // CT = UTC-5
  { id: "6", ciudad: "Dallas", hora: 15, zona: "CT" },
  { id: "7", ciudad: "Philadelphia", hora: 19, zona: "ET" }
]

const offsetMap = { "PT": 7, "CT": 5, "ET": 4 }  // Junio (horario de verano)

partidos.forEach(p => {
  const offset = offsetMap[p.zona]
  const utcHour = p.hora + offset
  const newTimestamp = new Date(Date.UTC(2026, 5, 13, utcHour, 0)).getTime()
  console.log(`Partido ${p.id}: ${p.hora}:00 ${p.zona} → ${utcHour}:00 UTC → ${new Date(newTimestamp).toISOString()}`)
})
