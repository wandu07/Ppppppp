
let results = [];
const agents = Array.from({ length: 10 }, (_, i) => ({
    name: `A${i+1}`,
    predict: (history) => {
        if (i === 0) return 'B';
        if (i === 1) return 'P';
        const last = history.slice(-i - 1);
        return last.filter(r => r === 'B').length > last.filter(r => r === 'P').length ? 'B' : 'P';
    },
    correct: 0,
    total: 0
}));

function addResult(r) {
    results.push(r);
    updateAgents(r);
    showPrediction();
    updateHistory();
}

function updateAgents(latest) {
    agents.forEach(agent => {
        const pred = agent.predict(results.slice(0, -1));
        if (pred === latest) agent.correct++;
        agent.total++;
    });
}

function showPrediction() {
    const best = agents.reduce((a, b) => (a.correct / (a.total || 1)) > (b.correct / (b.total || 1)) ? a : b);
    const next = best.predict(results);
    const emoji = next === 'B' ? '🔴 뱅커' : next === 'P' ? '🔵 플레이어' : '🟢 타이';
    const percent = ((best.correct / (best.total || 1)) * 100).toFixed(1);
    document.getElementById("predictionArea").innerHTML = `
        <h2>🔥 다음 추천: <span style="color:yellow">${emoji}</span></h2>
        <div>📊 이유: ${best.name} - 전략 기반 (정답률 ${percent}%)</div>
        <div>🧠 지금까지 ${best.total}판 중 ${best.correct}판 적중</div>
    `;
}

function updateHistory() {
    const list = results.map(r => r === 'B' ? '🔴' : r === 'P' ? '🔵' : '🟢');
    document.getElementById("history").innerText = '결과: ' + list.join(' ');
}

function resetAll() {
    results = [];
    agents.forEach(a => (a.correct = 0, a.total = 0));
    document.getElementById("history").innerText = '';
    document.getElementById("predictionArea").innerText = '예측 없음';
}
