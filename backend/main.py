import json
import os
from typing import Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="ALODO MPME Diagnostic API", version="1.0.0")

# Configuration du CORS pour autoriser React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Ajoute ton domaine Vercel ici en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement du questionnaire JSON
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(BASE_DIR, "questions.json")

def load_questions():
    try:
        with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Fichier questions.json introuvable")

QUESTIONS = load_questions()

class AssessmentSubmission(BaseModel):
    answers: Dict[str, int]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "API Diagnostic ALODO MPME opérationnelle"}

@app.get("/api/questions")
def get_questions():
    """Retourne la liste des questions au Frontend."""
    return QUESTIONS

@app.post("/api/diagnostiquer")
def calculate_diagnostic(submission: AssessmentSubmission):
    """Calcule les scores et génère le bilan."""
    user_answers = submission.answers
    if not user_answers:
        raise HTTPException(status_code=400, detail="Aucune réponse fournie")

    # Structures de suivi des scores par dimension
    dimension_scores = {"Finance": 0, "Commercial": 0, "Digitalisation": 0}
    dimension_max = {"Finance": 0, "Commercial": 0, "Digitalisation": 0}

    for q in QUESTIONS:
        q_id = q["id"]
        dim = q["dimension"]
        max_pts = max(opt["points"] for opt in q["options"])

        dimension_max[dim] += max_pts
        if q_id in user_answers:
            dimension_scores[dim] += user_answers[q_id]

    # Calcul des pourcentages par dimension
    dimension_results = {}
    for dim in dimension_scores:
        max_possible = dimension_max[dim]
        score_obtained = dimension_scores[dim]
        pct = round((score_obtained / max_possible) * 100) if max_possible > 0 else 0
        dimension_results[dim] = pct

    # Score global
    global_score = round(sum(dimension_results.values()) / len(dimension_results))

    # Analyse des points forts et faibles
    strengths = []
    weaknesses = []
    for dim, score in dimension_results.items():
        if score >= 80:
            strengths.append(f"Excellence : Maîtrise avancée du volet {dim} ({score}%).")
        elif score >= 70:
            strengths.append(f"Solide : Bonne maîtrise du volet {dim} ({score}%).")
        elif score < 50:
            weaknesses.append(f"Point mort critique : Niveau insuffisant sur {dim} ({score}%). Nécessite action urgente.")
        elif score < 70:
            weaknesses.append(f"Axe à consolider : Le volet {dim} ({score}%) doit être structuré.")

    if not strengths:
        strengths.append("Potentiel de progression identifié sur l'ensemble des axes.")
    if not weaknesses:
        weaknesses.append("Aucune faiblesse critique majeure observée. Continuez.")

    # Recommandation prioritaire sur l'axe le plus faible
    lowest_dim = min(dimension_results, key=dimension_results.get)

    recommendations_db = {
        "Finance": "URGENCE : Séparez vos comptes et mettez en place un tableau de suivi de trésorerie mensuel. Utilisez Mobile Money Pro.",
        "Commercial": "URGENCE : Créez un fichier client sur Google Sheet. Lancez 1 campagne de relance WhatsApp cette semaine.",
        "Digitalisation": "URGENCE : Passez sur WhatsApp Business et ouvrez un compte marchand. Digitalisez vos factures."
    }
    if global_score >= 80:
        recommandation = "Consolidez votre leadership. Passez à l'automatisation avancée et à l'export."
    else:
        recommandation = recommendations_db.get(lowest_dim)

    return {
        "score_global": global_score,
        "synthese": "Entreprise mature" if global_score >= 80 else "Entreprise en consolidation" if global_score >= 50 else "Situation critique nécessitant des actions immédiates.",
        "scores_par_dimension": dimension_results,
        "points_forts": strengths,
        "points_faibles": weaknesses,
        "recommandation_prioritaire": recommandation
    }
