// --- SISTEMA DE RARIDADES (20 Tiers!) ---
const rarities = [
    { name: "Common", color: "#7f8c8d", weight: 35, bonusMult: 1.0, relicBonus: 5 },
    { name: "Uncommon", color: "#2ecc71", weight: 25, bonusMult: 1.5, relicBonus: 10 },
    { name: "Rare", color: "#3498db", weight: 15, bonusMult: 2.2, relicBonus: 15 },
    { name: "Epic", color: "#9b59b6", weight: 10, bonusMult: 3.5, relicBonus: 20 },
    { name: "Legendary", color: "#f1c40f", weight: 6, bonusMult: 6.0, relicBonus: 25 },
    { name: "Mythic", color: "#e67e22", weight: 4, bonusMult: 10.0, relicBonus: 35 },
    { name: "Celestial", color: "#1abc9c", weight: 2.5, bonusMult: 18.0, relicBonus: 50 },
    { name: "Void", color: "#8e44ad", weight: 1.5, bonusMult: 30.0, relicBonus: 75 },
    { name: "Ancient", color: "#c0392b", weight: 0.6, bonusMult: 50.0, relicBonus: 100 },
    { name: "Godly", color: "#ffffff", weight: 0.25, bonusMult: 100.0, relicBonus: 200 },
    { name: "Ethereal", color: "#00d2ff", weight: 0.1, bonusMult: 250, relicBonus: 350 },
    { name: "Infernal", color: "#ff4b2b", weight: 0.04, bonusMult: 500, relicBonus: 600 },
    { name: "Galactic", color: "#3a1c71", weight: 0.01, bonusMult: 1000, relicBonus: 1200 },
    { name: "Dimensional", color: "#ee0979", weight: 0.004, bonusMult: 2500, relicBonus: 3000 },
    { name: "Universal", color: "#ff00cc", weight: 0.001, bonusMult: 6000, relicBonus: 8000 },
    { name: "Eternal", color: "rainbow", weight: 0.0004, bonusMult: 15000, relicBonus: 20000 },
    { name: "Infinite", color: "#74ebd5", weight: 0.0001, bonusMult: 40000, relicBonus: 55000 },
    { name: "Omnipotent", color: "#f9d423", weight: 0.00004, bonusMult: 100000, relicBonus: 150000 },
    { name: "Manus God", color: "#ff0000", weight: 0.00001, bonusMult: 300000, relicBonus: 500000 },
    { name: "THE END", color: "#000000", weight: 0.000005, bonusMult: 1000000, relicBonus: 2000000 }
];

// --- TEMPLATES DE ITENS ---
const itemBases = {
    weapon: ["Espada", "Machado", "Cajado", "Arco", "Martelo", "Lança", "Adaga", "Katana", "Foice", "Cetro"],
    armor: ["Peitoral", "Túnica", "Armadura", "Manto", "Cota", "Vestimenta", "Couraça"],
    mount: ["Cavalo", "Lobo", "Tigre", "Dragão", "Fênix", "Unicórnio", "Grifo", "Quimera"],
    pet: ["Slime", "Fada", "Dragãozinho", "Gatinho", "Robô", "Espírito", "Demônio", "Anjo"]
};
const itemIcons = {
    weapon: ["🗡️", "🪓", "🪄", "🏹", "🔨", "🔱", "⚔️", "🔪", "🪚", "🔫"],
    armor: ["👕", "🛡️", "🥋", "🧥", "🛡️", "👔"],
    mount: ["🐎", "🐺", "🐅", "🐉", "🔥", "🦄", "🦅", "🦁"],
    pet: ["💧", "🧚", "🐲", "🐱", "🤖", "👻", "😈", "👼"]
};

// --- SISTEMA DE RELÍQUIAS ---
const relicTemplates = [
    { name: "Heart of Fire", icon: "💎", stat: "atk" },
    { name: "Eternal Soul", icon: "🧿", stat: "hp" },
    { name: "Ancient Shield", icon: "🛡️", stat: "def" },
    { name: "Void Eye", icon: "👁️", stat: "crit" },
    { name: "Ghost Wing", icon: "🕊️", stat: "evade" }
];

// --- SISTEMA DE ENCANTAMENTOS ---
const enchantStats = [
    { id: 'atk', name: 'Ataque', icon: '⚔️', base: 10 },
    { id: 'hp', name: 'Vida', icon: '❤️', base: 100 },
    { id: 'crit', name: 'Crítico', icon: '💥', base: 2 },
    { id: 'evade', name: 'Esquiva', icon: '💨', base: 2 },
    { id: 'lifeSteal', name: 'Roubo de Vida', icon: '🩸', base: 1 },
    { id: 'doubleAtk', name: 'Atk Duplo', icon: '⚡', base: 1 },
    { id: 'tripleAtk', name: 'Atk Triplo', icon: '🔥', base: 0.5 },
    { id: 'goldBonus', name: 'Bônus Ouro', icon: '💰', base: 5 },
    { id: 'expBonus', name: 'Bônus EXP', icon: '✨', base: 5 }
];

// --- JOGADOR ---
const player = {
    level: 1, exp: 0, nextLevelExp: 100, gold: 10000,
    baseHp: 500, baseAtk: 50, baseDef: 30,
    hp: 500, maxHp: 500, atk: 50, def: 30,
    crit: 5, evade: 5, lifeSteal: 0, goldBonus: 0, expBonus: 0,
    doubleAtk: 0, tripleAtk: 0, luck: 2.0, powerRating: 0,
    
    rebirths: 0, rebirthPoints: 0,
    rebirthUpgrades: { atkMult: 1, hpMult: 1, luckMult: 1, expMult: 1 },

    equipment: { weapon: null, armor: null, mount: null, pet: null },
    relics: [null, null, null, null, null],
    inventory: [],
    enchants: Array(10).fill(null),
    upgrades: { atk: 0, hp: 0, luck: 0 }
};

// --- MASMORRAS ---
let inDungeon = false;
let dungeonFloor = 0;
let currentDungeonType = "normal";
const MAX_DUNGEON_FLOORS = 10;

const monsterBases = [
    { name: "Slime", color: "#27ae60", hp: 100, atk: 20 },
    { name: "Bat", color: "#34495e", hp: 150, atk: 30 },
    { name: "Spider", color: "#8e44ad", hp: 250, atk: 50 },
    { name: "Skeleton", color: "#ecf0f1", hp: 450, atk: 80 },
    { name: "Demon", color: "#c0392b", hp: 1000, atk: 150 },
    { name: "Void Stalker", color: "#000", hp: 5000, atk: 500 },
    { name: "God Slayer", color: "#f1c40f", hp: 25000, atk: 2000 }
];

let currentEnemy = null;
let currentZone = 1;
let defeatedInZone = 0;
let isBattleActive = false;
let currentTurn = 'player';
let battleTimer = null;
let currentView = 'shop'; // 'shop' ou 'enchant'

// --- CORE FUNCTIONS ---

function calculateStats() {
    let totalHp = (player.baseHp + (player.level * 100) + (player.upgrades.hp * 500)) * player.rebirthUpgrades.hpMult;
    let totalAtk = (player.baseAtk + (player.level * 20) + (player.upgrades.atk * 100)) * player.rebirthUpgrades.atkMult;
    let totalDef = (player.baseDef + (player.level * 10));
    let totalCrit = 5;
    let totalEvade = 5;
    let totalLifeSteal = 0;
    let totalDoubleAtk = 0;
    let totalTripleAtk = 0;
    player.goldBonus = 0;
    player.expBonus = (player.rebirthUpgrades.expMult - 1) * 100;

    Object.values(player.equipment).forEach(item => {
        if (!item) return;
        if (item.stats) {
            if (item.stats.atk) totalAtk += item.stats.atk;
            if (item.stats.def) totalDef += item.stats.def;
            if (item.stats.hp) totalHp += item.stats.hp;
            if (item.stats.crit) totalCrit += item.stats.crit;
            if (item.stats.evade) totalEvade += item.stats.evade;
            if (item.stats.lifeSteal) totalLifeSteal += item.stats.lifeSteal;
            if (item.stats.doubleAtk) totalDoubleAtk += item.stats.doubleAtk;
            if (item.stats.tripleAtk) totalTripleAtk += item.stats.tripleAtk;
        }
    });

    player.enchants.forEach(en => {
        if (!en) return;
        if (en.stat === 'atk') totalAtk += en.value;
        if (en.stat === 'hp') totalHp += en.value;
        if (en.stat === 'crit') totalCrit += en.value;
        if (en.stat === 'evade') totalEvade += en.value;
        if (en.stat === 'lifeSteal') totalLifeSteal += en.value;
        if (en.stat === 'doubleAtk') totalDoubleAtk += en.value;
        if (en.stat === 'tripleAtk') totalTripleAtk += en.value;
        if (en.stat === 'goldBonus') player.goldBonus += en.value;
        if (en.stat === 'expBonus') player.expBonus += en.value;
    });

    if (player.equipment.weapon && player.equipment.armor && 
        player.equipment.weapon.rarity && player.equipment.armor.rarity &&
        player.equipment.weapon.rarity.name === player.equipment.armor.rarity.name) {
        totalAtk *= 1.5;
        totalHp *= 1.5;
    }

    let atkMult = 1, hpMult = 1, defMult = 1, critMult = 1, evadeMult = 1;
    player.relics.forEach(relic => {
        if (!relic) return;
        const bonus = relic.bonusValue / 100;
        if (relic.stat === 'atk') atkMult += bonus;
        if (relic.stat === 'hp') hpMult += bonus;
        if (relic.stat === 'def') defMult += bonus;
        if (relic.stat === 'crit') critMult += bonus;
        if (relic.stat === 'evade') evadeMult += bonus;
    });

    player.atk = totalAtk * atkMult;
    player.maxHp = totalHp * hpMult;
    player.def = totalDef * defMult;
    player.crit = totalCrit * critMult;
    player.evade = totalEvade * evadeMult;
    player.lifeSteal = totalLifeSteal;
    player.doubleAtk = totalDoubleAtk;
    player.tripleAtk = totalTripleAtk;

    player.powerRating = Math.floor((player.atk * 2) + (player.maxHp / 5) + (player.def * 3) + (player.crit * 50) + (player.evade * 50) + (player.doubleAtk * 100) + (player.tripleAtk * 500));
}

function updateUI() {
    const el = (id) => document.getElementById(id);
    if (!el('player-level')) return;

    el('player-level').textContent = player.level;
    el('player-gold').textContent = formatNumber(player.gold);
    el('player-hp-text').textContent = `${formatNumber(Math.max(0, Math.ceil(player.hp)))}/${formatNumber(Math.ceil(player.maxHp))}`;
    el('player-hp-bar-inner').style.width = `${(player.hp / player.maxHp) * 100}%`;
    el('player-exp-bar').style.width = `${(player.exp / player.nextLevelExp) * 100}%`;
    el('zone-display').textContent = inDungeon ? `DUNGEON ${currentDungeonType.toUpperCase()} F${dungeonFloor}` : currentZone;

    el('stat-atk').textContent = formatNumber(Math.floor(player.atk));
    el('stat-hp').textContent = formatNumber(Math.floor(player.maxHp));
    el('stat-def').textContent = formatNumber(Math.floor(player.def));
    el('stat-crit').textContent = player.crit.toFixed(1) + "%";
    el('stat-evade').textContent = player.evade.toFixed(1) + "%";
    el('stat-lifesteal').textContent = player.lifeSteal.toFixed(1) + "%";
    el('stat-luck').textContent = (player.luck * player.rebirthUpgrades.luckMult).toFixed(1) + "x";
    el('stat-pr').textContent = formatNumber(player.powerRating);
    
    if (!el('stat-double')) {
        const statsList = el('stats-list');
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `<span>⚡ ATK DUPLO:</span> <span id="stat-double" class="val">0%</span>`;
        statsList.insertBefore(row, statsList.children[6]);
        const row2 = document.createElement('div');
        row2.className = 'stat-row';
        row2.innerHTML = `<span>🔥 ATK TRIPLO:</span> <span id="stat-triple" class="val">0%</span>`;
        statsList.insertBefore(row2, statsList.children[7]);
        const row3 = document.createElement('div');
        row3.className = 'stat-row';
        row3.style.color = "#00d2ff";
        row3.innerHTML = `<span>🔄 REBIRTHS:</span> <span id="stat-rebirths" class="val">0</span>`;
        statsList.insertBefore(row3, statsList.children[0]);
    }
    el('stat-double').textContent = player.doubleAtk.toFixed(1) + "%";
    el('stat-triple').textContent = player.tripleAtk.toFixed(1) + "%";
    el('stat-rebirths').textContent = player.rebirths;

    if (currentEnemy) {
        el('enemy-hp-text').textContent = `${formatNumber(Math.max(0, Math.ceil(currentEnemy.hp)))}/${formatNumber(currentEnemy.maxHp)}`;
        el('enemy-hp-bar-inner').style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;
        el('enemy-name').textContent = currentEnemy.name;
    }

    ['weapon', 'armor', 'mount', 'pet'].forEach(type => {
        const slot = el(`slot-${type}`);
        const item = player.equipment[type];
        slot.textContent = item ? item.icon : (type === 'weapon' ? '⚔️' : type === 'armor' ? '🛡️' : type === 'mount' ? '🐎' : '🐾');
        slot.className = `slot ${getRarityClass(item)}`;
        slot.onmouseover = item ? (e) => showTooltip(e, item) : null;
        slot.onmouseout = hideTooltip;
    });

    const relicContainer = el('relic-slots');
    relicContainer.innerHTML = '';
    player.relics.forEach((relic, i) => {
        const div = document.createElement('div');
        div.className = `slot relic-slot ${getRarityClass(relic)}`;
        div.textContent = relic ? relic.icon : '💠';
        if (relic) {
            div.onmouseover = (e) => showTooltip(e, relic);
            div.onmouseout = hideTooltip;
            div.onclick = () => unequipRelic(i);
        }
        relicContainer.appendChild(div);
    });

    if (currentView === 'shop') updateShopUI();
    else updateEnchantUI();
    
    updateInventoryUI();
    updateDropPanel();
}

function getRarityClass(item) {
    if (!item) return '';
    return (item.rarity.name || item.rarity).toLowerCase().replace(' ', '-');
}

function formatNumber(num) {
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num);
}

function updateShopUI() {
    const shop = document.getElementById('shop-container');
    if (!shop) return;
    
    const atkCost = 100 + player.upgrades.atk * 200;
    const hpCost = 100 + player.upgrades.hp * 200;
    const luckCost = 1000 + player.upgrades.luck * 2000;
    const canRebirth = player.level >= 100;

    shop.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
            <button class="shop-btn" onclick="buyUpgrade('atk', 100, 200)">ATK (💰${formatNumber(atkCost)})</button>
            <button class="shop-btn" onclick="buyUpgrade('hp', 100, 200)">HP (💰${formatNumber(hpCost)})</button>
        </div>
        <button class="shop-btn" onclick="buyUpgrade('luck', 1000, 2000)">SORTE (💰${formatNumber(luckCost)})</button>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:5px;">
            <button class="shop-btn" style="background:#8e44ad;" onclick="toggleDungeon('normal')">DUNGEON</button>
            <button class="shop-btn" style="background:#c0392b;" onclick="toggleDungeon('hell')">HELL</button>
        </div>
        <button class="shop-btn" style="background:#27ae60; margin-top:5px;" onclick="sellAll()">VENDER TUDO (💰)</button>
        <button class="shop-btn" style="background:${canRebirth ? '#00d2ff' : '#333'}; margin-top:5px;" onclick="performRebirth()">REBIRTH (LV 100+)</button>
        <button class="shop-btn" style="background:#f1c40f; color:#000; font-weight:bold;" onclick="showRebirthShop()">LOJA DE REBIRTH (✨${player.rebirthPoints})</button>
        <button class="shop-btn" style="background:#3498db; margin-top:10px;" onclick="switchView('enchant')">⚙️ ABA DE ENCANTAMENTOS</button>
    `;
}

function updateEnchantUI() {
    const shop = document.getElementById('shop-container');
    if (!shop) return;
    const cost = 1000 + (player.level * 500);
    
    shop.innerHTML = `
        <h3 style="color:#3498db; margin-bottom:5px;">ENCANTAMENTOS</h3>
        <p style="font-size:10px; color:#888; margin-bottom:10px;">Gire para ganhar bônus de Tier 1 a 100!</p>
        <div class="enchant-grid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:5px; margin-bottom:10px;">
            ${player.enchants.map((en, i) => {
                const locked = i >= Math.floor(player.level / 5) + 1;
                return `<div class="enchant-slot ${locked ? 'locked' : ''}" 
                             style="border:2px solid ${en ? en.color : '#444'}; background:#000; aspect-ratio:1; display:flex; align-items:center; justify-content:center; cursor:${locked ? 'not-allowed' : 'pointer'}"
                             onclick="${locked ? '' : `rollEnchant(${i})`}"
                             title="${en ? `${en.name}: ${en.statName} +${en.value}` : (locked ? 'Bloqueado (LV '+(i*5)+')' : 'Girar (💰'+formatNumber(cost)+')')}">
                             ${en ? en.icon : (locked ? '🔒' : '✨')}
                        </div>`;
            }).join('')}
        </div>
        <div style="background:#000; padding:5px; border-radius:5px; font-size:10px; color:#aaa; margin-bottom:10px;">
            Custo atual: 💰${formatNumber(cost)}
        </div>
        <button class="shop-btn" style="background:#333;" onclick="switchView('shop')">VOLTAR PARA LOJA</button>
    `;
}

function switchView(view) {
    currentView = view;
    updateUI();
}

function updateDropPanel() {
    let panel = document.getElementById('drop-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'drop-panel';
        panel.style.position = 'absolute';
        panel.style.bottom = '180px';
        panel.style.left = '15px';
        panel.style.width = '220px';
        panel.style.background = 'rgba(0,0,0,0.9)';
        panel.style.border = '1px solid #444';
        panel.style.borderRadius = '8px';
        panel.style.padding = '10px';
        panel.style.fontSize = '10px';
        panel.style.maxHeight = '250px';
        panel.style.overflowY = 'auto';
        document.getElementById('game-container').appendChild(panel);
    }
    
    if (!currentEnemy) { panel.innerHTML = 'Buscando inimigo...'; return; }
    
    const luck = player.luck * player.rebirthUpgrades.luckMult;
    let html = `<h4 style="color:#f1c40f; margin-bottom:5px; text-align:center;">DROPS POSSÍVEIS (${currentEnemy.name})</h4>`;
    
    const relicChance = currentEnemy.isBoss ? 60 : 10;
    html += `<div style="display:flex; justify-content:space-between; margin-bottom:2px;"><span>💠 Relíquia</span> <span style="color:#00d2ff">${relicChance}%</span></div>`;
    html += `<div style="border-top:1px solid #333; margin:5px 0; padding-top:5px;"></div>`;
    
    const totalWeight = rarities.reduce((acc, r) => acc + r.weight, 0);
    const luckFactor = Math.pow(luck, 0.7); 

    rarities.forEach((r, idx) => {
        let baseChance = (r.weight / totalWeight) * 100;
        let actualChance;
        
        if (idx === 0) { // Common
            actualChance = Math.max(1, baseChance / luckFactor);
        } else {
            actualChance = baseChance * luckFactor;
        }
        
        if (actualChance > 100) actualChance = 100;
        if (actualChance < 0.000001) return;
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:1px;"><span style="color:${r.color === 'rainbow' ? '#fff' : r.color}">${r.name}</span> <span>${actualChance.toFixed(4)}%</span></div>`;
    });
    
    panel.innerHTML = html;
}

function sellAll() {
    let totalGain = 0;
    player.inventory.forEach(item => {
        const rarityIdx = rarities.findIndex(r => r.name === (item.rarity.name || item.rarity));
        totalGain += (rarityIdx + 1) * 500;
    });
    player.gold += totalGain;
    player.inventory = [];
    logMessage(`💰 Vendeu tudo por ${formatNumber(totalGain)} de Ouro!`);
    updateUI();
}

function performRebirth() {
    if (player.level < 100) { logMessage(`❌ Nível insuficiente para Rebirth!`); return; }
    const points = Math.floor(player.level / 100);
    player.rebirths++;
    player.rebirthPoints += points;
    player.level = 1;
    player.exp = 0;
    player.nextLevelExp = 100;
    player.gold = 1000;
    player.upgrades = { atk: 0, hp: 0, luck: 0 };
    defeatedInZone = 0;
    calculateStats();
    player.hp = player.maxHp;
    logMessage(`🔄 REBIRTH REALIZADO! Ganhou ${points} Pontos.`);
    updateUI();
    spawnEnemy();
}

function showRebirthShop() {
    const shop = document.getElementById('shop-container');
    shop.innerHTML = `
        <h3 style="color:#00d2ff">LOJA DE REBIRTH (✨${player.rebirthPoints})</h3>
        <button class="shop-btn" onclick="buyRebirthUpgrade('atkMult')">Ataque x1.5 (✨1)</button>
        <button class="shop-btn" onclick="buyRebirthUpgrade('hpMult')">Vida x1.5 (✨1)</button>
        <button class="shop-btn" onclick="buyRebirthUpgrade('luckMult')">Sorte x1.5 (✨2)</button>
        <button class="shop-btn" onclick="buyRebirthUpgrade('expMult')">EXP x2.0 (✨2)</button>
        <button class="shop-btn" style="background:#444" onclick="updateUI()">VOLTAR</button>
    `;
}

function buyRebirthUpgrade(type) {
    const cost = (type === 'luckMult' || type === 'expMult') ? 2 : 1;
    if (player.rebirthPoints >= cost) {
        player.rebirthPoints -= cost;
        if (type === 'expMult') player.rebirthUpgrades[type] *= 2;
        else player.rebirthUpgrades[type] *= 1.5;
        calculateStats();
        logMessage(`✨ Upgrade de Rebirth adquirido!`);
        showRebirthShop();
    } else {
        logMessage(`❌ Pontos insuficientes!`);
    }
}

function toggleDungeon(type = "normal") {
    isBattleActive = false;
    clearTimeout(battleTimer);
    if (inDungeon && currentDungeonType === type) {
        inDungeon = false;
        dungeonFloor = 0;
        logMessage(`🚪 Você saiu da masmorra.`);
    } else {
        inDungeon = true;
        currentDungeonType = type;
        dungeonFloor = 1;
        logMessage(`🏰 Você entrou na Masmorra ${type.toUpperCase()}!`);
    }
    spawnEnemy();
}

function spawnEnemy() {
    isBattleActive = false;
    clearTimeout(battleTimer);
    const isBoss = inDungeon ? (dungeonFloor % 5 === 0) : ((defeatedInZone + 1) % 10 === 0);
    const base = monsterBases[Math.min(currentZone - 1, monsterBases.length - 1)];
    let zMult = 1 + (currentZone - 1) * 2;
    if (inDungeon) zMult *= (dungeonFloor * (currentDungeonType === 'hell' ? 15 : 4));
    const bMult = isBoss ? (inDungeon ? 20 : 6) : 1;

    currentEnemy = {
        name: isBoss ? `BOSS ${base.name.toUpperCase()}` : base.name,
        hp: Math.floor(base.hp * zMult * bMult), maxHp: Math.floor(base.hp * zMult * bMult),
        atk: Math.floor(base.atk * zMult * bMult), def: Math.floor(20 * zMult),
        gold: Math.floor(100 * zMult * bMult), exp: Math.floor(200 * zMult * bMult),
        isBoss: isBoss, color: inDungeon ? (currentDungeonType === 'hell' ? "#ff0000" : "#8e44ad") : base.color, scale: isBoss ? 1.7 : 1
    };
    
    const sprite = document.getElementById('enemy-sprite');
    if (sprite) {
        sprite.style.backgroundColor = currentEnemy.color;
        sprite.style.transform = `scale(${currentEnemy.scale})`;
    }
    
    const typeEl = document.getElementById('enemy-type');
    if (typeEl) {
        typeEl.textContent = isBoss ? "BOSS" : (inDungeon ? `F${dungeonFloor}` : "ZONA " + currentZone);
        typeEl.className = `badge ${isBoss ? 'boss' : ''}`;
    }
    
    isBattleActive = true; 
    currentTurn = 'player';
    updateUI();
    battleTimer = setTimeout(battleLoop, 800);
}

function battleLoop() {
    if (!isBattleActive || !currentEnemy) return;
    if (currentTurn === 'player') { performAttack(player, currentEnemy); currentTurn = 'enemy'; }
    else { performAttack(currentEnemy, player); currentTurn = 'player'; }
    if (isBattleActive) battleTimer = setTimeout(battleLoop, 1000);
}

function performAttack(att, def) {
    if (!isBattleActive || !currentEnemy) return;
    const isPlayer = att === player;
    if (!isPlayer && Math.random() * 100 < player.evade) { logMessage(`💨 ESQUIVA!`); return; }
    
    let hits = 1;
    if (isPlayer) {
        if (Math.random() * 100 < player.tripleAtk) { hits = 3; logMessage(`🔥 TRIPLO!`); }
        else if (Math.random() * 100 < player.doubleAtk) { hits = 2; logMessage(`⚡ DUPLO!`); }
    }

    for (let i = 0; i < hits; i++) {
        if (def.hp <= 0) break;
        let mult = 1; let crit = false;
        if (isPlayer && Math.random() * 100 < player.crit) { mult = 3.5; crit = true; }
        let dmg = Math.floor((att.atk - (def.def * 0.4)) * (Math.random() * 0.2 + 0.9) * mult);
        dmg = Math.max(Math.floor(att.atk * 0.3), dmg);
        def.hp -= dmg;
        if (isPlayer && player.lifeSteal > 0) player.hp = Math.min(player.maxHp, player.hp + Math.floor(dmg * (player.lifeSteal / 100)));
        logMessage(`${crit ? '💥 CRIT! ' : ''}${isPlayer ? 'Você' : att.name} causou ${formatNumber(dmg)} dano.`);
    }

    const s = isPlayer ? document.getElementById('player-sprite') : document.getElementById('enemy-sprite');
    const d = isPlayer ? document.getElementById('enemy-sprite') : document.getElementById('player-sprite');
    if (s && d) {
        s.classList.add(isPlayer ? 'attack-player' : 'attack-enemy');
        setTimeout(() => { 
            s.classList.remove(isPlayer ? 'attack-player' : 'attack-enemy'); 
            d.classList.add('damage-flash'); 
            setTimeout(() => d.classList.remove('damage-flash'), 150); 
        }, 150);
    }
    updateUI();
    if (def.hp <= 0) { isBattleActive = false; clearTimeout(battleTimer); setTimeout(() => handleVictory(isPlayer), 500); }
}

function handleVictory(isPlayer) {
    if (isPlayer) {
        const goldGain = Math.floor(currentEnemy.gold * (1 + player.goldBonus / 100));
        const expGain = Math.floor(currentEnemy.exp * (1 + player.expBonus / 100));
        player.gold += goldGain; player.exp += expGain;
        logMessage(`✨ Vitória! +${formatNumber(goldGain)} Ouro, +${formatNumber(expGain)} EXP.`);
        if (inDungeon) {
            if (dungeonFloor < MAX_DUNGEON_FLOORS) { dungeonFloor++; logMessage(`🔼 Andar ${dungeonFloor}...`); }
            else { inDungeon = false; dungeonFloor = 0; logMessage(`🏆 CONCLUÍDA!`); rollLoot(true); }
        } else {
            defeatedInZone++;
            if (currentEnemy.isBoss) { currentZone++; defeatedInZone = 0; logMessage(`🚀 ZONA ${currentZone}!`); }
        }
        checkLevelUp(); rollLoot();
        setTimeout(() => { player.hp = Math.min(player.maxHp, player.hp + (player.maxHp * 0.5)); spawnEnemy(); }, 1000);
    } else {
        logMessage(`💀 Derrotado!`);
        if (inDungeon) { inDungeon = false; dungeonFloor = 0; }
        defeatedInZone = 0; player.hp = player.maxHp;
        setTimeout(spawnEnemy, 2000);
    }
}

function rollLoot(guaranteedSuperRarity = false) {
    if (!currentEnemy) return;
    const relicLuck = currentEnemy.isBoss ? 0.6 : 0.1;
    if (Math.random() < relicLuck) {
        const relic = generateRelic();
        player.inventory.push(relic);
        logMessage(`💠 RELÍQUIA: <span class="${getRarityClass(relic)}">[${relic.rarity.name}] ${relic.name}</span>`);
    }
    const itemRolls = currentEnemy.isBoss ? 2 : (Math.random() < 0.5 ? 1 : 0);
    for (let i = 0; i < itemRolls; i++) {
        const item = generateItem(null, guaranteedSuperRarity ? rarities[15] : null);
        player.inventory.push(item);
        logMessage(`🎁 DROP: <span class="${getRarityClass(item)}">[${item.rarity.name}] ${item.name}</span>`);
    }
    updateInventoryUI();
}

function generateRelic() {
    const template = relicTemplates[Math.floor(Math.random() * relicTemplates.length)];
    const luck = player.luck * player.rebirthUpgrades.luckMult;
    const totalWeight = rarities.reduce((acc, r) => acc + r.weight, 0);
    const luckFactor = Math.pow(luck, 0.7);
    let roll = Math.random() * totalWeight;
    if (roll < totalWeight / 2) roll /= luckFactor; // Aumenta chance de itens raros
    
    let cumulative = 0;
    let rarity = rarities[0];
    for (const r of rarities) {
        cumulative += r.weight;
        if (roll <= cumulative) { rarity = r; break; }
    }
    return { id: Math.random().toString(36).substr(2, 9), name: template.name, icon: template.icon, type: 'relic', stat: template.stat, rarity: rarity, bonusValue: rarity.relicBonus };
}

function generateItem(type = null, forcedRarity = null) {
    if (!type) type = ['weapon', 'armor', 'mount', 'pet'][Math.floor(Math.random() * 4)];
    const nameBase = itemBases[type][Math.floor(Math.random() * itemBases[type].length)];
    const icon = itemIcons[type][Math.floor(Math.random() * itemIcons[type].length)];
    const luck = player.luck * player.rebirthUpgrades.luckMult;
    
    let rarity = forcedRarity;
    if (!rarity) {
        const totalWeight = rarities.reduce((acc, r) => acc + r.weight, 0);
        const luckFactor = Math.pow(luck, 0.7);
        let roll = Math.random() * totalWeight;
        if (roll < totalWeight / 2) roll /= luckFactor;
        let cumulative = 0; rarity = rarities[0];
        for (const r of rarities) { cumulative += r.weight; if (roll <= cumulative) { rarity = r; break; } }
    }
    
    const m = rarity.bonusMult; const stats = {};
    if (type === 'weapon') { stats.atk = Math.floor(50 * m); stats.crit = Math.floor(5 * (1 + Math.log10(m))); stats.doubleAtk = m > 10 ? Math.min(50, m/10) : 0; }
    else if (type === 'armor') { stats.def = Math.floor(30 * m); stats.evade = Math.floor(4 * (1 + Math.log10(m))); }
    else if (type === 'mount') { stats.hp = Math.floor(200 * m); stats.lifeSteal = Math.floor(2 * (1 + Math.log10(m))); }
    else { stats.atk = Math.floor(30 * m); stats.hp = Math.floor(100 * m); stats.tripleAtk = m > 100 ? Math.min(20, m/100) : 0; }
    return { id: Math.random().toString(36).substr(2, 9), name: `${rarity.name} ${nameBase}`, icon, type, rarity, stats };
}

function equipRelic(inventoryIndex) {
    const relic = player.inventory[inventoryIndex];
    let emptyIndex = player.relics.indexOf(null);
    if (emptyIndex !== -1) { player.relics[emptyIndex] = relic; player.inventory.splice(inventoryIndex, 1); calculateStats(); updateUI(); }
}

function unequipRelic(relicIndex) {
    const relic = player.relics[relicIndex];
    if (relic) { player.inventory.push(relic); player.relics[relicIndex] = null; calculateStats(); updateUI(); }
}

function rollEnchant(slotIndex) {
    const cost = 1000 + (player.level * 500);
    if (player.gold < cost) { logMessage(`❌ Ouro insuficiente`); return; }
    player.gold -= cost;
    const tier = Math.floor(Math.random() * 100);
    const stat = enchantStats[Math.floor(Math.random() * enchantStats.length)];
    const power = 1 + (tier * 1.5);
    let val = Math.floor(stat.base * power);
    player.enchants[slotIndex] = { name: `Tier ${tier+1}`, stat: stat.id, statName: stat.name, value: val, icon: stat.icon, color: `hsl(${(tier * 3.6) % 360}, 80%, 60%)` };
    calculateStats(); updateUI();
    logMessage(`✨ Encanto ${stat.name} +${val} aplicado!`);
}

function buyUpgrade(stat, base, scale) {
    const cost = base + player.upgrades[stat] * scale;
    if (player.gold >= cost) { 
        player.gold -= cost; player.upgrades[stat]++; 
        if (stat === 'luck') player.luck *= 1.1; 
        calculateStats(); updateUI(); logMessage(`🔥 Upgrade ${stat.toUpperCase()}!`); 
    } else logMessage(`❌ Ouro insuficiente`);
}

function checkLevelUp() {
    while (player.exp >= player.nextLevelExp) {
        player.level++; player.exp -= player.nextLevelExp; 
        player.nextLevelExp = Math.floor(player.nextLevelExp * 1.5);
        calculateStats(); player.hp = player.maxHp;
        logMessage(`🎊 NÍVEL ${player.level}! 🎊`);
    }
}

function showTooltip(e, item) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    tooltip.style.display = 'block'; 
    tooltip.style.borderColor = (item.rarity.color === 'rainbow') ? '#fff' : (item.rarity.color || '#fff');
    if (item.rarity.color === 'rainbow') tooltip.classList.add('eternal-glow');
    else tooltip.classList.remove('eternal-glow');

    let sHtml = '';
    if (item.type === 'relic') sHtml = `<div class="tooltip-stat"><span>BÔNUS:</span> <span class="stat-up">+${item.bonusValue}% ${item.stat.toUpperCase()}</span></div>`;
    else if (item.stats) {
        const current = player.equipment[item.type];
        Object.keys(item.stats).forEach(s => {
            const v = item.stats[s] || 0; const cV = current ? (current.stats[s] || 0) : 0;
            const diff = v - cV;
            const dText = diff > 0 ? `<span class="stat-up">+${formatNumber(diff)}</span>` : (diff < 0 ? `<span class="stat-down">${formatNumber(diff)}</span>` : `<span style="color:#888">0</span>`);
            sHtml += `<div class="tooltip-stat"><span>${s.toUpperCase()}:</span> <span>${formatNumber(v)} (${dText})</span></div>`;
        });
    }
    tooltip.innerHTML = `<div class="tooltip-header" style="color:${item.rarity.color === 'rainbow' ? '#fff' : item.rarity.color}">${item.name}</div><div style="font-size:11px; color:#888; margin-bottom:10px;">Tipo: ${item.type.toUpperCase()}</div><div style="background:#111; padding:10px; border-radius:5px;">${sHtml}</div><div style="font-size:10px; color:#f1c40f; margin-top:10px; text-align:center;">CLIQUE PARA EQUIPAR</div>`;
    
    const rect = e.target.getBoundingClientRect(); 
    tooltip.style.visibility = 'hidden'; tooltip.style.display = 'block'; 
    const tRect = tooltip.getBoundingClientRect(); tooltip.style.visibility = 'visible';
    let left = rect.left + (rect.width / 2) - (tRect.width / 2); let top = rect.top - tRect.height - 15;
    if (left < 20) left = 20; if (left + tRect.width > window.innerWidth - 20) left = window.innerWidth - tRect.width - 20;
    if (top < 20) top = rect.bottom + 15;
    tooltip.style.left = left + 'px'; tooltip.style.top = top + 'px';
}
function hideTooltip() { const tooltip = document.getElementById('tooltip'); if (tooltip) tooltip.style.display = 'none'; }

function updateInventoryUI() {
    const grid = document.getElementById('inventory-grid'); if (!grid) return;
    grid.innerHTML = '';
    player.inventory.forEach((item, i) => {
        const div = document.createElement('div'); div.className = `item-slot ${getRarityClass(item)}`; div.textContent = item.icon;
        div.onmouseover = (e) => showTooltip(e, item); div.onmouseout = hideTooltip;
        div.onclick = () => { const idx = player.inventory.indexOf(item); if (item.type === 'relic') equipRelic(idx); else equipItem(idx); hideTooltip(); };
        grid.appendChild(div);
    });
}

function equipItem(i) {
    const item = player.inventory[i];
    if (player.equipment[item.type]) player.inventory.push(player.equipment[item.type]);
    player.equipment[item.type] = item; player.inventory.splice(i, 1);
    calculateStats(); updateUI();
}

function logMessage(msg) {
    const log = document.getElementById('battle-log'); if (!log) return;
    const p = document.createElement('p'); p.innerHTML = msg; log.appendChild(p);
    log.scrollTop = log.scrollHeight; if (log.children.length > 30) log.removeChild(log.firstChild);
}

window.onload = () => { calculateStats(); spawnEnemy(); };
