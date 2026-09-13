# ALODO MPME - Prototype de Diagnostic et Évaluation de Maturité

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)
![Status](https://img.shields.io/badge/Status-Prototype-FF5A00?style=for-the-badge)

> Prototype interactif et intelligent développé dans le cadre du challenge technique **ALODO TECH** pour évaluer la maturité globale des Micro, Petites et Moyennes Entreprises (MPME) en Afrique de l'Ouest.

## 1. Présentation du Projet
Ce projet est un prototype fonctionnel d'interface de diagnostic pour le programme ALODO MPME. Il a été conçu pour immerger l'entrepreneur dans un parcours d'évaluation fluide et structuré. L'application simule une analyse granulaire de la santé de l'entreprise, transformant des réponses simples à un questionnaire ciblé en un tableau de bord décisionnel clair, doté d'un score global, de scores par axe, de points forts, d'axes d'amélioration et de recommandations stratégiques. 

## 2. Choix Produit et Justification du Périmètre
Pour répondre aux contraintes du challenge tout en maximisant la pertinence métier, le périmètre a été recentré sur 3 dimensions fondamentales issues du référentiel global d'ALODO :  
**Finance** : Analyse critique de la santé financière, de la gestion de la trésorerie et de la séparation impérative entre les comptes personnels et professionnels.  
**Commercial** : Évaluation des méthodes d'acquisition client, des performances de vente et de la structuration de la relation client.  
**Digitalisation** : Mesure de l'adoption des outils numériques, de la présence en ligne et de l'utilisation des solutions de paiement adaptées au marché local (comme Mobile Money).  
Ce choix permet d'offrir une démonstration percutante, ciblée et directement applicable aux réalités des marchés émergents.

## 3. Choix Techniques et Architecture
**Front-end** : Développé avec React (via Vite) pour garantir une réactivité instantanée, une modularité exemplaire des composants et une expérience utilisateur sans latence.  
**Stylisation** : CSS moderne (utilisant les Flexbox, les variables CSS et un design responsive axé Mobile First), reprenant fidèlement l'identité visuelle et la charte graphique d'ALODO TECH (Bleu Nuit, Orange).  
**Architecture des Données** : Gestion d'état locale robuste (useState, useEffect) simulant les appels API de diagnostic pour assurer un rendu dynamique et une évolutivité aisée vers un backend complet. 

## 4. Guide d'Installation et de Lancement
Pour exécuter ce projet en local sur votre machine, suivez les étapes ci-dessous :
```bash
# 1. Cloner le dépôt GitHub
git clone https://github.com/Amen-pixel/ALODO-MPME-CHALLENGE-AMEN-QUENUM.git
# 2. Naviguer dans le dossier du projet
cd ALODO-MPME-CHALLENGE-AMEN-QUENUM
# 3. Installer les dépendances nécessaires
npm install
# 4. Lancer le serveur de développement local
npm run dev

5. Fonctionnalités ImplémentéesÉcran d'accueil immersif : Présentation claire de l'objectif du diagnostic avec le logo ALODO TECH.Parcours interactif dynamique : Navigation fluide entre les questions avec barre de progression implicite.Sécurité et validation : Impossibilité de passer à la question suivante sans réponse. Système Précédent / Suivant.Tableau de bord des résultats complet :Calcul et affichage d'un Score Global de maturité sur 100.Ventilation des scores par axe : Finance, Commercial, Digitalisation.Synthèse textuelle automatisée du profil de l'entreprise.Identification claire des points forts et des axes d'amélioration.Délivrance d'une recommandation prioritaire sur-mesure.

6. Limites Actuelles du PrototypePersistance des données : Les résultats ne sont pas stockés dans une BDD. Pas de stockage long terme côté serveur.Périmètre réduit : Seules 3 dimensions sur les 8 du programme global d'ALODO ont été modélisées.Authentification : Le parcours est entièrement anonyme. Pas d'espace personnel sécurisé pour cette version MVP.

7. Pistes d'Amélioration FuturesDiagnostic Adaptatif Intelligent : Questionnaire en arbre de décision. Les questions s'adaptent selon la taille, le secteur d'activité.Export PDF du Rapport : Permettre de télécharger un compte-rendu officiel et détaillé du diagnostic.Tableau de bord Administrateur : Espace de suivi pour l'équipe ALODO TECH pour qualifier et analyser les données des cohortes de MPME.Développé pour le Challenge Technique ALODO TECH © 2026

