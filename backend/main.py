import json
import os
from typing import Dict, List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="ALODO MPME Diagnostic API")

# Configuration du CORS pour autoriser les requêtes React (Vite / CRA)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier l'URL exacte du frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement du questionnaire JSON
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(BASE_DIR, "questions.json")

def load_questions():
    if os.path.exists(QUESTIONS_FILE):
        with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

# Modèle Pydantic pour recevoir les réponses : {"fin_1": 10, "fin_2": 5, ...}
class AssessmentSubmission(BaseModel):
    answers: Dict[str, int]

@app.get("/")
def read_root():
    return {"message": "API Diagnostic ALODO MPME opérationnelle"}

@app.get("/api/questions")
def get_questions():
    """Retourne la liste des questions au Frontend."""
    return load_questions()

@app.post("/api/diagnostiquer")
def calculate_diagnostic(submission: AssessmentSubmission):
    """Calcule les scores par dimension, le score global et génère le bilan."""
    questions = load_questions()
    user_answers = submission.answers

    # Structures de suivi des scores par dimension
    dimension_scores = {"Finance": 0, "Commercial": 0, "Digitalisation": 0}
    dimension_max = {"Finance": 0, "Commercial": 0, "Digitalisation": 0}

    for q in questions:
        q_id = q["id"]
        dim = q["dimension"]
        max_pts = max(opt["points"] for opt in q["options"])
        
        dimension_max[dim] += max_pts
        if q_id in user_answers:
            dimension_scores[dim] += user_answers[q_id]

    # Calcul des pourcentages par dimension (sur 100)
    dimension_results = {}
    for dim in dimension_scores:
        max_possible = dimension_max[dim]
        score_obtained = dimension_scores[dim]
        pct = round((score_obtained / max_possible) * 100) if max_possible > 0 else 0
        dimension_results[dim] = pct

    # Score global moyen sur 100
    global_score = round(sum(dimension_results.values()) / len(dimension_results))

    # Identification des points forts (>= 70%) et faibles (< 50%)
    strengths = []
    weaknesses = []
    for dim, score in dimension_results.items():
        if score >= 70:
            strengths.append(f"Excellente maîtrise du volet {dim} ({score}%).")
        elif score < 50:
            weaknesses.append(f"Niveau critique sur la dimension {dim} ({score}%).")

    if not strengths:
        strengths.append("Potentiel de progression global identifié sur l'ensemble des axes.")
    if not weaknesses:
        weaknesses.append("Aucune faiblesse critique majeure observée.")

    # Génération des recommandations automatiques selon la dimension la plus faible
    lowest_dim = min(dimension_results, key=dimension_results.get)
    
    recommendations_db = {
        "Finance": "Priorisez la mise en place d'un tableau de suivi de trésorerie strict et séparez immédiatement vos comptes personnels et professionnels.",
        "Commercial": "Structurez votre fichier client sur un outil dédié et mettez en place des campagnes de relance régulières.",
        "Digitalisation": "Adoptez Mobile Money Pro pour vos encaissements et basculez sur WhatsApp Business pour professionnaliser votre relation client."
    }

    recommandation = recommendations_db.get(
        lowest_dim, 
        "Poursuivez la structuration globale de vos processus de gestion."
    )

    return {
        "score_global": global_score,
        "scores_par_dimension": dimension_results,
        "points_forts": strengths,
        "points_faibles": weaknesses,
        "recommandation_prioritaire": recommandation
    }
