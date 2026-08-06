import Header from '../components/Header'
import Card from '../components/Card'

const Icon = ({ d }: { d: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export default function MarsExplorer() {
  return (
    <div>
      <Header
        title="Mars Explorer"
        subtitle="Surface data, rover telemetry, and atmospheric conditions"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card title="Rover Status" icon={<Icon d="M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM13 6h5l3 5v4h-8V6zM3 6h5l3 5v4H3V6z" />}>
          <span className="block text-xl font-bold text-green-400 mb-1">Online</span>
          <span className="text-xs text-slate-500">Perseverance · Sol 1,234 · Jezero Crater</span>
        </Card>

        <Card title="Surface Temperature" icon={<Icon d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />}>
          <span className="block text-xl font-bold text-orange-400 mb-1">−23°C</span>
          <span className="text-xs text-slate-500">High · Low: −83°C · Diurnal range 60°C</span>
        </Card>

        <Card title="Sol Counter" icon={<Icon d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />}>
          <span className="block text-xl font-bold text-amber-400 mb-1">Sol 1,234</span>
          <span className="text-xs text-slate-500">Earth date: 2025-08-01 · Mission day 1,234</span>
        </Card>

        <Card title="Atmospheric Data" icon={<Icon d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />}>
          <span className="block text-xl font-bold text-space-blue-400 mb-1">7.1 hPa</span>
          <span className="text-xs text-slate-500">Surface pressure · CO₂ 95.3% · Dust low</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Instrument Readings" icon={<Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />}>
          <ul className="space-y-3">
            {[
              { name: 'MEDA Weather Station', value: 'Nominal', color: 'text-green-400' },
              { name: 'SuperCam Rock Analysis', value: 'Active', color: 'text-space-blue-400' },
              { name: 'PIXL X-Ray Spectrometer', value: 'Standby', color: 'text-slate-400' },
              { name: 'RIMFAX Ground Penetrating Radar', value: 'Active', color: 'text-space-blue-400' },
              { name: 'Ingenuity Helicopter', value: 'Grounded', color: 'text-amber-400' },
            ].map((inst) => (
              <li key={inst.name} className="flex items-center justify-between">
                <span className="text-slate-300 text-xs">{inst.name}</span>
                <span className={`text-xs font-medium ${inst.color}`}>{inst.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Sample Collection Progress" icon={<Icon d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />}>
          <div className="space-y-4">
            {[
              { label: 'Core Samples Collected', current: 23, target: 38, color: 'bg-space-blue-600' },
              { label: 'Spectroscopy Targets', current: 187, target: 200, color: 'bg-space-purple-600' },
              { label: 'Panoramic Images', current: 4120, target: 5000, color: 'bg-amber-600' },
            ].map((item) => {
              const pct = Math.round((item.current / item.target) * 100)
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-300">{item.current} / {item.target}</span>
                  </div>
                  <div className="h-1.5 bg-space-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
