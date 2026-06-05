import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBg from '../components/ParticlesBg';

const safeFetchJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

// Embedded fallback/seed data in case API is offline
const fallbackData = {
  profile: {
    name: "Virendra Kumar",
    title: "Full Stack Developer",
    tagline: "I build scalable APIs, real-time systems, and responsive web apps with the MERN stack.",
    about: "I am a dedicated MERN Stack Developer with hands-on experience building full-stack web applications. I specialize in crafting robust backend RESTful APIs, implementing stateless authentication models, and building fluid, responsive React user interfaces.",
    statusBadge: { text: "Open to Work", visible: true }
  },
  social: {
    github: "https://github.com/virendra-kumar",
    linkedin: "https://linkedin.com/in/virendra-kumar",
    leetcode: "https://leetcode.com/virendra-kumar",
    email: "virendra.kumar@email.com"
  },
  skills: [
    { category: "Languages", skills: ["JavaScript (ES6+)", "Python", "HTML5", "CSS3", "C++"], isAdditional: false },
    { category: "Backend Development", skills: ["Node.js", "Express.js", "Flask", "FastAPI", "REST API", "API Integration", "Backend Development", "Authentication", "OpenAI API"], isAdditional: false },
    { category: "Frontend Development", skills: ["React", "Redux Toolkit", "React Router", "Vanilla CSS", "Web Development", "Responsive Design"], isAdditional: false },
    { category: "Databases & Tools", skills: ["MongoDB", "MySQL", "Database Design", "Git", "Postman", "NPM"], isAdditional: false },
    { category: "Additional: Machine Learning & AI", skills: ["Machine Learning", "Artificial Intelligence", "Automation", "Supervised Learning", "Unsupervised Learning", "Regression Models", "Data Preprocessing", "scikit-learn", "Pandas", "NumPy"], isAdditional: true }
  ],
  experience: [
    {
      title: "MERN Full Stack Developer Intern",
      company: "Skill Risers Infotech Pvt. Ltd.",
      companyUrl: "https://skillrisers.com",
      duration: "3 Months · In-House",
      description: [
        "Designed and implemented REST API endpoints processing thousands of queries with minimal latency.",
        "Built a modular URL shortener service handling routing patterns and redirection triggers.",
        "Acquired full-stack MERN expertise working in a collaborative environment."
      ],
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB"]
    }
  ],
  projects: [
    {
      title: "CraftCurio",
      description: "A full-stack ecommerce marketplace for unique, handcrafted art and collectibles. Features a custom product catalog, shopping cart state management, and user transactions.",
      highlights: [
        "Architected database design for products, users, and orders.",
        "Implemented RESTful endpoints to execute catalog searches and sorting filters."
      ],
      techStack: ["React", "Node.js", "Express.js", "MongoDB"],
      githubUrl: "https://github.com/virendra-kumar/craft-curio",
      demoUrl: "https://craft-curio.demo",
      featured: true,
      isMLProject: false
    },
    {
      title: "QuickHire",
      description: "A dynamic hiring portal facilitating communication between recruiters and developers. Built to streamline job applications and resume uploads.",
      highlights: [
        "Implemented JWT-based authentication guards to protect private portal views.",
        "Integrated dynamic resume uploading parsed and stored cleanly in file systems."
      ],
      techStack: ["React", "Express.js", "Multer", "JWT", "MongoDB"],
      githubUrl: "https://github.com/virendra-kumar/quick-hire",
      demoUrl: "https://quick-hire.demo",
      featured: false,
      isMLProject: false
    },
    {
      title: "House Price Prediction Engine",
      description: "A machine learning regression model designed to predict real estate valuation based on local socio-economic indicators.",
      highlights: [
        "Preprocessed housing datasets, resolving missing values and scaling numerical attributes.",
        "Trained supervised regression models, optimizing MSE parameters."
      ],
      techStack: ["Python", "scikit-learn", "Flask", "Pandas"],
      githubUrl: "https://github.com/virendra-kumar/house-price-prediction",
      demoUrl: "",
      featured: false,
      isMLProject: true
    }
  ],
  education: [
    { period: "2022 — 2026", degree: "B.Tech in Computer Science & Engineering (AI & ML)", institution: "IMS Engineering College Ghaziabad (AKTU)", location: "India", score: "71%" },
    { period: "2020 — 2021", degree: "Intermediate Education (Class XII)", institution: "Savitri Vidya Vihar Inter College Ramjipuram Basti UP", location: "India", score: "82%" },
    { period: "2018 — 2019", degree: "High School (Class X)", institution: "Savitri Vidya Vihar Inter College Ramjipuram Basti UP", location: "India", score: "79%" }
  ],
  certifications: [
    { name: "Python Bootcamp & Programming Course", provider: "Udemy", url: "https://udemy.com" }
  ]
};

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [scrollPercent, setScrollPercent] = useState(0);
  const navigate = useNavigate();
  
  const spotlightRef = useRef(null);

  // Mouse Movement tracker for spotlight glow effect
  const handleMouseMove = (e) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty('--x', `${e.clientX}px`);
      spotlightRef.current.style.setProperty('--y', `${e.clientY}px`);
    }
  };

  // Scroll percent tracker for top progress bar
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const percentage = (window.scrollY / totalHeight) * 100;
      setScrollPercent(percentage);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch portfolio data from endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes, expRes, eduRes, certRes, socialRes] = await Promise.all([
          safeFetchJson('/api/profile'),
          safeFetchJson('/api/projects'),
          safeFetchJson('/api/skills'),
          safeFetchJson('/api/experience'),
          safeFetchJson('/api/education'),
          safeFetchJson('/api/certifications'),
          safeFetchJson('/api/social')
        ]);

        setData({
          profile: (profileRes && profileRes.success) ? profileRes.data : fallbackData.profile,
          projects: (projectsRes && projectsRes.success) ? projectsRes.data : fallbackData.projects,
          skills: (skillsRes && skillsRes.success) ? skillsRes.data : fallbackData.skills,
          experience: (expRes && expRes.success) ? expRes.data : fallbackData.experience,
          education: (eduRes && eduRes.success) ? eduRes.data : fallbackData.education,
          certifications: (certRes && certRes.success) ? certRes.data : fallbackData.certifications,
          social: (socialRes && socialRes.success) ? socialRes.data : fallbackData.social
        });
      } catch (err) {
        console.warn('API connection failed, using fallback seed data.', err);
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Intersection Observer to track active scrolling sections
  useEffect(() => {
    if (loading) return;

    const sections = ['about', 'experience', 'projects', 'skills', 'education', 'contact'];
    const observers = sections.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach(obs => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [loading]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0a0a1a', color: '#a78bfa' }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.1em' }}>Loading Portfolio...</div>
      </div>
    );
  }

  const { profile, projects = [], skills = [], experience = [], education = [], certifications = [], social = {} } = data;

  const standardProjects = (projects || [])
    .filter(p => !p.isMLProject)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    })
    .slice(0, 3);

  const mlProjects = (projects || [])
    .filter(p => p.isMLProject)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    })
    .slice(0, 2);


  return (
    <>
      {/* Scroll Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: '4px', background: 'var(--gradient-primary)', width: `${scrollPercent}%`, zIndex: 1000, transition: 'width 0.1s ease-out' }} />

      {/* Particles Drift Background */}
      <ParticlesBg />

      {/* Background Spotlight */}
      <div ref={spotlightRef} className="spotlight-bg" />

      {/* Main Container Layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>

        <div className="portfolio-layout">
          
          {/* Left Fixed Column */}
          <header className="portfolio-header">
            <div>
              {profile.statusBadge?.visible && (
                <div className="glass-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '24px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></span>
                  {profile.statusBadge.text}
                </div>
              )}
              <h1 className="gradient-text">{profile.name}</h1>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#ededf0', marginBottom: '16px' }}>{profile.title}</h2>
              <p style={{ maxWidth: '320px', color: '#a1a1b5', fontSize: '0.95rem' }}>{profile.tagline}</p>
              
              {/* Navigation Menu */}
              <nav className="nav-dot-container" style={{ marginTop: '64px' }}>
                {['about', 'experience', 'projects', 'skills', 'education', 'contact'].map(id => (
                  <div key={id} onClick={() => scrollTo(id)} className={`nav-dot-item ${activeSection === id ? 'active' : ''}`}>
                    <div className="nav-dot" />
                    <span>{id}</span>
                  </div>
                ))}
              </nav>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              {social.github && (
                <a href={social.github} target="_blank" rel="noreferrer" title="GitHub" style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'all 0.3s ease' }} className="social-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'all 0.3s ease' }} className="social-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {social.leetcode && (
                <a href={social.leetcode} target="_blank" rel="noreferrer" title="LeetCode" style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'all 0.3s ease' }} className="social-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.443 10.228a1.375 1.375 0 0 0-1.942 0l-5.38 5.378a1.375 1.375 0 1 0 1.943 1.944l5.38-5.38a1.374 1.374 0 0 0 0-1.942zM4.34 17.52a1.374 1.374 0 0 0-1.94 0L.414 19.5a1.374 1.374 0 0 0 0 1.942l2.02 2.02a1.374 1.374 0 0 0 1.94 0l1.986-1.986a1.374 1.374 0 0 0 0-1.94L4.34 17.52zM12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
                  </svg>
                </a>
              )}
              {social.email && (
                <a href={`mailto:${social.email}`} title="Email" style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'all 0.3s ease' }} className="social-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm.445.361l4.932 3.997 4.932-3.997 5.4 6.71h-20.664l5.4-6.71zm10.309-.361l4.623-3.746v9.458l-4.623-5.712zm3.323-6.929l-10.7 8.666-10.7-8.666h21.4z" />
                  </svg>
                </a>
              )}
            </div>
          </header>

          {/* Right Scrollable Column */}
          <main className="portfolio-main">
            
            {/* About Section */}
            <section id="about">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>About</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{profile.about}</p>
            </section>

            {/* Experience Section */}
            <section id="experience">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {experience.map((exp, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '24px', borderLeft: '4px solid var(--color-accent-violet)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.15rem' }}>
                      {exp.companyUrl ? (
                        <>{exp.title} at <a href={exp.companyUrl} target="_blank" rel="noreferrer">{exp.company}</a></>
                      ) : (
                        <>{exp.title} at {exp.company}</>
                      )}
                      </h3>
                      <span style={{ fontSize: '0.85rem', color: '#6b6b80' }}>{exp.duration}</span>
                    </div>
                    <ul style={{ paddingLeft: '18px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(exp.description || []).map((bullet, bidx) => (
                        <li key={bidx}>{bullet}</li>
                      ))}
                    </ul>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(exp.techStack || []).map((tech, tidx) => (
                        <span key={tidx} style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(167, 139, 250, 0.1)', color: '#c4b5fd', borderRadius: '4px', border: '1px solid rgba(167, 139, 250, 0.2)' }}>{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* View Full Resume */}
              <div style={{ marginTop: '24px' }}>
                <a 
                  href="/uploads/resume.pdf" 
                  target="_blank" 
                  rel="noreferrer"
                  className="glass-btn" 
                  style={{ 
                    background: 'transparent', 
                    color: 'var(--color-accent-violet)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '30px', 
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    textDecoration: 'none'
                  }}
                >
                  View Full Resume
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </section>

            {/* Projects Section */}
            <section id="projects">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projects</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Full Stack Web Work */}
                {standardProjects.map((proj, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#a1a1b5' }}>{proj.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                      {(proj.techStack || []).map((tech, tidx) => (
                        <span key={tidx} style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(167, 139, 250, 0.1)', color: '#c4b5fd', borderRadius: '4px' }}>{tech}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer">GitHub Repo</a>}
                      {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer">Live Demo</a>}
                    </div>
                  </div>
                ))}

                {/* Machine Learning Work (Grouped Separately) */}
                {mlProjects.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#6b6b80', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Additional: Machine Learning Projects</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {mlProjects.map((proj, idx) => (
                        <div key={idx} className="glass-card" style={{ padding: '24px', borderStyle: 'dashed' }}>
                          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{proj.title}</h3>
                          <p style={{ fontSize: '0.95rem', marginBottom: '16px', color: '#a1a1b5' }}>{proj.description}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {(proj.techStack || []).map((tech, tidx) => (
                              <span key={tidx} style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(167, 139, 250, 0.05)', color: '#a1a1b5', borderRadius: '4px', border: '1px dashed rgba(167, 139, 250, 0.2)' }}>{tech}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* View Archive Link */}
                <div style={{ marginTop: '32px' }}>
                  <button 
                    onClick={() => navigate('/archive')}
                    className="glass-btn" 
                    style={{ 
                      background: 'transparent', 
                      color: 'var(--color-accent-violet)', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: '30px', 
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 28px'
                    }}
                  >
                    View Full Project Archive
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {skills.map((skillGroup, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '20px', borderStyle: skillGroup.isAdditional ? 'dashed' : 'solid' }}>
                    <h3 style={{ fontSize: '1rem', color: skillGroup.isAdditional ? '#6b6b80' : '#ededf0', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{skillGroup.category}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(skillGroup.skills || []).map((skill, sidx) => (
                        <span key={sidx} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education & Certs */}
            <section id="education">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Education</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {education.map((edu, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.1rem' }}>{edu.degree}</h3>
                      <span style={{ fontSize: '0.85rem', color: '#6b6b80' }}>{edu.period}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem' }}>{edu.institution} · {edu.location}</p>
                    <p style={{ fontSize: '0.85rem', color: '#a78bfa' }}>Score: {edu.score}</p>
                  </div>
                ))}
              </div>

              {certifications.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#6b6b80', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certifications</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {certifications.map((cert, idx) => (
                      <a key={idx} href={cert.url} target="_blank" rel="noreferrer" className="glass-card" style={{ padding: '10px 16px', display: 'inline-flex', fontSize: '0.85rem' }}>
                        {cert.name} — {cert.provider}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Contact CTA */}
            <section id="contact" style={{ textAlign: 'center' }} className="glass-card">
              <div style={{ padding: '40px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '16px' }} className="gradient-text">Let's build something together</h2>
                <p style={{ maxWidth: '480px', margin: '0 auto 32px auto', color: '#a1a1b5' }}>
                  I am currently looking for internship and employment opportunities! My inbox is always open. Click below to say hello.
                </p>
                <a href={`mailto:${social.email}`} className="glass-btn">Say Hello ✉</a>
              </div>
            </section>

            {/* Footer */}
            <footer style={{ textAlign: 'center', color: '#6b6b80', fontSize: '0.8rem', marginTop: '40px' }}>
              <p>Designed & Built by Virendra Kumar © 2026</p>
            </footer>

          </main>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
