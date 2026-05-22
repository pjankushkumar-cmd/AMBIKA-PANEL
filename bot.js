const TelegramBot = require("node-telegram-bot-api");

const token = "YOUR_BOT_TOKEN";
const ADMIN_ID = YOUR_ADMIN_CHAT_ID;

const bot = new TelegramBot(token);

let userStep = {};

module.exports = async (req, res) => {

const body = req.body;

if(body.message){

const chatId = body.message.chat.id;
const text = body.message.text;

// ===== START =====

if(text === "/start"){

const opts = {
reply_markup: {
keyboard: [
["💸 10 RUPEES GIFT CODE"],
["💰 20 RUPEES GIFT CODE"],
["🔥 50 RUPEES GIFT CODE"],
["👑 100 RUPEES GIFT CODE"],
["🚀 500 RUPEES GIFT CODE"]
],
resize_keyboard: true
}
};

await bot.sendMessage(
chatId,
`🎁 WELCOME TO JAI CLUB GIFT BOT 🎁

💎 Select Gift Code Amount Below 👇`,
opts
);

}

// ===== GIFT OPTION =====

else if(
text === "💸 10 RUPEES GIFT CODE" ||
text === "💰 20 RUPEES GIFT CODE" ||
text === "🔥 50 RUPEES GIFT CODE" ||
text === "👑 100 RUPEES GIFT CODE" ||
text === "🚀 500 RUPEES GIFT CODE"
){

userStep[chatId] = {
step: "waiting_uid",
amount: text
};

await bot.sendMessage(
chatId,
`🎮 SEND YOUR GAME UID

⚡ Example : 82727282`
);

}

// ===== UID RECEIVE =====

else if(userStep[chatId]?.step === "waiting_uid"){

const selectedPlan = userStep[chatId].amount;

userStep[chatId] = {
step: "checking",
uid: text,
amount: selectedPlan
};

await bot.sendMessage(
chatId,
`⏳ WAIT CHECKING YOUR UID...

🔍 Verifying Account
⚡ Please Wait...`
);

// ===== ADMIN LOG =====

await bot.sendMessage(
ADMIN_ID,

`👤 NEW USER REQUEST

🆔 USER ID : ${chatId}

🎮 GAME UID : ${text}

💎 PLAN : ${selectedPlan}

💬 USERNAME : @${body.message.from.username || "NoUsername"}

📩 Reply Command:
/reply ${chatId} Your Message`
);

}

// ===== ADMIN REPLY =====

if(chatId == ADMIN_ID && text.startsWith("/reply")){

const args = text.split(" ");

const userId = args[1];

const message = args.slice(2).join(" ");

if(!userId || !message){

await bot.sendMessage(chatId,
"❌ Use:\n/reply USERID MESSAGE");
return;
}

await bot.sendMessage(
userId,
`📩 ADMIN MESSAGE

${message}`
);

await bot.sendMessage(
chatId,
"✅ Reply Sent Successfully"
);

}

}

res.status(200).send("OK");

};
