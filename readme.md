🛠️ Product Inventory Management App – MERN Stack
A full-stack inventory management application with user authentication, product & category handling, and filtering. Built using the MERN stack with JWT and React Context API.

📁 Backend (Node.js + Express + MongoDB)
🔧 Setup Instructions:
Built with Express.js and MongoDB (Mongoose)

JWT-based authentication

Environment variables required:

PORT

MONGO_URI

JWT_SECRET

Start server using: npm run dev

🔐 Authentication Endpoints:
POST /auth/signup – Register a new user (name, email, password)

POST /auth/login – Login and receive JWT token

🔒 Protected with JWT:
Add Authorization: Bearer <token> in headers for protected routes

📦 Product Endpoints (Protected):
POST /products – Create a product

GET /products – Get all products

Optional filters: ?name=, ?category=, ?inStock=true

GET /products/:id – Get product by ID

PUT /products/:id – Update a product

DELETE /products/:id – Delete a product

🗂️ Category Endpoints:
POST /categories – Create category

GET /categories – List categories

💻 Frontend (React + Vite)
🧱 Features:
Built with Vite and React

Uses React Context for authentication

Axios for API calls with JWT token

React Router for routing

Toast notifications with react-toastify

🔐 Auth System:
Signup and Login pages

JWT stored in localStorage

AuthContext used to manage user session globally

📦 Product Management:
View all products with filters (name, category, stock)

Add new product and edit existing

Delete product functionality

Category dropdown for assigning product category

🧭 Routing:
/login, /signup

/products – Product listing

/products/new – Add product

/products/:id/edit – Edit product

🪄 UI:
Clean and modern responsive layout

Toasts for feedback

Protected routes via context

