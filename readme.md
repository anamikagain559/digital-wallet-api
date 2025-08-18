# 💳 Digital Wallet API (MFS Project)

A **secure, modular, role-based backend API** for a digital wallet system (like Bkash or Nagad) built with **Node.js, Express.js, and MongoDB**. Users can register, manage wallets, and perform financial operations like add money, withdraw, and send money.

---

## 🎯 Project Overview

- JWT-based login system with **three roles**: admin, user, agent
- Secure password hashing (bcrypt)
- Automatic wallet creation for each user and agent (initial balance: ৳50)
- Role-based access control
- Full transaction tracking and wallet management

### Features per Role

**Users:**

- Add money (top-up)
- Withdraw money
- Send money to other users
- View transaction history

**Agents:**

- Add money to any user's wallet (cash-in)
- Withdraw money from any user's wallet (cash-out)
- View commission history (optional)

**Admins:**

- View all users, agents, wallets, and transactions
- Block/unblock wallets
- Approve/suspend agents
- Set system parameters (optional)

---

## 🧠 Design Considerations

- **Wallet Management:** Automatically during registration; blocked wallets cannot perform operations.
- **Transaction Management:** Tracks type, amount, fee, commission, initiator, status (pending → completed → reversed), atomic operations.
- **Role Representation:** Single User model with `role` field.
- **Validations & Business Rules:** Insufficient balance, blocked wallets, negative amounts, and non-existent receivers.
- **API Design:** RESTful endpoints like `/wallets/deposit`, `/transactions/me`, `/wallets/block/:id`.

---

## 📁 Suggested Project Structure

```
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── wallet/
│   └── transaction/
├── middlewares/
├── config/
├── utils/
├── app.ts
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
3. Create a `.env` file
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

| Method | Endpoint                           | Description        |
| ------ | ---------------------------------- | ------------------ |
| POST   | `/api/v1/wallet`                   | Create a wallet    |
| GET    | `/api/v1/wallet/:userId`           | Get wallet details |
| PATCH  | `/api/v1/wallet/block/:walletId`   | Block a wallet     |
| PATCH  | `/api/v1/wallet/unblock/:walletId` | Unblock a wallet   |
| GET    | `/api/v1/wallet/balance/:walletId` | Get wallet balance |

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

## 🧪 Testing & Documentation

- Use **Postman** to test all endpoints
- Create a **screen-recorded demo (5–10 mins)** showing:
  - Intro (name + project title)
  - Folder structure
  - Auth flow (register, login, JWT + roles)
  - User features (deposit, withdraw, send, history)
  - Agent features (cash-in, cash-out, commission)
  - Admin features (view users, block/unblock wallets, approve agents)
  - API testing in Postman

---

## 🌐 Live & Repository Links

- Live Demo: [https://wallet-api-live.example.com](https://wallet-api-live.example.com)
- GitHub Repository: [https://github.com/anamikagain559/digital-wallet-api.git](https://github.com/anamikagain559/digital-wallet-api.git)

---

## 👨‍💻 Author

Developed by **Anamika Gain**

