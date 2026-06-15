import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface Partido {
  id: string
  grupo: string
  local: string
  visitante: string
  golesLocal: number
  golesVisitante: number
  jugado: boolean
  fecha: string
  hora: string
  estadio: string
  ciudad: string
  pais: string
  ronda: number
}

const TODOS_LOS_PARTIDOS: Partido[] = [
  // ==================== GRUPO A ====================
  { id: "A1", grupo: "A", local: "México", visitante: "Sudáfrica", golesLocal: 2, golesVisitante: 0, jugado: true, fecha: "2026-06-11", hora: "13:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México", ronda: 1 },
  { id: "A2", grupo: "A", local: "Corea del Sur", visitante: "República Checa", golesLocal: 2, golesVisitante: 1, jugado: true, fecha: "2026-06-11", hora: "20:00", estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México", ronda: 1 },
  { id: "A3", grupo: "A", local: "México", visitante: "Corea del Sur", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", hora: "18:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México", ronda: 2 },
  { id: "A4", grupo: "A", local: "Sudáfrica", visitante: "República Checa", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", hora: "21:00", estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México", ronda: 2 },
  { id: "A5", grupo: "A", local: "México", visitante: "República Checa", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "18:00", estadio: "Estadio Azteca", ciudad: "Ciudad de México", pais: "México", ronda: 3 },
  { id: "A6", grupo: "A", local: "Corea del Sur", visitante: "Sudáfrica", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "21:00", estadio: "Estadio Akron", ciudad: "Guadalajara", pais: "México", ronda: 3 },

  // ==================== GRUPO B ====================
  { id: "B1", grupo: "B", local: "Canadá", visitante: "Bosnia y H.", golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-12", hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 1 },
  { id: "B2", grupo: "B", local: "Catar", visitante: "Suiza", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-12", hora: "18:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá", ronda: 1 },
  { id: "B3", grupo: "B", local: "Canadá", visitante: "Catar", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 2 },
  { id: "B4", grupo: "B", local: "Bosnia y H.", visitante: "Suiza", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "18:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá", ronda: 2 },
  { id: "B5", grupo: "B", local: "Suiza", visitante: "Canadá", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "15:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 3 },
  { id: "B6", grupo: "B", local: "Bosnia y H.", visitante: "Catar", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "18:00", estadio: "BC Place", ciudad: "Vancouver", pais: "Canadá", ronda: 3 },

  // ==================== GRUPO C ====================
  { id: "C1", grupo: "C", local: "Brasil", visitante: "Marruecos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-13", hora: "16:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 1 },
  { id: "C2", grupo: "C", local: "Haití", visitante: "Escocia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-13", hora: "19:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", ronda: 1 },
  { id: "C3", grupo: "C", local: "Brasil", visitante: "Haití", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", hora: "16:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 2 },
  { id: "C4", grupo: "C", local: "Marruecos", visitante: "Escocia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", hora: "19:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", ronda: 2 },
  { id: "C5", grupo: "C", local: "Escocia", visitante: "Brasil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", hora: "16:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 3 },
  { id: "C6", grupo: "C", local: "Marruecos", visitante: "Haití", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", hora: "19:00", estadio: "Levi's Stadium", ciudad: "San Francisco", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO D ====================
  { id: "D1", grupo: "D", local: "Estados Unidos", visitante: "Paraguay", golesLocal: 4, golesVisitante: 1, jugado: true, fecha: "2026-06-12", hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 1 },
  { id: "D2", grupo: "D", local: "Australia", visitante: "Turquía", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-12", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 1 },
  { id: "D3", grupo: "D", local: "Estados Unidos", visitante: "Australia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 2 },
  { id: "D4", grupo: "D", local: "Paraguay", visitante: "Turquía", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 2 },
  { id: "D5", grupo: "D", local: "Turquía", visitante: "Estados Unidos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "18:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 3 },
  { id: "D6", grupo: "D", local: "Paraguay", visitante: "Australia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO E ====================
  { id: "E1", grupo: "E", local: "Alemania", visitante: "Curazao", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-14", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 1 },
  { id: "E2", grupo: "E", local: "Costa de Marfil", visitante: "Ecuador", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-14", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 1 },
  { id: "E3", grupo: "E", local: "Alemania", visitante: "Costa de Marfil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 2 },
  { id: "E4", grupo: "E", local: "Curazao", visitante: "Ecuador", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 2 },
  { id: "E5", grupo: "E", local: "Ecuador", visitante: "Alemania", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", hora: "12:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 3 },
  { id: "E6", grupo: "E", local: "Curazao", visitante: "Costa de Marfil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", hora: "19:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO F ====================
  { id: "F1", grupo: "F", local: "Países Bajos", visitante: "Japón", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-14", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 1 },
  { id: "F2", grupo: "F", local: "Suecia", visitante: "Túnez", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-14", hora: "20:00", estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México", ronda: 1 },
  { id: "F3", grupo: "F", local: "Países Bajos", visitante: "Suecia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 2 },
  { id: "F4", grupo: "F", local: "Japón", visitante: "Túnez", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", hora: "20:00", estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México", ronda: 2 },
  { id: "F5", grupo: "F", local: "Túnez", visitante: "Países Bajos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 3 },
  { id: "F6", grupo: "F", local: "Japón", visitante: "Suecia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", hora: "20:00", estadio: "Estadio BBVA", ciudad: "Monterrey", pais: "México", ronda: 3 },

  // ==================== GRUPO G ====================
  { id: "G1", grupo: "G", local: "Bélgica", visitante: "Egipto", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "13:00", estadio: "Arrowhead Stadium", ciudad: "Kansas City", pais: "EEUU", ronda: 1 },
  { id: "G2", grupo: "G", local: "Irán", visitante: "Nueva Zelanda", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "16:00", estadio: "Lumen Field", ciudad: "Seattle", pais: "EEUU", ronda: 1 },
  { id: "G3", grupo: "G", local: "Bélgica", visitante: "Irán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "13:00", estadio: "Arrowhead Stadium", ciudad: "Kansas City", pais: "EEUU", ronda: 2 },
  { id: "G4", grupo: "G", local: "Egipto", visitante: "Nueva Zelanda", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "16:00", estadio: "Lumen Field", ciudad: "Seattle", pais: "EEUU", ronda: 2 },
  { id: "G5", grupo: "G", local: "Nueva Zelanda", visitante: "Bélgica", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "13:00", estadio: "Arrowhead Stadium", ciudad: "Kansas City", pais: "EEUU", ronda: 3 },
  { id: "G6", grupo: "G", local: "Egipto", visitante: "Irán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "16:00", estadio: "Lumen Field", ciudad: "Seattle", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO H ====================
  { id: "H1", grupo: "H", local: "España", visitante: "Cabo Verde", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "19:00", estadio: "Hard Rock Stadium", ciudad: "Miami", pais: "EEUU", ronda: 1 },
  { id: "H2", grupo: "H", local: "Arabia Saudita", visitante: "Uruguay", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", hora: "22:00", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "EEUU", ronda: 1 },
  { id: "H3", grupo: "H", local: "España", visitante: "Arabia Saudita", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "19:00", estadio: "Hard Rock Stadium", ciudad: "Miami", pais: "EEUU", ronda: 2 },
  { id: "H4", grupo: "H", local: "Cabo Verde", visitante: "Uruguay", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", hora: "22:00", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "EEUU", ronda: 2 },
  { id: "H5", grupo: "H", local: "Uruguay", visitante: "España", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "19:00", estadio: "Hard Rock Stadium", ciudad: "Miami", pais: "EEUU", ronda: 3 },
  { id: "H6", grupo: "H", local: "Cabo Verde", visitante: "Arabia Saudita", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-28", hora: "22:00", estadio: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO I ====================
  { id: "I1", grupo: "I", local: "Francia", visitante: "Senegal", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", hora: "14:00", estadio: "Gillette Stadium", ciudad: "Boston", pais: "EEUU", ronda: 1 },
  { id: "I2", grupo: "I", local: "Irak", visitante: "Noruega", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", hora: "17:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 1 },
  { id: "I3", grupo: "I", local: "Francia", visitante: "Irak", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", hora: "14:00", estadio: "Gillette Stadium", ciudad: "Boston", pais: "EEUU", ronda: 2 },
  { id: "I4", grupo: "I", local: "Senegal", visitante: "Noruega", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", hora: "17:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 2 },
  { id: "I5", grupo: "I", local: "Noruega", visitante: "Francia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-29", hora: "14:00", estadio: "Gillette Stadium", ciudad: "Boston", pais: "EEUU", ronda: 3 },
  { id: "I6", grupo: "I", local: "Senegal", visitante: "Irak", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-29", hora: "17:00", estadio: "Lincoln Financial Field", ciudad: "Philadelphia", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO J ====================
  { id: "J1", grupo: "J", local: "Argentina", visitante: "Argelia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", hora: "20:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 1 },
  { id: "J2", grupo: "J", local: "Austria", visitante: "Jordania", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", hora: "23:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 1 },
  { id: "J3", grupo: "J", local: "Argentina", visitante: "Austria", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", hora: "20:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 2 },
  { id: "J4", grupo: "J", local: "Argelia", visitante: "Jordania", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", hora: "23:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 2 },
  { id: "J5", grupo: "J", local: "Jordania", visitante: "Argentina", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-29", hora: "20:00", estadio: "Rose Bowl", ciudad: "Los Ángeles", pais: "EEUU", ronda: 3 },
  { id: "J6", grupo: "J", local: "Argelia", visitante: "Austria", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-29", hora: "23:00", estadio: "SoFi Stadium", ciudad: "Los Ángeles", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO K ====================
  { id: "K1", grupo: "K", local: "Portugal", visitante: "RD Congo", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 1 },
  { id: "K2", grupo: "K", local: "Uzbekistán", visitante: "Colombia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", hora: "18:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 1 },
  { id: "K3", grupo: "K", local: "Portugal", visitante: "Uzbekistán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 2 },
  { id: "K4", grupo: "K", local: "RD Congo", visitante: "Colombia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "18:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 2 },
  { id: "K5", grupo: "K", local: "Colombia", visitante: "Portugal", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-30", hora: "15:00", estadio: "AT&T Stadium", ciudad: "Dallas", pais: "EEUU", ronda: 3 },
  { id: "K6", grupo: "K", local: "RD Congo", visitante: "Uzbekistán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-30", hora: "18:00", estadio: "NRG Stadium", ciudad: "Houston", pais: "EEUU", ronda: 3 },

  // ==================== GRUPO L ====================
  { id: "L1", grupo: "L", local: "Inglaterra", visitante: "Croacia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 1 },
  { id: "L2", grupo: "L", local: "Ghana", visitante: "Panamá", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", hora: "23:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 1 },
  { id: "L3", grupo: "L", local: "Inglaterra", visitante: "Ghana", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 2 },
  { id: "L4", grupo: "L", local: "Croacia", visitante: "Panamá", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", hora: "23:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 2 },
  { id: "L5", grupo: "L", local: "Panamá", visitante: "Inglaterra", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-30", hora: "21:00", estadio: "MetLife Stadium", ciudad: "New Jersey", pais: "EEUU", ronda: 3 },
  { id: "L6", grupo: "L", local: "Croacia", visitante: "Ghana", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-30", hora: "23:00", estadio: "BMO Field", ciudad: "Toronto", pais: "Canadá", ronda: 3 },
]

export async function GET() {
  return NextResponse.json(TODOS_LOS_PARTIDOS, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  })
}