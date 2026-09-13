import { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  const [step, setStep] = useState('welcome');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/questions')
    .then((res) => res.json())
    .then((data) => setQuestions(data))
    .catch((err) => console.error("Erreur de chargement des questions:", err));
  }, []);

  const handleSelectOption = (questionId, points) => {
    setAnswers({...answers, [questionId]: points });

    setTimeout(() => {
      navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitDiagnostic();
    }
  };

  // FONCTION QUI CALCULE LES 3 AXES
  const calculateScores = () => {
    let finance = { total: 0, count: 0 };
    let commercial = { total: 0, count: 0 };
    let digital = { total: 0, count: 0 };

    questions.forEach(q => {
      const points = answers[q.id] || 0;
      const maxPoints = Math.max(...q.options.map(o => o.points));
      const scorePercent = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

      const dim = q.dimension.toLowerCase();
      
      if (dim.includes('financ')) {
        finance.total += scorePercent;
        finance.count++;
      } else if (dim.includes('commercial') || dim.includes('vente')) {
        commercial.total += scorePercent;
        commercial.count++;
      } else if (dim.includes('digital') || dim.includes('numérique') || dim.includes('tech')) {
        digital.total += scorePercent;
        digital.count++;
      }
    });

    return {
      Finance: finance.count > 0 ? Math.round(finance.total / finance.count) : 0,
      Commercial: commercial.count > 0 ? Math.round(commercial.total / commercial.count) : 0,
      Digitalisation: digital.count > 0 ? Math.round(digital.total / digital.count) : 0,
    };
  };

  const submitDiagnostic = async () => {
    setLoading(true);
    try {
      // 1. On appelle le backend pour score global + reco + synthese
      const res = await fetch('http://127.0.0.1:8000/api/diagnostiquer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();

      // 2. On calcule nous même les 3 scores par axe
      const scores_par_axe = calculateScores();

      // 3. On fusionne et on affiche
      setDiagnostic({...data, scores_par_axe });
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Erreur lors du diagnostic:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetTest = () => {
    setAnswers({});
    setCurrentQ(0);
    setStep('welcome');
    setDiagnostic(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (step === 'welcome') {
    return (
      <div className="container">
        <img src="/logo-alodo.png" alt="ALODO TECH" className="logo-alodo" />

        <h1>Diagnostic ALODO MPME</h1>
        <p className="subtitle">
          Évaluez la maturité financière, commerciale et numérique de votre entreprise en quelques clics.
        </p>

        <button onClick={() => setStep('quiz')} className="btn-start" disabled={questions.length === 0}>
          {questions.length > 0? "Démarrer le diagnostic" : "Chargement des questions..."}
        </button>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = questions[currentQ];
    if (!q) return <div className="container"><p>Chargement...</p></div>;

    const isAnswered = answers[q.id]!== undefined;

    return (
      <div className="container">
        <div className="question-block">
          <h2>
            Question {currentQ + 1} / {questions.length}
            <span className="badge">{q.dimension}</span>
          </h2>
          <h3>{q.intitule}</h3>

          <div className="options">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(q.id, opt.points)}
                className={answers[q.id] === opt.points? "selected" : ""}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span>{opt.label || opt.texte}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="navigation" ref={navRef}>
          <button
            onClick={() => { setCurrentQ(currentQ - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentQ === 0}
            className="btn-secondary"
          >
            ← Précédent
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered || loading}
            className="btn-primary"
          >
            {loading? "Calcul..." : currentQ === questions.length - 1? "Voir les résultats →" : "Suivant →"}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'results' && diagnostic) {
    return (
      <div className="container">

        <div className="result-header">
          <h1 className="result-title">Bilan de votre Diagnostic</h1>
        </div>

        {/* CARTE SCORE GLOBAL */}
        <div className="score-global-card">
          <div className="score-main">
            ALODO MPME Score — <span>{diagnostic.score_global}/100</span>
          </div>
          {diagnostic.synthese && (
            <p className="score-synthese">"{diagnostic.synthese}"</p>
          )}
        </div>

        {/* GRILLE 3 AXES - MAINTENANT ÇA MARCHE */}
        <div className="scores-grid">
          <div className="score-item">
            <div className="score-item-label">Finance</div>
            <div className="score-item-value">{diagnostic.scores_par_axe.Finance}%</div>
          </div>
          <div className="score-item">
            <div className="score-item-label">Commercial</div>
            <div className="score-item-value">{diagnostic.scores_par_axe.Commercial}%</div>
          </div>
          <div className="score-item">
            <div className="score-item-label">Digitalisation</div>
            <div className="score-item-value">{diagnostic.scores_par_axe.Digitalisation}%</div>
          </div>
        </div>

        {/* CADRE POINTS FORTS */}
        <div className="result-card">
          <h3>✅ Points forts</h3>
          {diagnostic.points_forts?.length > 0? (
            diagnostic.points_forts.map((pf, i) => <p key={i}>• {pf}</p>)
          ) : <p>Aucun point fort majeur identifié.</p>}
        </div>

        {/* CADRE AXES + RECO */}
        <div className="result-card">
          <h3>⚠️ Axes d'amélioration</h3>
          {diagnostic.axes_amelioration?.length > 0? (
            diagnostic.axes_amelioration.map((ax, i) => <p key={i}>• {ax}</p>)
          ) : <p>Aucun axe critique.</p>}

          <h3 style={{marginTop: '20px'}}>🎯 Recommandation prioritaire</h3>
          <div className="reco-box">{diagnostic.recommandation_prioritaire}</div>
        </div>

        <button onClick={resetTest} className="btn-start">
          🔄 Refaire le test
        </button>
      </div>
    );
  }

  return null;
}
