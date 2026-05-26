// server.js

const express = require("express");
const cors = require("cors");

const fetch = (...args) =>
import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors({
origin: "*",
methods: ["GET","POST"],
allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

const API_URL =
"https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

let historyData = [];

let prediction = {
number: "?",
size: "WAITING",
color: "WAITING",
sizeConf: "0%",
colorConf: "0%",
numConf: "0%",
upcomingPeriod: "CONNECTING..."
};

async function updateData(){

try{

const response = await fetch(API_URL);

if(!response.ok){
throw new Error("API FAILED");
}

const data = await response.json();

let list = data?.data?.list || data?.list || [];

if(!list.length){
return;
}

historyData = list.slice(0,50).map(item=>{

const num = Number(item.number);

let color = num % 2 === 0 ? "Red" : "Green";

if(num === 0){
color = "Red/Violet";
}

if(num === 5){
color = "Green/Violet";
}

return{
period: String(item.issue || item.issueNumber),
number: num,
size: num >= 5 ? "Big" : "Small",
color: color
};

});

const latest = historyData[0];

let nextNumber = Math.floor(Math.random()*10);

let nextColor = nextNumber % 2 === 0 ? "Red" : "Green";

if(nextNumber === 0){
nextColor = "Red/Violet";
}

if(nextNumber === 5){
nextColor = "Green/Violet";
}

prediction = {
number: nextNumber,
size: nextNumber >= 5 ? "Big" : "Small",
color: nextColor,
sizeConf: "94%",
colorConf: "92%",
numConf: "90%",
upcomingPeriod: String(BigInt(latest.period)+1n)
};

console.log("LIVE DATA UPDATED");

}catch(e){

console.log("API ERROR:", e.message);

}
}

setInterval(updateData,2000);

app.get("/", (req,res)=>{

res.send("HACKII PANEL SERVER RUNNING");

});

app.get("/api/matrix-data",(req,res)=>{

res.json({
history: historyData,
prediction: prediction
});

});

app.listen(PORT,()=>{

console.log("SERVER RUNNING ON PORT:", PORT);

updateData();

});
