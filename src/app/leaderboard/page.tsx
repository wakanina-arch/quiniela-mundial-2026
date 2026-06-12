import { Trophy, Award, Users, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Simulación de datos ordenados desde la Base de Datos
const USERS_RANKING = [
  { id: "1", name: "Carlos Mendoza", email: "carlos@mail.com", points: 42 },
  { id: "2", name: "Ana Martínez", email: "ana@mail.com", points: 39 },
  { id: "3", name: "Diego López", email: "diego@mail.com", points: 35 },
  { id: "4", name: "Sofía Rodríguez", email: "sofia@mail.com", points: 31 },
  { id: "5", name: "Juan Castro", email: "juan@mail.com", points: 28 }
]

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
          <Trophy className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tabla de Clasificación</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Ranking en tiempo real de todos los participantes de la quiniela.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-400" /> Competidores Activos
          </CardTitle>
          <CardDescription>Los puntos se actualizan inmediatamente tras el silbatazo final.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100/70 dark:bg-slate-900/70">
              <TableRow>
                <TableHead className="w-[100px] text-center font-bold">Posición</TableHead>
                <TableHead className="font-bold">Participante</TableHead>
                <TableHead className="text-right font-bold pr-8">Puntos Totales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS_RANKING.map((usuario, index) => {
                const posicion = index + 1
                const esPodio = posicion <= 3

                return (
                  <TableRow key={usuario.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="text-center font-bold">
                      {posicion === 1 ? (
                        <span className="inline-flex items-center justify-center bg-amber-500 text-white rounded-full w-7 h-7 text-xs shadow-sm shadow-amber-500/30">1</span>
                      ) : posicion === 2 ? (
                        <span className="inline-flex items-center justify-center bg-slate-400 text-white rounded-full w-7 h-7 text-xs shadow-sm shadow-slate-400/30">2</span>
                      ) : posicion === 3 ? (
                        <span className="inline-flex items-center justify-center bg-amber-700 text-white rounded-full w-7 h-7 text-xs shadow-sm shadow-amber-700/30">3</span>
                      ) : (
                        <span className="text-slate-400 text-sm font-medium">{posicion}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">{usuario.name}</span>
                        <span className="text-xs text-slate-400 font-normal">{usuario.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-lg font-black text-amber-600 dark:text-amber-500 pr-8">
                      {usuario.points} <span className="text-xs font-bold text-slate-400 ml-0.5">pts</span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
