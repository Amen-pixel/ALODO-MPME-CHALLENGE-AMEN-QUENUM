import { useState, useRef } from 'react';
import './App.css';

// Données statiques intégrées pour garantir un fonctionnement 100% autonome sur Vercel
const QUESTIONS_DATA = [
  {
    id: 1,
    dimension: "Finance",
    intitule: "Comment gérez-vous la comptabilité et le suivi financier de votre entreprise?",
    options: [
      { label: "Comptabilité formalisée avec un expert-comptable et tableaux de bord réguliers", points: 10 },
      { label: "Tenue comptable basique en interne (cahier ou tableur simple)", points: 5 },
      { label: "Absence de suivi comptable formel ou confusion comptes perso/pro", points: 0 }
    ]
  },
  //... garde toutes tes autres questions ici
  {
    id: 9,
    dimension: "Digitalisation",
    intitule: "Comment sécurisez-vous vos données professionnelles?",
    options: [
      { label: "Sauvegardes cloud automatisées et politiques de sécurité appliquées", points: 10 },
      { label: "Sauvegardes manuelles occasionnelles sur disque dur ou clé USB", points: 5 },
      { label: "Aucune sauvegarde formalisée", points: 0 }
    ]
  }
];

export default function App() {
  const [step, setStep] = useState('welcome');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(false);
  const navRef = useRef(null);

  const questions = QUESTIONS_DATA;

  const handleSelectOption = (questionId, points) => {
    setAnswers({...answers, [questionId]: points });
    setTimeout(() => { navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
  };

  const handlePrevious = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitDiagnostic();
    }
  };

  const submitDiagnostic = () => {
    setLoading(true);
    setTimeout(() => {
      //... ta logique de calcul reste identique...
      let financeTotal = 0, financeMax = 0;
      let commercialTotal = 0, commercialMax = 0;
      let digitalTotal = 0, digitalMax = 0;

      questions.forEach((q) => {
        const pts = answers[q.id]!== undefined? answers[q.id] : 0;
        const maxPts = Math.max(...q.options.map(o => o.points));
        if (q.dimension === "Finance") { financeTotal += pts; financeMax += maxPts; }
        else if (q.dimension === "Commercial") { commercialTotal += pts; commercialMax += maxPts; }
        else if (q.dimension === "Digitalisation") { digitalTotal += pts; digitalMax += maxPts; }
      });

      const scoreFinance = financeMax > 0? Math.round((financeTotal / financeMax) * 100) : 0;
      const scoreCommercial = commercialMax > 0? Math.round((commercialTotal / commercialMax) * 100) : 0;
      const scoreDigital = digitalMax > 0? Math.round((digitalTotal / digitalMax) * 100) : 0;
      const scoreGlobal = Math.round((scoreFinance + scoreCommercial + scoreDigital) / 3);

      //... garde tout ton if/else pour synthese...

      setDiagnostic({ /*... ton objet diagnostic... */
        score_global: scoreGlobal, synthese: "Test",
        scores_par_axe: { Finance: scoreFinance, Commercial: scoreCommercial, Digitalisation: scoreDigital },
        points_forts: ["Test"], axes_amelioration: ["Test"], recommandation_prioritaire: "Test"
      });

      setLoading(false);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const resetTest = () => {
    setAnswers({}); setCurrentQ(0); setStep('welcome'); setDiagnostic(null);
  };

  if (step === 'welcome') {
    return (
      <div className="container">
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" /> {/* <-- LOGO ICI */}
        <h1>Diagnostic ALODO MPME</h1>
        <p className="subtitle">Évaluez la maturité financière, commerciale et numérique de votre entreprise en 2 minutes.</p>
        <button onClick={() => setStep('quiz')} className="btn-start">Démarrer le diagnostic</button>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = questions[currentQ];
    if (!q) return <div className="container"><h2>Chargement...</h2></div>;
    const isAnswered = answers[q.id]!== undefined;

    return (
      <div className="container">
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" /> {/* <-- LOGO ICI */}
        <div className="question-block">
          <h2><span className="badge">Question {currentQ + 1} / {questions.length}</span> Axe: {q.dimension}</h2>
          <h3>{q.intitule}</h3>
          <div className="options">
            {q.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleSelectOption(q.id, opt.points)} className={answers[q.id] === opt.points? "selected" : ""}>
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="navigation" ref={navRef}>
          <button onClick={handlePrevious} disabled={currentQ === 0} className="btn-secondary">← Précédent</button>
          <button onClick={handleNext} disabled={!isAnswered} className="btn-primary">
            {loading? "Analyse..." : currentQ === questions.length - 1? "Voir les résultats →" : "Suivant →"}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'results' && diagnostic) {
    return (
      <div className="container">
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" /> {/* <-- LOGO ICI */}
        <div className="result-header">
          <h2 className="result-title">Bilan de votre Diagnostic</h2>
          <div className="score-global-card">
            <p className="score-main">Score Global : <span>{diagnostic.score_global}</span>/100</p>
            <p className="score-synthese">"{diagnostic.synthese}"</p>
          </div>
        </div>
        {/*... le reste de tes resultats... */}
        <button onClick={resetTest} className="btn-start">🔄 Refaire le test</button>
      </div>
    );
  }

  return null;
}
