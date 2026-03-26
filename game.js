// --- SISTEMA DE RARIDADES (10 Tiers) ---
const rarities = [
    { name: "Common", color: "#7f8c8d", weight: 60, bonusMult: 1.0 },
    { name: "Uncommon", color: "#2ecc71", weight: 25, bonusMult: 1.5 },
    { name: "Rare", color: "#3498db", weight: 10, bonusMult: 2.2 },
    { name: "Epic", color: "#9b59b6", weight: 4, bonusMult: 3.5 },
    { name: "Legendary", color: "#f1c40f", weight: 0.8, bonusMult: 6.0 },
    { name: "Mythic", color: "#e67e22", weight: 0.15, bonusMult: 10.0 },
    { name: "Celestial", color: "#1abc9c", weight: 0.04, bonusMult: 18.0 },
    { name: "Void", color: "#8e44ad", weight: 0.008, bonusMult: 30.0 },
    { name: "Ancient", color: "#c0392b", weight: 0.0015, bonusMult: 50.0 },
    { name: "Godly", color: "#ffffff", weight: 0.0004, bonusMult: 100.0 }
];

// --- JOGADOR ---
const player = {
    level: 1, exp: 0, nextLevelExp: 100, gold: 0,
    baseHp: 120, baseAtk: 15, baseDef: 5,
    hp: 120, maxHp: 120, atk: 15, def: 5,
    crit: 5, evade: 5, lifeSteal: 0,
    luck: 1.0, // Multiplicador de drop
    
    equipment: { weapon: null, armor: null, mount: null },
    inventory: [],
    
    upgrades: { atk: 0, hp: 0, luck: 0 }
};

// --- BANCO DE DADOS DE ITENS ---
const itemTemplates = {
    weapon: [
        { name: "Sword", icon: "⚔️", stat: "atk" },
        { name: "Axe", icon: "🪓", stat: "atk" },
        { name: "Bow", icon: "🏹", stat: "atk" },
        { name: "Staff", icon: "🪄", stat: "atk" }
    ],
    armor: [
        { name: "Chestplate", icon: "🛡️", stat: "def" },
        { name: "Robe", icon: "🥋", stat: "def" },
        { name: "Leather", icon: "🧥", stat: "def" }
    ],
    mount: [
        { name: "Horse", icon: "🐎", stat: "hp" },
        { name: "Wolf", icon: "🐺", stat: "atk" },
        { name: "Dragon", icon: "🐲", stat: "all" }
    ]
};

// --- MONSTROS ---
const monsterBases = [
    { name: "Slime", icon: "🟢", color: "#27ae60", hp: 60, atk: 12 },
    { name: "Bat", icon: "🦇", color: "#34495e", hp: 80, atk: 16 },
    { name: "Spider", icon: "🕷️", color: "#8e44ad", hp: 120, atk: 22 },
    { name: "Skeleton", icon: "💀", color: "#ecf0f1", hp: 180, atk: 30 },
    { name: "Demon", icon: "👿", color: "#c0392b", hp: 350, atk: 55 }
];

let currentEnemy = null;
let currentZone = 1;
let defeatedInZone = 0;
let isBattleActive = false;
let currentTurn = 'player';

// --- CORE FUNCTIONS ---

function calculateStats() {
    player.maxHp = (player.baseHp + (player.level * 25) + (player.upgrades.hp * 50));
    player.atk = (player.baseAtk + (player.level * 5) + (player.upgrades.atk * 10));
    player.def = (player.baseDef + (player.level * 2));
    player.crit = 5; player.evade = 5; player.lifeSteal = 0;

    Object.values(player.equipment).forEach(item => {
        if (!item) return;
        if (item.stats.atk) player.atk += item.stats.atk;
        if (item.stats.def) player.def += item.stats.def;
        if (item.stats.hp) player.maxHp += item.stats.hp;
        if (item.stats.crit) player.crit += item.stats.crit;
        if (item.stats.evade) player.evade += item.stats.evade;
        if (item.stats.lifeSteal) player.lifeSteal += item.stats.lifeSteal;
    });

    // Sinergia: Se Arma e Armadura forem da mesma raridade, bônus de 15% em tudo
    if (player.equipment.weapon && player.equipment.armor && 
        player.equipment.weapon.rarity.name === player.equipment.armor.rarity.name) {
        player.atk *= 1.15;
        player.maxHp *= 1.15;
    }
}

function generateItem(type = null, forcedRarity = null) {
    if (!type) {
        const types = ['weapon', 'armor', 'mount'];
        type = types[Math.floor(Math.random() * types.length)];
    }
    
    const template = itemTemplates[type][Math.floor(Math.random() * itemTemplates[type].length)];
    
    let rarity;
    if (forcedRarity) {
        rarity = forcedRarity;
    } else {
        const roll = Math.random() * 100 / player.luck;
        let cumulative = 0;
        rarity = rarities[0];
        for (const r of rarities) {
            cumulative += r.weight;
            if (roll <= cumulative) {
                rarity = r;
                break;
            }
        }
    }

    const m = rarity.bonusMult;
    const stats = {};
    if (type === 'weapon') {
        stats.atk = Math.floor(10 * m);
        stats.crit = Math.floor(2 * m);
    } else if (type === 'armor') {
        stats.def = Math.floor(5 * m);
        stats.evade = Math.floor(1 * m);
    } else {
        stats.hp = Math.floor(50 * m);
        stats.lifeSteal = Math.floor(1 * m);
    }

    return {
        id: Math.random().toString(36).substr(2, 9),
        name: `${rarity.name} ${template.name}`,
        icon: template.icon,
        type: type,
        rarity: rarity,
        stats: stats
    };
}

function spawnEnemy() {
    const isBoss = (defeatedInZone + 1) % 10 === 0;
    const base = monsterBases[Math.min(currentZone - 1, monsterBases.length - 1)];
    const zMult = 1 + (currentZone - 1) * 0.8;
    const bMult = isBoss ? 4 : 1;

    currentEnemy = {
        name: isBoss ? `BOSS ${base.name.toUpperCase()}` : base.name,
        hp: Math.floor(base.hp * zMult * bMult),
        maxHp: Math.floor(base.hp * zMult * bMult),
        atk: Math.floor(base.atk * zMult * bMult),
        def: Math.floor(10 * zMult),
        gold: Math.floor(20 * zMult * bMult),
        exp: Math.floor(50 * zMult * bMult),
        isBoss: isBoss,
        color: base.color,
        scale: isBoss ? 1.5 : 1
    };

    const sprite = document.getElementById('enemy-sprite');
    sprite.style.backgroundColor = currentEnemy.color;
    sprite.style.transform = `scale(${currentEnemy.scale})`;
    
    document.getElementById('enemy-type').textContent = isBoss ? "BOSS" : "ZONA " + currentZone;
    document.getElementById('enemy-type').className = `badge ${isBoss ? 'boss' : ''}`;
    
    isBattleActive = true;
    currentTurn = 'player';
    updateUI();
    logMessage(`--- ${currentEnemy.name} apareceu! ---`);
    setTimeout(battleLoop, 1000);
}

function battleLoop() {
    if (!isBattleActive) return;

    if (currentTurn === 'player') {
        performAttack(player, currentEnemy);
        currentTurn = 'enemy';
    } else {
        performAttack(currentEnemy, player);
        currentTurn = 'player';
    }

    if (isBattleActive) setTimeout(battleLoop, 1200);
}

function performAttack(att, def) {
    const isPlayer = att === player;
    
    // Evade
    if (!isPlayer && Math.random() * 100 < player.evade) {
        logMessage(`💨 ESQUIVA!`);
        return;
    }

    // Crit
    let mult = 1;
    let crit = false;
    if (isPlayer && Math.random() * 100 < player.crit) {
        mult = 2.5;
        crit = true;
    }

    let dmg = Math.floor((att.atk - (def.def * 0.4)) * (Math.random() * 0.3 + 0.85) * mult);
    dmg = Math.max(Math.floor(att.atk * 0.2), dmg);

    def.hp -= dmg;
    
    // Life Steal
    if (isPlayer && player.lifeSteal > 0) {
        const heal = Math.floor(dmg * (player.lifeSteal / 100));
        player.hp = Math.min(player.maxHp, player.hp + heal);
    }

    // Animation
    const s = isPlayer ? document.getElementById('player-sprite') : document.getElementById('enemy-sprite');
    const d = isPlayer ? document.getElementById('enemy-sprite') : document.getElementById('player-sprite');
    s.classList.add(isPlayer ? 'attack-player' : 'attack-enemy');
    setTimeout(() => {
        s.classList.remove(isPlayer ? 'attack-player' : 'attack-enemy');
        d.classList.add('damage-flash');
        setTimeout(() => d.classList.remove('damage-flash'), 200);
    }, 150);

    logMessage(`${crit ? '💥 CRIT! ' : ''}${att === player ? 'Você' : att.name} causou ${dmg} de dano.`);
    updateUI();

    if (def.hp <= 0) {
        isBattleActive = false;
        handleVictory(isPlayer);
    }
}

function handleVictory(isPlayer) {
    if (isPlayer) {
        logMessage(`✨ Vitória! +${currentEnemy.gold} Ouro.`);
        player.gold += currentEnemy.gold;
        player.exp += currentEnemy.exp;
        defeatedInZone++;
        
        if (currentEnemy.isBoss) {
            currentZone++;
            defeatedInZone = 0;
            logMessage(`🚀 AVANÇOU PARA ZONA ${currentZone}!`);
        }

        checkLevelUp();
        rollLoot();
        
        setTimeout(() => {
            player.hp = Math.min(player.maxHp, player.hp + (player.maxHp * 0.4));
            spawnEnemy();
        }, 2000);
    } else {
        logMessage(`💀 Derrotado! Reiniciando zona...`);
        defeatedInZone = 0;
        player.hp = player.maxHp;
        setTimeout(spawnEnemy, 3000);
    }
}

function rollLoot() {
    let chance = currentEnemy.isBoss ? 0.95 : 0.25;
    if (Math.random() < chance) {
        const item = generateItem();
        player.inventory.push(item);
        logMessage(`🎁 DROP: <span style="color:${item.rarity.color}">[${item.rarity.name}] ${item.name}</span>`);
        updateInventoryUI();
    }
}

function checkLevelUp() {
    if (player.exp >= player.nextLevelExp) {
        player.level++;
        player.exp -= player.nextLevelExp;
        player.nextLevelExp = Math.floor(player.nextLevelExp * 1.8);
        calculateStats();
        player.hp = player.maxHp;
        logMessage(`🎊 LEVEL UP: ${player.level}! 🎊`);
    }
}

// --- UI & TOOLTIPS ---

const tooltip = document.getElementById('tooltip');

function showTooltip(e, item) {
    tooltip.style.display = 'block';
    tooltip.style.left = (e.pageX + 15) + 'px';
    tooltip.style.top = (e.pageY + 15) + 'px';
    tooltip.style.borderColor = item.rarity.color;

    let statsHtml = '';
    for (const [s, v] of Object.entries(item.stats)) {
        const current = player.equipment[item.type];
        const diff = current ? v - (current.stats[s] || 0) : v;
        const diffClass = diff >= 0 ? 'stat-up' : 'stat-down';
        statsHtml += `<div class="tooltip-stat"><span>${s.toUpperCase()}:</span> <span class="${diffClass}">${v} (${diff >= 0 ? '+' : ''}${diff})</span></div>`;
    }

    tooltip.innerHTML = `
        <div class="tooltip-header" style="color:${item.rarity.color}">${item.name}</div>
        <div style="font-size:11px; color:#888; margin-bottom:10px;">Tipo: ${item.type.toUpperCase()}</div>
        ${statsHtml}
        <div style="font-size:10px; color:#aaa; margin-top:10px; font-style:italic;">Clique para equipar</div>
    `;
}

function hideTooltip() { tooltip.style.display = 'none'; }

function updateInventoryUI() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    player.inventory.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = `item-slot ${item.rarity.name.toLowerCase()}`;
        div.textContent = item.icon;
        div.onmouseover = (e) => showTooltip(e, item);
        div.onmouseout = hideTooltip;
        div.onclick = () => { equipItem(i); hideTooltip(); };
        grid.appendChild(div);
    });
}

function equipItem(i) {
    const item = player.inventory[i];
    if (player.equipment[item.type]) player.inventory.push(player.equipment[item.type]);
    player.equipment[item.type] = item;
    player.inventory.splice(i, 1);
    calculateStats();
    updateUI();
}

function updateUI() {
    document.getElementById('player-level').textContent = player.level;
    document.getElementById('player-gold').textContent = player.gold;
    document.getElementById('player-hp-text').textContent = `${Math.max(0, Math.ceil(player.hp))}/${Math.ceil(player.maxHp)}`;
    document.getElementById('player-hp-bar-inner').style.width = `${(player.hp / player.maxHp) * 100}%`;
    document.getElementById('player-exp-bar').style.width = `${(player.exp / player.nextLevelExp) * 100}%`;
    document.getElementById('zone-display').textContent = currentZone;

    if (currentEnemy) {
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, Math.ceil(currentEnemy.hp))}/${currentEnemy.maxHp}`;
        document.getElementById('enemy-hp-bar-inner').style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;
        document.getElementById('enemy-name').textContent = currentEnemy.name;
    }

    ['weapon', 'armor', 'mount'].forEach(type => {
        const slot = document.getElementById(`slot-${type}`);
        const item = player.equipment[type];
        slot.textContent = item ? item.icon : (type === 'weapon' ? '⚔️' : type === 'armor' ? '🛡️' : '🐎');
        slot.className = `slot ${item ? item.rarity.name.toLowerCase() : ''}`;
        if (item) {
            slot.onmouseover = (e) => showTooltip(e, item);
            slot.onmouseout = hideTooltip;
        }
    });

    // Atualizar Loja
    document.getElementById('upgrade-atk').textContent = `Melhorar ATK (💰 ${100 + player.upgrades.atk * 150})`;
    document.getElementById('upgrade-hp').textContent = `Melhorar HP (💰 ${100 + player.upgrades.hp * 150})`;
    document.getElementById('upgrade-luck').textContent = `Melhorar SORTE (💰 ${500 + player.upgrades.luck * 1000})`;

    updateInventoryUI();
}

function logMessage(msg) {
    const log = document.getElementById('battle-log');
    const p = document.createElement('p');
    p.innerHTML = msg;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 30) log.removeChild(log.firstChild);
}

// --- LOJA ---
document.getElementById('upgrade-atk').onclick = () => {
    const cost = 100 + player.upgrades.atk * 150;
    if (player.gold >= cost) {
        player.gold -= cost;
        player.upgrades.atk++;
        calculateStats();
        updateUI();
        logMessage(`🔥 Upgrade: ATK aumentado!`);
    }
};

document.getElementById('upgrade-hp').onclick = () => {
    const cost = 100 + player.upgrades.hp * 150;
    if (player.gold >= cost) {
        player.gold -= cost;
        player.upgrades.hp++;
        calculateStats();
        player.hp = player.maxHp;
        updateUI();
        logMessage(`💚 Upgrade: HP aumentado!`);
    }
};

document.getElementById('upgrade-luck').onclick = () => {
    const cost = 500 + player.upgrades.luck * 1000;
    if (player.gold >= cost) {
        player.gold -= cost;
        player.upgrades.luck++;
        player.luck += 0.2;
        updateUI();
        logMessage(`🍀 Upgrade: Sorte aumentada!`);
    }
};

window.onload = () => {
    calculateStats();
    spawnEnemy();
};
