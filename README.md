
# langr

## Run/Execute Project:
Install packages:
```
npm install
```
Backend: running in port http://localhost:8081

```
node app.js
```

Frontend: running in port http://localhost:8082

```
cd client
npm run serve
```
Install maildev and configure to the right port to receive emails

## But du projet

Centre des réfugiés
Créez une plate-forme (web) qui peut faciliter l'échange linguistique basé sur des intérêts communs. Ces jumelages permettront aux nouveaux arrivants et aux membres de la communauté d'apprendre de nouvelles langues et de créer des liens sociaux.La plate-forme doit avoir un système de planification et un profil indiquant les langues parlées, les langues que vous souhaitez apprendre et un passe-temps ou des intérêts afin que les gens puissent correspondre en conséquence.

## Comment il fonctionne

L'utilisateur créé un compte dans lequel il peut remplir ses informations personelles:

- Nom complet
- Langue parlée
- Langue qu'il/elle souhait apprendre
- Location
- Email
- Mot de passe
- Intérêts
  L'utilisateur peut ensuite naviguer dans son profil ou dans le profil des autres pour voir leurs informations.
  L'utilisateur peut éditer son profil.
  L'utilisateur peut être jumeler dans la page home avec une personne.
  L'utilisateur pourrait parler avec la personne avec qui il/elle est jumelée.
  Ils/elles peuvent schedule des meetings.
  Il y aurait un historique des choses
  L'utilisateur peut se déconnecter.

## Les Difficultés rencontrées

- mysql
- loading images
- websocket for chat
- computer slowed down during recording

## Main Idea:

- User

  - Full name string (first name last name)
  - Speaking Language
  - Preferred Language
  - Interests - Hobbies (array)
  - Email
  - Password (encryption)
  - Location
  - profile pic
  - Contacts (array of user id)

- Translation feature

- Message System

  - Text
  - user id
  - Date-created

- Time spent learning language
- Recommendation of goals (level) - Badge
- Tinder swipe (to facilitate exchanges)

- Scheduling System

  - Schedule meeting (time and date)
  - Story of (Timeline) memory

- User Flow
  - Home Dashboard
  - Message
  - Story of meeting
  - Contacts (imported)
  - Profile (edit)

## Technologies

- Cloud database (Postgresql)
- Backend nodejs, expressjs
- Frontend VueJS (js, html, css) - Bootstrap
- Deploy (soon): Heroku

## Todo:

- Implement database models (User, Message)
- Implement connecting user and message
- Frontend
