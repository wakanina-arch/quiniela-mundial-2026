"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trophy, ArrowLeft, LayoutDashboard, Calendar, MapPin, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// ------------------------------------------------------------
// 1. TIPOS
// ------------------------------------------------------------
interface PartidoReal {
  id: number
  grupo: string
  local: string
  visitante: string
  banderaLocal: string
  banderaVisitante: string
  golesLocal: number
  golesVisitante: number
  jugado: boolean
  fecha: string      // YYYY-MM-DD
  horaLocal: string  // HH:MM (EST)
  horaEspana: string // HH:MM (EST+6)
  estadio: string
  ciudad: string
  timestamp: number
}

// ------------------------------------------------------------
// 2. BANDERAS OFICIALES (mapeo completo)
// ------------------------------------------------------------
const BANDERAS: Record<string, string> = {
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
}

// ------------------------------------------------------------
// 3. FUNCIÓN PARA CALCULAR HORA ESPAÑA (EST + 6)
// ------------------------------------------------------------
const horaEspana = (horaLocal: string): string => {
  const [h, m] = horaLocal.split(':').map(Number)
  let nuevaH = h + 6
  if (nuevaH >= 24) nuevaH -= 24
  return `${nuevaH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// ------------------------------------------------------------
// 4. FIXTURE REAL COMPLETO (72 PARTIDOS)
// Basado en el calendario proporcionado por el usuario
// ------------------------------------------------------------
const PARTIDOS_REALES: PartidoReal[] = [
  // ==================== JUEVES 11 DE JUNIO ====================
  { id: 1, grupo: "A", local: "México", visitante: "Sudáfrica", banderaLocal: BANDERAS["México"], banderaVisitante: BANDERAS["Sudáfrica"], golesLocal: 2, golesVisitante: 0, jugado: true, fecha: "2026-06-11", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Ciudad de México", ciudad: "CDMX", timestamp: new Date(2026, 5, 11, 15, 0).getTime() },
  { id: 2, grupo: "A", local: "Corea del Sur", visitante: "República Checa", banderaLocal: BANDERAS["Corea del Sur"], banderaVisitante: BANDERAS["República Checa"], golesLocal: 2, golesVisitante: 1, jugado: true, fecha: "2026-06-11", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 11, 18, 0).getTime() },
  // ==================== VIERNES 12 DE JUNIO ====================
  { id: 3, grupo: "B", local: "Canadá", visitante: "Bosnia y Herzegovina", banderaLocal: BANDERAS["Canadá"], banderaVisitante: BANDERAS["Bosnia y Herzegovina"], golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-12", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 12, 15, 0).getTime() },
  { id: 4, grupo: "D", local: "Estados Unidos", visitante: "Paraguay", banderaLocal: BANDERAS["Estados Unidos"], banderaVisitante: BANDERAS["Paraguay"], golesLocal: 4, golesVisitante: 1, jugado: true, fecha: "2026-06-12", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 12, 18, 0).getTime() },
  // ==================== SÁBADO 13 DE JUNIO ====================
  { id: 5, grupo: "B", local: "Catar", visitante: "Suiza", banderaLocal: BANDERAS["Catar"], banderaVisitante: BANDERAS["Suiza"], golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-13", horaLocal: "12:00", horaEspana: horaEspana("12:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 13, 12, 0).getTime() },
  { id: 6, grupo: "C", local: "Brasil", visitante: "Marruecos", banderaLocal: BANDERAS["Brasil"], banderaVisitante: BANDERAS["Marruecos"], golesLocal: 1, golesVisitante: 1, jugado: true, fecha: "2026-06-13", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 13, 15, 0).getTime() },
  { id: 7, grupo: "C", local: "Haití", visitante: "Escocia", banderaLocal: BANDERAS["Haití"], banderaVisitante: BANDERAS["Escocia"], golesLocal: 0, golesVisitante: 1, jugado: true, fecha: "2026-06-13", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 13, 18, 0).getTime() },
  { id: 8, grupo: "D", local: "Australia", visitante: "Turquía", banderaLocal: BANDERAS["Australia"], banderaVisitante: BANDERAS["Turquía"], golesLocal: 2, golesVisitante: 0, jugado: true, fecha: "2026-06-13", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 13, 21, 0).getTime() },
  // ==================== DOMINGO 14 DE JUNIO ====================
  { id: 9, grupo: "E", local: "Alemania", visitante: "Curazao", banderaLocal: BANDERAS["Alemania"], banderaVisitante: BANDERAS["Curazao"], golesLocal: 7, golesVisitante: 1, jugado: true, fecha: "2026-06-14", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 14, 13, 0).getTime() },
  { id: 10, grupo: "F", local: "Países Bajos", visitante: "Japón", banderaLocal: BANDERAS["Países Bajos"], banderaVisitante: BANDERAS["Japón"], golesLocal: 2, golesVisitante: 2, jugado: true, fecha: "2026-06-14", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 14, 16, 0).getTime() },
  { id: 11, grupo: "E", local: "Costa de Marfil", visitante: "Ecuador", banderaLocal: BANDERAS["Costa de Marfil"], banderaVisitante: BANDERAS["Ecuador"], golesLocal: 1, golesVisitante: 0, jugado: true, fecha: "2026-06-14", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 14, 19, 0).getTime() },
  { id: 12, grupo: "F", local: "Suecia", visitante: "Túnez", banderaLocal: BANDERAS["Suecia"], banderaVisitante: BANDERAS["Túnez"], golesLocal: 5, golesVisitante: 1, jugado: true, fecha: "2026-06-14", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Monterrey", ciudad: "Monterrey", timestamp: new Date(2026, 5, 14, 22, 0).getTime() },
  // ==================== LUNES 15 DE JUNIO ====================
  { id: 13, grupo: "H", local: "España", visitante: "Cabo Verde", banderaLocal: BANDERAS["España"], banderaVisitante: BANDERAS["Cabo Verde"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 15, 15, 0).getTime() },
  { id: 14, grupo: "G", local: "Bélgica", visitante: "Egipto", banderaLocal: BANDERAS["Bélgica"], banderaVisitante: BANDERAS["Egipto"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 15, 18, 0).getTime() },
  { id: 15, grupo: "H", local: "Arabia Saudita", visitante: "Uruguay", banderaLocal: BANDERAS["Arabia Saudita"], banderaVisitante: BANDERAS["Uruguay"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 15, 21, 0).getTime() },
  { id: 16, grupo: "G", local: "Irán", visitante: "Nueva Zelanda", banderaLocal: BANDERAS["Irán"], banderaVisitante: BANDERAS["Nueva Zelanda"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-15", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 15, 0, 0).getTime() },
  // ==================== MARTES 16 DE JUNIO ====================
  { id: 17, grupo: "I", local: "Francia", visitante: "Senegal", banderaLocal: BANDERAS["Francia"], banderaVisitante: BANDERAS["Senegal"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 16, 15, 0).getTime() },
  { id: 18, grupo: "I", local: "Irak", visitante: "Noruega", banderaLocal: BANDERAS["Irak"], banderaVisitante: BANDERAS["Noruega"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 16, 18, 0).getTime() },
  { id: 19, grupo: "J", local: "Argentina", visitante: "Argelia", banderaLocal: BANDERAS["Argentina"], banderaVisitante: BANDERAS["Argelia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 16, 21, 0).getTime() },
  { id: 20, grupo: "J", local: "Austria", visitante: "Jordania", banderaLocal: BANDERAS["Austria"], banderaVisitante: BANDERAS["Jordania"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-16", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 16, 0, 0).getTime() },
  // ==================== MIÉRCOLES 17 DE JUNIO ====================
  { id: 21, grupo: "K", local: "Portugal", visitante: "RD Congo", banderaLocal: BANDERAS["Portugal"], banderaVisitante: BANDERAS["RD Congo"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 17, 13, 0).getTime() },
  { id: 22, grupo: "L", local: "Inglaterra", visitante: "Croacia", banderaLocal: BANDERAS["Inglaterra"], banderaVisitante: BANDERAS["Croacia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 17, 16, 0).getTime() },
  { id: 23, grupo: "L", local: "Ghana", visitante: "Panamá", banderaLocal: BANDERAS["Ghana"], banderaVisitante: BANDERAS["Panamá"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 17, 19, 0).getTime() },
  { id: 24, grupo: "K", local: "Uzbekistán", visitante: "Colombia", banderaLocal: BANDERAS["Uzbekistán"], banderaVisitante: BANDERAS["Colombia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-17", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Ciudad de México", ciudad: "CDMX", timestamp: new Date(2026, 5, 17, 22, 0).getTime() },
  // ==================== JUEVES 18 DE JUNIO ====================
  { id: 25, grupo: "A", local: "República Checa", visitante: "Sudáfrica", banderaLocal: BANDERAS["República Checa"], banderaVisitante: BANDERAS["Sudáfrica"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "12:00", horaEspana: horaEspana("12:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 18, 12, 0).getTime() },
  { id: 26, grupo: "B", local: "Suiza", visitante: "Bosnia y Herzegovina", banderaLocal: BANDERAS["Suiza"], banderaVisitante: BANDERAS["Bosnia y Herzegovina"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 18, 15, 0).getTime() },
  { id: 27, grupo: "B", local: "Canadá", visitante: "Catar", banderaLocal: BANDERAS["Canadá"], banderaVisitante: BANDERAS["Catar"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 18, 18, 0).getTime() },
  { id: 28, grupo: "A", local: "México", visitante: "Corea del Sur", banderaLocal: BANDERAS["México"], banderaVisitante: BANDERAS["Corea del Sur"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-18", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 18, 21, 0).getTime() },
  // ==================== VIERNES 19 DE JUNIO ====================
  { id: 29, grupo: "D", local: "Estados Unidos", visitante: "Australia", banderaLocal: BANDERAS["Estados Unidos"], banderaVisitante: BANDERAS["Australia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 19, 15, 0).getTime() },
  { id: 30, grupo: "C", local: "Escocia", visitante: "Marruecos", banderaLocal: BANDERAS["Escocia"], banderaVisitante: BANDERAS["Marruecos"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 19, 18, 0).getTime() },
  { id: 31, grupo: "C", local: "Brasil", visitante: "Haití", banderaLocal: BANDERAS["Brasil"], banderaVisitante: BANDERAS["Haití"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 19, 21, 0).getTime() },
  { id: 32, grupo: "D", local: "Turquía", visitante: "Paraguay", banderaLocal: BANDERAS["Turquía"], banderaVisitante: BANDERAS["Paraguay"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-19", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 19, 0, 0).getTime() },
  // ==================== SÁBADO 20 DE JUNIO ====================
  { id: 33, grupo: "F", local: "Países Bajos", visitante: "Suecia", banderaLocal: BANDERAS["Países Bajos"], banderaVisitante: BANDERAS["Suecia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 20, 13, 0).getTime() },
  { id: 34, grupo: "E", local: "Alemania", visitante: "Costa de Marfil", banderaLocal: BANDERAS["Alemania"], banderaVisitante: BANDERAS["Costa de Marfil"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 20, 16, 0).getTime() },
  { id: 35, grupo: "E", local: "Ecuador", visitante: "Curazao", banderaLocal: BANDERAS["Ecuador"], banderaVisitante: BANDERAS["Curazao"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 20, 22, 0).getTime() },
  { id: 36, grupo: "F", local: "Túnez", visitante: "Japón", banderaLocal: BANDERAS["Túnez"], banderaVisitante: BANDERAS["Japón"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-20", horaLocal: "00:00", horaEspana: horaEspana("00:00"), estadio: "Estadio Monterrey", ciudad: "Monterrey", timestamp: new Date(2026, 5, 20, 0, 0).getTime() },
  // ==================== DOMINGO 21 DE JUNIO ====================
  { id: 37, grupo: "H", local: "España", visitante: "Arabia Saudita", banderaLocal: BANDERAS["España"], banderaVisitante: BANDERAS["Arabia Saudita"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "12:00", horaEspana: horaEspana("12:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 21, 12, 0).getTime() },
  { id: 38, grupo: "G", local: "Bélgica", visitante: "Irán", banderaLocal: BANDERAS["Bélgica"], banderaVisitante: BANDERAS["Irán"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 21, 15, 0).getTime() },
  { id: 39, grupo: "H", local: "Uruguay", visitante: "Cabo Verde", banderaLocal: BANDERAS["Uruguay"], banderaVisitante: BANDERAS["Cabo Verde"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 21, 18, 0).getTime() },
  { id: 40, grupo: "G", local: "Nueva Zelanda", visitante: "Egipto", banderaLocal: BANDERAS["Nueva Zelanda"], banderaVisitante: BANDERAS["Egipto"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-21", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 21, 21, 0).getTime() },
  // ==================== LUNES 22 DE JUNIO ====================
  { id: 41, grupo: "J", local: "Argentina", visitante: "Austria", banderaLocal: BANDERAS["Argentina"], banderaVisitante: BANDERAS["Austria"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 22, 13, 0).getTime() },
  { id: 42, grupo: "I", local: "Francia", visitante: "Irak", banderaLocal: BANDERAS["Francia"], banderaVisitante: BANDERAS["Irak"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "17:00", horaEspana: horaEspana("17:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 22, 17, 0).getTime() },
  { id: 43, grupo: "I", local: "Noruega", visitante: "Senegal", banderaLocal: BANDERAS["Noruega"], banderaVisitante: BANDERAS["Senegal"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "20:00", horaEspana: horaEspana("20:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 22, 20, 0).getTime() },
  { id: 44, grupo: "J", local: "Jordania", visitante: "Argelia", banderaLocal: BANDERAS["Jordania"], banderaVisitante: BANDERAS["Argelia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-22", horaLocal: "23:00", horaEspana: horaEspana("23:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 22, 23, 0).getTime() },
  // ==================== MARTES 23 DE JUNIO ====================
  { id: 45, grupo: "K", local: "Portugal", visitante: "Uzbekistán", banderaLocal: BANDERAS["Portugal"], banderaVisitante: BANDERAS["Uzbekistán"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "13:00", horaEspana: horaEspana("13:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 23, 13, 0).getTime() },
  { id: 46, grupo: "L", local: "Inglaterra", visitante: "Ghana", banderaLocal: BANDERAS["Inglaterra"], banderaVisitante: BANDERAS["Ghana"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 23, 16, 0).getTime() },
  { id: 47, grupo: "L", local: "Panamá", visitante: "Croacia", banderaLocal: BANDERAS["Panamá"], banderaVisitante: BANDERAS["Croacia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 23, 19, 0).getTime() },
  { id: 48, grupo: "K", local: "Colombia", visitante: "RD Congo", banderaLocal: BANDERAS["Colombia"], banderaVisitante: BANDERAS["RD Congo"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-23", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 23, 22, 0).getTime() },
  // ==================== MIÉRCOLES 24 DE JUNIO ====================
  { id: 49, grupo: "B", local: "Suiza", visitante: "Canadá", banderaLocal: BANDERAS["Suiza"], banderaVisitante: BANDERAS["Canadá"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 24, 15, 0).getTime() },
  { id: 50, grupo: "B", local: "Bosnia y Herzegovina", visitante: "Catar", banderaLocal: BANDERAS["Bosnia y Herzegovina"], banderaVisitante: BANDERAS["Catar"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 24, 15, 0).getTime() },
  { id: 51, grupo: "C", local: "Escocia", visitante: "Brasil", banderaLocal: BANDERAS["Escocia"], banderaVisitante: BANDERAS["Brasil"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 24, 18, 0).getTime() },
  { id: 52, grupo: "C", local: "Marruecos", visitante: "Haití", banderaLocal: BANDERAS["Marruecos"], banderaVisitante: BANDERAS["Haití"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "18:00", horaEspana: horaEspana("18:00"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 24, 18, 0).getTime() },
  { id: 53, grupo: "A", local: "República Checa", visitante: "México", banderaLocal: BANDERAS["República Checa"], banderaVisitante: BANDERAS["México"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Ciudad de México", ciudad: "CDMX", timestamp: new Date(2026, 5, 24, 21, 0).getTime() },
  { id: 54, grupo: "A", local: "Sudáfrica", visitante: "Corea del Sur", banderaLocal: BANDERAS["Sudáfrica"], banderaVisitante: BANDERAS["Corea del Sur"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-24", horaLocal: "21:00", horaEspana: horaEspana("21:00"), estadio: "Estadio Monterrey", ciudad: "Monterrey", timestamp: new Date(2026, 5, 24, 21, 0).getTime() },
  // ==================== JUEVES 25 DE JUNIO ====================
  { id: 55, grupo: "E", local: "Curazao", visitante: "Costa de Marfil", banderaLocal: BANDERAS["Curazao"], banderaVisitante: BANDERAS["Costa de Marfil"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 25, 16, 0).getTime() },
  { id: 56, grupo: "E", local: "Ecuador", visitante: "Alemania", banderaLocal: BANDERAS["Ecuador"], banderaVisitante: BANDERAS["Alemania"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "16:00", horaEspana: horaEspana("16:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 25, 16, 0).getTime() },
  { id: 57, grupo: "F", local: "Japón", visitante: "Suecia", banderaLocal: BANDERAS["Japón"], banderaVisitante: BANDERAS["Suecia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 25, 19, 0).getTime() },
  { id: 58, grupo: "F", local: "Túnez", visitante: "Países Bajos", banderaLocal: BANDERAS["Túnez"], banderaVisitante: BANDERAS["Países Bajos"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "19:00", horaEspana: horaEspana("19:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 25, 19, 0).getTime() },
  { id: 59, grupo: "D", local: "Turquía", visitante: "Estados Unidos", banderaLocal: BANDERAS["Turquía"], banderaVisitante: BANDERAS["Estados Unidos"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Los Ángeles", ciudad: "Los Ángeles", timestamp: new Date(2026, 5, 25, 22, 0).getTime() },
  { id: 60, grupo: "D", local: "Paraguay", visitante: "Australia", banderaLocal: BANDERAS["Paraguay"], banderaVisitante: BANDERAS["Australia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-25", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Bahía de San Francisco", ciudad: "San Francisco", timestamp: new Date(2026, 5, 25, 22, 0).getTime() },
  // ==================== VIERNES 26 DE JUNIO ====================
  { id: 61, grupo: "I", local: "Noruega", visitante: "Francia", banderaLocal: BANDERAS["Noruega"], banderaVisitante: BANDERAS["Francia"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Boston", ciudad: "Boston", timestamp: new Date(2026, 5, 26, 15, 0).getTime() },
  { id: 62, grupo: "I", local: "Senegal", visitante: "Irak", banderaLocal: BANDERAS["Senegal"], banderaVisitante: BANDERAS["Irak"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "15:00", horaEspana: horaEspana("15:00"), estadio: "Estadio Toronto", ciudad: "Toronto", timestamp: new Date(2026, 5, 26, 15, 0).getTime() },
  { id: 63, grupo: "H", local: "Cabo Verde", visitante: "Arabia Saudita", banderaLocal: BANDERAS["Cabo Verde"], banderaVisitante: BANDERAS["Arabia Saudita"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "20:00", horaEspana: horaEspana("20:00"), estadio: "Estadio Houston", ciudad: "Houston", timestamp: new Date(2026, 5, 26, 20, 0).getTime() },
  { id: 64, grupo: "H", local: "Uruguay", visitante: "España", banderaLocal: BANDERAS["Uruguay"], banderaVisitante: BANDERAS["España"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "20:00", horaEspana: horaEspana("20:00"), estadio: "Estadio Guadalajara", ciudad: "Guadalajara", timestamp: new Date(2026, 5, 26, 20, 0).getTime() },
  { id: 65, grupo: "G", local: "Egipto", visitante: "Irán", banderaLocal: BANDERAS["Egipto"], banderaVisitante: BANDERAS["Irán"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "23:00", horaEspana: horaEspana("23:00"), estadio: "Estadio Seattle", ciudad: "Seattle", timestamp: new Date(2026, 5, 26, 23, 0).getTime() },
  { id: 66, grupo: "G", local: "Nueva Zelanda", visitante: "Bélgica", banderaLocal: BANDERAS["Nueva Zelanda"], banderaVisitante: BANDERAS["Bélgica"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-26", horaLocal: "23:00", horaEspana: horaEspana("23:00"), estadio: "BC Place", ciudad: "Vancouver", timestamp: new Date(2026, 5, 26, 23, 0).getTime() },
  // ==================== SÁBADO 27 DE JUNIO ====================
  { id: 67, grupo: "L", local: "Panamá", visitante: "Inglaterra", banderaLocal: BANDERAS["Panamá"], banderaVisitante: BANDERAS["Inglaterra"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "17:00", horaEspana: horaEspana("17:00"), estadio: "Estadio Nueva York Nueva Jersey", ciudad: "Nueva York", timestamp: new Date(2026, 5, 27, 17, 0).getTime() },
  { id: 68, grupo: "L", local: "Croacia", visitante: "Ghana", banderaLocal: BANDERAS["Croacia"], banderaVisitante: BANDERAS["Ghana"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "17:00", horaEspana: horaEspana("17:00"), estadio: "Estadio Filadelfia", ciudad: "Filadelfia", timestamp: new Date(2026, 5, 27, 17, 0).getTime() },
  { id: 69, grupo: "K", local: "Colombia", visitante: "Portugal", banderaLocal: BANDERAS["Colombia"], banderaVisitante: BANDERAS["Portugal"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "19:30", horaEspana: horaEspana("19:30"), estadio: "Estadio Miami", ciudad: "Miami", timestamp: new Date(2026, 5, 27, 19, 30, 0).getTime() },
  { id: 70, grupo: "K", local: "RD Congo", visitante: "Uzbekistán", banderaLocal: BANDERAS["RD Congo"], banderaVisitante: BANDERAS["Uzbekistán"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "19:30", horaEspana: horaEspana("19:30"), estadio: "Estadio Atlanta", ciudad: "Atlanta", timestamp: new Date(2026, 5, 27, 19, 30, 0).getTime() },
  { id: 71, grupo: "J", local: "Argelia", visitante: "Austria", banderaLocal: BANDERAS["Argelia"], banderaVisitante: BANDERAS["Austria"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Kansas City", ciudad: "Kansas City", timestamp: new Date(2026, 5, 27, 22, 0).getTime() },
  { id: 72, grupo: "J", local: "Jordania", visitante: "Argentina", banderaLocal: BANDERAS["Jordania"], banderaVisitante: BANDERAS["Argentina"], golesLocal: 0, golesVisitante: 0, jugado: false, fecha: "2026-06-27", horaLocal: "22:00", horaEspana: horaEspana("22:00"), estadio: "Estadio Dallas", ciudad: "Dallas", timestamp: new Date(2026, 5, 27, 22, 0).getTime() }
]


// ------------------------------------------------------------
// 5. FUNCIÓN PARA ACTUALIZAR PARTIDOS FINALIZADOS CON MARGEN DE 30'
// ------------------------------------------------------------
const actualizarPartidosFinalizados = (partidos: PartidoReal[]): (PartidoReal & { autoMarcado?: boolean })[] => {
  const ahora = Date.now()
  return partidos.map(partido => {
    // Si ya está marcado como jugado, lo dejamos igual
    if (partido.jugado) return partido
    
    const finPartido = partido.timestamp + 120 * 60 * 1000 // 90' + 30' margen
    if (ahora >= finPartido) {
      // Marcamos como jugado con resultado provisional y añadimos flag autoMarcado
      return {
        ...partido,
        jugado: true,
        golesLocal: 0,
        golesVisitante: 0,
        autoMarcado: true
      }
    }
    return partido
  })
}

// ------------------------------------------------------------
// 6. FUNCIONES DE ORDEN Y ESTADO (modificadas para mostrar "Pendiente")
// ------------------------------------------------------------
const agruparPorFecha = (partidos: (PartidoReal & { autoMarcado?: boolean })[]) => {
  const grupos: Record<string, (PartidoReal & { autoMarcado?: boolean })[]> = {}
  for (const p of partidos) {
    if (!grupos[p.fecha]) grupos[p.fecha] = []
    grupos[p.fecha].push(p)
  }
  const fechasOrdenadas = Object.keys(grupos).sort()
  return fechasOrdenadas.map(fecha => ({
    fecha,
    partidos: grupos[fecha].sort((a, b) => a.timestamp - b.timestamp)
  }))
}

const obtenerEstado = (partido: PartidoReal & { autoMarcado?: boolean }) => {
  if (partido.jugado) {
    if (partido.autoMarcado) {
      return { texto: "Finalizado (pendiente)", color: "text-yellow-400", bg: "bg-yellow-950/20" }
    }
    return { texto: "Finalizado", color: "text-green-400", bg: "bg-green-950/30" }
  }
  const ahora = Date.now()
  const inicio = partido.timestamp
  const fin = inicio + 90 * 60 * 1000
  if (ahora >= inicio && ahora <= fin) return { texto: "EN VIVO", color: "text-red-500 animate-pulse", bg: "bg-red-950/30" }
  return { texto: "Próximo", color: "text-yellow-500", bg: "bg-slate-800" }
}

// ------------------------------------------------------------
// 7. COMPONENTE PRINCIPAL
// ------------------------------------------------------------
export default function HistorialPage() {
  const [partidosAgrupados, setPartidosAgrupados] = useState<{ fecha: string; partidos: (PartidoReal & { autoMarcado?: boolean })[] }[]>([])
  const [actualizando, setActualizando] = useState(false)

  const cargarPartidos = () => {
    setActualizando(true)
    setTimeout(() => {
      const partidosActualizados = actualizarPartidosFinalizados(PARTIDOS_REALES)
      const agrupados = agruparPorFecha(partidosActualizados)
      setPartidosAgrupados(agrupados)
      setActualizando(false)
    }, 300)
  }

  useEffect(() => {
    cargarPartidos()
    // Intervalo cada 5 minutos para recalcular partidos finalizados
    const interval = setInterval(cargarPartidos, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Renderizado (igual que antes pero modificando la parte del marcador)
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-yellow-500" />
          Historial y Calendario Oficial
        </h1>
        <button onClick={cargarPartidos} disabled={actualizando} className="text-slate-400 hover:text-white">
          <RefreshCw className={`h-5 w-5 ${actualizando ? "animate-spin" : ""}`} />
        </button>
      </header>

      <main className="flex-1">
        <section className="w-full py-10 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center">
          <div className="container px-4 mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-8 w-8 text-yellow-500 animate-pulse" />
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-400">
                Copa Mundial 2026
              </h1>
            </div>
            <p className="text-slate-400 text-base mt-1">
              Fase de grupos - Datos reales de sedes, horarios y resultados oficiales
            </p>
            <div className="mt-4">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white gap-2 font-bold" asChild>
                <Link href="/quiniela">Ir a la Quiniela</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-6 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            {partidosAgrupados.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400">Cargando calendario...</p>
              </div>
            ) : (
              partidosAgrupados.map(grupo => {
                const fechaObj = new Date(grupo.fecha)
                const fechaLegible = fechaObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                return (
                  <div key={grupo.fecha} className="space-y-3">
                    <div className="sticky top-16 z-40 bg-slate-950/90 backdrop-blur-sm py-2 px-3 rounded-lg border-l-4 border-yellow-500">
                      <h3 className="text-sm font-bold text-yellow-500 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {fechaLegible}
                      </h3>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {grupo.partidos.map(partido => {
                        const estado = obtenerEstado(partido)
                        return (
                          <div key={partido.id} className={`bg-slate-900 rounded-lg border overflow-hidden shadow-md transition-all ${estado.bg}`}>
                            <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800">
                              <div className="text-center font-bold text-sky-400 text-xs">Grupo {partido.grupo}</div>
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between gap-2 text-center font-bold text-sm">
                                <div className="flex-1 text-right">
                                  <span className="text-base mr-1">{partido.banderaLocal}</span>
                                  <span className="text-slate-100 text-xs">{partido.local.split(' ')[0]}</span>
                                </div>
                                {partido.jugado ? (
                                  partido.autoMarcado ? (
                                    <div className="text-yellow-400 font-black text-xs px-2 py-0.5 bg-yellow-950/40 rounded">
                                      Pendiente
                                    </div>
                                  ) : (
                                    <div className="text-yellow-500 font-black text-base px-2 py-0.5 bg-slate-800 rounded">
                                      {partido.golesLocal} - {partido.golesVisitante}
                                    </div>
                                  )
                                ) : estado.texto === "EN VIVO" ? (
                                  <div className="text-red-500 font-black text-xs px-2 py-0.5 bg-red-500/20 rounded-full animate-pulse">🔴 EN VIVO</div>
                                ) : (
                                  <div className="text-yellow-500 font-black text-xs px-2 py-0.5 bg-slate-800 rounded">VS</div>
                                )}
                                <div className="flex-1 text-left">
                                  <span className="text-base mr-1">{partido.banderaVisitante}</span>
                                  <span className="text-slate-100 text-xs">{partido.visitante.split(' ')[0]}</span>
                                </div>
                              </div>
                              <div className="mt-2 text-center text-[10px] text-slate-400">
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partido.horaLocal} ET / {partido.horaEspana} ES</span>
                                </div>
                                <div className="flex items-center justify-center gap-1 mt-1">
                                  <MapPin className="h-2.5 w-2.5" />
                                  <span>{partido.estadio}, {partido.ciudad}</span>
                                </div>
                              </div>
                              <div className={`mt-1.5 text-center text-[9px] font-semibold ${estado.color}`}>
                                {estado.texto === "Finalizado" && "✓ "}
                                {estado.texto === "Finalizado (pendiente)" && "⏳ "}
                                {estado.texto}
                                {partido.autoMarcado && <span className="ml-1 text-[8px]">(no oficial)</span>}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-slate-500 text-xs border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Datos oficiales actualizados según resultados reales</p>
      </footer>
    </div>
  )
}