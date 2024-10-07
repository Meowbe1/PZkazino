const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/casinoDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Определение схемы пользователя
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    chips: { type: Number, default: 100 },
    spins: { type: Number, default: 0 },
    role: String
});

const User = mongoose.model('User', userSchema);

// API для регистрации
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.status(201).send('Пользователь успешно зарегистрирован');
    } catch (error) {
        res.status(400).send('Ошибка регистрации: ' + error.message);
    }
});

// API для входа
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.send({ username: user.username, chips: user.chips, spins: user.spins });
    } else {
        res.status(401).send('Неверные учетные данные');
    }
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
