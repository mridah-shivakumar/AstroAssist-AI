import Header from '../components/Header'
import Card from '../components/Card'

const Icon = ({ d }: { d: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const ComingSoonBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-space-purple-900/50 text-space-purple-400 border border-space-purple-700/40">
    <Icon d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    Coming Soon
  </span>
)

const insights = [
  {
    title: 'Latest Mission Summary',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-2 10H8m4-3H8m8 6H8',
    description:
      'An AI-generated narrative overview of the most recent mission milestones, covering Perseverance sample collection, Europa Clipper trajectory corrections, and Artemis III preparation status.',
  },
  {
    title: 'Asteroid Risk Briefing',
    icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    description:
      'A synthesised risk assessment of currently tracked near-Earth objects, highlighting the three closest approaches this week, their estimated diameters, and probability of Earth interaction.',
  },
  {
    title: 'Mars Conditions Report',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 0v10M12 12l4.5-4.5',
    description:
      'Daily summary of Martian atmospheric and surface conditions derived from MEDA sensor data, including dust storm probability, UV index, and projected traverse conditions for the rover.',
  },
  {
    title: 'Upcoming Events',
    icon: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    description:
      'An AI-curated calendar of significant upcoming space events — including asteroid close approaches, planned rocket launches, orbital insertions, and planetary conjunctions — for the next 30 days.',
  },
]

export default function MissionInsights() {
  return (
    <div>
      <Header
        title="Mission Insights"
        subtitle="AI-generated explanations and summaries of space mission data"
      />

      <div className="mb-6 rounded-xl border border-space-purple-700/40 bg-space-purple-900/20 px-5 py-4 flex items-start gap-3">
        <span className="text-space-purple-400 mt-0.5 flex-shrink-0">
          <Icon d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </span>
        <div>
          <p className="text-sm font-semibold text-space-purple-300">AI Integration Roadmap</p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            These summaries will be powered by IBM watsonx.ai. Each section below represents a planned AI-generated insight module that will fetch live data, synthesise it, and present a human-readable briefing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            icon={<Icon d={item.icon} />}
          >
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.description}</p>
            <ComingSoonBadge />
          </Card>
        ))}
      </div>
    </div>
  )
}
