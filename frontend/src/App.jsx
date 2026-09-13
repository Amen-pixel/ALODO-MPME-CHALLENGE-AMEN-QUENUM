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
  {
    id: 2,
    dimension: "Finance",
    intitule: "Disposez-vous d'un budget prévisionnel ou d'un plan de trésorerie?",
    options: [
      { label: "Oui, actualisé mensuellement avec anticipation des flux", points: 10 },
      { label: "De manière ponctuelle ou intuitive", points: 5 },
      { label: "Non, pilotage au jour le jour", points: 0 }
    ]
  },
  {
    id: 3,
    dimension: "Finance",
    intitule: "Comment évaluez-vous la rentabilité de vos produits ou services?",
    options: [
      { label: "Calcul précis des marges par produit/service (coûts complets)", points: 10 },
      { label: "Estimation globale de la marge bénéficiaire", points: 5 },
      { label: "Pas de calcul de rentabilité précis", points: 0 }
    ]
  },
  {
    id: 4,
    dimension: "Commercial",
    intitule: "Quelle est votre méthode de prospection et de gestion client (CRM)?",
    options: [
      { label: "Outil CRM structuré et stratégie de prospection active multicanal", points: 10 },
      { label: "Fichier de suivi clients (Excel) et bouche-à-oreille entretenu", points: 5 },
      { label: "Pas de suivi formalisé, dépendance totale aux clients spontanés", points: 0 }
    ]
  },
  {
    id: 5,
    dimension: "Commercial",
    intitule: "Comment analysez-vous la satisfaction de vos clients?",
    options: [
      { label: "Enquêtes de satisfaction régulières et indicateurs de fidélisation suivis", points: 10 },
      { label: "Retours informels lors des échanges", points: 5 },
      { label: "Aucun suivi de la satisfaction client", points: 0 }
    ]
  },
  {
    id: 6,
    dimension: "Commercial",
    intitule: "Avez-vous formalisé une stratégie de prix (pricing) claire?",
    options: [
      { label: "Politique tarifaire documentée basée sur le marché et les coûts", points: 10 },
      { label: "Tarifs fixés par rapport à la concurrence directe", points: 5 },
      { label: "Tarifs fixés au jugé ou au cas par cas", points: 0 }
    ]
  },
  {
    id: 7,
    dimension: "Digitalisation",
    intitule: "Quel est le niveau de présence numérique de votre entreprise?",
    options: [
      { label: "Site web professionnel actif et réseaux sociaux gérés stratégiquement", points: 10 },
      { label: "Présence basique (simple page ou profil social non mis à jour)", points: 5 },
      { label: "Aucune visibilité ou présence en ligne", points: 0 }
    ]
  },
  {
    id: 8,
    dimension: "Digitalisation",
    intitule: "Quels outils numériques utilisez-vous pour vos opérations quotidiennes?",
    options: [
      { label: "Logiciels cloud intégrés (facturation, gestion de stock, collaboration)", points: 10 },
      { label: "Outils bureautiques classiques (Word, Excel, e-mails basiques)", points: 5 },
      { label: "Processus essentiellement manuels ou sur papier", points: 0 }
    ]
  },
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

      let synthese = "";
      let points_forts = [];
      let axes_amelioration = [];
      let recommandation_prioritaire = "";

      if (scoreGlobal >= 80) {
        synthese = "Organisation mature dotée de processus solides et d'une vision stratégique structurée.";
        points_forts = ["Excellente maîtrise des équilibres financiers et opérationnels.", "Processus commerciaux et numériques solidement ancrés."];
        axes_amelioration = ["Optimisation continue de l'automatisation avancée.", "Veille stratégique accrue pour maintenir l'avantage concurrentiel."];
        recommandation_prioritaire = "Consolidez votre leadership en explorant des leviers d'innovation disruptive et d'expansion à l'international.";
      } else if (scoreGlobal >= 50) {
        synthese = "Structure en phase de consolidation intermédiaire présentant des bases saines mais des zones de vulnérabilité opérationnelle.";
        points_forts = ["Bonne conscience des enjeux de gestion et de développement commercial.", "Disponibilité de données de base pour amorcer le pilotage."];
        axes_amelioration = ["Formalisation insuffisante des outils de prévision budgétaire.", "Niveau de digitalisation encore perfectible pour fluidifier la croissance."];
        recommandation_prioritaire = "Structurez un tableau de bord de pilotage mensuel et formalisez vos procédures commerciales pour sécuriser votre croissance.";
      } else {
        synthese = "Situation critique nécessitant une refonte urgente des fondamentaux de gestion, de prospection et de sécurisation.";
        points_forts = ["Agilité opérationnelle de terrain et réactivité face aux urgences."];
        axes_amelioration = ["Absence critique de visibilité financière et de plan de trésorerie.", "Dépendance excessive aux méthodes informelles.", "Retard prononcé en matière de digitalisation."];
        recommandation_prioritaire = "Mettez en place immédiate un plan de redressement de trésorerie, séparez rigoureusement les comptes et adoptez des outils de gestion formalisés.";
      }

      setDiagnostic({
        score_global: scoreGlobal,
        synthese,
        scores_par_axe: { Finance: scoreFinance, Commercial: scoreCommercial, Digitalisation: scoreDigital },
        points_forts,
        axes_amelioration,
        recommandation_prioritaire
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
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" />
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
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" />
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
        <img src="/logo-alodo.png" alt="ALODO TECH Logo" className="logo-alodo" />
        <div className="result-header">
          <h2 className="result-title">Bilan de votre Diagnostic</h2>
          <div className="score-global-card">
            <p className="score-main">Score Global : <span>{diagnostic.score_global}</span>/100</p>
            <p className="score-synthese">"{diagnostic.synthese}"</p>
          </div>
        </div>
        <div className="scores-grid">
          <div className="score-item"><p className="score-item-label">Finance</p><p className="score-item-value">{diagnostic.scores_par_axe.Finance}%</p></div>
          <div className="score-item"><p className="score-item-label">Commercial</p><p className="score-item-value">{diagnostic.scores_par_axe.Commercial}%</p></div>
          <div className="score-item"><p className="score-item-label">Digitalisation</p><p className="score-item-value">{diagnostic.scores_par_axe.Digitalisation}%</p></div>
        </div>
        <div className="result-card">
          <h3>✅ Points forts</h3>
          <ul>{diagnostic.points_forts.map((pf, i) => <li key={i}>{pf}</li>)}</ul> {/* CORRIGÉ ICI: plus de • */}
        </div>
        <div className="result-card">
          <h3>⚠️ Axes d'amélioration critiques</h3>
          <ul>{diagnostic.axes_amelioration.map((ax, i) => <li key={i}>{ax}</li>)}</ul> {/* CORRIGÉ ICI: plus de • */}
          <h3>🎯 Recommandation stratégique prioritaire</h3>
          <div className="reco-box">{diagnostic.recommandation_prioritaire}</div>
        </div>
        <button onClick={resetTest} className="btn-start">🔄 Refaire le test</button>
      </div>
    );
  }
  return null;
}
