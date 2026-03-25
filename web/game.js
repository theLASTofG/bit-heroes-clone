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

const talents = {
    assassin: [
        { id: 'crit_dmg', name: 'Dano Crítico', desc: '+20% Dano Crítico por ponto', max: 5, cost: 1 },
        { id: 'double_chance', name: 'Mestre do Combo', desc: '+5% Chance Atk Duplo', max: 5, cost: 2 },
        { id: 'triple_chance', name: 'Fúria Divina', desc: '+2% Chance Atk Triplo', max: 5, cost: 3 }
    ],
    paladin: [
        { id: 'thorns_buff', name: 'Pele de Ferro', desc: '+50% Dano de Espinhos', max: 5, cost: 1 },
        { id: 'def_res', name: 'Resiliência', desc: '+10% Defesa Absoluta', max: 5, cost: 2 },
        { id: 'lifesteal_buff', name: 'Sanguessuga', desc: '+5% Roubo de Vida', max: 5, cost: 3 }
    ],
    god: [
        { id: 'luck_buff', name: 'Benção de Manus', desc: '+50% Sorte Final', max: 5, cost: 2 },
        { id: 'exp_buff', name: 'Sabedoria Ancestral', desc: '+100% Ganho de EXP', max: 5, cost: 2 },
        { id: 'drop_buff', name: 'Mãos de Ouro', desc: '+20% Chance de Item Raro', max: 5, cost: 5 }
    ]
};

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

const enemyDebuffs = [
    { id: 'bleed', name: '🩸 SANGRAMENTO', desc: 'Dano por turno', chance: 15 },
    { id: 'stun', name: '💫 ATORDOADO', desc: 'Pula turno', chance: 10 },
    { id: 'curse', name: '💀 AMALDIÇOADO', desc: 'Reduz Sorte e Defesa', chance: 8 }
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

const el = (id) => document.getElementById(id);

function calculateStats() {
    let totalHp = (player.baseHp + (player.level * 100) + (player.upgrades.hp * 500)) * player.rebirthUpgrades.hpMult;
    let totalAtk = (player.baseAtk + (player.level * 20) + (player.upgrades.atk * 100)) * player.rebirthUpgrades.atkMult;
    let totalDef = (player.baseDef + (player.level * 10));
    let totalCrit = 5;
    let totalEvade = 5;
    let totalLifeSteal = 0;
    let totalDoubleAtk = 0;
    let totalTripleAtk = 0;
    let totalThorns = 0;
    let totalSpeed = 100;
    let totalCritDmg = 3.5; 
    let totalLuckMult = 1;

    const t = player.talentsOwned;
    if (t.crit_dmg) totalCritDmg += (t.crit_dmg * 0.2);
    if (t.double_chance) totalDoubleAtk += (t.double_chance * 5);
    if (t.triple_chance) totalTripleAtk += (t.triple_chance * 2);
    if (t.lifesteal_buff) totalLifeSteal += (t.lifesteal_buff * 5);

    player.goldBonus = 0;
    player.expBonus = (player.rebirthUpgrades.expMult - 1) * 100;

    Object.values(player.equipment).forEach(item => {
        if (!item || !item.stats) return;
        if (item.stats.atk) totalAtk += item.stats.atk;
        if (item.stats.def) totalDef += item.stats.def;
        if (item.stats.hp) totalHp += item.stats.hp;
        if (item.stats.crit) totalCrit += item.stats.crit;
        if (item.stats.evade) totalEvade += item.stats.evade;
        if (item.stats.lifeSteal) totalLifeSteal += item.stats.lifeSteal;
        if (item.stats.doubleAtk) totalDoubleAtk += item.stats.doubleAtk;
        if (item.stats.tripleAtk) totalTripleAtk += item.stats.tripleAtk;
        if (item.stats.thorns) totalThorns += item.stats.thorns;
        if (item.stats.speed) totalSpeed += item.stats.speed;
    });

    player.relics.forEach(relic => {
        if (!relic) return;
        const bonus = 1 + (relic.bonusValue / 100);
        if (relic.stat === 'atk') totalAtk *= bonus;
        if (relic.stat === 'hp') totalHp *= bonus;
        if (relic.stat === 'luck') totalLuckMult *= bonus;
        if (relic.stat === 'speed') totalSpeed *= bonus;
        if (relic.stat === 'goldBonus') player.goldBonus += relic.bonusValue;
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
        if (en.stat === 'thorns') totalThorns += en.value;
        if (en.stat === 'speed') totalSpeed += en.value;
        if (en.stat === 'goldBonus') player.goldBonus += en.value;
        if (en.stat === 'expBonus') player.expBonus += en.value;
    });

    if (t.thorns_buff) totalThorns *= (1 + (t.thorns_buff * 0.5));
    if (t.def_res) totalDef *= (1 + (t.def_res * 0.1));
    
    player.finalLuckMult = player.rebirthUpgrades.luckMult * totalLuckMult;
    if (t.luck_buff) player.finalLuckMult *= (1 + (t.luck_buff * 0.5));
    if (t.exp_buff) player.expBonus += (t.exp_buff * 100);

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
    player.critDmg = totalCritDmg;
    
    player.powerRating = Math.floor((player.atk * 2) + (player.maxHp / 5) + (player.def * 3) + (player.crit * 50) + (player.evade * 50) + (player.doubleAtk * 100) + (player.tripleAtk * 500) + (player.thorns * 5) + (player.speed * 2));
}

function updateUI() {
    if (!el('player-level')) return;
    el('player-level').textContent = player.level;
    el('player-gold').textContent = formatNumber(player.gold);
    el('player-exp-bar').style.width = `${(player.exp / player.nextLevelExp) * 100}%`;
    el('zone-display').textContent = inDungeon ? `Dungeon F${dungeonFloor}` : currentZone;
    
    el('player-hp-text').textContent = `${formatNumber(Math.max(0, Math.ceil(player.hp)))}/${formatNumber(Math.ceil(player.maxHp))}`;
    el('player-hp-bar-inner').style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
    
    el('stat-atk').textContent = formatNumber(player.atk);
    el('stat-hp').textContent = formatNumber(player.maxHp);
    el('stat-def').textContent = formatNumber(player.def);
    el('stat-crit').textContent = player.crit.toFixed(1) + "%";
    el('stat-evade').textContent = player.evade.toFixed(1) + "%";
    el('stat-lifesteal').textContent = player.lifeSteal.toFixed(1) + "%";
    el('stat-luck').textContent = (player.luck * player.finalLuckMult).toFixed(1) + "x";
    el('stat-pr').textContent = formatNumber(player.powerRating);
    
    // Garantir que stats extras existam
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
            const div = document.createElement('div');
            div.className = 'stat-row';
            if (r.color) div.style.color = r.color;
            div.innerHTML = `<span>${r.label}:</span> <span id="${r.id}" class="val">0</span>`;
            if (r.id === 'stat-rebirths') statsList.insertBefore(div, statsList.firstChild);
            else statsList.appendChild(div);
        });
    }
    el('stat-double').textContent = player.doubleAtk.toFixed(1) + "%";
    el('stat-triple').textContent = player.tripleAtk.toFixed(1) + "%";
    el('stat-thorns').textContent = formatNumber(player.thorns);
    el('stat-speed').textContent = player.speed.toFixed(0);
    el('stat-rebirths').textContent = player.rebirths;

    if (currentEnemy) {
        const eHp = Number(currentEnemy.hp) || 0;
        const eMax = Number(currentEnemy.maxHp) || 1;
        el('enemy-hp-text').textContent = `${formatNumber(Math.max(0, Math.ceil(eHp)))}/${formatNumber(Math.ceil(eMax))}`;
        el('enemy-hp-bar-inner').style.width = `${Math.max(0, (eHp / eMax) * 100)}%`;
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
    else if (currentView === 'enchant') updateEnchantUI();
    else if (currentView === 'talents') updateTalentsUI();
    
    updateInventoryUI();
    updateDropPanel();
    updateDebuffsUI();
}

function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return "0";
    if (num >= 1e21) return (num / 1e21).toFixed(2) + 'S';
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'E';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

function getRarityClass(item) {
    if (!item) return '';
    const rName = (item.rarity && item.rarity.name) ? item.rarity.name : (typeof item.rarity === 'string' ? item.rarity : 'Common');
    return rName.toLowerCase().replace(' ', '-');
}

function spawnEnemy() {
    isBattleActive = false; clearTimeout(battleTimer);
    const isBoss = inDungeon ? (dungeonFloor % 5 === 0) : ((defeatedInZone + 1) % 10 === 0);
    const baseIndex = Math.min(currentZone - 1, monsterBases.length - 1);
    const base = monsterBases[baseIndex];
    
    let zMult = 1 + (currentZone - 1) * 2;
    if (inDungeon) zMult *= Math.max(1, dungeonFloor) * (currentDungeonType === 'hell' ? 15 : 4);
    const bMult = isBoss ? (inDungeon ? 20 : 6) : 1;
    
    let modName = ""; let modColor = null; let modScale = 1; let modStatMult = 1; let modLootMult = 1;
    const rollMod = Math.random();
    if (!isBoss && rollMod < 0.2) { 
        if (rollMod < 0.05) { modName = "GIGANTE "; modScale = 2.2; modStatMult = 5; modLootMult = 20; modColor = "#c0392b"; }
        else if (rollMod < 0.10) { modName = "DOURADO "; modStatMult = 2; modLootMult = 50; modColor = "#f1c40f"; }
        else { modName = "FANTASMA "; modStatMult = 3; modLootMult = 15; modColor = "#8e44ad"; }
    }

    const finalHp = Math.max(10, Math.floor(base.hp * zMult * bMult * modStatMult));
    const finalAtk = Math.max(1, Math.floor(base.atk * zMult * bMult * modStatMult));
    const finalDef = Math.max(0, Math.floor(20 * zMult * modStatMult));

    currentEnemy = {
        name: modName + (isBoss ? `BOSS ${base.name.toUpperCase()}` : base.name),
        hp: finalHp, maxHp: finalHp, atk: finalAtk, def: finalDef,
        gold: Math.floor(100 * zMult * bMult * modLootMult),
        exp: Math.floor(200 * zMult * bMult * modLootMult),
        isBoss, color: modColor || (inDungeon ? (currentDungeonType === 'hell' ? "#ff0000" : "#8e44ad") : base.color), 
        scale: (isBoss ? 1.7 : 1) * modScale, modType: modName.trim()
    };
    
    const sprite = el('enemy-sprite');
    if (sprite) { 
        sprite.style.backgroundColor = currentEnemy.color; 
        sprite.style.transform = `scale(${currentEnemy.scale})`;
        sprite.style.boxShadow = `0 0 20px ${currentEnemy.color}`;
    }
    
    isBattleActive = true; currentTurn = 'player'; updateUI();
    battleTimer = setTimeout(battleLoop, Math.max(200, 1000 - (player.speed - 100) * 5));
}

function battleLoop() {
    if (!isBattleActive || !currentEnemy) return;
    
    if (currentTurn === 'player') {
        const stun = player.debuffs.find(d => d.id === 'stun');
        if (stun) {
            logMessage(`💫 Atordoado! Pula turno.`);
            player.debuffs = player.debuffs.filter(d => d.id !== 'stun');
            currentTurn = 'enemy';
        } else {
            performAttack(player, currentEnemy);
            currentTurn = 'enemy';
        }
    } else {
        performAttack(currentEnemy, player);
        currentTurn = 'player';
    }
    
    const bleed = player.debuffs.find(d => d.id === 'bleed');
    if (bleed) {
        const bDmg = Math.floor(player.maxHp * 0.05);
        player.hp -= bDmg;
        logMessage(`🩸 Sangramento: -${formatNumber(bDmg)}`);
        if (player.hp <= 0) { isBattleActive = false; handleVictory(false); return; }
    }

    if (isBattleActive) battleTimer = setTimeout(battleLoop, Math.max(200, 1000 - (player.speed - 100) * 5));
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
        if (isPlayer && Math.random() * 100 < player.crit) { mult = player.critDmg; crit = true; }
        
        let aAtk = Number(att.atk) || 1;
        let dDef = Number(def.def) || 0;
        let dMult = Number(mult) || 1;
        
        let dmg = Math.floor((aAtk - (dDef * 0.4)) * (Math.random() * 0.2 + 0.9) * dMult);
        dmg = Math.max(Math.floor(aAtk * 0.3), dmg);
        if (isNaN(dmg)) dmg = 1;
        
        def.hp -= dmg;
        
        if (isPlayer) {
            if (player.lifeSteal > 0) player.hp = Math.min(player.maxHp, player.hp + Math.floor(dmg * (player.lifeSteal / 100)));
        } else {
            if (player.thorns > 0) { currentEnemy.hp -= player.thorns; logMessage(`🌵 Espinhos: ${formatNumber(player.thorns)}`); }
            if (currentZone > 3 || inDungeon) {
                const roll = Math.random() * 100;
                const d = enemyDebuffs.find(db => roll < db.chance);
                if (d && !player.debuffs.find(pd => pd.id === d.id)) {
                    player.debuffs.push(d);
                    logMessage(`${d.name} aplicado!`);
                }
            }
        }
        logMessage(`${crit ? '💥 CRIT! ' : ''}${isPlayer ? 'Você' : att.name} causou ${formatNumber(dmg)} dano.`);
    }

    const s = isPlayer ? el('player-sprite') : el('enemy-sprite');
    const d = isPlayer ? el('enemy-sprite') : el('player-sprite');
    if (s && d) {
        s.classList.add(isPlayer ? 'attack-player' : 'attack-enemy');
        setTimeout(() => { s.classList.remove(isPlayer ? 'attack-player' : 'attack-enemy'); d.classList.add('damage-flash'); setTimeout(() => d.classList.remove('damage-flash'), 150); }, 150);
    }
    updateUI();
    if (def.hp <= 0) { isBattleActive = false; clearTimeout(battleTimer); setTimeout(() => handleVictory(isPlayer), 500); }
}

function handleVictory(isPlayer) {
    player.debuffs = []; 
    if (isPlayer) {
        const goldGain = Math.floor(currentEnemy.gold * (1 + player.goldBonus / 100));
        const expGain = Math.floor(currentEnemy.exp * (1 + player.expBonus / 100));
        player.gold += goldGain; player.exp += expGain;
        
        if (currentEnemy.modType === "GIGANTE") {
            temporaryLuck += 50; logMessage(`🌟 SORTE GIGANTE: +50 Sorte por 30s!`);
            clearTimeout(luckTimer); luckTimer = setTimeout(() => { temporaryLuck -= 50; updateUI(); }, 30000);
        }
        if (inDungeon) {
            if (dungeonFloor < MAX_DUNGEON_FLOORS) dungeonFloor++;
            else { inDungeon = false; dungeonFloor = 0; rollLoot(true); }
        } else {
            defeatedInZone++;
            if (currentEnemy.isBoss) { currentZone++; defeatedInZone = 0; }
        }
        checkLevelUp(); rollLoot();
        setTimeout(() => { player.hp = Math.min(player.maxHp, player.hp + (player.maxHp * 0.5)); spawnEnemy(); }, 1000);
    } else {
        inDungeon = false; dungeonFloor = 0; defeatedInZone = 0; player.hp = player.maxHp;
        setTimeout(spawnEnemy, 2000);
    }
}

function rollLoot(guaranteedSuperRarity = false) {
    if (!currentEnemy) return;
    const relicLuck = currentEnemy.isBoss ? 0.6 : 0.1;
    if (Math.random() < relicLuck) { const relic = generateRelic(); player.inventory.push(relic); }
    const itemRolls = currentEnemy.isBoss ? 2 : (Math.random() < 0.5 ? 1 : 0);
    for (let i = 0; i < itemRolls; i++) { const item = generateItem(null, guaranteedSuperRarity ? rarities[15] : null); player.inventory.push(item); }
    updateInventoryUI();
}

function generateRelic() {
    const template = relicTemplates[Math.floor(Math.random() * relicTemplates.length)];
    const luck = (player.luck + temporaryLuck) * player.finalLuckMult;
    const totalWeight = rarities.reduce((acc, r) => acc + r.weight, 0);
    const luckFactor = Math.pow(luck, 0.7);
    let roll = Math.random() * totalWeight;
    if (roll < totalWeight / 2) roll /= luckFactor;
    let cumulative = 0; let rarity = rarities[0];
    for (const r of rarities) { cumulative += r.weight; if (roll <= cumulative) { rarity = r; break; } }
    return { id: Math.random().toString(36).substr(2, 9), name: template.name, icon: template.icon, type: 'relic', stat: template.stat, rarity, bonusValue: rarity.relicBonus };
}

function generateItem(type = null, forcedRarity = null) {
    if (!type) type = ['weapon', 'armor', 'mount', 'pet'][Math.floor(Math.random() * 4)];
    const nameBase = itemBases[type][Math.floor(Math.random() * itemBases[type].length)];
    const icon = itemIcons[type][Math.floor(Math.random() * itemIcons[type].length)];
    const luck = (player.luck + temporaryLuck) * player.finalLuckMult;
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
    if (type === 'weapon') { stats.atk = Math.floor(50 * m); stats.crit = Math.floor(5 * (1 + Math.log10(m))); stats.doubleAtk = m > 5 ? Math.min(75, m/2) : 0; if (m > 100) stats.tripleAtk = Math.min(50, m/100); }
    else if (type === 'armor') { stats.def = Math.floor(30 * m); stats.evade = Math.floor(4 * (1 + Math.log10(m))); stats.thorns = Math.floor(20 * m); }
    else if (type === 'mount') { stats.hp = Math.floor(200 * m); stats.lifeSteal = Math.floor(2 * (1 + Math.log10(m))); stats.speed = Math.floor(10 * Math.log10(m)); }
    else { stats.atk = Math.floor(30 * m); stats.hp = Math.floor(100 * m); stats.tripleAtk = m > 50 ? Math.min(30, m/50) : 0; }
    return { id: Math.random().toString(36).substr(2, 9), name: `${rarity.name} ${nameBase}`, icon, type, rarity, stats };
}

function equipRelic(i) {
    const r = player.inventory[i]; let empty = player.relics.indexOf(null);
    if (empty !== -1) { player.relics[empty] = r; player.inventory.splice(i, 1); calculateStats(); updateUI(); }
}
function unequipRelic(i) {
    const r = player.relics[i]; if (r) { player.inventory.push(r); player.relics[i] = null; calculateStats(); updateUI(); }
}
function rollEnchant(idx) {
    const cost = 1000 + (player.level * 500);
    if (player.gold < cost) return;
    player.gold -= cost; const tier = Math.floor(Math.random() * 100);
    const s = enchantStats[Math.floor(Math.random() * enchantStats.length)];
    const val = Math.floor(s.base * (1 + (tier * 1.5)));
    player.enchants[idx] = { name: `Tier ${tier+1}`, stat: s.id, statName: s.name, value: val, icon: s.icon, color: `hsl(${(tier * 3.6) % 360}, 80%, 60%)` };
    calculateStats(); updateUI();
}
function buyUpgrade(s, b, sc) {
    const c = b + player.upgrades[s] * sc;
    if (player.gold >= c) { player.gold -= c; player.upgrades[s]++; calculateStats(); updateUI(); }
}
function checkLevelUp() {
    while (player.exp >= player.nextLevelExp) {
        player.level++; player.exp -= player.nextLevelExp; player.nextLevelExp = Math.floor(player.nextLevelExp * 1.5);
        calculateStats(); player.hp = player.maxHp;
    }
}
function showTooltip(e, item) {
    const tooltip = el('tooltip'); if (!tooltip) return;
    tooltip.style.display = 'block'; tooltip.style.borderColor = (item.rarity.color === 'rainbow') ? '#fff' : (item.rarity.color || '#fff');
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
    tooltip.innerHTML = `<div class="tooltip-header" style="color:${item.rarity.color === 'rainbow' ? '#fff' : item.rarity.color}">${item.name}</div><div style="background:#111; padding:10px; border-radius:5px;">${sHtml}</div>`;
    const rect = e.target.getBoundingClientRect(); tooltip.style.left = (rect.left + rect.width + 10) + 'px'; tooltip.style.top = rect.top + 'px';
}
function hideTooltip() { const t = el('tooltip'); if (t) t.style.display = 'none'; }
function updateInventoryUI() {
    const grid = el('inventory-grid'); if (!grid) return;
    grid.innerHTML = '';
    player.inventory.forEach((item, i) => {
        const div = document.createElement('div'); div.className = `item-slot ${getRarityClass(item)}`; div.textContent = item.icon;
        div.onmouseover = (e) => showTooltip(e, item); div.onmouseout = hideTooltip;
        div.onclick = () => { const idx = player.inventory.indexOf(item); if (item.type === 'relic') equipRelic(idx); else equipItem(idx); hideTooltip(); };
        grid.appendChild(div);
    });
}
function equipItem(i) {
    const item = player.inventory[i]; if (player.equipment[item.type]) player.inventory.push(player.equipment[item.type]);
    player.equipment[item.type] = item; player.inventory.splice(i, 1); calculateStats(); updateUI();
}
function logMessage(msg) {
    const log = el('battle-log'); if (!log) return;
    const p = document.createElement('p'); p.innerHTML = msg; log.appendChild(p);
    log.scrollTop = log.scrollHeight; if (log.children.length > 30) log.removeChild(log.firstChild);
}

function saveGame() {
    localStorage.setItem('bitHeroesClone_save', JSON.stringify(player));
    logMessage('💾 Jogo Salvo!');
}
function loadGame() {
    const save = localStorage.getItem('bitHeroesClone_save');
    if (save) {
        player = JSON.parse(save);
        calculateStats(); updateUI(); logMessage('📂 Progresso Carregado!');
    }
}
function resetGame() {
    if (confirm('Deseja resetar TUDO?')) {
        localStorage.removeItem('bitHeroesClone_save');
        location.reload();
    }
}

function toggleSidebar() { el('drop-sidebar').classList.toggle('closed'); }
function updateDropPanel() {
    const list = el('drop-list'); if (!list) return;
    list.innerHTML = rarities.map(r => `<div style="color:${r.color === 'rainbow' ? '#fff' : r.color}">${r.name}: ${(r.weight).toFixed(2)}%</div>`).join('');
}
function updateDebuffsUI() {
    const container = el('player-area');
    let debuffList = el('debuff-list');
    if (!debuffList) {
        debuffList = document.createElement('div'); debuffList.id = 'debuff-list';
        debuffList.style.position = 'absolute'; debuffList.style.top = '-40px'; debuffList.style.left = '50%';
        debuffList.style.transform = 'translateX(-50%)'; debuffList.style.display = 'flex'; debuffList.style.gap = '5px';
        container.appendChild(debuffList);
    }
    debuffsUI(debuffList, player.debuffs);
}
function debuffsUI(el, list) {
    el.innerHTML = list.map(d => `<span title="${d.name}" style="font-size:18px;">${d.id === 'bleed' ? '🩸' : d.id === 'stun' ? '💫' : '💀'}</span>`).join('');
}
function switchView(v) { currentView = v; updateUI(); }

function updateShopUI() {
    const shop = el('shop-container'); if (!shop) return;
    const atkCost = 100 + player.upgrades.atk * 200;
    const hpCost = 100 + player.upgrades.hp * 200;
    const luckCost = 1000 + player.upgrades.luck * 2000;
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
        <button class="shop-btn" style="background:#00d2ff; margin-top:5px;" onclick="switchView('talents')">🌳 ÁRVORE DE TALENTOS (✨${player.talentPoints})</button>
        <button class="shop-btn" style="background:#3498db; margin-top:5px;" onclick="switchView('enchant')">⚙️ ENCANTAMENTOS</button>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:5px;">
            <button class="shop-btn" style="background:#444;" onclick="saveGame()">💾 SALVAR</button>
            <button class="shop-btn" style="background:#c0392b;" onclick="resetGame()">🗑️ RESET</button>
        </div>
    `;
}

window.onload = () => { loadGame(); calculateStats(); player.hp = player.maxHp; spawnEnemy(); };
