import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// TODOS LOS PARTIDOS DEL MUNDIAL (fase de grupos completa)
const TODOS_LOS_PARTIDOS = [
  // Grupo A
  { id: "A1", grupo: "A", local: "México", visitante: "Sudáfrica", golesLocal: 2, golesVisitante: 0, jugado: true, fecha: "2026-06-11", hora: "13:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México", ronda: 1 },
  { id: "A2", grupo: "A", local: "Corea del Sur", visitante: "República Checa", golesLocal: 2, golesVisitante: 1, jugado: true, fecha: "2026-06-11", hora: "20:00", estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México", ronda: 1 },
  { id: "A3", grupo: "A", local: "México", visitante: "Corea del Sur", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", hora: "18:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México", ronda: 2 },
  { id: "A4", grupo: "A", local: "Sudáfrica", visitante: "República Checa", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", hora: "21:00", estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México", ronda: 2 },
  { id: "A5", grupo: "A", local: "México", visitante: "República Checa", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "18:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México", ronda: 3 },
  { id: "A6", grupo: "A", local: "Corea del Sur", visitante: "Sudáfrica", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "21:00", estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México", ronda: 3 },

  // Grupo B
  { id: "B1", grupo: "B", local: "Canadá", visitante: "Bosnia y H.", golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-12", hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 1 },
  { id: "B2", grupo: "B", local: "Catar", visitante: "Suiza", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-13", hora: "18:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá", ronda: 1 },
  { id: "B3", grupo: "B", local: "Canadá", visitante: "Catar", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 2 },
  { id: "B4", grupo: "B", local: "Bosnia y H.", visitante: "Suiza", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "18:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá", ronda: 2 },
  { id: "B5", grupo: "B", local: "Suiza", visitante: "Canadá", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 3 },
  { id: "B6", grupo: "B", local: "Bosnia y H.", visitante: "Catar", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "18:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá", ronda: 3 },

  // Grupo C
  { id: "C1", grupo: "C", local: "Brasil", visitante: "Marruecos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-13", hora: "16:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 1 },
  { id: "C2", grupo: "C", local: "Haití", visitante: "Escocia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-13", hora: "19:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", ronda: 1 },
  { id: "C3", grupo: "C", local: "Brasil", visitante: "Haití", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", hora: "16:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 2 },
  { id: "C4", grupo: "C", local: "Marruecos", visitante: "Escocia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", hora: "19:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", ronda: 2 },
  { id: "C5", grupo: "C", local: "Escocia", visitante: "Brasil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", hora: "16:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 3 },
  { id: "C6", grupo: "C", local: "Marruecos", visitante: "Haití", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", hora: "19:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", ronda: 3 },

  // Grupo D
  { id: "D1", grupo: "D", local: "Estados Unidos", visitante: "Paraguay", golesLocal: 4, golesVisitante: 1, jugado: true, fecha: "2026-06-12", hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 1 },
  { id: "D2", grupo: "D", local: "Australia", visitante: "Turquía", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-13", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 1 },
  { id: "D3", grupo: "D", local: "Estados Unidos", visitante: "Australia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 2 },
  { id: "D4", grupo: "D", local: "Paraguay", visitante: "Turquía", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 2 },
  { id: "D5", grupo: "D", local: "Turquía", visitante: "Estados Unidos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 3 },
  { id: "D6", grupo: "D", local: "Paraguay", visitante: "Australia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 3 },

  // Grupo E (HOY 15 DE JUNIO)
  { id: "E1", grupo: "E", local: "Alemania", visitante: "Curazao", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 1 },
  { id: "E2", grupo: "E", local: "Costa de Marfil", visitante: "Ecuador", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 1 },
  { id: "E3", grupo: "E", local: "Alemania", visitante: "Costa de Marfil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 2 },
  { id: "E4", grupo: "E", local: "Curazao", visitante: "Ecuador", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 2 },
  { id: "E5", grupo: "E", local: "Ecuador", visitante: "Alemania", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 3 },
  { id: "E6", grupo: "E", local: "Curazao", visitante: "Costa de Marfil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 3 },

  // Grupo F (HOY 15 DE JUNIO)
  { id: "F1", grupo: "F", local: "Países Bajos", visitante: "Japón", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 1 },
  { id: "F2", grupo: "F", local: "Suecia", visitante: "Túnez", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "20:00", estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México", ronda: 1 },
  { id: "F3", grupo: "F", local: "Países Bajos", visitante: "Suecia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 2 },
  { id: "F4", grupo: "F", local: "Japón", visitante: "Túnez", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "20:00", estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México", ronda: 2 },
  { id: "F5", grupo: "F", local: "Túnez", visitante: "Países Bajos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 3 },
  { id: "F6", grupo: "F", local: "Japón", visitante: "Suecia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "20:00", estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México", ronda: 3 },
]

export async function GET() {
  return NextResponse.json(TODOS_LOS_PARTIDOS, {
    status: 200,
    headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" },
  })
}
