// --- CONFIGURAÇÕES E DADOS ---
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

const relicTemplates = [
    { name: "Olho de Odin", icon: "👁️", stat: "atk" },
    { name: "Coração de Dragão", icon: "❤️", stat: "hp" },
    { name: "Anel do Destino", icon: "💍", stat: "luck" },
    { name: "Mão de Midas", icon: "✋", stat: "goldBonus" },
    { name: "Pena de Fênix", icon: "🪶", stat: "speed" }
];

const enchantStats = [
    { id: 'atk', name: 'Ataque', icon: '⚔️', base: 50 },
    { id: 'hp', name: 'Vida', icon: '❤️', base: 200 },
    { id: 'crit', name: 'Crítico', icon: '💥', base: 2 },
    { id: 'evade', name: 'Esquiva', icon: '💨', base: 2 },
    { id: 'speed', name: 'Velocidade', icon: '👟', base: 5 },
    { id: 'goldBonus', name: 'Ouro %', icon: '💰', base: 10 },
    { id: 'expBonus', name: 'EXP %', icon: '✨', base: 10 }
];

// --- ESTADO DO JOGO ---
let player = {
    level: 1, exp: 0, nextLevelExp: 100, gold: 10000,
    baseHp: 500, baseAtk: 50, baseDef: 30,
    hp: 500, maxHp: 500, atk: 50, def: 30,
    crit: 5, evade: 5, lifeSteal: 0, goldBonus: 0, expBonus: 0,
    doubleAtk: 0, tripleAtk: 0, thorns: 0, speed: 100, luck: 2.0, powerRating: 0,
    finalLuckMult: 1, critDmg: 3.5,
    rebirths: 0, rebirthPoints: 0, talentPoints: 0,
    talentsOwned: {}, 
    rebirthUpgrades: { atkMult: 1, hpMult: 1, luckMult: 1, expMult: 1 },
    equipment: { weapon: null, armor: null, mount: null, pet: null },
    relics: [null, null, null, null, null],
    inventory: [],
    enchants: Array(10).fill(null),
    upgrades: { atk: 0, hp: 0, luck: 0 },
    debuffs: [] 
};

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
let currentView = 'shop';
let inDungeon = false;
let currentDungeonType = 'normal';
let dungeonFloor = 0;
let temporaryLuck = 0;
let luckTimer = null;
const MAX_DUNGEON_FLOORS = 50;

// --- UTILITÁRIOS ---
const el = (id) => document.getElementById(id);

function n(val, fallback = 0) {
    const num = Number(val);
    return isNaN(num) || !isFinite(num) ? fallback : num;
}

function formatNumber(num) {
    const val = n(num);
    if (val >= 1e21) return (val / 1e21).toFixed(2) + 'S';
    if (val >= 1e18) return (val / 1e18).toFixed(2) + 'E';
    if (val >= 1e15) return (val / 1e15).toFixed(2) + 'Q';
    if (val >= 1e12) return (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
    return Math.floor(val).toString();
}

// --- LÓGICA DE ATRIBUTOS ---
function calculateStats() {
    let totalHp = (n(player.baseHp, 500) + (n(player.level, 1) * 100) + (n(player.upgrades.hp) * 500)) * n(player.rebirthUpgrades.hpMult, 1);
    let totalAtk = (n(player.baseAtk, 50) + (n(player.level, 1) * 20) + (n(player.upgrades.atk) * 100)) * n(player.rebirthUpgrades.atkMult, 1);
    let totalDef = (n(player.baseDef, 30) + (n(player.level, 1) * 10));
    let totalCrit = 5;
    let totalEvade = 5;
    let totalLifeSteal = 0;
    let totalDoubleAtk = 0;
    let totalTripleAtk = 0;
    let totalThorns = 0;
    let totalSpeed = 100;
    let totalCritDmg = 3.5; 
    let totalLuckMult = 1;

    const t = player.talentsOwned || {};
    if (t.crit_dmg) totalCritDmg += (n(t.crit_dmg) * 0.2);
    if (t.double_chance) totalDoubleAtk += (n(t.double_chance) * 5);
    if (t.triple_chance) totalTripleAtk += (n(t.triple_chance) * 2);
    if (t.lifesteal_buff) totalLifeSteal += (n(t.lifesteal_buff) * 5);

    player.goldBonus = 0;
    player.expBonus = (n(player.rebirthUpgrades.expMult, 1) - 1) * 100;

    Object.values(player.equipment || {}).forEach(item => {
        if (!item || !item.stats) return;
        const s = item.stats;
        if (s.atk) totalAtk += n(s.atk);
        if (s.def) totalDef += n(s.def);
        if (s.hp) totalHp += n(s.hp);
        if (s.crit) totalCrit += n(s.crit);
        if (s.evade) totalEvade += n(s.evade);
        if (s.lifeSteal) totalLifeSteal += n(s.lifeSteal);
        if (s.doubleAtk) totalDoubleAtk += n(s.doubleAtk);
        if (s.tripleAtk) totalTripleAtk += n(s.tripleAtk);
        if (s.thorns) totalThorns += n(s.thorns);
        if (s.speed) totalSpeed += n(s.speed);
    });

    (player.relics || []).forEach(relic => {
        if (!relic) return;
        const bonus = 1 + (n(relic.bonusValue) / 100);
        if (relic.stat === 'atk') totalAtk *= bonus;
        if (relic.stat === 'hp') totalHp *= bonus;
        if (relic.stat === 'luck') totalLuckMult *= bonus;
        if (relic.stat === 'speed') totalSpeed *= bonus;
        if (relic.stat === 'goldBonus') player.goldBonus += n(relic.bonusValue);
    });

    (player.enchants || []).forEach(en => {
        if (!en) return;
        const val = n(en.value);
        if (en.stat === 'atk') totalAtk += val;
        if (en.stat === 'hp') totalHp += val;
        if (en.stat === 'crit') totalCrit += val;
        if (en.stat === 'evade') totalEvade += val;
        if (en.stat === 'lifeSteal') totalLifeSteal += val;
        if (en.stat === 'doubleAtk') totalDoubleAtk += val;
        if (en.stat === 'tripleAtk') totalTripleAtk += val;
        if (en.stat === 'thorns') totalThorns += val;
        if (en.stat === 'speed') totalSpeed += val;
        if (en.stat === 'goldBonus') player.goldBonus += val;
        if (en.stat === 'expBonus') player.expBonus += val;
    });

    player.maxHp = Math.max(1, Math.floor(totalHp));
    player.atk = Math.max(1, Math.floor(totalAtk));
    player.def = Math.max(0, Math.floor(totalDef));
    player.crit = totalCrit;
    player.evade = Math.min(75, totalEvade);
    player.lifeSteal = totalLifeSteal;
    player.doubleAtk = totalDoubleAtk;
    player.tripleAtk = totalTripleAtk;
    player.thorns = Math.floor(totalThorns);
    player.speed = Math.max(10, totalSpeed);
    player.critDmg = n(totalCritDmg, 3.5);
    player.finalLuckMult = n(player.rebirthUpgrades.luckMult, 1) * totalLuckMult;
    
    player.powerRating = Math.floor((player.atk * 2) + (player.maxHp / 5) + (player.def * 3) + (player.crit * 50) + (player.evade * 50) + (player.doubleAtk * 100) + (player.tripleAtk * 500) + (player.thorns * 5) + (player.speed * 2));
}

// --- INTERFACE ---
function updateUI() {
    if (!el('player-level')) return;
    el('player-level').textContent = player.level;
    el('player-gold').textContent = formatNumber(player.gold);
    el('player-exp-bar').style.width = `${(n(player.exp) / n(player.nextLevelExp, 100)) * 100}%`;
    el('zone-display').textContent = inDungeon ? `Dungeon F${dungeonFloor}` : currentZone;
    
    const curHp = n(player.hp);
    const maxHp = n(player.maxHp, 1);
    el('player-hp-text').textContent = `${formatNumber(curHp)}/${formatNumber(maxHp)}`;
    el('player-hp-bar-inner').style.width = `${Math.min(100, Math.max(0, (curHp / maxHp) * 100))}%`;
    
    el('stat-atk').textContent = formatNumber(player.atk);
    el('stat-hp').textContent = formatNumber(player.maxHp);
    el('stat-def').textContent = formatNumber(player.def);
    el('stat-crit').textContent = n(player.crit).toFixed(1) + "%";
    el('stat-evade').textContent = n(player.evade).toFixed(1) + "%";
    el('stat-lifesteal').textContent = n(player.lifeSteal).toFixed(1) + "%";
    el('stat-luck').textContent = (n(player.luck, 2) * n(player.finalLuckMult, 1)).toFixed(1) + "x";
    el('stat-pr').textContent = formatNumber(player.powerRating);
    
    if (!el('stat-double')) {
        const statsList = el('stats-list');
        const rows = [
            { id: 'stat-rebirths', label: '🔄 REBIRTHS', color: '#00d2ff' },
            { id: 'stat-double', label: '⚡ ATK DUPLO', color: '#fff' },
            { id: 'stat-triple', label: '🔥 ATK TRIPLO', color: '#fff' },
            { id: 'stat-thorns', label: '🌵 ESPINHOS', color: '#fff' },
            { id: 'stat-speed', label: '👟 VELOCIDADE', color: '#fff' }
        ];
        rows.forEach(r => {
            const div = document.createElement('div'); div.className = 'stat-row';
            if (r.color) div.style.color = r.color;
            div.innerHTML = `<span>${r.label}:</span> <span id="${r.id}" class="val">0</span>`;
            if (r.id === 'stat-rebirths') statsList.insertBefore(div, statsList.firstChild);
            else statsList.appendChild(div);
        });
    }
    el('stat-double').textContent = n(player.doubleAtk).toFixed(1) + "%";
    el('stat-triple').textContent = n(player.tripleAtk).toFixed(1) + "%";
    el('stat-thorns').textContent = formatNumber(player.thorns);
    el('stat-speed').textContent = n(player.speed).toFixed(0);
    el('stat-rebirths').textContent = n(player.rebirths);

    if (currentEnemy) {
        const eHp = n(currentEnemy.hp);
        const eMax = n(currentEnemy.maxHp, 1);
        el('enemy-hp-text').textContent = `${formatNumber(eHp)}/${formatNumber(eMax)}`;
        el('enemy-hp-bar-inner').style.width = `${Math.min(100, Math.max(0, (eHp / eMax) * 100))}%`;
        el('enemy-name').textContent = currentEnemy.name || "Inimigo";
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
    (player.relics || []).forEach((relic, i) => {
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

    updateShopUI();
    updateInventoryUI();
    updateDropPanel();
}

function getRarityClass(item) {
    if (!item || !item.rarity) return '';
    return (item.rarity.name || 'Common').toLowerCase().replace(' ', '-');
}

// --- COMBATE ---
function spawnEnemy() {
    isBattleActive = false; clearTimeout(battleTimer);
    const isBoss = inDungeon ? (dungeonFloor % 5 === 0) : ((defeatedInZone + 1) % 10 === 0);
    const base = monsterBases[Math.min(currentZone - 1, monsterBases.length - 1)];
    
    let zMult = 1 + (currentZone - 1) * 2;
    if (inDungeon) zMult *= Math.max(1, dungeonFloor) * (currentDungeonType === 'hell' ? 15 : 4);
    const bMult = isBoss ? (inDungeon ? 20 : 6) : 1;
    
    let modName = ""; let modStat = 1; let modLoot = 1; let modColor = null;
    const roll = Math.random();
    if (!isBoss && roll < 0.2) {
        if (roll < 0.05) { modName = "GIGANTE "; modStat = 5; modLoot = 20; modColor = "#c0392b"; }
        else if (roll < 0.1) { modName = "DOURADO "; modStat = 2; modLoot = 50; modColor = "#f1c40f"; }
        else { modName = "FANTASMA "; modStat = 3; modLoot = 15; modColor = "#8e44ad"; }
    }

    const hp = Math.max(10, Math.floor(n(base.hp) * zMult * bMult * modStat));
    currentEnemy = {
        name: modName + (isBoss ? `BOSS ${base.name.toUpperCase()}` : base.name),
        hp: hp, maxHp: hp, 
        atk: Math.max(1, Math.floor(n(base.atk) * zMult * bMult * modStat)),
        def: Math.max(0, Math.floor(20 * zMult * modStat)),
        gold: Math.floor(100 * zMult * bMult * modLoot),
        exp: Math.floor(200 * zMult * bMult * modLoot),
        color: modColor || (inDungeon ? "#8e44ad" : base.color)
    };
    
    const s = el('enemy-sprite');
    if (s) { s.style.backgroundColor = currentEnemy.color; s.style.boxShadow = `0 0 20px ${currentEnemy.color}`; }
    
    isBattleActive = true; currentTurn = 'player'; updateUI();
    battleTimer = setTimeout(battleLoop, Math.max(200, 1000 - (n(player.speed, 100) - 100) * 5));
}

function battleLoop() {
    if (!isBattleActive || !currentEnemy) return;
    
    if (currentTurn === 'player') {
        performAttack(player, currentEnemy);
        currentTurn = 'enemy';
    } else {
        performAttack(currentEnemy, player);
        currentTurn = 'player';
    }
    
    if (isBattleActive) battleTimer = setTimeout(battleLoop, Math.max(200, 1000 - (n(player.speed, 100) - 100) * 5));
}

function performAttack(att, def) {
    if (!isBattleActive || !def) return;
    const isPlayer = att === player;
    
    if (!isPlayer && Math.random() * 100 < n(player.evade)) { logMessage(`💨 ESQUIVA!`); return; }
    
    let hits = 1;
    if (isPlayer) {
        if (Math.random() * 100 < n(player.tripleAtk)) { hits = 3; logMessage(`🔥 TRIPLO!`); }
        else if (Math.random() * 100 < n(player.doubleAtk)) { hits = 2; logMessage(`⚡ DUPLO!`); }
    }

    for (let i = 0; i < hits; i++) {
        if (n(def.hp) <= 0) break;
        
        let mult = 1; let crit = false;
        if (isPlayer && Math.random() * 100 < n(player.crit)) { mult = n(player.critDmg, 3.5); crit = true; }
        
        const aAtk = n(att.atk, 1);
        const dDef = n(def.def, 0);
        let dmg = Math.floor((aAtk - (dDef * 0.4)) * (Math.random() * 0.2 + 0.9) * mult);
        dmg = Math.max(Math.floor(aAtk * 0.3), dmg);
        
        def.hp = Math.max(0, n(def.hp) - dmg);
        
        if (isPlayer && n(player.lifeSteal) > 0) {
            player.hp = Math.min(n(player.maxHp), n(player.hp) + Math.floor(dmg * (n(player.lifeSteal) / 100)));
        }
        
        logMessage(`${crit ? '💥 CRIT! ' : ''}${isPlayer ? 'Você' : att.name} causou ${formatNumber(dmg)} dano.`);
    }

    updateUI();
    if (n(def.hp) <= 0) {
        isBattleActive = false; clearTimeout(battleTimer);
        setTimeout(() => handleVictory(isPlayer), 500);
    }
}

function handleVictory(isPlayerVictory) {
    if (isPlayerVictory) {
        player.gold += n(currentEnemy.gold) * (1 + n(player.goldBonus) / 100);
        player.exp += n(currentEnemy.exp) * (1 + n(player.expBonus) / 100);
        
        if (inDungeon) {
            if (dungeonFloor < MAX_DUNGEON_FLOORS) dungeonFloor++;
            else { inDungeon = false; dungeonFloor = 0; }
        } else {
            defeatedInZone++;
            if (currentEnemy.isBoss) { currentZone++; defeatedInZone = 0; }
        }
        
        checkLevelUp();
        setTimeout(() => { player.hp = Math.min(n(player.maxHp), n(player.hp) + (n(player.maxHp) * 0.5)); spawnEnemy(); }, 1000);
    } else {
        inDungeon = false; dungeonFloor = 0; player.hp = player.maxHp;
        setTimeout(spawnEnemy, 2000);
    }
}

function checkLevelUp() {
    while (player.exp >= player.nextLevelExp) {
        player.level++; player.exp -= player.nextLevelExp; player.nextLevelExp = Math.floor(player.nextLevelExp * 1.5);
        calculateStats(); player.hp = player.maxHp;
    }
}

// --- OUTRAS FUNÇÕES ---
function logMessage(msg) {
    const log = el('battle-log'); if (!log) return;
    const p = document.createElement('p'); p.innerHTML = msg; log.appendChild(p);
    log.scrollTop = log.scrollHeight; if (log.children.length > 30) log.removeChild(log.firstChild);
}

function saveGame() { localStorage.setItem('bitHeroesClone_save', JSON.stringify(player)); logMessage('💾 Jogo Salvo!'); }
function loadGame() {
    const save = localStorage.getItem('bitHeroesClone_save');
    if (save) { try { player = JSON.parse(save); calculateStats(); updateUI(); } catch(e) { console.error("Erro ao carregar save"); } }
}
function resetGame() { if (confirm('Resetar?')) { localStorage.removeItem('bitHeroesClone_save'); location.reload(); } }

function buyUpgrade(s, b, sc) {
    const cost = b + n(player.upgrades[s]) * sc;
    if (player.gold >= cost) { player.gold -= cost; player.upgrades[s]++; calculateStats(); updateUI(); }
}
function toggleDungeon(type) { inDungeon = !inDungeon; currentDungeonType = type; dungeonFloor = 1; spawnEnemy(); }
function sellAll() { player.inventory = []; updateUI(); logMessage('💰 Inventário vendido!'); }
function switchView(v) { currentView = v; updateUI(); }

function updateInventoryUI() {
    const grid = el('inventory-grid'); if (!grid) return;
    grid.innerHTML = '';
    player.inventory.forEach((item, i) => {
        const div = document.createElement('div'); div.className = `item-slot ${getRarityClass(item)}`; div.textContent = item.icon;
        div.onclick = () => { if (item.type === 'relic') equipRelic(i); else equipItem(i); };
        grid.appendChild(div);
    });
}
function equipItem(i) {
    const item = player.inventory[i]; if (player.equipment[item.type]) player.inventory.push(player.equipment[item.type]);
    player.equipment[item.type] = item; player.inventory.splice(i, 1); calculateStats(); updateUI();
}
function equipRelic(i) {
    const r = player.inventory[i]; let empty = player.relics.indexOf(null);
    if (empty !== -1) { player.relics[empty] = r; player.inventory.splice(i, 1); calculateStats(); updateUI(); }
}
function unequipRelic(i) {
    const r = player.relics[i]; if (r) { player.inventory.push(r); player.relics[i] = null; calculateStats(); updateUI(); }
}

function updateShopUI() {
    const shop = el('shop-container'); if (!shop) return;
    const atkCost = 100 + n(player.upgrades.atk) * 200;
    const hpCost = 100 + n(player.upgrades.hp) * 200;
    const luckCost = 1000 + n(player.upgrades.luck) * 2000;
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
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:5px;">
            <button class="shop-btn" style="background:#444;" onclick="saveGame()">💾 SALVAR</button>
            <button class="shop-btn" style="background:#c0392b;" onclick="resetGame()">🗑️ RESET</button>
        </div>
    `;
}

function updateDropPanel() {
    const list = el('drop-list'); if (!list) return;
    list.innerHTML = rarities.map(r => `<div style="color:${r.color === 'rainbow' ? '#fff' : r.color}">${r.name}: ${(r.weight).toFixed(2)}%</div>`).join('');
}
function showTooltip() {}
function hideTooltip() {}

window.onload = () => { loadGame(); calculateStats(); player.hp = player.maxHp; spawnEnemy(); };
