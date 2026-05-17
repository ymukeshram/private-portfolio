import { useState, useEffect } from 'react';
import { auth, googleProvider, db, storage, ADMIN_EMAIL } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, LogOut, ChevronRight, Briefcase, Award, 
  Upload, X, Save, Image as ImageIcon, Loader2, Lock, Code2
} from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internships, setInternships] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'internships' | 'certifications' | 'skills' | 'achievements' | 'projects'>('internships');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [internshipForm, setInternshipForm] = useState({
    company: '',
    role: '',
    duration: '',
    description: '',
    technologies: '',
    certificateUrl: ''
  });

  const [certificationForm, setCertificationForm] = useState({
    organization: '',
    description: '', // This is being used as the "Certificate Name"
    imageUrl: ''    // This is being used as the "Link"
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    category: ''
  });

  const [achievementForm, setAchievementForm] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
    proofUrl: ''
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tech: '',
    image: '',
    github: '',
    live: ''
  });

  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleFirestoreError = (err: any, type: string, path: string) => {
    console.error(`Firestore Error [${type}] on ${path}:`, err);
    const errInfo = {
      error: err.message || String(err),
      operationType: type,
      path,
      authInfo: {
        email: auth.currentUser?.email,
        uid: auth.currentUser?.uid
      }
    };
    setError(JSON.stringify(errInfo, null, 2));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cert' | 'intern' | 'achievement' | 'project') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      if (type === 'cert') {
        setCertificationForm(prev => ({ ...prev, imageUrl: url }));
      } else if (type === 'intern') {
        setInternshipForm(prev => ({ ...prev, certificateUrl: url }));
      } else if (type === 'achievement') {
        setAchievementForm(prev => ({ ...prev, proofUrl: url }));
      } else if (type === 'project') {
        setProjectForm(prev => ({ ...prev, image: url }));
      }
    } catch (err: any) {
      console.error(err);
      setError("Upload failed: " + err.message);
    } finally {
      setUploadingType(null);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        if (u.email === ADMIN_EMAIL) {
          setUser(u);
          setError(null);
        } else {
          setUser(null);
          setError(`Access denied. ${u.email} is not authorized.`);
          signOut(auth); // Sign out if it's the wrong account
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const qI = query(collection(db, 'internships'), orderBy('createdAt', 'desc'));
    const unsubI = onSnapshot(qI, (snap) => {
      setInternships(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Internships unsub:", err));

    const qC = query(collection(db, 'certifications'), orderBy('createdAt', 'desc'));
    const unsubC = onSnapshot(qC, (snap) => {
      setCertifications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Certs unsub:", err));

    const qS = query(collection(db, 'skills'), orderBy('createdAt', 'desc'));
    const unsubS = onSnapshot(qS, (snap) => {
      setSkills(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Skills unsub:", err));

    const qA = query(collection(db, 'achievements'), orderBy('createdAt', 'desc'));
    const unsubA = onSnapshot(qA, (snap) => {
      setAchievements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Achievements unsub:", err));

    const qP = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubP = onSnapshot(qP, (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Projects unsub:", err));

    return () => { unsubI(); unsubC(); unsubS(); unsubA(); unsubP(); };
  }, [user]);

  const login = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to login. Please try again.');
    }
  };

  const submitInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'internships';
    try {
      const data = {
        ...internshipForm,
        technologies: internshipForm.technologies.split(',').map(t => t.trim()),
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        const existingItem = internships.find(i => i.id === editingId);
        if (!existingItem) throw new Error("Item not found in local state");
        
        await updateDoc(doc(db, path, editingId), {
          ...data,
          createdAt: existingItem.createdAt
        });
      } else {
        await addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
      }
      closeForm();
    } catch (err: any) {
      handleFirestoreError(err, editingId ? 'update' : 'create', editingId ? `${path}/${editingId}` : path);
    }
  };

  const submitCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'certifications';
    try {
      const data = { ...certificationForm, updatedAt: serverTimestamp() };

      if (editingId) {
        const existingItem = certifications.find(c => c.id === editingId);
        if (!existingItem) throw new Error("Item not found in local state");
        
        await updateDoc(doc(db, path, editingId), {
          ...data,
          createdAt: existingItem.createdAt
        });
      } else {
        await addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
      }
      closeForm();
    } catch (err: any) {
      handleFirestoreError(err, editingId ? 'update' : 'create', editingId ? `${path}/${editingId}` : path);
    }
  };

  const submitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'skills';
    try {
      const data = { ...skillForm, updatedAt: serverTimestamp() };

      if (editingId) {
        const existingItem = skills.find(s => s.id === editingId);
        if (!existingItem) throw new Error("Item not found in local state");
        
        await updateDoc(doc(db, path, editingId), {
          ...data,
          createdAt: existingItem.createdAt
        });
      } else {
        await addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
      }
      closeForm();
    } catch (err: any) {
      handleFirestoreError(err, editingId ? 'update' : 'create', editingId ? `${path}/${editingId}` : path);
    }
  };

  const submitAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'achievements';
    try {
      const data = { ...achievementForm, updatedAt: serverTimestamp() };

      if (editingId) {
        const existingItem = achievements.find(a => a.id === editingId);
        if (!existingItem) throw new Error("Item not found in local state");
        
        await updateDoc(doc(db, path, editingId), {
          ...data,
          createdAt: existingItem.createdAt
        });
      } else {
        await addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
      }
      closeForm();
    } catch (err: any) {
      handleFirestoreError(err, editingId ? 'update' : 'create', editingId ? `${path}/${editingId}` : path);
    }
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = 'projects';
    try {
      const data = { 
        ...projectForm, 
        tech: projectForm.tech.split(',').map(t => t.trim()),
        updatedAt: serverTimestamp() 
      };

      if (editingId) {
        const existingItem = projects.find(p => p.id === editingId);
        if (!existingItem) throw new Error("Item not found in local state");
        
        await updateDoc(doc(db, path, editingId), {
          ...cleanTech(data),
          createdAt: existingItem.createdAt
        });
      } else {
        await addDoc(collection(db, path), { ...cleanTech(data), createdAt: serverTimestamp() });
      }
      closeForm();
    } catch (err: any) {
      handleFirestoreError(err, editingId ? 'update' : 'create', editingId ? `${path}/${editingId}` : path);
    }
  };

  const cleanTech = (data: any) => {
    // Ensure tech is a clean array of strings
    return {
      ...data,
      tech: Array.isArray(data.tech) ? data.tech.filter((t: string) => t && t.trim() !== '') : []
    };
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setInternshipForm({ company: '', role: '', duration: '', description: '', technologies: '', certificateUrl: '' });
    setCertificationForm({ organization: '', description: '', imageUrl: '' });
    setSkillForm({ name: '', category: '' });
    setAchievementForm({ title: '', organization: '', date: '', description: '', proofUrl: '' });
    setProjectForm({ title: '', description: '', tech: '', image: '', github: '', live: '' });
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'internships') {
      setInternshipForm({
        company: item.company,
        role: item.role,
        duration: item.duration,
        description: item.description,
        technologies: item.technologies.join(', '),
        certificateUrl: item.certificateUrl || ''
      });
    } else if (activeTab === 'certifications') {
      setCertificationForm({
        organization: item.organization,
        description: item.description,
        imageUrl: item.imageUrl
      });
    } else if (activeTab === 'skills') {
      setSkillForm({
        name: item.name,
        category: item.category || ''
      });
    } else if (activeTab === 'achievements') {
      setAchievementForm({
        title: item.title,
        organization: item.organization,
        date: item.date || '',
        description: item.description || '',
        proofUrl: item.proofUrl || ''
      });
    } else {
      setProjectForm({
        title: item.title,
        description: item.description,
        tech: item.tech.join(', '),
        image: item.image,
        github: item.github || '',
        live: item.live || ''
      });
    }
    setIsFormOpen(true);
  };

  const deleteItem = async (id: string, coll: string) => {
    try {
      await deleteDoc(doc(db, coll, id));
      setError(null);
      setDeleteId(null);
    } catch (err: any) {
      handleFirestoreError(err, 'delete', `${coll}/${id}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-3xl max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-8 text-neon-blue">
          <Lock size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Admin Access</h1>
        <p className="text-white/40 mb-8">This area is restricted to the administrator. Please log in to continue.</p>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <button 
          onClick={login}
          className="w-full py-4 rounded-xl bg-neon-blue text-dark-bg font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors"
        >
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient">Admin Dashboard</h1>
            <p className="text-white/40 mt-2">Manage your internships and certifications</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('internships')}
            className={`px-6 py-2 rounded-full font-medium transition-all shrink-0 ${activeTab === 'internships' ? 'bg-neon-blue text-dark-bg' : 'bg-white/5 hover:bg-white/10'}`}
          >
            Internships
          </button>
          <button 
            onClick={() => setActiveTab('certifications')}
            className={`px-6 py-2 rounded-full font-medium transition-all shrink-0 ${activeTab === 'certifications' ? 'bg-neon-blue text-dark-bg' : 'bg-white/5 hover:bg-white/10'}`}
          >
            Certifications
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-2 rounded-full font-medium transition-all shrink-0 ${activeTab === 'skills' ? 'bg-neon-blue text-dark-bg' : 'bg-white/5 hover:bg-white/10'}`}
          >
            Skills
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-2 rounded-full font-medium transition-all shrink-0 ${activeTab === 'achievements' ? 'bg-neon-blue text-dark-bg' : 'bg-white/5 hover:bg-white/10'}`}
          >
            Achievements
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2 rounded-full font-medium transition-all shrink-0 ${activeTab === 'projects' ? 'bg-neon-blue text-dark-bg' : 'bg-white/5 hover:bg-white/10'}`}
          >
            Projects
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center font-bold">!</div>
            <div>
              <p className="font-bold">Error Occurred</p>
              <p className="opacity-80">{error}</p>
              {error.includes('auth/unauthorized-domain') && (
                <p className="mt-2 text-xs opacity-60">
                  Tip: Add {window.location.hostname} to authorized domains in Firebase Console (Authentication &gt; Settings &gt; Authorized domains).
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-display font-bold capitalize">{activeTab}</h2>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-dark-bg rounded-xl font-bold hover:scale-105 transition-all"
          >
            <Plus size={20} /> Add New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'internships' ? internships : activeTab === 'certifications' ? certifications : activeTab === 'skills' ? skills : activeTab === 'achievements' ? achievements : projects).map(item => (
            <motion.div 
              layout
              key={item.id}
              className="glass p-6 rounded-2xl group hover:border-neon-blue/30 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 glass rounded-xl text-neon-blue">
                  {activeTab === 'internships' ? <Briefcase size={24} /> : activeTab === 'certifications' ? <Award size={24} /> : activeTab === 'skills' ? <Code2 size={24} /> : activeTab === 'projects' ? <Code2 size={24} /> : <Award size={24} />}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="p-2 hover:text-neon-blue transition-colors"><Edit3 size={18} /></button>
                  <div className="relative">
                    <button 
                      onClick={() => setDeleteId(deleteId === item.id ? null : item.id)} 
                      className={`p-2 transition-colors ${deleteId === item.id ? 'text-red-500 scale-110' : 'hover:text-red-400'}`}
                    >
                      <Trash2 size={18} />
                    </button>
                    {deleteId === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-0 bottom-full mb-2 bg-red-500 text-white text-[10px] font-bold px-3 py-2 rounded-lg whitespace-nowrap z-20 cursor-pointer shadow-lg"
                        onClick={() => deleteItem(item.id, activeTab)}
                      >
                        Click to Confirm
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab === 'internships' ? item.role : activeTab === 'certifications' ? item.organization : activeTab === 'skills' ? item.name : activeTab === 'projects' ? item.title : item.title}
              </h3>
              <p className="text-white/40 text-sm line-clamp-3">
                {activeTab === 'skills' ? item.category : activeTab === 'achievements' ? item.organization : activeTab === 'projects' ? item.description : item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Modal Form */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark-bg/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="glass p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-display font-bold">
                    {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
                  </h3>
                  <button onClick={closeForm} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
                </div>

                <form onSubmit={
                  activeTab === 'internships' ? submitInternship : 
                  activeTab === 'certifications' ? submitCertification : 
                  activeTab === 'skills' ? submitSkill : 
                  activeTab === 'achievements' ? submitAchievement : 
                  submitProject
                } className="space-y-6">
                  {activeTab === 'internships' ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Internship / Program Name</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="e.g. Software Engineer Intern"
                            value={internshipForm.role}
                            onChange={e => setInternshipForm({...internshipForm, role: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Organization / Company</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="e.g. Google"
                            value={internshipForm.company}
                            onChange={e => setInternshipForm({...internshipForm, company: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Duration</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="e.g. Jan 2024 - Mar 2024"
                            value={internshipForm.duration}
                            onChange={e => setInternshipForm({...internshipForm, duration: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Technologies (comma separated)</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="React, Firebase, TS"
                            value={internshipForm.technologies}
                            onChange={e => setInternshipForm({...internshipForm, technologies: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Detailed Description</label>
                        <textarea 
                          required
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          placeholder="What did you do during this internship?"
                          value={internshipForm.description}
                          onChange={e => setInternshipForm({...internshipForm, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Certificate / Proof Link</label>
                        <div className="flex flex-col gap-4">
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="https://drive.google.com/..."
                            value={internshipForm.certificateUrl}
                            onChange={e => setInternshipForm({...internshipForm, certificateUrl: e.target.value})}
                          />
                          <label className="flex items-center justify-center p-8 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 border-2 border-dashed border-white/10 transition-all">
                            <div className="text-center">
                              {uploadingType === 'intern' ? (
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-blue" />
                              ) : (
                                <>
                                  <Upload size={24} className="mx-auto mb-2 text-white/40" />
                                  <p className="text-xs text-white/40">Upload Internship Certificate</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'intern')} />
                          </label>
                          {internshipForm.certificateUrl && (
                            <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                              <ChevronRight size={10} /> Link Set: {internshipForm.certificateUrl.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : activeTab === 'certifications' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Certificate Name</label>
                        <input 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          placeholder="e.g. Software Engineer Intern Certificate"
                          value={certificationForm.description}
                          onChange={e => setCertificationForm({...certificationForm, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Issuer / Organization</label>
                        <input 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          placeholder="e.g. HackerRank"
                          value={certificationForm.organization}
                          onChange={e => setCertificationForm({...certificationForm, organization: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Certificate Link (Google Drive / Image URL)</label>
                        <div className="flex flex-col gap-4">
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="https://drive.google.com/..."
                            value={certificationForm.imageUrl}
                            onChange={e => setCertificationForm({...certificationForm, imageUrl: e.target.value})}
                          />
                          <label className="flex items-center justify-center p-8 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 border-2 border-dashed border-white/10 transition-all">
                            <div className="text-center">
                              {uploadingType === 'cert' ? (
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-blue" />
                              ) : (
                                <>
                                  <Upload size={24} className="mx-auto mb-2 text-white/40" />
                                  <p className="text-xs text-white/40">Upload Certificate File</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'cert')} />
                          </label>
                          {certificationForm.imageUrl && (
                            <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                              <ChevronRight size={10} /> Link Set: {certificationForm.imageUrl.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : activeTab === 'skills' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Skill Name</label>
                        <input 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          value={skillForm.name}
                          onChange={e => setSkillForm({...skillForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Category (Optional)</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          placeholder="e.g. Programming, Tools"
                          value={skillForm.category}
                          onChange={e => setSkillForm({...skillForm, category: e.target.value})}
                        />
                      </div>
                    </>
                  ) : activeTab === 'achievements' ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Achievement Title</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="e.g. Hackathon Winner"
                            value={achievementForm.title}
                            onChange={e => setAchievementForm({...achievementForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Issuer / Organization</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="e.g. Major League Hacking"
                            value={achievementForm.organization}
                            onChange={e => setAchievementForm({...achievementForm, organization: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Date / Year (Optional)</label>
                        <input 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          placeholder="e.g. 2024"
                          value={achievementForm.date}
                          onChange={e => setAchievementForm({...achievementForm, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Detailed Description</label>
                        <textarea 
                          required
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          placeholder="Describe your achievement..."
                          value={achievementForm.description}
                          onChange={e => setAchievementForm({...achievementForm, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Proof / Certificate Link</label>
                        <div className="flex flex-col gap-4">
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="https://drive.google.com/..."
                            value={achievementForm.proofUrl}
                            onChange={e => setAchievementForm({...achievementForm, proofUrl: e.target.value})}
                          />
                          <label className="flex items-center justify-center p-8 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 border-2 border-dashed border-white/10 transition-all">
                            <div className="text-center">
                              {uploadingType === 'achievement' ? (
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-blue" />
                              ) : (
                                <>
                                  <Upload size={24} className="mx-auto mb-2 text-white/40" />
                                  <p className="text-xs text-white/40">Upload Achievement Proof</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'achievement')} />
                          </label>
                          {achievementForm.proofUrl && (
                            <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                              <ChevronRight size={10} /> Link Set: {achievementForm.proofUrl.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Project Title</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            value={projectForm.title}
                            onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Technologies (comma separated)</label>
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="React, Node.js, Python"
                            value={projectForm.tech}
                            onChange={e => setProjectForm({...projectForm, tech: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Project Image Link / Upload</label>
                        <div className="flex flex-col gap-4">
                          <input 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            placeholder="https://..."
                            value={projectForm.image}
                            onChange={e => setProjectForm({...projectForm, image: e.target.value})}
                          />
                          <label className="flex items-center justify-center p-8 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 border-2 border-dashed border-white/10 transition-all">
                            <div className="text-center">
                              {uploadingType === 'project' ? (
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-blue" />
                              ) : (
                                <>
                                  <Upload size={24} className="mx-auto mb-2 text-white/40" />
                                  <p className="text-xs text-white/40">Upload Project Image</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'project')} />
                          </label>
                          {projectForm.image && (
                            <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                              <ChevronRight size={10} /> Image Set: {projectForm.image.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">GitHub URL (Optional)</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            value={projectForm.github}
                            onChange={e => setProjectForm({...projectForm, github: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/60 mb-2">Live Demo URL (Optional)</label>
                          <input 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                            value={projectForm.live}
                            onChange={e => setProjectForm({...projectForm, live: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Detailed Description</label>
                        <textarea 
                          required
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-neon-blue outline-none"
                          value={projectForm.description}
                          onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  <button 
                    disabled={uploading}
                    className="w-full py-4 bg-neon-blue text-dark-bg font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white disabled:opacity-50 transition-all"
                  >
                    <Save size={20} /> {editingId ? 'Update' : 'Save'} Item
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
