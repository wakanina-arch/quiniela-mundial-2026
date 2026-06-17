// src/lib/utils/dates.ts

export const getTodayEST = (): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
};

export const getCurrentEST = (): Date => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.format(new Date()).split(/[\/, :]/);
  return new Date(Date.UTC(
    parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]),
    parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5])
  ));
};

export const formatDateES = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};