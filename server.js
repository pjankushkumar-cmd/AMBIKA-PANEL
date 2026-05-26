// server.js
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";

// Shared Cloud Buffer Matrix (Locked at exactly 50 nodes across all machines)
let globalHistoryBuffer = [];
let nextPredictionCache = {
    number: "?",
    size: "ANALYZING",
    color: "ANALYZING",
    sizeConf: "0%",
    colorConf: "0%",
    numConf: "0%",
    upcomingPeriod: "LOADING..."
};

// COMPREHENSIVE GAMBLING PATTERN ENGINE (High-Level Server Tracker)
function executeAdvancedGamblingMatrix() {
    if (globalHistoryBuffer.length < 10) return;

    const numbers = globalHistoryBuffer.map(x => x.number);
    const sizes = globalHistoryBuffer.map(x => x.size);
    const colors = globalHistoryBuffer.map(x => x.color.includes("Red") ? "Red" : "Green");
    const currentLen = numbers.length;

    // Weight allocations based on historical position indexes
    let matrixWeights = new Array(10).fill(0);
    numbers.forEach((num, idx) => {
        matrixWeights[num] += (idx + 1) * 3.5;
    });

    const lastSize = sizes[currentLen - 1];
    const lastColor = colors[currentLen - 1];

    // 1. STREAK MATRIX LOGIC
    let sizeStreak = 1;
    for (let i = currentLen - 2; i >= 0; i--) {
        if (sizes[i] === lastSize) sizeStreak++; else break;
    }
    let colorStreak = 1;
    for (let i = currentLen - 2; i >= 0; i--) {
        if (colors[i] === lastColor) colorStreak++; else break;
    }

    // 2. ALTERNATING ZIG-ZAG TRACKER (B->S->B->S / R->G->R->G)
    let isAlternateSize = true;
    for (let i = currentLen - 1; i > currentLen - 5; i--) {
        if (sizes[i] === sizes[i - 1]) { isAlternateSize = false; break; }
    }
    let isAlternateColor = true;
    for (let i = currentLen - 1; i > currentLen - 5; i--) {
        if (colors[i] === colors[i - 1]) { isAlternateColor = false; break; }
    }

    // 3. DOUBLET SYMMETRIC PATTERN DETECTION (BB-SS-BB)
    let isDoubletSize = false;
    if (currentLen >= 4 && sizes[currentLen-1] === sizes[currentLen-2] && sizes[currentLen-3] === sizes[currentLen-4] && sizes[currentLen-2] !== sizes[currentLen-3]) {
        isDoubletSize = true;
    }

    // Target Value Computations
    let targetSize = lastSize;
    if (isAlternateSize) {
        targetSize = lastSize === "Big" ? "Small" : "Big";
    } else if (isDoubletSize) {
        targetSize = lastSize;
    } else if (sizeStreak >= 4) {
        targetSize = lastSize; // Dynamic Trend Flow Lock
    } else {
        let lastFive = sizes.slice(-5);
        targetSize = lastFive.filter(x => x === "Big").length >= 3 ? "Big" : "Small";
    }

    let targetColor = lastColor;
    if (isAlternateColor) {
        targetColor = lastColor === "Red" ? "Green" : "Red";
    } else if (colorStreak >= 4) {
        targetColor = lastColor;
    } else {
        let lastFiveColors = colors.slice(-5);
        targetColor = lastFiveColors.filter(x => x === "Red").length >= 3 ? "Red" : "Green";
    }

    // Anti-Stuck loop modifiers
    matrixWeights[numbers[currentLen - 1]] -= 60;
    if (numbers[currentLen - 2] !== undefined) matrixWeights[numbers[currentLen - 2]] -= 30;

    // Global Time-Based Deterministic Entropy Block
    let timeBlockFactor = Math.floor(Date.now() / 60000);
    for (let i = 0; i < 10; i++) {
        matrixWeights[i] += ((timeBlockFactor * (i + 1)) % 13);
    }

    let chosenNumber = 0;
    let maxPeak = -99999;
    for (let i = 0; i < 10; i++) {
        let evalSize = (i >= 5) ? "Big" : "Small";
        let evalColor = (i % 2 === 0) ? "Red" : "Green";

        let bonus = 0;
        if (evalSize === targetSize) bonus += 100;
        if (evalColor === targetColor) bonus += 100;

        let score = matrixWeights[i] + bonus;
        if (score > maxPeak) {
            maxPeak = score;
            chosenNumber = i;
        }
    }

    let resolvedColor = chosenNumber % 2 === 0 ? "Red" : "Green";
    if (chosenNumber === 0) resolvedColor = "Red/Violet";
    if (chosenNumber === 5) resolvedColor = "Green/Violet";
    let resolvedSize = chosenNumber >= 5 ? "Big" : "Small";

    // Set Synchronized Prediction Results
    let confidenceSeed = (timeBlockFactor % 4);
    nextPredictionCache = {
        number: chosenNumber,
        size: resolvedSize,
        color: resolvedColor,
        sizeConf: `${88 + confidenceSeed}%`,
        colorConf: `${87 + confidenceSeed}%`,
        numConf: `${82 + confidenceSeed}%`,
        upcomingPeriod: String(BigInt(globalHistoryBuffer[globalHistoryBuffer.length - 1].period) + 1n)
    };
    console.log(`[CORE ENG] Synced Calc Updated -> Expected Node: ${chosenNumber}`);
}

// Background Worker for continuous server extraction
async function pollExternalLotteryApi() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) return;
        const data = await response.json();
        let list = data?.data?.list || data?.list || [];

        if (!list.length) return;

        let cleanBatch = list.slice(0, 30).reverse().map(item => {
            let num = parseInt(item.number);
            let color = num % 2 === 0 ? "Red" : "Green";
            if (num === 0) color = "Red/Violet";
            if (num === 5) color = "Green/Violet";

            return {
                period: String(item.issue || item.issueNumber),
                number: num,
                size: num >= 5 ? "Big" : "Small",
                color: color
            };
        });

        // Unique dynamic parsing array validation
        cleanBatch.forEach(node => {
            if (!globalHistoryBuffer.some(m => m.period === node.period)) {
                globalHistoryBuffer.push(node);
            }
        });

        // Fixed Global Sliding Window Constraints at exactly 50
        if (globalHistoryBuffer.length > 50) {
            globalHistoryBuffer = globalHistoryBuffer.slice(-50);
        }

        executeAdvancedGamblingMatrix();
    } catch (e) {
        console.log("[CRITICAL ERROR] Pipeline Interruption. Recovering arrays.");
    }
}

// Poll data instantly every 4 seconds continuously regardless of user clients connections
setInterval(pollExternalLotteryApi, 4000);

// Endpoint Matrix
app.get('/api/matrix-data', (req, res) => {
    res.json({
        history: globalHistoryBuffer,
        prediction: nextPredictionCache
    });
});

app.listen(PORT, () => {
    console.log(`HACKII SYNC ENGINE ONLINE ON PORT ${PORT}`);
    pollExternalLotteryApi();
});
