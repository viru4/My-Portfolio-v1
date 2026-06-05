import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

const AdminDashboard = () => {
  const [verifying, setVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Unified data states
  const [profile, setProfile] = useState({ name: '', title: '', tagline: '', about: '', statusBadge: { text: '', visible: true } });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [social, setSocial] = useState({ github: '', linkedin: '', leetcode: '', email: '' });
  
  // File upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);

  const getAuthHeaders = (withJson = false) => {
    const headers = { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` };
    if (withJson) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const loadAllData = useCallback(async () => {
    try {
      const [profileRes, projectsRes, skillsRes, expRes, eduRes, certRes, socialRes] = await Promise.all([
        fetch('/api/profile').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/skills').then(r => r.json()),
        fetch('/api/experience').then(r => r.json()),
        fetch('/api/education').then(r => r.json()),
        fetch('/api/certifications').then(r => r.json()),
        fetch('/api/social').then(r => r.json())
      ]);

      if (profileRes.success) setProfile(profileRes.data);
      if (projectsRes.success) setProjects(projectsRes.data);
      if (skillsRes.success) setSkills(skillsRes.data);
      if (expRes.success) setExperience(expRes.data);
      if (eduRes.success) setEducation(eduRes.data);
      if (certRes.success) setCertifications(certRes.data);
      if (socialRes.success) setSocial(socialRes.data);
    } catch {
      showToast('Error loading active portfolio details.', 'error');
    }
  }, [showToast]);

  // Authentication session check
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        showToast('Authentication session missing. Please log in.', 'error');
        navigate('/admin/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          setVerifying(false);
          loadAllData();
        } else {
          localStorage.removeItem('adminToken');
          showToast('Session expired. Please log in again.', 'error');
          navigate('/admin/login');
        }
      } catch {
        showToast('Backend connection error.', 'error');
        navigate('/');
      }
    };

    verifySession();
  }, [navigate, showToast, loadAllData]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    showToast('Session logged out.', 'success');
    navigate('/');
  };

  // Profile Save
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...profile };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast('Failed to update profile.', 'error');
      }
    } catch {
      showToast('API save error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Social Links Save
  const saveSocial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...social };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;

      const res = await fetch('/api/social', {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Social links updated successfully!', 'success');
      } else {
        showToast('Failed to save links.', 'error');
      }
    } catch {
      showToast('API save error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resume PDF Upload
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      showToast('Please choose a PDF file first', 'error');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Resume PDF uploaded successfully!', 'success');
      } else {
        showToast(data.error || 'Upload failed.', 'error');
      }
    } catch {
      showToast('File upload network error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // CRUD Helpers
  const startAddProject = () => {
    setEditingProject({
      title: '',
      description: '',
      techStack: '',
      highlights: '',
      githubUrl: '',
      demoUrl: '',
      featured: false,
      isMLProject: false,
      displayOrder: 0
    });
  };

  const startEditProject = (proj) => {
    setEditingProject({
      ...proj,
      techStack: proj.techStack.join(', '),
      highlights: proj.highlights.join('\n')
    });
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Parse comma-separated tech stack to array
    const techStack = typeof editingProject.techStack === 'string'
      ? editingProject.techStack.split(',').map(s => s.trim()).filter(Boolean)
      : editingProject.techStack;

    // Parse newline-separated highlights to array
    const highlights = typeof editingProject.highlights === 'string'
      ? editingProject.highlights.split('\n').map(s => s.trim()).filter(Boolean)
      : editingProject.highlights;

    const payload = { ...editingProject, techStack, highlights };

    const isNew = !payload._id;
    const url = isNew ? '/api/projects' : `/api/projects/${payload._id}`;
    const method = isNew ? 'POST' : 'PUT';

    if (!isNew) {
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(isNew ? 'Project created successfully!' : 'Project updated successfully!', 'success');
        setEditingProject(null);
        loadAllData();
      } else {
        showToast('Failed to save project.', 'error');
      }
    } catch {
      showToast('Error saving project details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Project removed!', 'success');
        if (editingProject && editingProject._id === id) {
          setEditingProject(null);
        }
        loadAllData();
      }
    } catch {
      showToast('Error removing project.', 'error');
    }
  };

  const startAddSkillGroup = () => {
    setEditingSkill({
      category: '',
      skills: '',
      displayOrder: 0,
      isAdditional: false
    });
  };

  const startEditSkillGroup = (skillGroup) => {
    setEditingSkill({
      ...skillGroup,
      skills: skillGroup.skills.join(', ')
    });
  };

  const saveSkillGroup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const skillsArray = typeof editingSkill.skills === 'string'
      ? editingSkill.skills.split(',').map(s => s.trim()).filter(Boolean)
      : editingSkill.skills;

    const payload = { ...editingSkill, skills: skillsArray };

    const isNew = !payload._id;
    const url = isNew ? '/api/skills' : `/api/skills/${payload._id}`;
    const method = isNew ? 'POST' : 'PUT';

    if (!isNew) {
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(isNew ? 'Skill group created successfully!' : 'Skill group updated successfully!', 'success');
        setEditingSkill(null);
        loadAllData();
      } else {
        showToast('Failed to save skill group.', 'error');
      }
    } catch {
      showToast('Error saving skill details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteSkillGroup = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Category deleted.', 'success');
        if (editingSkill && editingSkill._id === id) {
          setEditingSkill(null);
        }
        loadAllData();
      }
    } catch {
      showToast('Error deleting.', 'error');
    }
  };

  const startAddExperience = () => {
    setEditingExperience({
      title: '',
      company: '',
      companyUrl: '',
      duration: '',
      description: '',
      techStack: '',
      displayOrder: 0
    });
  };

  const startEditExperience = (exp) => {
    setEditingExperience({
      ...exp,
      description: (exp.description || []).join('\n'),
      techStack: (exp.techStack || []).join(', ')
    });
  };

  const saveExperience = async (e) => {
    e.preventDefault();
    setLoading(true);

    const description = typeof editingExperience.description === 'string'
      ? editingExperience.description.split('\n').map(s => s.trim()).filter(Boolean)
      : editingExperience.description;
    const techStack = typeof editingExperience.techStack === 'string'
      ? editingExperience.techStack.split(',').map(s => s.trim()).filter(Boolean)
      : editingExperience.techStack;

    const payload = { ...editingExperience, description, techStack };
    const isNew = !payload._id;
    const url = isNew ? '/api/experience' : `/api/experience/${payload._id}`;
    const method = isNew ? 'POST' : 'PUT';

    if (!isNew) {
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(isNew ? 'Experience entry created!' : 'Experience entry updated!', 'success');
        setEditingExperience(null);
        loadAllData();
      } else {
        showToast('Failed to save experience entry.', 'error');
      }
    } catch {
      showToast('Error saving experience entry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Experience entry removed!', 'success');
        if (editingExperience && editingExperience._id === id) {
          setEditingExperience(null);
        }
        loadAllData();
      }
    } catch {
      showToast('Error removing experience entry.', 'error');
    }
  };

  const startAddEducation = () => {
    setEditingEducation({
      period: '',
      degree: '',
      institution: '',
      location: '',
      score: '',
      displayOrder: 0
    });
  };

  const startEditEducation = (edu) => {
    setEditingEducation({ ...edu });
  };

  const saveEducation = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...editingEducation };
    const isNew = !payload._id;
    const url = isNew ? '/api/education' : `/api/education/${payload._id}`;
    const method = isNew ? 'POST' : 'PUT';

    if (!isNew) {
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(isNew ? 'Education entry created!' : 'Education entry updated!', 'success');
        setEditingEducation(null);
        loadAllData();
      } else {
        showToast('Failed to save education entry.', 'error');
      }
    } catch {
      showToast('Error saving education entry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteEducation = async (id) => {
    if (!confirm('Delete this education entry?')) return;
    try {
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Education entry removed!', 'success');
        if (editingEducation && editingEducation._id === id) {
          setEditingEducation(null);
        }
        loadAllData();
      }
    } catch {
      showToast('Error removing education entry.', 'error');
    }
  };

  const startAddCertification = () => {
    setEditingCertification({
      name: '',
      provider: '',
      url: ''
    });
  };

  const startEditCertification = (cert) => {
    setEditingCertification({ ...cert });
  };

  const saveCertification = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...editingCertification };
    const isNew = !payload._id;
    const url = isNew ? '/api/certifications' : `/api/certifications/${payload._id}`;
    const method = isNew ? 'POST' : 'PUT';

    if (!isNew) {
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.__v;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(isNew ? 'Certification created!' : 'Certification updated!', 'success');
        setEditingCertification(null);
        loadAllData();
      } else {
        showToast('Failed to save certification.', 'error');
      }
    } catch {
      showToast('Error saving certification.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteCertification = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        showToast('Certification removed!', 'success');
        if (editingCertification && editingCertification._id === id) {
          setEditingCertification(null);
        }
        loadAllData();
      }
    } catch {
      showToast('Error removing certification.', 'error');
    }
  };

  if (verifying) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0a0a1a', color: '#a78bfa' }}>
        <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem' }}>Verifying Session...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: '📝 Profile' },
    { id: 'projects', label: '📂 Projects' },
    { id: 'skills', label: '🛠 Skills' },
    { id: 'experience', label: '💼 Experience' },
    { id: 'education', label: '🎓 Education' },
    { id: 'certifications', label: '📜 Certifications' },
    { id: 'socials', label: '🔗 Socials & Resume' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a1a', color: '#ededf0', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <aside className="glass-card" style={{ width: '260px', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', borderRadius: 0, padding: '40px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10, position: 'fixed', height: '100vh' }}>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate('/')}>CMS Console</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'rgba(167, 139, 250, 0.15)' : 'transparent',
                  border: 'none',
                  color: activeTab === tab.id ? '#ededf0' : '#a1a1b5',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  borderLeft: activeTab === tab.id ? '3px solid var(--color-accent-violet)' : '3px solid transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button className="glass-btn" style={{ background: '#f87171', color: '#000', width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main editor */}
      <main style={{ marginLeft: '260px', flexGrow: 1, padding: '60px 48px', minHeight: '100vh' }}>
        <div className="glass-card" style={{ padding: '40px', minHeight: '80vh' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '24px', textTransform: 'capitalize' }}>
            {activeTab} Settings
          </h1>

          {/* Profile form */}
          {activeTab === 'profile' && (
            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Developer Name</label>
                <input className="glass-input" type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Role Title</label>
                <input className="glass-input" type="text" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Tagline</label>
                <input className="glass-input" type="text" value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>About Me (Bio)</label>
                <textarea className="glass-input" rows="6" value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} required />
              </div>
              <button className="glass-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Profile Details'}</button>
            </form>
          )}

          {/* Projects panel */}
          {activeTab === 'projects' && (
            <div>
              {editingProject ? (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={() => setEditingProject(null)}>← Back to List</button>
                  <form onSubmit={saveProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Project Title</label>
                      <input className="glass-input" type="text" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Description</label>
                      <textarea className="glass-input" rows="4" value={editingProject.description} onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Tech Stack (comma-separated)</label>
                      <input className="glass-input" type="text" placeholder="React, Express.js, MongoDB" value={editingProject.techStack} onChange={(e) => setEditingProject({ ...editingProject, techStack: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Highlights / Bullet Points (one per line)</label>
                      <textarea className="glass-input" rows="4" placeholder="Architected database design&#10;Implemented RESTful endpoints" value={editingProject.highlights} onChange={(e) => setEditingProject({ ...editingProject, highlights: e.target.value })} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>GitHub URL</label>
                        <input className="glass-input" type="url" value={editingProject.githubUrl || ''} onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Demo URL</label>
                        <input className="glass-input" type="url" value={editingProject.demoUrl || ''} onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={editingProject.featured || false} onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })} />
                        📌 Pin / Feature Project (Show on Front Page)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={editingProject.isMLProject || false} onChange={(e) => setEditingProject({ ...editingProject, isMLProject: e.target.checked })} />
                        Machine Learning Project
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Display Order</label>
                      <input className="glass-input" type="number" value={editingProject.displayOrder || 0} onChange={(e) => setEditingProject({ ...editingProject, displayOrder: parseInt(e.target.value) || 0 })} required />
                    </div>
                    <button className="glass-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Project Details'}</button>
                  </form>
                </div>
              ) : (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={startAddProject}>+ Add New Project</button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {projects.map((proj) => (
                      <div key={proj._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>
                            {proj.featured && <span title="Pinned to Front Page" style={{ marginRight: '6px' }}>📌</span>}
                            {proj.title} 
                            {proj.isMLProject && <span style={{ fontSize: '0.75rem', color: '#6b6b80', marginLeft: '6px' }}>(ML)</span>}
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{(proj.description || '').slice(0, 100)}{(proj.description || '').length > 100 ? '...' : ''}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="glass-btn" style={{ padding: '6px 14px' }} onClick={() => startEditProject(proj)}>Edit</button>
                          <button className="glass-btn" style={{ background: '#f87171', color: '#000', padding: '6px 14px' }} onClick={() => deleteProject(proj._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skills panel */}
          {activeTab === 'skills' && (
            <div>
              {editingSkill ? (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={() => setEditingSkill(null)}>← Back to List</button>
                  <form onSubmit={saveSkillGroup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Category Name</label>
                      <input className="glass-input" type="text" value={editingSkill.category} onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Skills (comma-separated)</label>
                      <input className="glass-input" type="text" placeholder="JavaScript, Python, C++" value={editingSkill.skills} onChange={(e) => setEditingSkill({ ...editingSkill, skills: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Display Order</label>
                      <input className="glass-input" type="number" value={editingSkill.displayOrder || 0} onChange={(e) => setEditingSkill({ ...editingSkill, displayOrder: parseInt(e.target.value) || 0 })} required />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={editingSkill.isAdditional || false} onChange={(e) => setEditingSkill({ ...editingSkill, isAdditional: e.target.checked })} />
                        Is Additional / ML Category (Dashed Styling)
                      </label>
                    </div>
                    <button className="glass-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Skill Category'}</button>
                  </form>
                </div>
              ) : (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={startAddSkillGroup}>+ Add Skill Category</button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {skills.map((skillGroup) => (
                      <div key={skillGroup._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>{skillGroup.category} {skillGroup.isAdditional && <span style={{ fontSize: '0.75rem', color: '#6b6b80' }}>(ML/Additional)</span>}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{(skillGroup.skills || []).join(', ')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="glass-btn" style={{ padding: '6px 14px' }} onClick={() => startEditSkillGroup(skillGroup)}>Edit</button>
                          <button className="glass-btn" style={{ background: '#f87171', color: '#000', padding: '6px 14px' }} onClick={() => deleteSkillGroup(skillGroup._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Experience panel */}
          {activeTab === 'experience' && (
            <div>
              {editingExperience ? (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={() => setEditingExperience(null)}>← Back to List</button>
                  <form onSubmit={saveExperience} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Job Title</label>
                      <input className="glass-input" type="text" value={editingExperience.title} onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Company</label>
                        <input className="glass-input" type="text" value={editingExperience.company} onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Duration</label>
                        <input className="glass-input" type="text" placeholder="3 Months · In-House" value={editingExperience.duration} onChange={(e) => setEditingExperience({ ...editingExperience, duration: e.target.value })} required />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Company URL</label>
                      <input className="glass-input" type="url" value={editingExperience.companyUrl || ''} onChange={(e) => setEditingExperience({ ...editingExperience, companyUrl: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Description Bullets (one per line)</label>
                      <textarea className="glass-input" rows="4" value={editingExperience.description} onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Tech Stack (comma-separated)</label>
                      <input className="glass-input" type="text" value={editingExperience.techStack} onChange={(e) => setEditingExperience({ ...editingExperience, techStack: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Display Order</label>
                      <input className="glass-input" type="number" value={editingExperience.displayOrder || 0} onChange={(e) => setEditingExperience({ ...editingExperience, displayOrder: parseInt(e.target.value) || 0 })} required />
                    </div>
                    <button className="glass-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Experience Entry'}</button>
                  </form>
                </div>
              ) : (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={startAddExperience}>+ Add Experience Entry</button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {experience.map((exp) => (
                      <div key={exp._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>{exp.title} at {exp.company}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{exp.duration}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="glass-btn" style={{ padding: '6px 14px' }} onClick={() => startEditExperience(exp)}>Edit</button>
                          <button className="glass-btn" style={{ background: '#f87171', color: '#000', padding: '6px 14px' }} onClick={() => deleteExperience(exp._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Education panel */}
          {activeTab === 'education' && (
            <div>
              {editingEducation ? (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={() => setEditingEducation(null)}>← Back to List</button>
                  <form onSubmit={saveEducation} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Period</label>
                        <input className="glass-input" type="text" placeholder="2022 — 2026" value={editingEducation.period} onChange={(e) => setEditingEducation({ ...editingEducation, period: e.target.value })} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Score</label>
                        <input className="glass-input" type="text" value={editingEducation.score || ''} onChange={(e) => setEditingEducation({ ...editingEducation, score: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Degree</label>
                      <input className="glass-input" type="text" value={editingEducation.degree} onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Institution</label>
                      <input className="glass-input" type="text" value={editingEducation.institution} onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Location</label>
                      <input className="glass-input" type="text" value={editingEducation.location || ''} onChange={(e) => setEditingEducation({ ...editingEducation, location: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Display Order</label>
                      <input className="glass-input" type="number" value={editingEducation.displayOrder || 0} onChange={(e) => setEditingEducation({ ...editingEducation, displayOrder: parseInt(e.target.value) || 0 })} required />
                    </div>
                    <button className="glass-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Education Entry'}</button>
                  </form>
                </div>
              ) : (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={startAddEducation}>+ Add Education Entry</button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {education.map((edu) => (
                      <div key={edu._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>{edu.degree}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{edu.institution} · {edu.period}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="glass-btn" style={{ padding: '6px 14px' }} onClick={() => startEditEducation(edu)}>Edit</button>
                          <button className="glass-btn" style={{ background: '#f87171', color: '#000', padding: '6px 14px' }} onClick={() => deleteEducation(edu._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certifications panel */}
          {activeTab === 'certifications' && (
            <div>
              {editingCertification ? (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={() => setEditingCertification(null)}>← Back to List</button>
                  <form onSubmit={saveCertification} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Certification Name</label>
                      <input className="glass-input" type="text" value={editingCertification.name} onChange={(e) => setEditingCertification({ ...editingCertification, name: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Provider</label>
                      <input className="glass-input" type="text" value={editingCertification.provider} onChange={(e) => setEditingCertification({ ...editingCertification, provider: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Certificate URL</label>
                      <input className="glass-input" type="url" value={editingCertification.url || ''} onChange={(e) => setEditingCertification({ ...editingCertification, url: e.target.value })} />
                    </div>
                    <button className="glass-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Certification'}</button>
                  </form>
                </div>
              ) : (
                <div>
                  <button className="glass-btn" style={{ marginBottom: '24px' }} onClick={startAddCertification}>+ Add Certification</button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {certifications.map((cert) => (
                      <div key={cert._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem' }}>{cert.name}</h3>
                          <p style={{ fontSize: '0.85rem', color: '#a1a1b5' }}>{cert.provider}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button className="glass-btn" style={{ padding: '6px 14px' }} onClick={() => startEditCertification(cert)}>Edit</button>
                          <button className="glass-btn" style={{ background: '#f87171', color: '#000', padding: '6px 14px' }} onClick={() => deleteCertification(cert._id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Socials & Resume panel */}
          {activeTab === 'socials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {/* Links form */}
              <form onSubmit={saveSocial} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', color: '#a78bfa' }}>Contact Links</h2>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>GitHub Profile</label>
                  <input className="glass-input" type="url" value={social.github} onChange={(e) => setSocial({ ...social, github: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>LinkedIn URL</label>
                  <input className="glass-input" type="url" value={social.linkedin} onChange={(e) => setSocial({ ...social, linkedin: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>LeetCode URL</label>
                  <input className="glass-input" type="url" value={social.leetcode} onChange={(e) => setSocial({ ...social, leetcode: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Contact Email</label>
                  <input className="glass-input" type="email" value={social.email} onChange={(e) => setSocial({ ...social, email: e.target.value })} />
                </div>
                <button className="glass-btn" type="submit" disabled={loading}>Update Links</button>
              </form>

              {/* Resume upload form */}
              <form onSubmit={handleResumeUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
                <h2 style={{ fontSize: '1.2rem', color: '#a78bfa' }}>Resume PDF Upload</h2>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#6b6b80', marginBottom: '8px' }}>Select Resume Document (.pdf)</label>
                  <input className="glass-input" type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files[0])} />
                </div>
                <button className="glass-btn" type="submit" disabled={loading}>{loading ? 'Uploading File...' : 'Upload New PDF'}</button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
