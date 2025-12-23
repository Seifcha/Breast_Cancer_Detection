# 🚀 Guide de Démarrage Rapide

## Installation et Lancement

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer l'application
```bash
npm run dev
```

### 3. Ouvrir dans le navigateur
Naviguer vers: **http://localhost:5173**

---

## 🔐 Connexion

**Code Docteur:** `166JMT8965`  
**Mot de passe:** N'importe quel mot de passe (minimum 6 caractères)

---

## 📋 Fonctionnalités Principales

### 1. **Recherche de Patients**
- Utilisez la barre de recherche en haut de la sidebar
- Tapez l'ID du patient (ex: "P001")
- La liste se filtre automatiquement

### 2. **Consulter un Patient**
- Cliquez sur le bouton bleu **"Consulter"** pour n'importe quel patient
- Une modale s'ouvre avec les informations du patient
- **Bouton Modifier**: Affiche un message (fonctionnalité à implémenter)
- **Bouton Imprimer**: Ouvre la boîte de dialogue d'impression

### 3. **Créer un Rapport Patient**
1. Remplissez le formulaire:
   - Nom du patient
   - ID du patient
   - Description du rapport
2. Uploadez une image mammographique OU un fichier PDF
3. Cliquez sur **"Créer le Rapport Patient"**
4. Attendez 2 secondes (simulation du traitement IA)
5. Visualisez les résultats du diagnostic

### 4. **Page de Résultats**
- Affiche le diagnostic IA (Bénin ou Malin)
- Score de confiance (75-100%)
- Informations du patient
- Image/PDF uploadé
- Bouton pour retourner au dashboard

---

## 🎨 Types de Fichiers Supportés

**Images:**
- PNG
- JPG / JPEG
- GIF

**Documents:**
- PDF

---

## ⚡ Raccourcis Clavier

- **F5** ou **Ctrl+R**: Rafraîchir la page
- **Ctrl+P**: Imprimer (sur la page de résultats)
- **Échap**: Fermer la modale

---

## 🐛 Dépannage

### La page est blanche
- Vérifiez que `npm run dev` est en cours d'exécution
- Rafraîchissez la page (F5)
- Vérifiez la console du navigateur (F12)

### Les styles ne s'affichent pas
- Assurez-vous que TailwindCSS est installé
- Redémarrez le serveur de développement
- Videz le cache du navigateur

### Le code docteur ne fonctionne pas
- Utilisez exactement: `166JMT8965`
- Vérifiez qu'il n'y a pas d'espaces
- Le mot de passe doit avoir au moins 6 caractères

---

## 📞 Besoin d'Aide?

Consultez le **README.md** pour la documentation complète.

---

**Bon diagnostic! 🏥💻**
