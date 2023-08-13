1. create frontend and backend folder
2. in the backend folder npm init -y 
3. and then npm i express bcrypt dotenv express-validator jsonwebtoken mongoose cookie-parser
4. npm install --save-dev nodemon
5. created db in the mongodb atlas and pasted the MONGO_URI link with username and password
6. create folders in the backend folder, controllers, models, routes
7. JWT_SECRET is created in the .env and a secret is used for it which no one can guess
8. Add authorize middleware to the routes where authorization is necessary