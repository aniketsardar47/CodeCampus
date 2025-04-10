# CodeCampus

**CodeCampus** is an online coding platform that helps streamline the process of managing and submitting coding assignments between teachers and students.

Teachers can upload practical assignments, and students can write, execute, and submit their code directly on the platform. It's designed for academic environments to facilitate interactive learning and automated evaluation of coding tasks.


## ✨ Features

- 👩‍🏫 **Teacher Dashboard**  
  - Create, update, and manage programming assignments.  
  - Define problem statements, inputs, expected outputs.
  - View students submitted codes.

- 👨‍🎓 **Student Dashboard**  
  - View assigned practicals.  
  - Write and run code in an online code editor.  
  - Submit solutions to teachers.

- ⚙️ **Code Execution Engine**  
  - Supports execution of code in multiple languages (extendable).  
  - Runs The code on user inputs and provides feature to store it on teacher dashboard.

- 🧠 **Anti-Cheating Tools** *(in development)*  
  - Monitor focus changes.  
  - Timer, fullscreen enforcement, and more.

---

## 🛠️ Tech Stack

- **Frontend**: React + Monaco Editor  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Other**: JWT Auth, REST APIs, Code Runner Integration, Piston API, Monaco-Editor

---

## 📁 Project Structure

```
CodeCampus/
├── server-backend/       # Node.js backend for handling APIs and code execution
├── user-interface/       # React frontend with Monaco Editor integration
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aniketsardar47/CodeCampus.git
cd CodeCampus
```

### 2. Set Up Backend

```bash
cd server-backend
npm install
npm start
```

### 3. Set Up Frontend

```bash
cd ../user-interface
npm install
npm start
```

- Frontend: Runs on [http://localhost:3000](http://localhost:3000)  
- Backend: Runs on [http://localhost:5000](http://localhost:5000) (or as configured)

---

## 💡 Future Improvements

- Submission history and grading analytics  
- Multi-language code execution  
- Real-time collaboration  
- Enhanced anti-cheating measures

---

## 🤝 Contributing

Feel free to fork this project, make changes, and submit a pull request!  
If you find bugs or have suggestions, open an issue to start a discussion.

