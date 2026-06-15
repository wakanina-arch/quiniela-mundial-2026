"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Calendar, MapPin, Clock, TrendingUp, Award, ArrowLeft, X, CheckCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { partidosGrupos, type Partido } from "@/lib/worldcup-data";

// --------------------------------------------------------------
// 1. FUNCIONES DE FECHA/HORA EN EST (America/New_York)
// --------------------------------------------------------------
const getCurrentEST = (): Date => {
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

const getPartidoDateTime = (partido: Partido): Date => {
  const [year, month, day] = partido.fechaReal.split('-').map(Number);
  const [hour, minute] = partido.horaLocal.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
};

// --------------------------------------------------------------
// 2. LÓGICA DE BLOQUEO Y ESTADO REAL DEL PARTIDO
// --------------------------------------------------------------
const getPartidoEstadoActual = (partido: Partido): { estado: Partido['estado']; mensaje: string; bloqueado: boolean } => {
  const ahora = getCurrentEST();
  const inicio = getPartidoDateTime(partido);
  const diffInicioMin = (inicio.getTime() - ahora.getTime()) / (1000 * 60);
  const finEstimado = new Date(inicio.getTime() + 105 * 60000); // +105 minutos
  const diffFinMin = (finEstimado.getTime() - ahora.getTime()) / (1000 * 60);

  // Si el partido ya está marcado como finished en los datos, lo respetamos
  if (partido.estado === 'finished') {
    return { estado: 'finished', mensaje: '✅ Finalizado', bloqueado: true };
  }

  // Si la hora actual supera la hora de finalización estimada
  if (diffFinMin <= 0) {
    return { estado: 'finished', mensaje: '✅ Finalizado', bloqueado: true };
  }

  // Si está en vivo (entre inicio y fin)
  if (diffInicioMin <= 0 && diffFinMin > 0) {
    return { estado: 'live', mensaje: '🔴 EN VIVO', bloqueado: true };
  }

  // Si faltan menos de 20 minutos para el inicio
  if (diffInicioMin <= 20) {
    return { estado: 'scheduled', mensaje: '⏰ Apuesta cerrada (20\')', bloqueado: true };
  }

  // Si faltan menos de 30 minutos
  if (diffInicioMin <= 30) {
    return { estado: 'scheduled', mensaje: '⚠️ Cierre próximo', bloqueado: false };
  }

  // Apuesta abierta
  return { estado: 'scheduled', mensaje: '✅ Apuesta abierta', bloqueado: false };
};

// --------------------------------------------------------------
// 3. ACTUALIZAR RESULTADOS (SIMULACIÓN O API)
//    En producción, aquí conectarías con una API real.
// --------------------------------------------------------------
const actualizarResultados = (partidos: Partido[]): Partido[] => {
  const ahora = getCurrentEST();
  return partidos.map(partido => {
    const inicio = getPartidoDateTime(partido);
    const finEstimado = new Date(inicio.getTime() + 105 * 60000);
    if (ahora >= finEstimado && partido.estado !== 'finished') {
      // Simular resultado (cámbialo por API real)
      return {
        ...partido,
        estado: 'finished',
        resultadoLocal: Math.floor(Math.random() * 6),
        resultadoVisitante: Math.floor(Math.random() * 6),
      };
    }
    return partido;
  });
};

// --------------------------------------------------------------
// 4. FILTRAR PARTIDOS DEL DÍA (solo los que están en fecha actual)
// --------------------------------------------------------------
const getTodayEST = (): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
};

// --------------------------------------------------------------
// 5. FUNCIONES AUXILIARES (apuestas, etc.)
// --------------------------------------------------------------
const mostrarBalones = (cantidad: number): string => {
  if (cantidad === 0) return "⚽️0";
  let resultado = "";
  for (let i = 0; i < Math.min(cantidad, 10); i++) resultado += "⚽️";
  if (cantidad > 10) resultado += ` +${cantidad - 10}`;
  return resultado;
};

const getTipoApuesta = (apuesta: any) => {
  const count = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length;
  if (count === 0) return { texto: "", icono: "", costo: 0 };
  if (count === 1) return { texto: "Simple", icono: "🔴", costo: 1 };
  if (count === 2) return { texto: "Doble", icono: "🟡", costo: 2 };
  return { texto: "Triple", icono: "🔴", costo: 3 };
};

// --------------------------------------------------------------
// 6. MODALES (sin cambios)
// --------------------------------------------------------------
const ModalReglas = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black text-amber-500">REGLAMENTO</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-slate-400" /></button>
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <p>• ⚽️ = 1 apuesta (Resultado o Marcador)</p>
          <p>• Máximo 10 ⚽️ por jugador</p>
          <p>• Cada acierto = +1 ⚽️</p>
          <p>• 5 🏵 = 1 🏆 (Apuesta Mundialista)</p>
        </div>
        <Button onClick={onClose} className="w-full mt-4 bg-amber-500 text-slate-950 font-black">Cerrar</Button>
      </div>
    </div>
  );
};

const ModalResumen = ({ open, onClose, total }: { open: boolean; onClose: () => void; total: number }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl max-w-md w-full border border-yellow-500/30 p-6">
        <h2 className="text-lg font-bold text-white text-center mb-4">Confirmar Apuestas</h2>
        <p className="text-3xl font-black text-yellow-500 text-center mb-4">{mostrarBalones(total)}</p>
        <Button onClick={onClose} className="w-full bg-green-600 text-white font-bold">Confirmar</Button>
      </div>
    </div>
  );
};

// --------------------------------------------------------------
// 7. COMPONENTE PRINCIPAL
// --------------------------------------------------------------
export default function QuinielaPage() {
  const router = useRouter();
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [apuestas, setApuestas] = useState<Record<string, any>>({});
  const [apuestaFinalista, setApuestaFinalista] = useState({ primero: "", segundo: "", aceptada: false });
  const [jugador, setJugador] = useState<any>(null);
  const [mostrarReglas, setMostrarReglas] = useState(false);
  const [mostrarModalResumen, setMostrarModalResumen] = useState(false);

  const hoy = getTodayEST();

  // Cargar partidos del día y actualizar estados cada 60 segundos
  useEffect(() => {
    const cargarPartidos = () => {
      let partidosHoy = partidosGrupos.filter(p => p.fechaReal === hoy);
      // Actualizar resultados simulados (o reales) para partidos que ya finalizaron
      partidosHoy = actualizarResultados(partidosHoy);
      setPartidos(partidosHoy);
    };

    cargarPartidos();
    const interval = setInterval(cargarPartidos, 60000);

    const jugadorGuardado = localStorage.getItem("jugador_actual");
    if (jugadorGuardado) {
      setJugador(JSON.parse(jugadorGuardado));
    } else {
      router.push("/registro");
    }

    const apis = localStorage.getItem("apuestas_quiniela");
    if (apis) setApuestas(JSON.parse(apis));
    const final = localStorage.getItem("apuesta_finalista");
    if (final) setApuestaFinalista(JSON.parse(final));

    return () => clearInterval(interval);
  }, [router, hoy]);

  useEffect(() => {
    localStorage.setItem("apuestas_quiniela", JSON.stringify(apuestas));
  }, [apuestas]);

  useEffect(() => {
    localStorage.setItem("apuesta_finalista", JSON.stringify(apuestaFinalista));
  }, [apuestaFinalista]);

  const estamparSello = (partidoId: string, tipo: "L" | "E" | "V") => {
    setApuestas(prev => {
      const actual = prev[partidoId] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false };
      if (actual.aceptada) return prev;
      const nueva = { ...actual, [tipo]: !actual[tipo] };
      const seleccionadas = [nueva.L, nueva.E, nueva.V].filter(Boolean).length;
      if (seleccionadas > 3) return prev;
      return { ...prev, [partidoId]: nueva };
    });
  };

  const handleGoles = (partidoId: string, campo: "golesLocal" | "golesVisita", valor: string) => {
    const limpio = valor.replace(/[^0-9]/g, "");
    setApuestas(prev => {
      const actual = prev[partidoId] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false };
      if (actual.aceptada) return prev;
      return { ...prev, [partidoId]: { ...actual, [campo]: limpio } };
    });
  };

  const aceptarApuesta = (partidoId: string) => {
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], aceptada: true } }));
  };

  const editarApuesta = (partidoId: string) => {
    setApuestas(prev => ({ ...prev, [partidoId]: { ...prev[partidoId], aceptada: false } }));
  };

  const totalApuestas = Object.values(apuestas).filter((a: any) => a.aceptada).length;

  // Agrupar partidos por fecha (todos son hoy, pero mantenemos estructura)
  const partidosPorFecha: Record<string, Partido[]> = {};
  partidos.forEach(p => {
    if (!partidosPorFecha[p.fechaReal]) partidosPorFecha[p.fechaReal] = [];
    partidosPorFecha[p.fechaReal].push(p);
  });
  const fechasOrdenadas = Object.keys(partidosPorFecha).sort();

  if (!jugador) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-yellow-500">Cargando...</div></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* HEADER */}
      <header className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <Link href="/" className="text-slate-400 hover:text-white"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex items-center gap-2 text-center">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Quiniela Mundialista 2026</h1>
        </div>
        <div className="w-5" />
      </header>

      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-2 px-4 border-b border-slate-700">
        <div className="max-w-4xl mx-auto flex flex-row items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white">¡Pronostica y Gana!</h2>
          <button onClick={() => setMostrarReglas(true)} className="text-red-500 hover:text-red-400 font-medium text-sm uppercase tracking-wide">Reglas</button>
        </div>
      </div>

      {/* Panel de recursos */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-2 px-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-6 text-center">
          <div><div className="text-xl">{mostrarBalones(jugador.balones)}</div><div className="text-[9px] text-slate-400">Balones</div></div>
          <div><div className="text-xl">{jugador.medallas > 0 ? "🏵️".repeat(Math.min(jugador.medallas, 3)) : "0"}</div><div className="text-[9px] text-slate-400">Medallas</div></div>
          <div><div className="text-xl">{jugador.copas > 0 ? "🏆".repeat(Math.min(jugador.copas, 2)) : "0"}</div><div className="text-[9px] text-slate-400">Copas</div></div>
        </div>
      </div>

      {/* LISTA DE PARTIDOS DEL DÍA */}
      <div className="p-2 md:p-3 pb-28">
        <div className="max-w-4xl mx-auto space-y-6">
          {fechasOrdenadas.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p>No hay partidos programados para hoy.</p>
              <p className="text-xs mt-2">Vuelve mañana para pronosticar los próximos encuentros.</p>
            </div>
          ) : (
            fechasOrdenadas.map(fecha => (
              <div key={fecha}>
                <div className="sticky top-14 z-40 bg-slate-950/90 backdrop-blur-sm py-2 px-3 rounded-lg mb-2 border-l-4 border-yellow-500">
                  <h3 className="text-sm font-bold text-yellow-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                </div>
                <div className="space-y-3">
                  {partidosPorFecha[fecha].map(partido => {
                    const apuesta = apuestas[partido.id] || { L: false, E: false, V: false, golesLocal: "", golesVisita: "", aceptada: false };
                    const tipo = getTipoApuesta(apuesta);
                    const estadoReal = getPartidoEstadoActual(partido);
                    const seleccionadas = [apuesta.L, apuesta.E, apuesta.V].filter(Boolean).length;
                    const bloqueada = estadoReal.bloqueado || apuesta.aceptada;

                    return (
                      <div key={partido.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-md">
                        {/* Cabecera */}
                        <div className="p-1.5 bg-slate-950/40 border-b border-slate-800">
                          <div className="text-center font-bold text-sky-400 text-[11px]">
                            {partido.banderaLocal} {partido.local} <span className="text-yellow-600 mx-1">VS</span> {partido.visitante} {partido.banderaVisitante}
                          </div>
                          <div className="text-center text-[9px] text-slate-500">Grupo {partido.grupo}</div>
                        </div>

                        {/* Info fija */}
                        <div className="px-2 pt-1">
                          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.55rem] text-slate-400">
                            <span><Clock className="h-2.5 w-2.5 inline" /> {partido.horaLocal} (Local)</span>
                            <span><Clock className="h-2.5 w-2.5 inline" /> {partido.horaEspana} (España)</span>
                            <span><MapPin className="h-2.5 w-2.5 inline" /> {partido.estadio}, {partido.ciudad}</span>
                          </div>
                        </div>

                        {/* Resultado si está finalizado o en vivo */}
                        {(estadoReal.estado === 'finished' || partido.resultadoLocal !== undefined) && (
                          <div className="text-center mt-1">
                            <span className="text-sm font-bold text-yellow-500">{partido.resultadoLocal ?? 0} - {partido.resultadoVisitante ?? 0}</span>
                          </div>
                        )}

                        {/* 2da Apuesta: Resultado */}
                        <div className="relative mt-1">
                          <div className="bg-slate-800/30 rounded-r-lg rounded-l-none overflow-hidden mx-2">
                            <div className="pt-1 px-2">
                              <span className="text-[0.55rem] font-semibold tracking-widest uppercase text-yellow-500 flex items-center justify-center gap-1">
                                <TrendingUp className="h-2.5 w-2.5" /> 2da. Apuesta: Resultado
                              </span>
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full opacity-70"></div>
                            <div className="pl-2">
                              <div className="p-2">
                                <div className="grid grid-cols-3 gap-2 text-center max-w-xs mx-auto">
                                  <div className="flex flex-col items-center">
                                    <span className="text-[0.45rem] font-semibold text-green-400 uppercase mb-0.5">LOCAL</span>
                                    <button onClick={() => estamparSello(partido.id, "L")} disabled={bloqueada} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 disabled:opacity-50 bg-slate-950">
                                      {apuesta.L ? "🌍" : "🌐"}
                                    </button>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[0.45rem] font-semibold text-yellow-400 uppercase mb-0.5">EMPATE</span>
                                    <button onClick={() => estamparSello(partido.id, "E")} disabled={bloqueada} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 disabled:opacity-50 bg-slate-950">
                                      {apuesta.E ? "🌍" : "🌐"}
                                    </button>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-[0.45rem] font-semibold text-blue-400 uppercase mb-0.5">VISITA</span>
                                    <button onClick={() => estamparSello(partido.id, "V")} disabled={bloqueada} className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 disabled:opacity-50 bg-slate-950">
                                      {apuesta.V ? "🌍" : "🌐"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="border-t border-slate-700/50 bg-slate-800/40 p-1.5">
                                <div className="flex justify-between items-center flex-wrap gap-1">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-0.5 text-slate-400 text-[0.5rem]"><div className={`w-1.5 h-1.5 rounded-full ${estadoReal.bloqueado ? 'bg-red-500' : 'bg-blue-500'}`}></div>{estadoReal.mensaje}</div>
                                    {seleccionadas > 0 && !apuesta.aceptada && !bloqueada && <div className="flex items-center gap-1 bg-slate-900/50 px-1.5 py-0.5 rounded-md mt-0.5"><span className="text-[0.6rem]">{tipo.icono}</span><span className="text-[10px] text-white">{tipo.texto}</span><span className="text-[10px] text-yellow-400">{tipo.costo} ⚽️</span></div>}
                                  </div>
                                  <div className="flex gap-1">
                                    <button onClick={() => aceptarApuesta(partido.id)} disabled={bloqueada || seleccionadas === 0} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"><CheckCircle className="h-2.5 w-2.5 inline mr-0.5" /> Aceptar</button>
                                    <button onClick={() => editarApuesta(partido.id)} disabled={!apuesta.aceptada || bloqueada} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><Edit className="h-2.5 w-2.5 inline mr-0.5" /> Editar</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3ra Apuesta: Marcador */}
                        <div className="bg-slate-950/50 rounded-md border border-slate-800 mx-2 mt-1 mb-2">
                          <div className="border-b border-slate-800/80 p-1 text-center">
                            <span className="text-[0.55rem] font-semibold tracking-widest uppercase text-yellow-500">🎯 3ra. Apuesta: Marcador (1 ⚽️)</span>
                          </div>
                          <div className="p-2">
                            <div className="flex justify-center gap-2 max-w-xs mx-auto">
                              <div className="text-center"><label className="text-[0.45rem] font-semibold text-green-400 block">{partido.local.split(' ')[0]}</label><Input type="text" maxLength={2} placeholder="0" value={apuesta.golesLocal} onChange={(e) => handleGoles(partido.id, "golesLocal", e.target.value)} disabled={bloqueada} className="w-10 h-7 text-center bg-slate-950 border-slate-800 text-white text-xs disabled:opacity-50" /></div>
                              <div className="text-slate-600 font-bold text-[0.65rem]">X</div>
                              <div className="text-center"><label className="text-[0.45rem] font-semibold text-blue-400 block">{partido.visitante.split(' ')[0]}</label><Input type="text" maxLength={2} placeholder="0" value={apuesta.golesVisita} onChange={(e) => handleGoles(partido.id, "golesVisita", e.target.value)} disabled={bloqueada} className="w-10 h-7 text-center bg-slate-950 border-slate-800 text-white text-xs disabled:opacity-50" /></div>
                            </div>
                          </div>
                          <div className="border-t border-slate-700/50 bg-slate-800/40 p-1.5">
                            <div className="flex justify-between items-center gap-1 flex-wrap">
                              <div className="flex-1"><div className="flex items-center gap-0.5 text-slate-400 text-[0.5rem]"><div className={`w-1.5 h-1.5 rounded-full ${estadoReal.bloqueado ? 'bg-red-500' : 'bg-blue-500'}`}></div>{estadoReal.mensaje}</div></div>
                              <div className="flex gap-1">
                                <button onClick={() => aceptarApuesta(partido.id)} disabled={bloqueada || (apuesta.golesLocal === "" && apuesta.golesVisita === "")} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"><CheckCircle className="h-2.5 w-2.5 inline mr-0.5" /> Aceptar</button>
                                <button onClick={() => editarApuesta(partido.id)} disabled={!apuesta.aceptada || bloqueada} className="h-6 px-2 text-[0.55rem] font-bold rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"><Edit className="h-2.5 w-2.5 inline mr-0.5" /> Editar</button>
                              </div>
                            </div>
                            {apuesta.aceptada && (apuesta.golesLocal !== "" || apuesta.golesVisita !== "") && <div className="text-center text-emerald-400 text-[0.45rem] mt-0.5">✓ Marcador registrado: {apuesta.golesLocal || "0"} - {apuesta.golesVisita || "0"}</div>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botón flotante de resumen */}
      {totalApuestas > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button onClick={() => setMostrarModalResumen(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold gap-2 px-4 py-2 text-sm shadow-2xl rounded-full">
            <CheckCircle className="h-4 w-4" /> Validar Apuestas ({mostrarBalones(totalApuestas)})
          </Button>
        </div>
      )}

      <ModalResumen open={mostrarModalResumen} onClose={() => setMostrarModalResumen(false)} total={totalApuestas} />
      <ModalReglas open={mostrarReglas} onClose={() => setMostrarReglas(false)} />

      <footer className="py-4 text-center text-slate-500 text-[10px] border-t border-slate-800">
        <p>© 2026 Quiniela Mundialista — Sistema de Balones ⚽️ | Medallas 🏵 | Copa 🏆</p>
      </footer>
    </div>
  );
}