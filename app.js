// app.js
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// DB初期化
const db = new sqlite3.Database("./survey.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            feedback TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// ミドルウェア
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

// 回答送信API
app.post("/submit", (req, res) => {

    const { name, feedback } = req.body;
    /*
    const { name, feedback, pageLoadedAt, submittedAt } = req.body; */

    if (
        typeof name !== "string" ||
        typeof feedback !== "string" ||
        name.trim() === "" ||
        feedback.trim() === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "名前とご意見は必須です。"
        });
    }

    db.run(
        `INSERT INTO answers(name, feedback)
         VALUES(?, ?)`,
        [name.trim(), feedback.trim()],
        function(err) {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "保存に失敗しました。"
                });
            }

            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

// 回答取得API
app.get("/api/answers", (req, res) => {

    db.all(
        `SELECT *
         FROM answers
         ORDER BY created_at DESC`,
        [],
        (err, rows) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false
                });
            }

            res.json(rows);
        }
    );
});

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});

/*const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// DB初期化
const db = new sqlite3.Database('./survey.db');
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            feedback TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// ミドルウェア設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// アンケートフォーム表示
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><meta charset="UTF-8"><title>アンケートフォーム</title></head>
        <body>
            <h1>アンケートフォーム</h1>
            <form action="/submit" method="post">
                <label>名前: <input type="text" name="name" required></label><br><br>
                <label>ご意見: <textarea name="feedback" required></textarea></label><br><br>
                <button type="submit">送信</button>
            </form>
            <p><a href="/answers">回答一覧を見る</a></p>
        </body>
        </html>
    `);
});

// フォーム送信処理
app.post('/submit', (req, res) => {
    const { name, feedback } = req.body;

    // 入力バリデーション
    if (!name.trim() || !feedback.trim()) {
        return res.status(400).send('名前とご意見は必須です。');
    }

    db.run(
        `INSERT INTO answers (name, feedback) VALUES (?, ?)`,
        [name.trim(), feedback.trim()],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('データ保存中にエラーが発生しました。');
            }
            res.redirect('/answers');
        }
    );
});

// 回答一覧表示
app.get('/answers', (req, res) => {
    db.all(`SELECT * FROM answers ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('データ取得中にエラーが発生しました。');
        }

        let html = `
            <html>
            <head><meta charset="UTF-8"><title>回答一覧</title></head>
            <body>
                <h1>回答一覧</h1>
                <table border="1" cellpadding="5">
                    <tr><th>ID</th><th>名前</th><th>ご意見</th><th>日時</th></tr>
        `;

        rows.forEach(row => {
            html += `<tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.feedback}</td>
                <td>${row.created_at}</td>
            </tr>`;
        });

        html += `
                </table>
                <p><a href="/">フォームに戻る</a></p>
            </body>
            </html>
        `;

        res.send(html);
    });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});*/