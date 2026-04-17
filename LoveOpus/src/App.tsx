import { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Heart, MessageSquare, Sparkles, MapPin, Clock, Calendar, Coffee, Music, Camera, Utensils } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Stars, Sparkles as Sparkles3D, Cloud } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D HEART COMPONENT ---
function BeatingHeart() {
  const mesh = useRef<THREE.Mesh>(null!);
  const shape = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
    return heartShape;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scale = 0.1 + Math.sin(t * 8) * 0.01 + (Math.sin(t * 1) > 0.9 ? 0.02 : 0); // Double beat effect
    mesh.current.scale.set(scale, scale, scale);
    mesh.current.rotation.z = Math.PI; // Correct orientation
    mesh.current.rotation.y = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <extrudeGeometry args={[shape, { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 }]} />
      <meshStandardMaterial color="#b06c5c" roughness={0.1} metalness={0.8} />
    </mesh>
  );
}

// --- 3D COMPONENTS ---
function Petal({ index }: { index: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const { position, rotation, speed, scale } = useMemo(() => ({
    position: [(Math.random() - 0.5) * 20, Math.random() * 20 + 10, (Math.random() - 0.5) * 10] as [number, number, number],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
    speed: 0.02 + Math.random() * 0.05,
    scale: 0.1 + Math.random() * 0.2
  }), []);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.position.y -= speed;
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.z += 0.01;
    if (mesh.current.position.y < -10) {
      mesh.current.position.y = 15;
      mesh.current.position.x = (Math.random() - 0.5) * 20;
    }
  });

  return (
    <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1.5]} />
      <meshStandardMaterial color="#f7cabf" side={THREE.DoubleSide} transparent opacity={0.4} />
    </mesh>
  );
}

function CafeScene() {
  return (
    <group position={[0, -2, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-1, 0.5, 0]}>
          <cylinderGeometry args={[0.4, 0.3, 0.6, 32]} />
          <meshStandardMaterial color="#fff6f2" roughness={0.1} />
        </mesh>
        <mesh position={[1, 0.5, 1]}>
          <cylinderGeometry args={[0.4, 0.3, 0.6, 32]} />
          <meshStandardMaterial color="#fff6f2" roughness={0.1} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
          <circleGeometry args={[3, 32]} />
          <meshStandardMaterial color="#3b2a25" opacity={0.5} transparent />
        </mesh>
      </Float>
      <Sparkles3D count={100} scale={10} size={2} speed={0.5} color="#b06c5c" opacity={0.2} />
    </group>
  );
}

function SeaScene() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = -Math.PI / 2 + Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group position={[0, -2, 0]}>
      <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30, 40, 40]} />
        <meshStandardMaterial color="#dd9f8f" wireframe opacity={0.4} transparent emissive="#b06c5c" emissiveIntensity={0.3} />
      </mesh>
      <Float speed={2} floatIntensity={1}>
        <mesh position={[0, 3.5, -6]}>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshStandardMaterial color="#d7ad7a" emissive="#d7ad7a" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </Float>
      <Cloud opacity={0.1} speed={0.2} position={[-5, 6, -10]} />
      <Cloud opacity={0.15} speed={0.3} position={[5, 4, -12]} />
      <Cloud opacity={0.1} speed={0.1} position={[0, 7, -15]} />
    </group>
  );
}

function TonightScene() {
  return (
    <group position={[0, 0, 0]}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshStandardMaterial color="#b06c5c" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
      <Sparkles3D count={200} scale={5} size={3} speed={0.2} color="#d7ad7a" />
    </group>
  );
}

function GlobalThreeScene({ activeTab, hoveredMoment }: { activeTab: string; hoveredMoment: number | null }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Environment preset="sunset" />
        {Array.from({ length: 40 }).map((_, i) => (
          <Petal key={i} index={i} />
        ))}
        {activeTab === 'overview' && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={[5, 2, 0]}>
              <BeatingHeart />
            </group>
          </Float>
        )}
        {activeTab === 'timeline' && (
          <>
            {hoveredMoment === 0 && <CafeScene />}
            {hoveredMoment === 1 && <SeaScene />}
            {hoveredMoment === 2 && <TonightScene />}
            {hoveredMoment === null && <CafeScene />}
          </>
        )}
        {activeTab === 'letter' && <TonightScene />}
        {activeTab === 'promises' && <SeaScene />}
        {activeTab === 'planner' && <TonightScene />}
      </Canvas>
    </div>
  );
}

// --- MAIN APPLICATION ---
const startDate = new Date('2024-02-14T00:00:00');
type TabType = 'overview' | 'timeline' | 'letter' | 'promises' | 'planner';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [hoveredMoment, setHoveredMoment] = useState<number | null>(null);
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null);
  const [daysTogether, setDaysTogether] = useState(0);
  const [dateIdea, setDateIdea] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Card Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 100, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  useEffect(() => {
    const updateDays = () => {
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - startDate.getTime());
      setDaysTogether(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    };
    updateDays();
    const interval = setInterval(updateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  const moments = [
    { date: 'First Meeting', title: 'The Rainy Cafe', text: 'You smiled over a chipped cup, and the city noise became music.', icon: <MapPin />, color: 'bg-blue-50' },
    { date: 'First Trip', title: 'Sea at Dawn', text: 'Barefoot on cold sand, we promised to keep choosing each other.', icon: <Sparkles />, color: 'bg-amber-50' },
    { date: 'Tonight', title: 'This Exact Minute', text: 'Even now this page glows because you exist. That is enough magic.', icon: <Clock />, color: 'bg-rose-50' }
  ];

  const promises = [
    { text: 'I will listen before I answer, and hold you before I fix.', icon: <Heart className="animate-pulse" /> },
    { text: 'I will celebrate your wins like my favorite holidays.', icon: <Sparkles /> },
    { text: 'I will protect your soft heart as carefully as my own.', icon: <Heart className="animate-pulse" /> },
    { text: 'I will keep falling in love with who you are becoming.', icon: <Sparkles /> }
  ];

  const dateIdeas = [
    "Picnic at the local park", "Stargazing on the roof", "Surprise visit to a bookstore", "Cooking a new recipe together", "A long drive with our songs", "Painting session with wine", "Revisiting where we met", "Building a cozy fort", "Going to a plant nursery", "A sunset walk by the river", "Attending a local jazz night", "Visiting an arcade together", "Quiet morning at a flower market", "Writing letters to our future selves", "Exploring a museum together", "Taking a pottery workshop", "A candlelit dinner theme night", "Hiking to a viewpoint", "Browsing a flea market", "Dessert-only fancy date", "Doing a DIY home project", "Going on a city photo walk", "Renting a rowboat", "Attending outdoor cinema", "Blind taste test of chocolates", "Morning bike ride and brunch", "Volunteering at a shelter", "Planning a dream vacation", "Making a polaroid scrapbook", "Board game night with tea"
  ];

  const generateDateIdea = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDateIdea(dateIdeas[Math.floor(Math.random() * dateIdeas.length)]);
      setIsGenerating(false);
    }, 1000);
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'timeline', label: 'Our Story', icon: Calendar },
    { id: 'letter', label: 'Letter', icon: MessageSquare },
    { id: 'promises', label: 'Promises', icon: Sparkles },
    { id: 'planner', label: 'Planner', icon: Utensils },
  ];

  return (
    <div className="relative min-h-screen pb-24 font-sans text-ink-900 bg-[#fff6f2]">
      <div className="grain pointer-events-none fixed inset-0 z-50 opacity-[0.03]" />
      <GlobalThreeScene activeTab={activeTab} hoveredMoment={hoveredMoment} />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="glass flex justify-between items-center px-6 py-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="font-serif text-3xl font-bold flex items-center gap-2"
          >
            Love Opus
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            >
              <Heart className="text-rose-600 fill-rose-600 w-5 h-5" />
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="chip flex items-center gap-2 bg-rose-100 border border-rose-600/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-ink-700">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            Still Falling
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.section key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-[1.2fr_0.8fr] gap-8">
              <div className="glass p-8 md:p-12 space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-700 mb-2">Romantic Edition</p>
                  <h1 className="font-serif text-5xl md:text-7xl leading-tight">Every Quiet Moment <br /> Feels Like Poetry</h1>
                </div>
                <p className="text-ink-700 text-lg">A place for your memories, promises, and the lines that make love feel alive. All in one exquisite opus.</p>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setActiveTab('letter')} className="bg-ink-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer">Read Letter</button>
                  <button onClick={() => setActiveTab('planner')} className="bg-white border text-ink-900 px-8 py-3 rounded-full font-bold hover:bg-rose-50 transition-colors cursor-pointer">Plan Date</button>
                </div>
              </div>
              <div className="perspective-[1200px] hidden md:block">
                <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative w-full h-[400px] glass p-4 cursor-pointer">
                  <div className="absolute inset-4 rounded-2xl border border-rose-600/10 flex flex-col items-center justify-center p-8 overflow-hidden bg-white/30" style={{ transform: 'translateZ(40px)' }}>
                    <p className="font-serif text-2xl md:text-3xl text-ink-900 italic leading-snug text-center mb-8" style={{ transform: 'translateZ(30px)' }}>
                      "In every lifetime, I would still find you in a crowded room."
                    </p>
                  </div>
                  <div className="absolute bottom-12 left-10 right-10 flex justify-between items-end" style={{ transform: 'translateZ(80px)' }}>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Since 2024</span>
                      <strong className="font-serif text-6xl leading-none text-rose-600">{daysTogether}</strong>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Days of Us</span>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Heart className="text-rose-600 fill-rose-600/10" size={48} />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeTab === 'timeline' && (
            <motion.section key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass p-8 md:p-12">
              <div className="mb-8"><h2 className="font-serif text-4xl">Our Story</h2></div>
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
                className="grid md:grid-cols-3 gap-6"
              >
                {moments.map((moment, idx) => (
                  <motion.article 
                    key={idx} 
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -10 }} 
                    onHoverStart={() => setHoveredMoment(idx)} 
                    onHoverEnd={() => setHoveredMoment(null)} 
                    className="bg-white p-6 rounded-2xl shadow-sm border border-rose-600/5 group cursor-pointer"
                    onClick={() => setSelectedMoment(idx)}
                  >
                    <div className="mb-4 p-2 bg-rose-100 rounded-lg w-fit group-hover:scale-110 transition-transform">{moment.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600/60">{moment.date}</span>
                    <h3 className="font-serif text-2xl mt-2 mb-3">{moment.title}</h3>
                    <p className="text-ink-700 text-sm leading-relaxed">{moment.text}</p>
                  </motion.article>
                ))}
              </motion.div>
            </motion.section>
          )}

          {activeTab === 'letter' && (
            <motion.section key="letter" initial={{ opacity: 0, scale:0.8 }} animate={{ opacity:1, scale: 1}} exit={{ opacity: 0}} className="glass p-12 max-w-2xl mx-auto font-serif italic text-xl leading-loose bg-white shadow-xl">
              <h3 className="text-3xl mb-8 not-italic font-bold tracking-tight">Dearest,</h3>
              <p className="mb-6">I find bits of you in everything—the way the sun hits the floor, the first sip of tea, the silence of midnight.</p>
              <p className="mb-6">Thank you for being my home. For the patience, the laughs, and the love that grows even on the quiet days.</p>
              <p className="text-right mt-12">— Eternal Love</p>
            </motion.section>
          )}

          {activeTab === 'promises' && (
            <motion.section key="promises" className="grid md:grid-cols-2 gap-6">
              {promises.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass p-8 flex items-start gap-4 hover:shadow-lg transition-all">
                   <div className="p-3 bg-rose-100 rounded-full text-rose-600">{p.icon}</div>
                   <p className="font-serif text-lg">{p.text}</p>
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === 'planner' && (
            <motion.section key="planner" className="glass p-12 max-w-xl mx-auto text-center space-y-8">
               <h2 className="font-serif text-3xl">Fate's Choice</h2>
               <div className="h-40 flex items-center justify-center bg-rose-50/50 rounded-3xl border-2 border-dashed border-rose-200">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div key="gen" className="animate-pulse flex flex-col items-center gap-2"><Sparkles className="text-rose-400" /><span>Dreaming...</span></motion.div>
                    ) : (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-serif italic text-ink-900">{dateIdea || "Ready for a surprise?"}</motion.p>
                    )}
                  </AnimatePresence>
               </div>
               <button onClick={generateDateIdea} disabled={isGenerating} className="w-full py-4 bg-ink-900 text-white rounded-full font-bold hover:bg-ink-700 transition-all disabled:opacity-50">Generate New Idea</button>
            </motion.section>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedMoment !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-xl"
              onClick={() => setSelectedMoment(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass max-w-lg w-full p-8 md:p-12 relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className={`absolute top-0 right-0 w-64 h-64 -mr-20 -mt-20 rounded-full blur-3xl opacity-20 ${moments[selectedMoment].color}`} />
                
                <button 
                  onClick={() => setSelectedMoment(null)}
                  className="absolute top-6 right-6 text-ink-700 hover:text-rose-600 transition-colors"
                >
                  <Clock size={20} className="rotate-45" />
                </button>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
                      {moments[selectedMoment].icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-rose-600/60 leading-none mb-1">
                        {moments[selectedMoment].date}
                      </p>
                      <h3 className="font-serif text-4xl text-ink-900">{moments[selectedMoment].title}</h3>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-rose-600/20 to-transparent" />

                  <p className="font-serif text-2xl italic text-ink-700 leading-relaxed">
                    "{moments[selectedMoment].text}"
                  </p>

                  <div className="pt-4 space-y-4">
                    <p className="text-ink-700 leading-relaxed">
                      This was the moment when everything changed. The air felt different, 
                      charged with a promise we hadn't even spoken yet. Looking back, 
                      it was the quietest revolution in my history.
                    </p>
                    <button 
                      onClick={() => setSelectedMoment(null)}
                      className="w-full py-4 bg-ink-900 text-white rounded-full font-bold hover:bg-ink-700 transition-all shadow-lg"
                    >
                      Close Memory
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass px-4 py-2 flex gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`p-3 rounded-full transition-all relative ${isActive ? 'bg-rose-600 text-white shadow-lg' : 'text-ink-700 hover:bg-rose-50'}`}>
              <Icon size={20} />
              {isActive && <motion.div layoutId="active" className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
