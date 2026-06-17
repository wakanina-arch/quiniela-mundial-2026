// src/lib/rankingFIFA.ts

import { obtenerRankingDesdeWikipedia, PaisRanking } from './utils/rankingScraper';
import { 
  guardarRankingEnCache, 
  obtenerRankingDesdeCache, 
  cacheEsValido,
  obtenerTimestampCache,
  limpiarCache,
  obtenerEdadCache
} from './utils/rankingCache';

// Estado interno
let rankingCache: PaisRanking[] | null = null;
let ultimaActualizacion: Date | null = null;
let actualizando = false;

export type { PaisRanking };

export const ULTIMA_ACTUALIZACION = "2026-06-11";
export const PROXIMA_ACTUALIZACION = "2026-07-20";

export const obtenerUltimaActualizacion = (): Date => {
  return new Date(ULTIMA_ACTUALIZACION);
};

export const obtenerProximaActualizacion = (): Date => {
  return new Date(PROXIMA_ACTUALIZACION);
};

export const obtenerDiasParaProxima = (): number => {
  const ahora = new Date();
  const proxima = new Date(PROXIMA_ACTUALIZACION);
  const diff = proxima.getTime() - ahora.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Función principal: obtener ranking (con auto‑actualización)
export const obtenerRankingCompleto = async (): Promise<PaisRanking[]> => {
  // 1. Si hay cache en memoria válido (menos de 24h), devolverlo
  if (rankingCache && ultimaActualizacion) {
    const cacheValido = (Date.now() - ultimaActualizacion.getTime()) < 24 * 60 * 60 * 1000;
    if (cacheValido) return rankingCache;
  }

  // 2. Si hay cache en localStorage válido, usarlo
  if (cacheEsValido()) {
    const cacheData = obtenerRankingDesdeCache();
    if (cacheData) {
      rankingCache = cacheData;
      ultimaActualizacion = new Date(obtenerTimestampCache() || Date.now());
      return rankingCache;
    }
  }

  // 3. Si no hay cache válido, intentar descargar desde internet
  if (!actualizando) {
    actualizando = true;
    try {
      const nuevoRanking = await obtenerRankingDesdeWikipedia();
      guardarRankingEnCache(nuevoRanking);
      rankingCache = nuevoRanking;
      ultimaActualizacion = new Date();
      actualizando = false;
      return nuevoRanking;
    } catch (error) {
      console.error('Error al actualizar ranking, usando cache antiguo si existe', error);
      actualizando = false;
      // Si falla la descarga, devolver cache antiguo (aunque haya expirado)
      const cacheData = obtenerRankingDesdeCache();
      if (cacheData) {
        rankingCache = cacheData;
        ultimaActualizacion = new Date(obtenerTimestampCache() || Date.now());
        return rankingCache;
      }
      // Si no hay nada, devolver array vacío
      return [];
    }
  }

  // Si se está actualizando, devolver cache antiguo
  const cacheData = obtenerRankingDesdeCache();
  if (cacheData) {
    rankingCache = cacheData;
    ultimaActualizacion = new Date(obtenerTimestampCache() || Date.now());
    return cacheData;
  }
  
  return [];
};

export const actualizarRankingManual = async (): Promise<PaisRanking[]> => {
  limpiarCache();
  rankingCache = null;
  ultimaActualizacion = null;
  return await obtenerRankingCompleto();
};

export const obtenerPaisPorCodigo = async (codigo: string): Promise<PaisRanking | undefined> => {
  const ranking = await obtenerRankingCompleto();
  return ranking.find(p => p.codigo === codigo);
};

export const obtenerPaisPorNombre = async (nombre: string): Promise<PaisRanking | undefined> => {
  const ranking = await obtenerRankingCompleto();
  return ranking.find(p => p.nombre === nombre);
};

export const obtenerPosicionPorNombre = async (nombre: string): Promise<number | undefined> => {
  const pais = await obtenerPaisPorNombre(nombre);
  return pais?.posicion;
};

export const obtenerRankingTop = async (cantidad: number = 10): Promise<PaisRanking[]> => {
  const ranking = await obtenerRankingCompleto();
  return ranking.slice(0, cantidad);
};

export const obtenerInfoCache = () => {
  const edad = obtenerEdadCache();
  return {
    tieneCache: edad !== null,
    edadHoras: edad,
    esValido: cacheEsValido(),
    ultimaActualizacion: ultimaActualizacion || new Date()
  };
};