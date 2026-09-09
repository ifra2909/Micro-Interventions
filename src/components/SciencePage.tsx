import { useNavigate } from "react-router-dom";
import { INTERVENTIONS, MECHANISMS, type MechanismId } from "../data";
import { Reveal } from "./chrome";

export function SciencePage() {
  const navigate = useNavigate();

  const interventionsByMechanism = INTERVENTIONS.reduce((acc, intervention) => {
    const mech = intervention.mechanism;
    if (!acc[mech]) acc[mech] = [];
    acc[mech].push(intervention);
    return acc;
  }, {} as Record<MechanismId, typeof INTERVENTIONS>);

  const mechanismOrder: MechanismId[] = ["safety", "clarity", "affect", "agency", "self", "connection", "meaning"];

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
      <Reveal>
        <button
          onClick={() => navigate("/")}
          className="btn-ghost px-5 py-2 text-sm mb-12 inline-flex items-center gap-2"
        >
          ← back to home
        </button>
      </Reveal>

      <Reveal delay={100}>
        <div className="mb-16">
          <p className="mono-label text-terracotta mb-3">the research</p>
          <h1 className="font-display text-espresso leading-[1.1] text-4xl sm:text-5xl lg:text-6xl mb-6">
            14 interventions.<br />
            <em className="italic text-taupe">backed by science.</em>
          </h1>
          <p className="text-taupe text-lg leading-relaxed max-w-2xl">
            Every micro-intervention in Microshift is adapted from peer-reviewed positive psychology research. 
            These aren't invented exercises — they're digital adaptations of empirically tested techniques that 
            have been shown to reduce stress, improve mood, and build resilience.
          </p>
        </div>
      </Reveal>

      {mechanismOrder.map((mechId, mechIndex) => {
        const mechanism = MECHANISMS[mechId];
        const interventions = interventionsByMechanism[mechId] || [];

        return (
          <Reveal key={mechId} delay={mechIndex * 80}>
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: mechanism.color, boxShadow: `0 0 12px ${mechanism.color}44` }}
                />
                <h2 className="font-display text-espresso text-2xl sm:text-3xl">
                  {mechanism.label}
                </h2>
                <span className="mono-label text-taupe">· {mechanism.need}</span>
              </div>

              <div className="grid gap-6">
                {interventions.map((intervention, intIndex) => (
                  <div
                    key={intervention.id}
                    className="panel p-7"
                    style={{ borderColor: `${mechanism.color}33` }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex-1">
                        <h3 className="font-display text-espresso text-xl sm:text-2xl mb-2">
                          {intervention.title}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="mono-label text-taupe">
                            ~{intervention.minutes} min
                          </span>
                          {intervention.preferWhen && (
                            <span className="font-mono text-[11px] text-taupe">
                              prefer when: {intervention.preferWhen}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="mono-label mb-2" style={{ color: mechanism.color }}>
                          why this works
                        </p>
                        <p className="text-taupe text-sm leading-relaxed">
                          {intervention.why}
                        </p>
                      </div>

                      <div>
                        <p className="mono-label mb-3" style={{ color: mechanism.color }}>
                          the steps
                        </p>
                        <ol className="space-y-2">
                          {intervention.steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-taupe">
                              <span
                                className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px]"
                                style={{ borderColor: `${mechanism.color}55`, color: mechanism.color }}
                              >
                                {i + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="border-t border-border pt-5">
                        <p className="mono-label mb-2 text-taupe">evidence</p>
                        <p className="font-mono text-[11px] text-sage leading-relaxed">
                          {intervention.evidence}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        );
      })}

      <Reveal>
        <div className="panel p-8 mt-20">
          <p className="mono-label text-terracotta mb-3">the full picture</p>
          <h2 className="font-display text-espresso text-2xl sm:text-3xl mb-4">
            standing on the shoulders of
          </h2>
          <p className="text-taupe text-sm leading-relaxed mb-6">
            These interventions draw from decades of research in positive psychology, cognitive behavioral therapy, 
            mindfulness-based stress reduction, and self-compassion training. The evidence base includes randomized 
            controlled trials, meta-analyses, and longitudinal studies published in peer-reviewed journals.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono text-sage leading-relaxed">
            <div>
              <p className="text-taupe mb-2">key researchers & frameworks:</p>
              <ul className="space-y-1">
                <li>• Seligman, Steen, Park & Peterson (2005)</li>
                <li>• Lieberman et al. (2007) — affect labeling</li>
                <li>• King (2001) — best possible self</li>
                <li>• Neff & Germer (2013) — self-compassion</li>
                <li>• Balban et al. (2023) — physiological sigh</li>
                <li>• Bryant & Veroff (2007) — savoring</li>
                <li>• Fredrickson et al. (2008) — loving-kindness</li>
                <li>• Kabat-Zinn (2009) — mindfulness-based stress reduction</li>
              </ul>
            </div>
            <div>
              <p className="text-taupe mb-2">methodologies:</p>
              <ul className="space-y-1">
                <li>• Randomized controlled trials</li>
                <li>• Meta-analyses & systematic reviews</li>
                <li>• Longitudinal studies</li>
                <li>• Positive psychology interventions (PPIs)</li>
                <li>• Cognitive behavioral therapy (CBT)</li>
                <li>• Mindfulness-based interventions</li>
                <li>• Self-compassion training</li>
                <li>• Values-based action (ACT)</li>
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="text-center mt-20">
          <button
            onClick={() => navigate("/")}
            className="btn-main px-8 py-3 text-base"
          >
            ← back to Microshift
          </button>
        </div>
      </Reveal>
    </main>
  );
}
