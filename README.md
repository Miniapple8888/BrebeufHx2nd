# BrebeufHx2nd

# Run/Execute Project:
Run
```
node app.js
```
See db info down

# But du projet
Centre des réfugiés
Créez une plate-forme (web) qui peut faciliter l'échange linguistique basé sur des intérêts communs. Ces jumelages permettront aux nouveaux arrivants et aux membres de la communauté d'apprendre de nouvelles langues et de créer des liens sociaux.La plate-forme doit avoir un système de planification et un profil indiquant les langues parlées, les langues que vous souhaitez apprendre et un passe-temps ou des intérêts afin que les gens puissent correspondre en conséquence.

# Comment il fonctionne
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

# Les Difficultés rencontrées
- mysql
- loading images
- websocket for chat
- computer slowed down during recording 

# Main Idea:
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

# Technologies
- Cloud database (mysql)
- Backend nodejs
- Frontend (js, html, css) - Bootstrap

# Todo:
- Implement database models (User, Message)
- Implement connecting user and message
- Frontend

# How to Create Database and GET RUNNIng:
See `database.js`
Database name: refugeecenter
Username: root
Password: password
Create users table
```
  CREATE TABLE users ( id INT NOT NULL AUTO_INCREMENT , first-name VARCHAR(255) NOT NULL , last-name VARCHAR(255) NOT NULL , email VARCHAR(255) NOT NULL , password-hash VARCHAR(255) NOT NULL , speaking-language VARCHAR(255) NOT NULL , preferred-language VARCHAR(255) NOT NULL , interests VARCHAR(255) NOT NULL , location VARCHAR(255) NOT NULL , profile-pic BLOB NOT NULL , PRIMARY KEY (id)); 
```
Create interests table
```
CREATE TABLE interests ( id INT NOT NULL AUTO_INCREMENT , interest-name VARCHAR(255) NOT NULL, PRIMARY KEY (id));
```
Create user_interests table
```
CREATE TABLE interests ( user_id INT NOT NULL , interest_id INT NOT NULL, PRIMARY KEY (id));
```
Create connections table
```
CREATE TABLE connections ( user_id_from INT NOT NULL, user_id_to INT NOT NULL, created_at DATETIME NOT NULL);
```
Create meetings table
```
CREATE TABLE meetings ( id INT NOT NULL AUTO_INCREMENT, user_id_create INT NOT NULL,  user_id_to INT NOT NULL, name_meeting varchar(255), date_created DATETIME NOT NULL, date_meeting DATETIME NOT NULL, meeting_desc TEXT, meeting_location varchar(255),  PRIMARY KEY (`id`));
```