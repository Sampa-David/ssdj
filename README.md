# SSDJ Portfolio

Portfolio personnel utilisant le template Craftivo avec Bootstrap.

## 🚀 Déploiement sur Vercel

### Configuration automatique
Ce projet est configuré pour être déployé automatiquement sur Vercel.

1. **Connectez votre repository GitHub à Vercel**
   - Allez sur https://vercel.com
   - Cliquez sur "New Project"
   - Sélectionnez votre repository `ssdj-Portfolio`

2. **Configuration Vercel**
   - Root Directory: `/` (racine)
   - Framework: `Other` (site statique HTML)
   - Build Command: `npm run build`
   - Output Directory: `.`

### Variables d'environnement
Aucune variable d'environnement requise pour démarrer. Pour activer Vercel Analytics:

```
VERCEL_ANALYTICS_ID=votre_id_vercel
```

## 📊 Analytics et Statistiques

### Vercel Web Analytics
Le dashboard Vercel vous montrera automatiquement:
- ✅ Nombre de visiteurs
- ✅ Pages les plus visitées
- ✅ Temps de chargement
- ✅ Localisation des visiteurs
- ✅ Appareils utilisés
- ✅ Navigateurs utilisés

Pour accéder au dashboard:
1. Allez sur https://vercel.com
2. Sélectionnez votre projet `ssdj-Portfolio`
3. Cliquez sur l'onglet "Analytics"

## 📁 Structure du projet

```
ssdj-Portfolio/
├── index.html              # Page d'accueil (Hero)
├── about.html             # Page À propos
├── resume.html            # Page Curriculum
├── services.html          # Page Services
├── portfolio.html         # Page Portfolio
├── contact.html           # Page Contact
├── assets/                # Ressources (CSS, JS, images)
├── api/                   # Fonctions serverless Vercel
├── vercel.json            # Configuration Vercel
├── package.json           # Dépendances Node
└── README.md              # Ce fichier
```

## 🔗 Pages disponibles

- **Home**: `index.html` - Section Hero avec présentation
- **About**: `about.html` - Profil, statistiques et compétences
- **Resume**: `resume.html` - Expérience et éducation
- **Services**: `services.html` - Services offerts
- **Portfolio**: `portfolio.html` - Projets réalisés
- **Contact**: `contact.html` - Formulaire de contact

## 🛠 Développement local

```bash
# Démarrer un serveur local
npm start

# Ou utiliser http-server directement
npx http-server . -p 3000
```

Puis ouvrez http://localhost:3000 dans votre navigateur.

## 📱 Responsive Design

Le site est entièrement responsive et fonctionne sur:
- Desktop (1920px et plus)
- Tablettes (768px à 1024px)
- Mobiles (< 768px)

## 🎨 Technologies utilisées

- HTML5
- CSS3 (Bootstrap 5)
- JavaScript Vanilla
- Bootstrap Icons
- AOS (Animate On Scroll)
- GLightbox (Galerie d'images)
- Isotope (Filtrage Portfolio)
- Swiper (Carrousels)
- Typed.js (Texte animé)

## 📞 Support

Pour toute question sur le déploiement sur Vercel, consultez:
- Documentation Vercel: https://vercel.com/docs
- Documentation Vercel Analytics: https://vercel.com/docs/analytics

## 📄 Licence

MIT License - Libre d'utilisation et de modification

---

**Auteur**: Sampa-David  
**Repository**: https://github.com/Sampa-David/ssdj-Portfolio
