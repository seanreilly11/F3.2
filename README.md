# F3.2
This is our front-end. You need back-end to run this project.
## Step 1 - Clone this project into your www folder
git clone https://github.com/seanreilly11/F3.2.git
## Step 2 - Install packages
npm i
## Step 3 - MongoDB
Use your own MongoDB account. There is a config-copy.json to add your username, password and clustername with its id. Rename this file to config.json and .gitignore it.
The URI connection string needs username, password and cluster name with attached id. If not, create an account and get the uri string from https://www.mongodb.com/ 
## Step 4 - Run the project
You should have installed nodemon globally. if not run npm install nodemon -g
nodemon -L index.js
## Step 5 - To see the home page
192.168.33.10:3000/
## Step 6 - Endpoints
| Endpoints | Description | Acceptable values | Methodd |
| --- | --- | --- | --- |
| /portfolios | get all portfolios from json file | | GET |
| /portfolio/p= | get portfolio by id from json file | Number | GET |
| /register | post a new user to db | | POST |
| /users | get all users from db | | GET |
| /login | check for existing user to login | | POST |
## Step 7 -MongoDB
To see data being posted, click on cluster->collections->portfolio->COLLECTION
