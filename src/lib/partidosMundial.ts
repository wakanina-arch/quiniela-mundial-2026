// src/lib/partidosMundial.ts

export interface PartidoReal {
  id: number
  grupo: string
  local: string
  visitante: string
  golesLocal: number
  golesVisitante: number
  jugado: boolean
  fecha: string
  horaLocal: string
  horaEspana: string
  estadio: string
  ciudad: string
  timestamp: number
  autoMarcado?: boolean
}

export const BANDERAS: Record<string, string> = {
  "México": "🇲🇽", "Corea del Sur": "🇰🇷", "República Checa": "🇨🇿", "Sudáfrica": "🇿🇦",
  "Canadá": "🇨🇦", "Bosnia y Herzegovina": "🇧🇦", "Catar": "🇶🇦", "Suiza": "🇨🇭",
  "Brasil": "🇧🇷", "Marruecos": "🇲🇦", "Haití": "🇭🇹", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Estados Unidos": "🇺🇸", "Paraguay": "🇵🇾", "Australia": "🇦🇺", "Turquía": "🇹🇷",
  "Alemania": "🇩🇪", "Curazao": "🇨🇼", "Costa de Marfil": "🇨🇮", "Ecuador": "🇪🇨",
  "Países Bajos": "🇳🇱", "Japón": "🇯🇵", "Suecia": "🇸🇪", "Túnez": "🇹🇳",
  "Bélgica": "🇧🇪", "Egipto": "🇪🇬", "Irán": "🇮🇷", "Nueva Zelanda": "🇳🇿",
  "España": "🇪🇸", "Cabo Verde": "🇨🇻", "Arabia Saudita": "🇸🇦", "Uruguay": "🇺🇾",
  "Francia": "🇫🇷", "Senegal": "🇸🇳", "Irak": "🇮🇶", "Noruega": "🇳🇴",
  "Argentina": "🇦🇷", "Argelia": "🇩🇿", "Austria": "🇦🇹", "Jordania": "🇯🇴",
  "Portugal": "🇵🇹", "RD Congo": "🇨🇩", "Uzbekistán": "🇺🇿", "Colombia": "🇨🇴",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croacia": "🇭🇷", "Ghana": "🇬🇭", "Panamá": "🇵🇦"
};

const horaEspana = (horaLocal: string): string => {
  const [h, m] = horaLocal.split(':').map(Number);
  let nuevaH = h + 6;
  if (nuevaH >= 24) nuevaH -= 24;
  return `${nuevaH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// ------------------------------------------------------------------
// LISTA COMPLETA DE 72 PARTIDOS (fase de grupos)
// Basada en el fixture oficial del Mundial 2026
// ------------------------------------------------------------------
export const PARTIDOS_BASE: PartidoReal[] = [
  // 11 de junio
  { id: 1, grupo: "A", local: "México", visitante: "Sudáfrica", golesLocal: 2, golesVisitante: 0, jugado: true, fecha: "2026-06-11", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Ciudad de México", ciudad: "CDMX", timestamp: new Date(2026, 5, 11, 15, 0).getTime() },
  { id: 2, grupo: "A", local: "Corea del Sur", visitante: "República Checa", golesLocal: 2, golesVisitante: 1, jugado: true, fecha: "2026-06-11", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 11, 18, 0).getTime() },
  // 12 de junio
  { id: 3, grupo: "B", local: "Canadá", visitante: "Bosnia y Herzegovina", golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-12", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 12, 15, 0).getTime() },
  { id: 4, grupo: "D", local: "Estados Unidos", visitante: "Paraguay", golesLocal: 4, golesVisitante: 1, jugado: true, fecha: "2026-06-12", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 12, 18, 0).getTime() },
  // 13 de junio
  { id: 5, grupo: "B", local: "Catar", visitante: "Suiza", golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-13", horaLocal: "12:00", horaEspana: horaEspana("12:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 13, 12, 0).getTime() },
  { id: 6, grupo: "C", local: "Brasil", visitante: "Marruecos", golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-13", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 13, 15, 0).getTime() },
  { id: 7, grupo: "C", local: "Haití", visitante: "Escocia", golesLocal: 0, golesVisitante: 1, jugado: true, fecha: "2026-06-13", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 13, 18, 0).getTime() },
  { id: 8, grupo: "D", local: "Australia", visitante: "Turquía", golesLocal: 2, golesVisitante: 0, jugado: true, fecha: "2026-06-13", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 13, 21, 0).getTime() },
  // 14 de junio
  { id: 9, grupo: "E", local: "Alemania", visitante: "Curazao", golesLocal: 7, golesVisitante: 1, jugado: true, fecha: "2026-06-14", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 14, 13, 0).getTime() },
  { id: 10, grupo: "F", local: "Países Bajos", visitante: "Japón", golesLocal: 2, golesVisitante: 2, jugado: true, fecha: "2026-06-14", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 14, 16, 0).getTime() },
  { id: 11, grupo: "E", local: "Costa de Marfil", visitante: "Ecuador", golesLocal: 1, golesVisitante: 0, jugado: true, fecha: "2026-06-14", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 14, 19, 0).getTime() },
  { id: 12, grupo: "F", local: "Suecia", visitante: "Túnez", golesLocal: 5, golesVisitante: 1, jugado: true, fecha: "2026-06-14", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Monterrey", ciudad: "Monterrey", timestamp: new Date(2026, 5, 14, 22, 0).getTime() },
  // 15 de junio
  { id: 13, grupo: "H", local: "España", visitante: "Cabo Verde", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 15, 15, 0).getTime() },
  { id: 14, grupo: "G", local: "Bélgica", visitante: "Egipto", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 15, 18, 0).getTime() },
  { id: 15, grupo: "H", local: "Arabia Saudita", visitante: "Uruguay", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 15, 21, 0).getTime() },
  { id: 16, grupo: "G", local: "Irán", visitante: "Nueva Zelanda", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 15, 0, 0).getTime() },
  // 16 de junio
  { id: 17, grupo: "I", local: "Francia", visitante: "Senegal", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 16, 15, 0).getTime() },
  { id: 18, grupo: "I", local: "Irak", visitante: "Noruega", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 16, 18, 0).getTime() },
  { id: 19, grupo: "J", local: "Argentina", visitante: "Argelia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 16, 21, 0).getTime() },
  { id: 20, grupo: "J", local: "Austria", visitante: "Jordania", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 16, 0, 0).getTime() },
  // 17 de junio
  { id: 21, grupo: "K", local: "Portugal", visitante: "RD Congo", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 17, 13, 0).getTime() },
  { id: 22, grupo: "L", local: "Inglaterra", visitante: "Croacia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 17, 16, 0).getTime() },
  { id: 23, grupo: "L", local: "Ghana", visitante: "Panamá", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 17, 19, 0).getTime() },
  { id: 24, grupo: "K", local: "Uzbekistán", visitante: "Colombia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Ciudad de México", ciudad: "CDMX", timestamp: new Date(2026, 5, 17, 22, 0).getTime() },
  // 18 de junio
  { id: 25, grupo: "A", local: "República Checa", visitante: "Sudáfrica", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "12:00", horaEspana: horaEspana("12:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 18, 12, 0).getTime() },
  { id: 26, grupo: "B", local: "Suiza", visitante: "Bosnia y Herzegovina", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 18, 15, 0).getTime() },
  { id: 27, grupo: "B", local: "Canadá", visitante: "Catar", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 18, 18, 0).getTime() },
  { id: 28, grupo: "A", local: "México", visitante: "Corea del Sur", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 18, 21, 0).getTime() },
  // 19 de junio
  { id: 29, grupo: "D", local: "Estados Unidos", visitante: "Australia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 19, 15, 0).getTime() },
  { id: 30, grupo: "C", local: "Escocia", visitante: "Marruecos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 19, 18, 0).getTime() },
  { id: 31, grupo: "C", local: "Brasil", visitante: "Haití", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 19, 21, 0).getTime() },
  { id: 32, grupo: "D", local: "Turquía", visitante: "Paraguay", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 19, 0, 0).getTime() },
  // 20 de junio
  { id: 33, grupo: "F", local: "Países Bajos", visitante: "Suecia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 20, 13, 0).getTime() },
  { id: 34, grupo: "E", local: "Alemania", visitante: "Costa de Marfil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 20, 16, 0).getTime() },
  { id: 35, grupo: "E", local: "Ecuador", visitante: "Curazao", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 20, 22, 0).getTime() },
  { id: 36, grupo: "F", local: "Túnez", visitante: "Japón", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Monterrey", ciudad: "Monterrey", timestamp: new Date(2026, 5, 20, 0, 0).getTime() },
  // 21 de junio
  { id: 37, grupo: "H", local: "España", visitante: "Arabia Saudita", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "12:00", horaEspana: horaEspana("12:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 21, 12, 0).getTime() },
  { id: 38, grupo: "G", local: "Bélgica", visitante: "Irán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 21, 15, 0).getTime() },
  { id: 39, grupo: "H", local: "Uruguay", visitante: "Cabo Verde", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 21, 18, 0).getTime() },
  { id: 40, grupo: "G", local: "Nueva Zelanda", visitante: "Egipto", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 21, 21, 0).getTime() },
  // 22 de junio
  { id: 41, grupo: "J", local: "Argentina", visitante: "Austria", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 22, 13, 0).getTime() },
  { id: 42, grupo: "I", local: "Francia", visitante: "Irak", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "17:00", horaEspana: horaEspana("17:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 22, 17, 0).getTime() },
  { id: 43, grupo: "I", local: "Noruega", visitante: "Senegal", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "20:00", horaEspana: horaEspana("20:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 22, 20, 0).getTime() },
  { id: 44, grupo: "J", local: "Jordania", visitante: "Argelia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "23:00", horaEspana: horaEspana("23:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 22, 23, 0).getTime() },
  // 23 de junio
  { id: 45, grupo: "K", local: "Portugal", visitante: "Uzbekistán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 23, 13, 0).getTime() },
  { id: 46, grupo: "L", local: "Inglaterra", visitante: "Ghana", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 23, 16, 0).getTime() },
  { id: 47, grupo: "L", local: "Panamá", visitante: "Croacia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 23, 19, 0).getTime() },
  { id: 48, grupo: "K", local: "Colombia", visitante: "RD Congo", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 23, 22, 0).getTime() },
  // 24 de junio
  { id: 49, grupo: "B", local: "Suiza", visitante: "Canadá", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 24, 15, 0).getTime() },
  { id: 50, grupo: "B", local: "Bosnia y Herzegovina", visitante: "Catar", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 24, 15, 0).getTime() },
  { id: 51, grupo: "C", local: "Escocia", visitante: "Brasil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 24, 18, 0).getTime() },
  { id: 52, grupo: "C", local: "Marruecos", visitante: "Haití", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 24, 18, 0).getTime() },
  { id: 53, grupo: "A", local: "República Checa", visitante: "México", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Ciudad de México", ciudad: "CDMX", timestamp: new Date(2026, 5, 24, 21, 0).getTime() },
  { id: 54, grupo: "A", local: "Sudáfrica", visitante: "Corea del Sur", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Monterrey", ciudad: "Monterrey", timestamp: new Date(2026, 5, 24, 21, 0).getTime() },
  // 25 de junio
  { id: 55, grupo: "E", local: "Curazao", visitante: "Costa de Marfil", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 25, 16, 0).getTime() },
  { id: 56, grupo: "E", local: "Ecuador", visitante: "Alemania", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 25, 16, 0).getTime() },
  { id: 57, grupo: "F", local: "Japón", visitante: "Suecia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 25, 19, 0).getTime() },
  { id: 58, grupo: "F", local: "Túnez", visitante: "Países Bajos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 25, 19, 0).getTime() },
  { id: 59, grupo: "D", local: "Turquía", visitante: "Estados Unidos", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 25, 22, 0).getTime() },
  { id: 60, grupo: "D", local: "Paraguay", visitante: "Australia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 25, 22, 0).getTime() },
  // 26 de junio
  { id: 61, grupo: "I", local: "Noruega", visitante: "Francia", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 26, 15, 0).getTime() },
  { id: 62, grupo: "I", local: "Senegal", visitante: "Irak", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 26, 15, 0).getTime() },
  { id: 63, grupo: "H", local: "Cabo Verde", visitante: "Arabia Saudita", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "20:00", horaEspana: horaEspana("20:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 26, 20, 0).getTime() },
  { id: 64, grupo: "H", local: "Uruguay", visitante: "España", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "20:00", horaEspana: horaEspana("20:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 26, 20, 0).getTime() },
  { id: 65, grupo: "G", local: "Egipto", visitante: "Irán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "23:00", horaEspana: horaEspana("23:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 26, 23, 0).getTime() },
  { id: 66, grupo: "G", local: "Nueva Zelanda", visitante: "Bélgica", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "23:00", horaEspana: horaEspana("23:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 26, 23, 0).getTime() },
  // 27 de junio
  { id: 67, grupo: "L", local: "Panamá", visitante: "Inglaterra", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "17:00", horaEspana: horaEspana("17:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 27, 17, 0).getTime() },
  { id: 68, grupo: "L", local: "Croacia", visitante: "Ghana", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "17:00", horaEspana: horaEspana("17:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 27, 17, 0).getTime() },
  { id: 69, grupo: "K", local: "Colombia", visitante: "Portugal", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "19:30", horaEspana: horaEspana("19:30"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 27, 19, 30, 0).getTime() },
  { id: 70, grupo: "K", local: "RD Congo", visitante: "Uzbekistán", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "19:30", horaEspana: horaEspana("19:30"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 27, 19, 30, 0).getTime() },
  { id: 71, grupo: "J", local: "Argelia", visitante: "Austria", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 27, 22, 0).getTime() },
  { id: 72, grupo: "J", local: "Jordania", visitante: "Argentina", golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 27, 22, 0).getTime() }
];

export const actualizarPartidosFinalizados = (partidos: PartidoReal[]): (PartidoReal & { autoMarcado?: boolean })[] => {
  const ahora = Date.now();
  return partidos.map(p => {
    if (p.jugado) return p;
    const fin = p.timestamp + 120 * 60 * 1000; // 90' + 30' margen
    if (ahora >= fin) {
      return { ...p, jugado: true, golesLocal: 0, golesVisitante: 0, autoMarcado: true };
    }
    return p;
  });
};

export const obtenerPartidosActualizados = (): (PartidoReal & { autoMarcado?: boolean })[] => {
  return actualizarPartidosFinalizados(PARTIDOS_BASE);
};