🛍️ Mini E-Commerce App

Mini E-Commerce App est une application mobile développée avec React Native (Expo).
Elle permet aux utilisateurs de découvrir des produits, consulter leurs détails et les ajouter à un panier virtuel pour simuler un processus d’achat.

⸻

🚀 Fonctionnalités principales

🎬 1. Écran de démarrage (Splash Screen)
	•	Animation d’introduction au lancement de l’application.
	•	Présente le logo ou une courte animation pour améliorer l’expérience utilisateur.

🏠 2. Page d’accueil (index.tsx)
	•	Affiche la liste des produits disponibles.
	•	Chaque produit contient :
	•	Une image
	•	Le nom du produit
	•	Le prix
	•	Un bouton ou un lien vers la page de détails.

🛒 3. Page Panier (cart.tsx)
	•	Affiche les produits ajoutés par l’utilisateur.
	•	Permet de :
	•	Voir le nom, le prix et la quantité de chaque produit.
	•	Supprimer un article du panier.
	•	Voir le total à payer.

🔍 4. Page Détails (details.tsx)
	•	Montre les informations complètes d’un produit sélectionné :
	•	Image en grand format
	•	Description détaillée
	•	Prix
	•	Bouton “Ajouter au panier”

⸻

🧩 Technologies utilisées
	•	React Native (avec Expo)
	•	TypeScript
	•	React Navigation pour la navigation entre les pages
	•	Zustand ou useState pour la gestion du panier (selon ton choix)
	•	StyleSheet de React Native pour le design

📂 Structure du projet

mini-ecommerce/
│
├── app/
│   ├── index.tsx        # Page d’accueil (liste des produits)
│   ├── details.tsx      # Détails du produit
│   ├── cart.tsx         # Page du panier
│
├── components/          # Composants réutilisables (ProductCard, Header, etc.)
├── assets/              # Images, icônes et ressources
├── App.tsx              # Point d’entrée de l’application
├── package.json
├── app.json
└── README.md

⚙️ Installation & exécution

1. Installer les dépendances
   -npm install

2. Lancer le projet
    -npx expo start

