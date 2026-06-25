import GlassCard from '../components/GlassCard.jsx';

function AboutPage() {
  return (
    <section className="page about-page">
      <div className="about-container">

        {/* Hero */}
        <div className="about-hero">
          <h1>
            <span className="about-accent">Sudarshan</span> AI
          </h1>
          <p>Clarity. Protection. Control.</p>
        </div>

        {/* Feature grid */}
        <div className="about-grid">

          <GlassCard>
            <div className="about-section">
              <h3>What It Is</h3>
              <p className="highlight">
                An AI built to handle real-world cyber threats.
              </p>
              <p>
                Sudarshan AI is a cybersecurity assistant designed to detect,
                prevent, and guide users through issues like scams, fraud,
                identity theft, and online harassment.
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="about-section">
              <h3>Why It Matters</h3>
              <p className="highlight">
                Cyber risks are increasing faster than awareness.
              </p>
              <p>
                As digital systems become part of everyday life, users are
                exposed to threats that are often complex and difficult to
                understand without expert guidance.
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="about-section">
              <h3>Built for India</h3>
              <p className="highlight">
                Focused on India's cyber laws and ecosystem.
              </p>
              <p>
                Unlike generic tools, Sudarshan AI integrates Indian IT laws
                and real-world cybercrime patterns to provide relevant,
                actionable solutions.
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="about-section">
              <h3>Core Philosophy</h3>
              <p className="highlight">
                Simplify complexity and enable confident decisions.
              </p>
              <p>
                The system translates technical and legal information into
                clear steps so users can act quickly and effectively.
              </p>
            </div>
          </GlassCard>

        </div>

        {/* Vision statement */}
        <div className="about-vision">
          <p>
            Sudarshan AI stands for a safer digital space where users are
            informed, protected, and empowered to act without fear.
          </p>
          <p>
            Built with a focus on accessibility and real-world impact, it aims
            to support a more secure and confident digital India.
          </p>
        </div>

      </div>
    </section>
  );
}

export default AboutPage;