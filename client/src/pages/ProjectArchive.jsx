import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBg from '../components/ParticlesBg';

const fallbackProjects = [
  {
    title: "CraftCurio",
    description: "A full-stack ecommerce marketplace for unique, handcrafted art and collectibles. Features a custom product catalog, shopping cart state management, and user transactions.",
    techStack: ["React", "Node.js", "Express.js", "MongoDB"],
    githubUrl: "https://github.com/virendra-kumar/craft-curio",
    demoUrl: "https://craft-curio.demo",
    featured: true,
    isMLProject: false
  },
  {
    title: "QuickHire",
    description: "A dynamic hiring portal facilitating communication between recruiters and developers. Built to streamline job applications and resume uploads.",
    techStack: ["React", "Express.js", "Multer", "JWT", "MongoDB"],
    githubUrl: "https://github.com/virendra-kumar/quick-hire",
    demoUrl: "https://quick-hire.demo",
    featured: false,
    isMLProject: false
  },
  {
    title: "House Price Prediction Engine",
    description: "A machine learning regression model designed to predict real estate valuation based on local socio-economic indicators.",
    techStack: ["Python", "scikit-learn", "Flask", "Pandas"],
    githubUrl: "https://github.com/virendra-kumar/house-price-prediction",
    demoUrl: "",
    featured: false,
    isMLProject: true
  }
];

const ProjectArchive = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const spotlightRef = useRef(null);

  const handleMouseMove = (e) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty('--x', `${e.clientX}px`);
      spotlightRef.current.style.setProperty('--y', `${e.clientY}px`);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (res.ok && data.success) {
          setProjects(data.data);
        } else {
          setProjects(fallbackProjects);
        }
      } catch {
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <ParticlesBg />
      <div ref={spotlightRef} className="spotlight-bg" />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 2 }}>
        
        {/* Back Link */}
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-accent-violet)', 
            cursor: 'pointer', 
            fontSize: '0.95rem', 
            fontWeight: 500, 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '32px',
            padding: 0,
            transition: 'transform 0.2s ease'
          }}
          className="social-icon"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Virendra Kumar
        </button>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '48px' }} className="gradient-text">All Projects</h1>

        {loading ? (
          <div style={{ color: '#a78bfa', fontFamily: 'Outfit, sans-serif' }}>Loading archive...</div>
        ) : (
          <div className="glass-card" style={{ padding: '0', overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '20px 24px', color: '#ededf0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                  <th style={{ padding: '20px 24px', color: '#ededf0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', width: '35%' }}>Description</th>
                  <th style={{ padding: '20px 24px', color: '#ededf0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Built with</th>
                  <th style={{ padding: '20px 24px', color: '#ededf0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Links</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj, idx) => (
                  <tr key={proj._id || proj.title} style={{ borderBottom: idx === projects.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)', transition: 'background-color 0.2s ease' }} className="archive-tr">
                    <td style={{ padding: '20px 24px', fontWeight: 600, color: '#ededf0', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '1.05rem' }}>{proj.title}</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {proj.featured && (
                            <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(167, 139, 250, 0.2)', color: '#c4b5fd', borderRadius: '4px', border: '1px solid rgba(167, 139, 250, 0.3)' }}>Featured</span>
                          )}
                          {proj.isMLProject && (
                            <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(255, 255, 255, 0.05)', color: '#a1a1b5', borderRadius: '4px', border: '1px dashed rgba(255, 255, 255, 0.2)' }}>ML / AI</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', color: '#a1a1b5', fontSize: '0.9rem', lineHeight: '1.5', verticalAlign: 'top' }}>
                      {proj.description}
                    </td>
                    <td style={{ padding: '20px 24px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(proj.techStack || []).map((tech, tidx) => (
                          <span 
                            key={tidx} 
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '4px 8px', 
                              background: proj.isMLProject ? 'rgba(255,255,255,0.03)' : 'rgba(167, 139, 250, 0.08)', 
                              color: proj.isMLProject ? '#a1a1b5' : '#c4b5fd', 
                              borderRadius: '4px',
                              border: proj.isMLProject ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px solid rgba(167, 139, 250, 0.1)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', verticalAlign: 'top', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '16px', alignItems: 'center' }}>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" title="GitHub" style={{ color: 'var(--text-muted)' }} className="social-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a href={proj.demoUrl} target="_blank" rel="noreferrer" title="Demo Link" style={{ color: 'var(--text-muted)' }} className="social-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </>
  );
};

export default ProjectArchive;
