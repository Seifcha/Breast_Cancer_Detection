# 🏥 Plateforme de Détection du Cancer du Sein

Application web médicale professionnelle pour la détection du cancer du sein utilisant React, TypeScript et TailwindCSS.

![Medical Dashboard](https://img.shields.io/badge/Medical-Dashboard-pink)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan)

## 🌟 Fonctionnalités

- **Interface Médicale Professionnelle**: Design moderne et responsive avec palette de couleurs médicales (rose/blanc/bleu)
- **Authentification Docteur**: Connexion sécurisée avec code docteur (166JMT8965)
- **Dashboard Patient**: Tableau de bord complet avec liste de patients et barre de recherche
- **Diagnostic IA**: Détection simulée du cancer du sein à partir d'images mammographiques
- **Affichage des Résultats**: Page de résultats détaillée avec scores de confiance et indicateurs visuels
- **Upload de Fichiers**: Support des images (PNG, JPG, JPEG) et PDF
- **Modale Professionnelle**: Fenêtre d'information patient élégante au lieu d'alertes JavaScript
- **Design Responsive**: Fonctionne parfaitement sur desktop, tablette et mobile

## 📁 Structure du Projet

```
BreastCancer/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx          # Sidebar avec liste patients et recherche
│   │   └── Modal.tsx             # Composant modale réutilisable
│   ├── pages/
│   │   ├── Login.tsx             # Page de connexion (code docteur)
│   │   ├── Home.tsx              # Dashboard avec formulaire patient
│   │   └── Results.tsx           # Page de résultats du diagnostic
│   ├── App.tsx                   # Configuration du routeur
│   ├── main.tsx                  # Point d'entrée de l'app
│   └── index.css                 # Styles TailwindCSS
├── tailwind.config.js            # Configuration TailwindCSS
├── postcss.config.js             # Configuration PostCSS
└── package.json                  # Dépendances Node
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn

### Installation

1. **Installer les dépendances:**
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement:**
   ```bash
   npm run dev
   ```

3. **Ouvrir le navigateur:**
   Naviguer vers `http://localhost:5173`

## 📱 Aperçu des Pages

### 1. Page de Connexion (`/`)
- Authentification avec code docteur
- Code requis: `166JMT8965`
- Mot de passe: minimum 6 caractères
- Validation des formulaires
- Redirection vers `/home` après connexion réussie

### 2. Dashboard (`/home`)
- **Sidebar Gauche**:
  - Barre de recherche par ID patient
  - Liste scrollable de patients (8 patients de démonstration)
  - Bouton "Consulter" pour chaque patient
  - Sélection active avec surbrillance
  
- **Zone de Contenu Principale**:
  - Formulaire de création de rapport patient
  - Champs: Nom, ID, Description du rapport
  - Upload d'image mammographique ou PDF
  - Aperçu de l'image/PDF
  - Bouton "Créer le Rapport Patient"

### 3. Page de Résultats (`/results`)
- Informations du patient
- Diagnostic IA (Bénin/Malin) avec code couleur
- Score de confiance avec barre de progression
- Aperçu de l'image mammographique
- Bouton "Retour au Dashboard"
- Fonctionnalité d'impression

## 🎨 Système de Design

### Palette de Couleurs

**Rose Médical (Primaire):**
- `medical-pink-50`: #fdf2f8 (le plus clair)
- `medical-pink-500`: #ec4899 (principal)
- `medical-pink-600`: #db2777 (hover)
- `medical-pink-700`: #be185d (foncé)

**Bleu Médical (Secondaire):**
- `medical-blue-50`: #eff6ff (le plus clair)
- `medical-blue-500`: #3b82f6 (principal)
- `medical-blue-600`: #2563eb (hover)
- `medical-blue-700`: #1d4ed8 (foncé)

### Typographie

- **Police**: Inter (Google Fonts)
- **Poids**: 300, 400, 500, 600, 700

### Composants

- `.card`: Carte blanche avec ombre et coins arrondis
- `.btn-primary`: Bouton rose primaire
- `.btn-secondary`: Bouton bleu secondaire
- `.input-field`: Champ de formulaire stylisé
- `.medical-gradient`: Dégradé de fond médical

## 🔑 Authentification

**Code Docteur:** `166JMT8965`
**Mot de passe:** N'importe quel mot de passe de 6+ caractères

## 📊 Diagnostic IA

Le diagnostic est actuellement **simulé** pour des fins de démonstration:
- Résultat aléatoire: Bénin ou Malin
- Score de confiance: 75-100%
- Délai de traitement simulé: 2 secondes

Pour intégrer un vrai modèle IA:
1. Entraîner votre modèle de détection du cancer du sein
2. Créer une API backend (Flask, FastAPI, etc.)
3. Mettre à jour `handleSubmit` dans `Home.tsx` pour appeler votre API

## 🧪 Tests

### Liste de Vérification Manuelle

- [ ] La page de connexion valide correctement le code docteur
- [ ] La navigation entre les pages fonctionne
- [ ] La barre de recherche filtre les patients par ID
- [ ] Le bouton "Consulter" ouvre la modale
- [ ] La modale affiche les informations du patient
- [ ] Les boutons "Modifier" et "Imprimer" fonctionnent
- [ ] Le formulaire patient accepte toutes les entrées
- [ ] L'upload d'image et de PDF fonctionne
- [ ] L'aperçu de l'image s'affiche correctement
- [ ] L'aperçu PDF affiche l'icône
- [ ] La soumission du formulaire navigue vers `/results`
- [ ] La page de résultats affiche toutes les données
- [ ] Le design responsive fonctionne sur mobile/tablette

## 🔧 Configuration

### TailwindCSS

Configuration personnalisée dans `tailwind.config.js`:
- Palette de couleurs médicales étendue
- Police personnalisée (Inter)
- Chemins de contenu pour les composants React

### Vite

Le serveur de développement tourne sur le port 5173 par défaut.

## 📝 Améliorations Futures

- [ ] Intégration d'un vrai modèle IA
- [ ] Base de données pour les dossiers patients
- [ ] Authentification JWT
- [ ] Historique des diagnostics
- [ ] Export PDF des rapports
- [ ] Support multilingue
- [ ] Mode sombre
- [ ] Notifications par email

## ⚠️ Avertissement

Cette application est à des fins éducatives et de démonstration uniquement. Elle NE DOIT PAS être utilisée pour un diagnostic médical réel sans validation appropriée, approbation réglementaire et intégration avec des modèles IA certifiés.

## 📄 Licence

MIT License

## 👨‍⚕️ Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.

---

**Construit avec ❤️ pour de meilleurs soins de santé**
