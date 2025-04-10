import { useEffect, useState } from "react"
import { Calendar, Map, Truck, Users, Leaf } from "lucide-react"
import { ContratistaService } from "../../api/services/contratistas.service"
import { OperadorService } from "../../api/services/operadores.service"
import { EquipoService } from "../../api/services/equipo.service"
import { TurnosService } from "../../api/services/turnos.service"
import { EspeciesService } from "../../api/services/especies.service"
import { ZonasService, FincasService } from "../../api/services/ubicaciones.service"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import ReactApexChart from "react-apexcharts"

interface Stats {
  contratistas: number
  operadores: number
  equipos: number
  turnos: number
  especies: number
  zonas: number
  fincas: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    contratistas: 0,
    operadores: 0,
    equipos: 0,
    turnos: 0,
    especies: 0,
    zonas: 0,
    fincas: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [contratistas, operadores, equipos, turnos, especies, zonas, fincas] = await Promise.all([
        ContratistaService.getAll(),
        OperadorService.getAll(),
        EquipoService.getAll(),
        TurnosService.getAll(),
        EspeciesService.getAll(),
        ZonasService.getAll(),
        FincasService.getAll(),
      ])

      setStats({
        contratistas: contratistas.length,
        operadores: operadores.length,
        equipos: equipos.length,
        turnos: turnos.length,
        especies: especies.length,
        zonas: zonas.length,
        fincas: fincas.length,
      })

      setLoading(false)
    }

    fetchStats()
  }, [])

  const donutChartOptions = {
    chart: { type: 'donut', background: 'transparent', toolbar: { show: false } },
    labels: ['Contratistas', 'Operadores', 'Equipos', 'Turnos', 'Especies', 'Zonas', 'Fincas'],
    legend: { position: 'bottom', labels: { colors: '#94a3b8' } },
    theme: { mode: 'dark' },
    colors: ['#22d3ee', '#7c3aed', '#0ea5e9', '#e11d48', '#14b8a6', '#facc15', '#38bdf8']
  }

  const donutChartSeries = [
    stats.contratistas,
    stats.operadores,
    stats.equipos,
    stats.turnos,
    stats.especies,
    stats.zonas,
    stats.fincas,
  ]

  const barChartOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Contratistas', 'Operadores', 'Equipos', 'Turnos', 'Especies', 'Zonas', 'Fincas'], labels: { style: { colors: '#94a3b8' } } },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    theme: { mode: 'dark' },
    colors: ['#0ea5e9']
  }

  const barChartSeries = [{ name: 'Cantidad', data: donutChartSeries }]

  const cards = [
    { title: "Contratistas", value: stats.contratistas, icon: <Users /> },
    { title: "Operadores", value: stats.operadores, icon: <Users /> },
    { title: "Equipos", value: stats.equipos, icon: <Truck /> },
    { title: "Turnos", value: stats.turnos, icon: <Calendar /> },
    { title: "Especies", value: stats.especies, icon: <Leaf /> },
    { title: "Zonas", value: stats.zonas, icon: <Map /> },
    { title: "Fincas", value: stats.fincas, icon: <Map /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center animate-fadeIn">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-tight drop-shadow-md">PANEL DE CONTROL</h1>
          <p className="text-gray-400 mt-2 text-sm">Resumen general de operaciones del sistema</p>
        </div>

        {loading ? (
          <div className="text-center text-cyan-300 animate-pulse text-lg">Cargando estadísticas...</div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card, i) => (
                <Card
                  key={i}
                  className="relative overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-zinc-900/60 to-black/60 shadow-xl backdrop-blur-xl hover:scale-105 transition-transform"
                >
                  <div className="absolute -top-1 -right-1 h-20 w-20 bg-cyan-500/10 rounded-full blur-2xl" />
                  <CardHeader className="flex justify-between items-center z-10">
                    <div>
                      <CardDescription className="uppercase text-xs text-cyan-300 tracking-wide">{card.title}</CardDescription>
                      <CardTitle className="text-3xl text-white font-bold mt-1">{card.value}</CardTitle>
                    </div>
                    <div className="text-cyan-400 scale-110">{card.icon}</div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="relative overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-zinc-900/60 to-black/60 shadow-xl backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-2xl" />
                <CardHeader className="z-10 relative">
                  <CardTitle className="text-xl text-cyan-300 font-bold tracking-wide">Distribución General</CardTitle>
                </CardHeader>
                <CardContent className="z-10 relative">
                  <ReactApexChart options={donutChartOptions} series={donutChartSeries} type="donut" height={360} />
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border border-purple-500/20 bg-gradient-to-br from-zinc-900/60 to-black/60 shadow-xl backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 blur-2xl" />
                <CardHeader className="z-10 relative">
                  <CardTitle className="text-xl text-purple-300 font-bold tracking-wide">Comparación de Recursos</CardTitle>
                </CardHeader>
                <CardContent className="z-10 relative">
                  <ReactApexChart options={barChartOptions} series={barChartSeries} type="bar" height={360} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}