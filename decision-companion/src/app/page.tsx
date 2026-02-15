import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-4xl text-center space-y-12 relative z-10">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/10 backdrop-blur-md rounded-full text-sm font-medium text-blue-200 mb-4 shadow-xl">
            ✨ Analysis Paralysis? Solved.
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 pb-2">
            Decision<span className="text-blue-400">Companion</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Make smarter, data-driven choices with our AI-assisted weighted decision matrix.
            Compare options, analyze trade-offs, and get clear explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left animate-fade-in px-4">
          <FeatureCard
            icon="⚖️"
            title="Define Criteria"
            description="Set what matters most to you (e.g., Price, Speed) and assign weights."
          />
          <FeatureCard
            icon="⭐"
            title="Rate Options"
            description="Score each option against your criteria. See the math work for you."
          />
          <FeatureCard
            icon="💡"
            title="Get Clarity"
            description="Receive a ranked list and a detailed 'Why' explanation for the winner."
          />
        </div>

        <div className="pt-8 animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/decision/new">
            <Button className="px-8 py-4 text-lg h-auto shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.6)] hover:-translate-y-1 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-none">
              Start a New Decision &rarr;
            </Button>
          </Link>
          <Link href="/decision/new?demo=startup">
            <Button variant="secondary" className="px-8 py-4 text-lg h-auto bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-sm">
              Try a Demo Case
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
