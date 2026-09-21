# Skin Care Assistant — Chatbot + Backoffice de gestion

Application complète de chatbot sur les soins de la peau, avec un backoffice de gestion
complet (thèmes, questions/réponses, imports de fichiers, discussions, administrateurs).

## Architecture générale

```
skin-care-chat/
  backend/       -> API Node.js/Express + PostgreSQL (Knex.js)
  backoffice/    -> Application React d'administration (port 3001)
  frontend/      -> Client chatbot React destiné aux utilisateurs finaux (port 3000)
```

- **Aucun SQL brut** : toutes les requêtes utilisent le Query Builder Knex.
- **Deux familles d'API** : `/api/public/*` (chatbot, sans authentification) et
  `/api/admin/*` (backoffice, protégée par JWT).
- **Aucune IA** : le chatbot répond en cherchant la meilleure correspondance dans
  une base de questions/réponses stockée en base de données (par thème).

---

## 1. Prérequis

- Node.js 18+
- PostgreSQL 14+ (une base vide, par exemple `skincare_chat`)

## 2. Installation du backend

```bash
cd backend
cp .env.example .env      # adaptez les valeurs (DB, JWT_SECRET, etc.)
npm install

# Crée les tables (migrations Knex)
npm run migrate

# Crée le compte admin initial, les 6 thèmes (+ leurs dossiers d'upload)
# et les 58 questions/réponses de départ
npm run seed

npm start                 # démarre l'API sur http://localhost:5000
```

Identifiants admin créés par le seed (modifiables dans `.env` avant `npm run seed`) :
- Email : `admin@skincare.local`
- Mot de passe : `Admin123!`

## 3. Installation du backoffice (administration)

```bash
cd backoffice
npm install
npm start                 # démarre sur http://localhost:3001
```

Connectez-vous avec le compte admin ci-dessus. Vous pouvez ensuite :
- Gérer les **thèmes** (CRUD) — chaque thème crée/renomme/supprime automatiquement
  son propre dossier d'upload dans `backend/uploads/<slug-du-theme>/`.
- Gérer les **questions/réponses** par thème (CRUD + recherche + pagination).
- **Importer** des fichiers `.txt`, `.pdf` ou `.docx` contenant des couples
  question/réponse (voir format ci-dessous) : le fichier est stocké dans le
  dossier du thème choisi, et les questions extraites sont insérées automatiquement.
- Consulter les **discussions** dans une interface façon messagerie, avec filtres
  par nom, email, téléphone, thème et date.
- Gérer les **administrateurs** et leur accès (réservé aux super administrateurs).

### Format des fichiers à importer

```
Q: Comment nettoyer son visage ?
R: Nettoyez matin et soir avec un produit doux adapté à votre peau.

Question : Faut-il exfolier tous les jours ?
Réponse : Non, une à deux fois par semaine suffit pour ne pas irriter la peau.
```

Chaque paire est séparée par une ligne vide. Les préfixes acceptés sont
`Q:`/`Question :` pour la question et `R:`/`A:`/`Réponse :` pour la réponse
(insensible à la casse, avec ou sans espace avant les deux-points).

## 4. Installation du frontend chatbot (client final)

```bash
cd frontend
npm install
npm start                 # démarre sur http://localhost:3000
```

Parcours utilisateur :
1. L'utilisateur saisit son **nom, email et téléphone**.
2. Il choisit un **thème** parmi ceux actifs.
3. Une discussion est créée côté serveur et il peut commencer à discuter.
4. Le bouton **"Nouvelle discussion"** clôture la session en cours et relance
   tout le parcours : une nouvelle discussion, totalement indépendante, sera
   créée même si les mêmes coordonnées sont ressaisies (aucune fusion de
   discussions basée sur le contact).

---

## 5. Modèle de données (PostgreSQL)

| Table                  | Rôle                                                              |
|-------------------------|--------------------------------------------------------------------|
| `admins`                | Comptes du backoffice (email, mot de passe hashé, rôle)            |
| `chatbot_themes`        | Thèmes du chatbot, chacun avec son propre dossier d'upload         |
| `chatbot_questions`     | Questions/réponses, rattachées à un thème                          |
| `chatbot_imports`       | Historique des fichiers importés (nom, type, nb de Q/R extraites)  |
| `chatbot_users`         | Coordonnées saisies avant chaque discussion (nom/email/téléphone)  |
| `chatbot_discussions`   | Une discussion = une session de chat indépendante                  |
| `chatbot_messages`      | Chaque message échangé (utilisateur ou bot) au sein d'une discussion |

Relations : `chatbot_questions.theme_id -> chatbot_themes.id`,
`chatbot_discussions.chatbot_user_id -> chatbot_users.id`,
`chatbot_discussions.theme_id -> chatbot_themes.id`,
`chatbot_messages.discussion_id -> chatbot_discussions.id`. Toutes les clés
étrangères, index et timestamps sont définis dans les migrations
(`backend/migrations/`).

Un même contact (nom/email/téléphone) peut démarrer plusieurs discussions :
chaque appel à `POST /api/public/discussions` crée une nouvelle ligne dans
`chatbot_users` et une nouvelle ligne dans `chatbot_discussions`, jamais fusionnées.

## 6. Sécurité

- Mots de passe admin hashés avec bcrypt (12 rounds).
- Authentification par JWT (expiration configurable), vérifiée par middleware
  sur toutes les routes `/api/admin/*`.
- Autorisation par rôle (`super_admin` uniquement pour la gestion des admins).
- Validation stricte de toutes les entrées (Joi) sur chaque route.
- Chaque discussion publique est protégée par un `public_token` opaque
  (UUID) : impossible de lire ou d'écrire dans la discussion d'un autre
  utilisateur en devinant un identifiant numérique.
- Rate limiting sur le login admin et sur l'API publique du chatbot.
- Upload de fichiers restreint par type MIME (TXT/PDF/DOCX) et par taille (10 Mo).
- En-têtes de sécurité HTTP (Helmet) et CORS restreint aux origines déclarées.
- Aucune requête SQL brute : 100% Knex Query Builder.

## 7. Principales routes API

### Publiques (`/api/public`)
- `GET /themes` — liste des thèmes actifs
- `POST /discussions` — démarre une discussion `{ name, email, phone, theme_id }`
- `GET /discussions/:id?token=...` — relit une conversation
- `POST /discussions/:id/messages?token=...` — envoie un message `{ message }`
- `POST /discussions/:id/close?token=...` — clôture la discussion

### Backoffice (`/api/admin`, JWT requis)
- `POST /auth/login`, `GET /auth/me`, `POST /auth/change-password`
- `GET/POST/PUT/DELETE /admins` *(super_admin uniquement)*
- `GET/POST/PUT/DELETE /themes`
- `GET/POST/PUT/DELETE /questions`
- `GET/POST/DELETE /imports` *(POST en `multipart/form-data` : `file`, `theme_id`)*
- `GET /discussions`, `GET /discussions/:id`

## 8. Scripts utiles (backend)

```bash
npm run migrate            # applique les migrations
npm run migrate:rollback   # annule le dernier batch de migrations
npm run seed                # relance les seeds (idempotents)
npm run dev                 # démarre avec nodemon
```
# myrmline_chatbot
