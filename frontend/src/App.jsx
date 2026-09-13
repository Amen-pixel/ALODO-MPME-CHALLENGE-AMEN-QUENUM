import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function App() {
  const [step, setStep] = useState('welcome');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navRef = useRef(null);

  // 1. CHARGEMENT DES QUESTIONS QUAND ON PASSE EN MODE QUIZ
  useEffect(() => {
    if(step === 'quiz' && questions.length === 0){
      setLoading(true);
      setError(null);
      fetch(`${API_URL}/questions`)
       .then(res => {
          if(!res.ok) throw new Error(`Erreur ${res.status}`);
          return res.json();
        })
       .then(data => {
          setQuestions(data);
          setLoading(false);
        })
       .catch(err => {
          console.error(err);
          setError("Impossible de joindre le backend. Lance `uvicorn main:app --reload`");
          setLoading(false);
        });
    }
  }, [step, questions.length]);

  const handleSelectOption = (questionId, points) => {
    setAnswers({...answers, [questionId]: points });
    setTimeout(() => { navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
  };

  const handlePrevious = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitDiagnostic();
    }
  };

  // 2. ENVOI DES REPONSES AU BACKEND
  const submitDiagnostic = () => {
    setLoading(true);
    fetch(`${API_URL}/diagnostiquer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
   .then(res => res.json())
   .then(data => {
      // Mapping pour adapter le backend au frontend
      setDiagnostic({
        score_global: data.score_global,
        synthese: data.synthese,
        scores_par_axe: data.scores_par_dimension,
        points_forts: data.points_forts,
        axes_amelioration: data.points_faibles,
        recommandation_prioritaire: data.recommandation_prioritaire
      });
      setLoading(false);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
   .catch(err => {
      console.error(err);
      setError("Erreur lors du calcul du diagnostic");
      setLoading(false);
    });
  };

  const resetTest = () => {
    setAnswers({});
    setCurrentQ(0);
    setStep('welcome');
    setDiagnostic(null);
    setError(null);
    setQuestions([]); // Pour recharger les questions si besoin
  };

  // PAGE D'ACCUEIL
  if (step === 'welcome') {
    return (
      <div className="container">
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" />
        <h1>Diagnostic ALODO MPME</h1>
        <p className="subtitle">Évaluez la maturité financière, commerciale et numérique de votre entreprise en 2 minutes.</p>
        <button onClick={() => setStep('quiz')} className="btn-start">Démarrer le diagnostic</button>
      </div>
    );
  }

  // PAGE DES QUESTIONS
  if (step === 'quiz') {
    if(loading) return <div className="container"><h2>Chargement des questions...</h2></div>
    if(error) return <div className="container"><h2 style={{color: 'red', textAlign: 'center'}}>{error}</h2><button onClick={resetTest} className="btn-start">Retour</button></div>
    if(questions.length === 0) return <div className="container"><h2>Aucune question trouvée</h2></div>

    const q = questions[currentQ];
    if(!q) return <div className="container"><h2>Chargement...</h2></div> // Sécurité anti-crash

    const isAnswered = answers[q.id]!== undefined;

    return (
      <div className="container">
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" />
        <div className="question-block">
          <div className="progress-bar">
            <div className="progress" style={{width: `${((currentQ + 1) / questions.length) * 100}%`}}></div>
          </div>
          <h2><span className="badge">Question {currentQ + 1} / {questions.length}</span> Axe: {q.dimension}</h2>
          <h3>{q.intitule}</h3>
          <div className="options">
            {q.options.map((opt, idx) => (
              <button
                key={q.id + idx}
                onClick={() => handleSelectOption(q.id, opt.points)}
                className={answers[q.id] === opt.points? "selected" : ""}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="navigation" ref={navRef}>
          <button onClick={handlePrevious} disabled={currentQ === 0} className="btn-secondary">← Précédent</button>
          <button onClick={handleNext} disabled={!isAnswered || loading} className="btn-primary">
            {loading? "Analyse..." : currentQ === questions.length - 1? "Voir les résultats →" : "Suivant →"}
          </button>
        </div>
      </div>
    );
  }

  // PAGE DES RESULTATS
  if (step === 'results' && diagnostic) {
    return (
      <div className="container">
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" />

        <div className="result-header">
          <h2 className="result-title">Bilan de votre Diagnostic</h2>
          <div className="score-global-card">
            <p className="score-main">Score Global : <span>{diagnostic.score_global}</span>/100</p>
            <p className="score-synthese">{diagnostic.synthese}</p>
          </div>
        </div>

        <div className="scores-grid">
          <div className="score-item"><p className="score-item-label">Finance</p><p className="score-item-value">{diagnostic.scores_par_axe.Finance}%</p></div>
          <div className="score-item"><p className="score-item-label">Commercial</p><p className="score-item-value">{diagnostic.scores_par_axe.Commercial}%</p></div>
          <div className="score-item"><p className="score-item-label">Digitalisation</p><p className="score-item-value">{diagnostic.scores_par_axe.Digitalisation}%</p></div>
        </div>

        <div className="result-card">
          <h3>✅ Points forts</h3>
          <ul>{diagnostic.points_forts.map((pf, i) => <li key={i}>• {pf}</li>)}</ul>
        </div>

        <div className="result-card">
          <h3>⚠️ Axes d'amélioration critiques</h3>
          <ul>{diagnostic.axes_amelioration.map((ax, i) => <li key={i}>• {ax}</li>)}</ul>
          <h3>🎯 Recommandation stratégique prioritaire</h3>
          <div className="reco-box">{diagnostic.recommandation_prioritaire}</div>
        </div>

        <button onClick={resetTest} className="btn-start">🔄 Refaire le test</button>
      </div>
    );
  }

  return null;
}
