# MediConnect

A full-stack healthcare web application built with the MERN stack that connects users with local pharmacies. The platform supports both medicine doorstep delivery and pickup options from nearby stores, providing real-time medicine availability and route optimization using GraphHopper. It includes user and shop owner portals with authentication, responsive UI, and live order tracking via WebSockets.


---

🚀 Features

👥 User Side

Sign up and log in as a user

Search for medicines

View nearby pharmacies with real-time availability

See distance to shops using map view (GraphHopper)

Choose between delivery and pickup options

Live order tracking via WebSockets

Mobile-first, responsive UI


🏪 Shop Owner Side

Sign up and log in as a shop owner

Add shop details (license, GST, services, location)

Manage inventory and order requests

Update shop status (active/inactive)



---

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, React Router

Backend: Node.js, Express.js, MongoDB

Real-Time Communication: WebSockets

Routing & Distance Calculation: GraphHopper API

Authentication: JWT, Bcrypt

State Management: useState/useEffect (can be scaled to Redux if needed)



---

🔧 Installation

1. Clone the repo:

git clone https://github.com/your-username/healthcare-platform.git
cd healthcare-platform


2. Install dependencies:

# Frontend
cd client
npm install

# Backend
cd ../server
npm install


3. Create a .env file in the backend folder with:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret


4. Run the project:

# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm run dev




---

📦 Folder Structure

├── client/                  # Frontend (React)
├── server/                  # Backend (Express)
│   ├── models/              # User and Shop Owner schemas
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   └── socket/              # WebSocket logic


---

📌 Future Improvements

Add payment integration (Razorpay/Stripe)

Push notifications

Pharmacy rating & reviews

Medicine images & details

Admin panel



---

🧑‍💻 Contributing

Feel free to fork the repo, raise issues, or submit pull requests.


---

📜 License

This project is licensed under the MIT License.


---

Let me know if you’d like to customize this further for deployment, documentation, or a walkthrough section.


