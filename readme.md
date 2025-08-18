# 💳 Wallet API (MFS Project)

A simple **Mobile Financial Service (MFS) / Wallet API** built with **Node.js, Express.js, and MongoDB**.\
This project provides basic wallet operations such as **create wallet, block/unblock wallet, check balance, and transfer money**.

---

## 🚀 Features

- ✅ Create a wallet for a user
- ✅ Get wallet details
- ✅ Block & Unblock wallet
- ✅ Transfer money between users
- ✅ Check wallet balance
- ✅ RESTful API design with proper error handling

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose / Native Driver)
- **Authentication (Optional):** JWT
- **Other Tools:** Nodemon, dotenv, bcryptjs

---

## 📂 Project Structure

```
wallet-api/
│-- src/
│   │-- config/         # Database connection, env setup
│   │-- controllers/    # API logic
│   │-- models/         # MongoDB models
│   │-- routes/         # API routes
│   │-- utils/          # Helpers & middlewares
│   │-- app.js          # Express app setup
│   └-- server.js       # Entry point
│-- .env                # Environment variables
│-- package.json
│-- README.md
```

---

## ⚙️ Installation & Setup

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/wallet-api.git
   cd wallet-api
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file and add:

   ```env
   PORT=5000
   DB_URL=mongodb://127.0.0.1:27017/walletDB
   JWT_SECRET=yourSecretKey
   ```

4. Run the server

   ```bash
   npm run dev
   ```

---

## 🔗 API Endpoints

### Wallet

| Method | Endpoint                           | Description                  |
| ------ | ---------------------------------- | ---------------------------- |
| POST   | `/api/v1/wallet`                   | Create a new wallet          |
| GET    | `/api/v1/wallet/:userId`           | Get wallet details by userId |
| PATCH  | `/api/v1/wallet/block/:walletId`   | Block a wallet               |
| PATCH  | `/api/v1/wallet/unblock/:walletId` | Unblock a wallet             |
| GET    | `/api/v1/wallet/balance/:walletId` | Get wallet balance           |

### Transfer

| Method | Endpoint                  | Body                                         |
| ------ | ------------------------- | -------------------------------------------- |
| POST   | `/api/v1/wallet/transfer` | `{ "toUserId": "userId123", "amount": 500 }` |

---

## 📌 Example Transfer Request

```http
POST /api/v1/wallet/transfer
Content-Type: application/json

{
  "toUserId": "79b3ce7807bb9c6d382125ab",
  "amount": 500
}
```

---

## 📊 Future Improvements

- ✅ Add authentication (JWT)
- ✅ Add transaction history
- ✅ Add deposit & withdraw endpoints
- ✅ Add role-based access (Admin/User)

---

## 👨‍💻 Author

Developed by **Anamika Gain** 🚀

