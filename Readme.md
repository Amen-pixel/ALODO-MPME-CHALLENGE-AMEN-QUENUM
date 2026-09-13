# ALODO MPME - Prototype de Diagnostic

> Prototype interactif développé dans le cadre du challenge technique **ALODO TECH** pour évaluer la maturité des MPME.


1. Présentation
Ce projet est un prototype fonctionnel d'interface de diagnostic pour le programme ALODO MPME. Il permet de guider un entrepreneur à travers un parcours de questions structuré, d'analyser ses réponses en temps réel et de lui restituer un bilan synthétique sous forme de score global, de scores par axe, de points forts, d'axes d'amélioration et de recommandations prioritaires.

2. Choix produit
Pour ce prototype, le périmètre a été volontairement recentré sur 3 dimensions clés parmi les 8 du programme global, garantissant à la fois la pertinence métier et la concision :

Finance : Analyse de la gestion de trésorerie et de la séparation des dépenses personnelles/professionnelles.

Commercial : Évaluation des méthodes de prospection et de la gestion de la relation client.

Digitalisation : Utilisation des outils numériques et des solutions de paiement adaptées au marché local.

3. Choix techniques
Front-end : React (Vite) pour une interface ultra-réactive, modulaire et fluide.

Stylisation : CSS moderne (Flexbox, variables CSS, design responsive) inspiré de la charte graphique d'ALODO TECH.

Architecture : Séparation propre des composants et communication avec une API (ou structure de données mockées) pour assurer l'extensibilité du projet.

4. Installation et Lancement
Suivez les étapes ci-dessous pour lancer le projet en local :

Bash
# Cloner le dépôt
git clone [https://github.com/votre-nom/ALODO-MPME-CHALLENGE-](https://github.com/votre-nom/ALODO-MPME-CHALLENGE-)[PRENOM-NOM].git

# Accéder au dossier du projet
cd [nom-du-dossier]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
5. Fonctionnalités
Écran d'accueil interactif aux couleurs d'ALODO TECH.

Parcours de questions dynamique avec indicateur de progression en temps réel.

Navigation intuitive (boutons Suivant / Précédent avec validation obligatoire des réponses).

Tableau de bord des résultats affichant :

Le score global de maturité sur 100.

Les scores ventilés par axe (Finance, Commercial, Digitalisation).

Une synthèse automatisée.

Les points forts et axes d'amélioration.

Une recommandation prioritaire sur-mesure.

6. Limites
Absence de persistance en base de données relationnelle (les données de diagnostic ne sont pas stockées à long terme).

Périmètre restreint à 3 dimensions et un nombre réduit de questions (conformément aux consignes du challenge).

Pas de système d'authentification utilisateur (parcours anonyme).

7. Améliorations (Futures)
Implémentation d'un diagnostic adaptatif (le questionnaire s'adapte dynamiquement en fonction du secteur d'activité ou de la taille de l'entreprise).

Ajout d'un export du rapport au format PDF.

Intégration d'un dashboard administrateur pour suivre les statistiques globales des MPME évaluées.



Note de Réflexion Produit / Bonus
Vers un Diagnostic Adaptatif et Intelligent pour ALODO MPME
Dans le cadre de l'extension future d'ALODO MPME à grande échelle, l'évolution la plus stratégique consisterait à faire passer le système d'un questionnaire linéaire à un diagnostic adaptatif.

Qualification Initiale (Segment) :
Dès l'introduction, l'entrepreneur renseignerait son secteur (ex: Négoce/Commerce, Services, Industrie/Production) et sa taille (ex: entreprise individuelle vs 10+ salariés).

Arbre de Décision Dynamique :

Une entreprise de négoce se verrait immédiatement poser des questions approfondies sur la gestion des stocks, des fournisseurs et la rotation de trésorerie.

Une entreprise de services basculerait plutôt sur des questions liées à la structuration des contrats, la facturation et la dépendance aux compétences clés.

Gains pour l'écosystème ALODO :
Cette personnalisation permettrait d'affiner la pertinence des recommandations, de qualifier plus précisément le profil des MPME pour de futures opportunités de financement, et d'offrir une expérience utilisateur hautement personnalisée, renforçant ainsi l'impact d'ALODO TECH sur le terrain.
