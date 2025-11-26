const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

// Gmailのアプリパスワードを使用して送信
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "あなたのGmail@gmail.com", // 送信元メールアドレスに変更
    pass: "アプリパスワード",         // Gmailのアプリパスワード
  },
});

exports.sendMail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({ error: "POSTメソッドのみ対応しています" });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send({ error: "全ての項目を入力してください" });
    }

    try {
      await transporter.sendMail({
        from: "あなたのGmail@gmail.com",      // 送信元メール
        to: "送信先メール@example.com",       // 実際に受け取るメールアドレスに変更
        subject: "お問い合わせフォームからのメッセージ",
        text: `名前: ${name}\nメール: ${email}\n内容: ${message}`,
      });

      res.status(200).send({ success: true, message: "送信完了！" });
    } catch (error) {
      console.error("メール送信エラー:", error);
      res.status(500).send({ error: "メール送信に失敗しました" });
    }
  });
});