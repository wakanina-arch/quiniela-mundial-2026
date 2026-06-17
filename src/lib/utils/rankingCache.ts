// src/lib/utils/rankingCache.ts

import { PaisRanking } from './rankingScraper';

const CACHE_KEY = 'fifa_ranking_cache';
const CACHE_TIMESTAMP_KEY = 'fifa_ranking_timestamp';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 horas

export const guardarRankingEnCache = (ranking: PaisRanking[]): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(ranking));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    }
  } catch (error) {
    console.warn('No se pudo guardar el ranking en cache:', error);
  }
};

export const obtenerRankingDesdeCache = (): PaisRanking[] | null => {
  try {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CACHE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.warn('No se pudo leer el ranking desde cache:', error);
    return null;
  }
};

export const obtenerTimestampCache = (): number | null => {
  try {
    if (typeof window === 'undefined') return null;
    const ts = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!ts) return null;
    return parseInt(ts);
  } catch {
    return null;
  }
};

export const cacheEsValido = (): boolean => {
  const timestamp = obtenerTimestampCache();
  if (!timestamp) return false;
  return (Date.now() - timestamp) < CACHE_EXPIRY_MS;
};

export const limpiarCache = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    }
  } catch (error) {
    console.warn('No se pudo limpiar el cache:', error);
  }
};

export const obtenerEdadCache = (): number | null => {
  const timestamp = obtenerTimestampCache();
  if (!timestamp) return null;
  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60)); // horas
};