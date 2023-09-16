1. create frontend and backend folder
2. in the backend folder npm init -y 
3. and then npm i express bcrypt dotenv express-validator jsonwebtoken mongoose cookie-parser
4. npm install --save-dev nodemon
5. created db in the mongodb atlas and pasted the MONGO_URI link with username and password
6. create folders in the backend folder, controllers, models, routes
7. JWT_SECRET is created in the .env and a secret is used for it which no one can guess
8. Add authorize middleware to the routes where authorization is necessary
9. We have created all our controllers. Now we will have to test using Thunder client API 
   localhost:4000/api/users/register
   json --> {
  "name": "Ayyasudeen",
  "email": "ayyasudeen@gmail.com",
  "password": "ayyas123",
  "age": 28
}
10. after the success message we can see the cookie stored.
11. localhost:4000/api/users/logout --> GET