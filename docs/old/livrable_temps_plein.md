# Livrable Temps Plein

## Sommaire
- [Tests E2E](#tests-e2e)
    - [Nos critères](#nos-critères)
    - [Nos scénarios et leur impact](#nos-scénarios-et-leur-impact)
    - [Ce que nous aurions aimé faire](#ce-que-nous-aurions-aimé-faire)
- [Conteneurisation](#conteneurisation)
    - [Etape 1 - Dockerisation du front et du back](#etape-1---dockerisation-du-front-et-du-back)
    - [Etape 2 - Compose du front et du back](#etape-2---compose-du-front-et-du-back)
    - [Etape 3 - Dockerisation du front, du back et des tests playwright](#etape-3---dockerisation-du-front-du-back-et-des-tests-playwright)



<br><br>
--------------------------------------------------------------------------------
<br><br>



# Tests E2E

## Nos critères

### Plaisir de jouer

**Utilisateur impacté :** Enfant

**Description :**
- Le jeux capte l'attention
- Le jeux n'est pas frustrant
- Le jeux est intuitif
- Les actions perçus par les joueurs sont fidèles à la réalité

**Justification :**
Afin d'encourager les enfants à apprendre et prévenir le décrochage des enfants hyperactifs, bien que ce ne soit pas notre publique de prédilection, nous estimons que le jeux ce doit d'être le plus plaisant à jouer.
L'enfant ne doit pas avoir l'impression de suivre un cours tout en apprenant malgré tout.


### Configurabilité (jeux + enfants)

**Utilisateur impacté :** Ergo

**Description :**
- L'ergothérapeute peut modifier les informations personnelles d'un enfant
- L'ergothérapeute peut adapter l'accessibilité pour l'enfant (à tout instant)
- L'ergothérapeute peut configurer la partie

**Justification :**
Afin d'assurer aux ergothérapeutes un suivi personnalisé pour chaque enfant ainsi qu'une interaction durant toute la séance avec l'enfant,
notre site doit être configurable.


### Suivi de la progression

**Utilisateurs impactés :** Ergo + Enfant

**Description :**
- L'ergothérapeute peut avoir accès à des statistiques montrant la progression de l'enfant
- L'enfant peut se comparer avec ses camarades
- L'enfant à également accès à une progression personnelle sous forme de notes et de badges

> [!NOTE]
> Le suivie de la progression se manifeste différement selon le rôle de l'utilisateur.

**Justification :**
Sans suivi de la progression de l'enfant :
- l'ergothérapeute ne peut pas adapter l'apprentissage du clavier de l'enfant.
- l'enfant n'est pas encorougé à progresser et ne voudra pas revenir sur le site pour une nouvelle séance.



## Nos scénarios et leurs impact

Nous avons décider de tester les scénarios suivants :

### Créer un profil d'enfant en tant qu'ergo :

**Impacts :**
|Suivi de la progression|Configurabilité|Plaisir de jouer|
|:---------------------:|:-------------:|:--------------:|
|         10/10         |     10/10     |      5/10      |

**Justification :**
> Le bon déroulement de ce scénario est essentiel à notre application.  
> Sans la création de profil, il n'est pas possible de permettre un suivie personnalisé pour chaque enfant.  
> D'où un impact fort pour les critères "Configurabilité" et "Suivi de la progression".  
> Ce scénario impact également légérement le critère "Plaisir de jouer" car il n'est pas possible de faire une partie multijoeur sans cette fonctionnalité.  

### Jouer une partie solo en tant qu'enfant et remarquer que ses statistiques sont mises à jour

**Impacts :**
|Suivi de la progression|Configurabilité|Plaisir de jouer|
|:---------------------:|:-------------:|:--------------:|
|          10/10        |     5/10      |      3/10      |

**Justification :**
> Le bon déroulement de ce scénario est important à notre application.  
> Sans la mise à jour des statistiques :  
> - l'erothérapeute ne peut pas adapter l'apprentissage de l'enfant.  
> - l'enfant n'est pas motivé à progresser.  


### Lancer une partie multijoueur en tant qu'ergo et remarquer qu'on peut changer les configs de la partie

**Impacts :**
|Suivi de la progression|Configurabilité|Plaisir de jouer|
|:---------------------:|:-------------:|:--------------:|
|          0/10         |      9/10     |      6/10      |

**Justification :**
> Le bon déroulement de ce scénario est important à notre application.  
> Sans la configuration de la partie, l'erothérapeute ne peut pas interagir avec l'enfant en pleine partie.  
> Le plaisir de l'enfant est également impacté car l'ergothérapeute ne peut pas intervenir en cas de difficulté de l'enfant (en désactivant certain type de question par exemple).  



## Ce que nous aurions aimé faire

Notre jeu possède beaucoup d'aléatoire.
Nous avions donc un choix à faire :
- *"Trouver un moyen tester le jeu malgré l'aléatoire (ex: faire un mock) afin de le tester **MAIS** ne pas avoir le temps de tester d'autres fonctionnalités"*
- *"Tester les autres fonctionnalités **MAIS** ne pas avoir le temps de trouver un moyen tester le jeu malgré l'aléatoire (ex: faire un mock) afin de le tester"*

Bien que le **"Plaisir de jouer"** est un de nos critères, nous avons décider de tester les autres fonctionnalités et d'ignorer le jeu.
Il faudrait donc également faire des tests E2E pour le jeu :
- Tester une vraie partie en solo
- Tester une vraie partie en multijoueur



<br><br>
--------------------------------------------------------------------------------
<br><br>



# Conteneurisation

## Etape 1 - Dockerisation du front et du back

**Etat de l'étape :** *Fini*

**Description de l'étape :**
Cette étape consiste à dockeriser le back et le front.
Pour cela, il a fallu :
- isoler les variables d'environnements telles que les URLs du back et du front.
- compiler le front et utiliser un serveur **`nginx`**.


**Ce que j'ai fait :**
J'ai donc isoler les variables d'environnement dans des fichiers `frontend/src/environments/environment*.ts` :
- `environment.ts` : fichier à importer quoiqu'il arrive (par défaut équivalent à `environment.development.ts`)
- `environment.development.ts` : fichier contenant les varaiables d'environnement correspondant à un environnement de développement non dockerisé.
- `environment.docker.ts` : fichier contenant les varaiables d'environnement correspondant à un environnement dockerisé.
`environment.ts` est remplacé automatiquement lors du *"build"* permettant de compiler le frontend Angular.
*Voir le fichier `angular.json` pour voir comment le remplacement est effectué.*

> [!NOTE]
> J'en ai profité pour faire un alias `@env` pour le chemin `src/environments/*` dans `tsconfig.json`.

La liaison du résultat du *"build"* du frontend avec le serveur **`nginx`** se fait dans le `Dockerfile.frontend`.

En ce qui concerne la conteneurisation du backend, j'ai créé un environnement suffisant pour faire tourner un serveur **`NodeJS`** dans le `Dockerfile.backend`.
Le conteneur du frontend expose le port `80` sur le port `8080` de la machine hôte.  
Et le conteneur du backend expose le port `9428` sur le port `8081` de la machine hôte.  


## Etape 2 - Compose du front et du back

**Etat de l'étape :** *Fini*

Cette étape consiste à établir une communication directe entre les conteneur backend et frontend.  
Pour celà j'ai fait un fichier de configuration `ops/docker-compose.yml` afin de configurer un "docker compose".

J'ai également fait un script `ops/run.sh` instanciant le "docker compose" à partir de `ops/docker-compose.yml`.

En ce qui concerne les "healthchecks" des services `frontend` et `backend` il consiste à faire requête HTTP au service avec `curl` et vérifié si la requête n'a pas échoué et dans le cas contraire arrète l'exécution du service.


- "Healthcheck" de `backend` :
    - Commande :
    ```sh
    curl -f http://localhost:9428/api/status || exit 1
    ```
    - Intervalle : `1m30s`
    - Démarrage : `5s` après la création du conteneur
- "Healthcheck" de `frontend` :
    - Commande :
    ```sh
    curl -f http://localhost || exit 1
    ```
    - Intervalle : `1m30s`
    - Démarrage : `5s` après la création du conteneur


## Etape 3 - Dockerisation du front, du back et des tests playwright

**Etat de l'étape :** *Fini*

Cette étape consiste à dockeriser un environnement de test (voir [ici](#tests-e2e) pour plus de détails sur les tests).

J'ai donc isolé les variables d'environnement dans un fichier `environment.docker-e2e.ts`.  
J'ai modifié la constant `testUrl` dans `frontend/e2e/e2e.config.ts` afin que playwright accède au bon service.  
J'ai également introduit le fichier `frontend/playwright.config-docker.ts` dans lequel je configure les retours de playwright pour qu'il me fournisse une vidéo de chaque test et qu'il mette le rapport de test dans un dossier `ops/e2e-results`.  

Par la suite il a fallu que je définisse un nouveau "docker compose" liant le backend et le frontend ainsi que le service `playwright`.



<br><br>
--------------------------------------------------------------------------------
<br><br>



# Crédits :

- Patrick Bizot

- Deyann Koperecz
