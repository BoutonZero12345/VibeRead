
# 📖 VibeRead — Spécifications Fonctionnelles & Techniques

**VibeRead** est une application web personnelle de "Deep Work" conçue pour résoudre trois problèmes majeurs d'attention et de productivité : l'ennui lié à la lecture passive de livres, le scroll compulsif sur les flux vidéo algorithmiques (YouTube), et le besoin d'un ancrage visuel apaisant sans source de distraction active.

## 🎯 1. Le Principe Global & Objectifs

L’application fusionne trois éléments essentiels au focus au sein d'une interface unique, épurée et sans friction :

1. **L'Ambiance Visuelle (Le "Vibe") :** Une vidéo YouTube de paysage (ex: pixel art sous la pluie) qui tourne en boucle en arrière-plan et occupe 100 % de l'espace écran.
2. **L'Ambiance Sonore :** Un flux audio piloté en tâche de fond via l'API YouTube Music pour gérer des playlists de concentration (Lo-Fi, Ambient) sans quitter l'interface.
3. **Le Focus Lecture (Le "Read") :** Une colonne de texte centrale minimaliste pour lire de grands classiques du développement personnel en mode zéro distraction.

## 🎨 2. Ergonomie & Subtilités d'Affichage (Accessibilité et Focus)

Pour maximiser la concentration et éviter la fatigue cognitive, l'interface obéit à des règles graphiques très strictes :

* **La Disposition en Vision Périphérique :** Le texte ne s'affiche pas directement par-dessus la vidéo en plein écran. L'application présente une **colonne blanche centrale opaque** dédiée à la lecture. La vidéo de paysage reste visible uniquement sur les côtés gauche et droit de l'écran. Cela permet de profiter de l'effet relaxant du décor dans la vision périphérique, sans que le mouvement des images ne vienne perturber les lignes de texte.
* **Typographie Adaptée (Dyslexie & Fatigue) :**
  La couleur du texte est noire sur fond blanc pour un contraste maximal. La police d'écriture est spécifiquement sélectionnée pour être adaptée aux personnes dyslexiques (type *OpenDyslexic* ou la police de  *Claude* ), offrant une lecture plus fluide, aérée et reposante pour les yeux lors des sessions prolongées.
* **Mode Immersion Totale :**
  L'application est configurée pour occuper l'intégralité du viewport (`100vw` / `100vh`). Aucune barre de défilement (scroll) globale du navigateur n'est visible. Seul le texte à l'intérieur de la colonne centrale peut défiler.

## 🛠️ 3. Architecture Technique & Fonctionnement

L'application est développée avec le framework **Next.js (React / TypeScript / Tailwind CSS)** et configurée pour être déployée instantanément sur la plateforme **Vercel** afin d'y avoir accès depuis n'importe quel appareil.

### Composant A : L'Arrière-plan Vidéo

La vidéo de paysage utilise l'IFrame standard de YouTube, mais modifiée chirurgicalement via ses paramètres d'URL pour masquer l'écosystème de Google :

* `controls=0` & `showinfo=0` : Suppression complète des barres de lecture, titres et boutons YouTube.
* `autoplay=1` & `mute=1` : Lancement automatique (le mode muet est requis par les navigateurs pour autoriser l'autoplay).
* `loop=1` & `playlist=[ID]` : Forçage de la lecture en boucle infinie.
* Un effet CSS `transform: scale()` est appliqué pour zoomer légèrement dans l'IFrame afin de couper définitivement les bordures noires et les résidus de logo.

### Composant B : La Gestion des Livres (Option Embarquée)

Le projet adopte une gestion de données locale et statique pour garantir une stabilité totale et une indépendance vis-à-vis des serveurs tiers :

* **La Base de Données (JSON) :** Un fichier de configuration central répertorie le **Top 100 des grands classiques absolus** du développement personnel (ex:  *Les 4 accords toltèques* ,  *Comment se faire des amis* ,  *The One Thing* ). Chaque entrée contient uniquement un `id` numérique séquentiel, le `title`, l'`author` et sa `category`.
* **Le Stockage des Fichiers bruts :** Les livres complets au format `.epub` sont téléchargés manuellement et stockés directement dans le répertoire `/public/books/` du projet, renommés selon leur ID numérique (ex: `1.epub`, `2.epub`).
* **Le Lecteur (Parser) :** Côté client, l'application intègre une librairie JavaScript (comme `epubjs`) capable de lire l'archive binaire de l'EPUB pour extraire le texte propre et l'injecter dynamiquement dans la colonne blanche. Le site retient la page et le chapitre en cours dans le `localStorage` du navigateur.

### Composant C : Le Module Audio (YouTube Music API alternative)

L'audio utilise l'**API YouTube IFrame Player** masquée.

* Une playlist personnelle (Lo-Fi / Concentration) est configurée.
* L'IFrame audio est présente dans le DOM mais cachée graphiquement (`opacity: 0` ou positionnée hors écran) pour ne pas casser le design.
* L'interface utilisateur de VibeRead intègre ses propres boutons de contrôle designés sur-mesure (Play, Pause, Suivant). Ces boutons interceptent les clics de l'utilisateur et pilotent l'IFrame YouTube Music sous-jacente via des fonctions JavaScript.

## 📋 4. Résumé du Flux Utilisateur

```
[ Chargement de VibeRead ]
     │
     ├── Arrière-plan ──> Lance la vidéo YouTube (Muette / Boucle / Plein écran)
     │
     ├── Flux Audio   ──> Charge la playlist en arrière-plan (Prête à jouer)
     │
     └── Interface    ──> Affiche la colonne blanche centrale
                             │
                             ├── 1. Sélection du livre parmi le Top 100 JSON
                             └── 2. Lecture avec police adaptée & contrôles audio discrets
```
