// --- SISTEMA DE RARIDADES (10 Tiers Base) ---
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

// --- SISTEMA DE ENCANTAMENTOS (50 Tiers) ---
const enchantTiers = Array.from({length: 50}, (_, i) => ({
    tier: i + 1,
    name: `T${i+1}`,
    color: `hsl(${(i * 7.2) % 360}, 70%, 60%)`,
    power: 1 + (i * 0.5) // Escala de poder
}));

const enchantStats = [
    { id: 'atk', name: 'Ataque', icon: '⚔️' },
    { id: 'hp', name: 'Vida', icon: '❤️' },
    { id: 'crit', name: 'Crítico', icon: '💥' },
    { id: 'evade', name: 'Esquiva', icon: '💨' },
    { id: 'lifeSteal', name: 'Roubo de Vida', icon: '🩸' }
];

// --- JOGADOR ---
const player = {
    level: 1, exp: 0, nextLevelExp: 100, gold: 1000,
    baseHp: 150, baseAtk: 20, baseDef: 10,
    hp: 150, maxHp: 150, atk: 20, def: 10,
    crit: 5, evade: 5, lifeSteal: 0,
    luck: 1.0,
    
    equipment: { weapon: null, armor: null, mount: null },
    inventory: [],
    
    // Encantamentos do Jogador (desbloqueia 1 slot a cada 5 níveis)
    enchants: [null, null, null, null, null, null, null, null, null, null], // Max 10 slots
    upgrades: { atk: 0, hp: 0, luck: 0 }
};

// --- BANCO DE DADOS DE ITENS ---
const itemTemplates = {
    weapon: [{ name: "Sword", icon: "⚔️" }, { name: "Axe", icon: "🪓" }, { name: "Bow", icon: "🏹" }],
    armor: [{ name: "Chestplate", icon: "🛡️" }, { name: "Robe", icon: "🥋" }, { name: "Leather", icon: "🧥" }],
    mount: [{ name: "Horse", icon: "🐎" }, { name: "Wolf", icon: "🐺" }, { name: "Dragon", icon: "🐲" }]
};

const monsterBases = [
    { name: "Slime", color: "#27ae60", hp: 80, atk: 15 },
    { name: "Bat", color: "#34495e", hp: 120, atk: 20 },
    { name: "Spider", color: "#8e44ad", hp: 200, atk: 35 },
    { name: "Skeleton", color: "#ecf0f1", hp: 350, atk: 50 },
    { name: "Demon", color: "#c0392b", hp: 800, atk: 100 }
];

let currentEnemy = null;
let currentZone = 1;
let defeatedInZone = 0;
let isBattleActive = false;
let currentTurn = 'player';

// --- CORE FUNCTIONS ---

function calculateStats() {
    player.maxHp = (player.baseHp + (player.level * 30) + (player.upgrades.hp * 60));
    player.atk = (player.baseAtk + (player.level * 6) + (player.upgrades.atk * 12));
    player.def = (player.baseDef + (player.level * 3));
    player.crit = 5; player.evade = 5; player.lifeSteal = 0;

    // Equipamentos
    Object.values(player.equipment).forEach(item => {
        if (!item) return;
        if (item.stats.atk) player.atk += item.stats.atk;
        if (item.stats.def) player.def += item.stats.def;
        if (item.stats.hp) player.maxHp += item.stats.hp;
        if (item.stats.crit) player.crit += item.stats.crit;
        if (item.stats.evade) player.evade += item.stats.evade;
        if (item.stats.lifeSteal) player.lifeSteal += item.stats.lifeSteal;
    });

    // Encantamentos
    player.enchants.forEach(enchant => {
        if (!enchant) return;
        const val = enchant.value;
        if (enchant.stat === 'atk') player.atk += val;
        if (enchant.stat === 'hp') player.maxHp += val;
        if (enchant.stat === 'crit') player.crit += val;
        if (enchant.stat === 'evade') player.evade += val;
        if (enchant.stat === 'lifeSteal') player.lifeSteal += val;
    });

    // Sinergia
    if (player.equipment.weapon && player.equipment.armor && 
        player.equipment.weapon.rarity.name === player.equipment.armor.rarity.name) {
        player.atk *= 1.2;
        player.maxHp *= 1.2;
    }
}

function generateItem(type = null) {
    if (!type) {
        const types = ['weapon', 'armor', 'mount'];
        type = types[Math.floor(Math.random() * types.length)];
    }
    const template = itemTemplates[type][Math.floor(Math.random() * itemTemplates[type].length)];
    
    const roll = Math.random() * 100 / player.luck;
    let cumulative = 0;
    let rarity = rarities[0];
    for (const r of rarities) {
        cumulative += r.weight;
        if (roll <= cumulative) { rarity = r; break; }
    }

    const m = rarity.bonusMult;
    const stats = {};
    if (type === 'weapon') { stats.atk = Math.floor(15 * m); stats.crit = Math.floor(3 * m); }
    else if (type === 'armor') { stats.def = Math.floor(8 * m); stats.evade = Math.floor(2 * m); }
    else { stats.hp = Math.floor(80 * m); stats.lifeSteal = Math.floor(2 * m); }

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
    const zMult = 1 + (currentZone - 1) * 1.0;
    const bMult = isBoss ? 5 : 1;

    currentEnemy = {
        name: isBoss ? `GOD BOSS ${base.name.toUpperCase()}` : base.name,
        hp: Math.floor(base.hp * zMult * bMult),
        maxHp: Math.floor(base.hp * zMult * bMult),
        atk: Math.floor(base.atk * zMult * bMult),
        def: Math.floor(15 * zMult),
        gold: Math.floor(50 * zMult * bMult),
        exp: Math.floor(100 * zMult * bMult),
        isBoss: isBoss,
        color: base.color,
        scale: isBoss ? 1.6 : 1
    };

    const sprite = document.getElementById('enemy-sprite');
    sprite.style.backgroundColor = currentEnemy.color;
    sprite.style.transform = `scale(${currentEnemy.scale})`;
    
    document.getElementById('enemy-type').textContent = isBoss ? "ULTRA BOSS" : "ZONA " + currentZone;
    document.getElementById('enemy-type').className = `badge ${isBoss ? 'boss' : ''}`;
    
    isBattleActive = true;
    currentTurn = 'player';
    updateUI();
    logMessage(`⚔️ Inimigo: ${currentEnemy.name} Nível ${currentZone}`);
    setTimeout(battleLoop, 1000);
}

function battleLoop() {
    if (!isBattleActive) return;
    if (currentTurn === 'player') { performAttack(player, currentEnemy); currentTurn = 'enemy'; }
    else { performAttack(currentEnemy, player); currentTurn = 'player'; }
    if (isBattleActive) setTimeout(battleLoop, 1200);
}

function performAttack(att, def) {
    const isPlayer = att === player;
    if (!isPlayer && Math.random() * 100 < player.evade) { logMessage(`💨 ESQUIVA!`); return; }

    let mult = 1;
    let crit = false;
    if (isPlayer && Math.random() * 100 < player.crit) { mult = 3.0; crit = true; }

    let dmg = Math.floor((att.atk - (def.def * 0.4)) * (Math.random() * 0.2 + 0.9) * mult);
    dmg = Math.max(Math.floor(att.atk * 0.3), dmg);

    def.hp -= dmg;
    if (isPlayer && player.lifeSteal > 0) player.hp = Math.min(player.maxHp, player.hp + Math.floor(dmg * (player.lifeSteal / 100)));

    const s = isPlayer ? document.getElementById('player-sprite') : document.getElementById('enemy-sprite');
    const d = isPlayer ? document.getElementById('enemy-sprite') : document.getElementById('player-sprite');
    s.classList.add(isPlayer ? 'attack-player' : 'attack-enemy');
    setTimeout(() => {
        s.classList.remove(isPlayer ? 'attack-player' : 'attack-enemy');
        d.classList.add('damage-flash');
        setTimeout(() => d.classList.remove('damage-flash'), 150);
    }, 150);

    logMessage(`${crit ? '💥 CRIT! ' : ''}${isPlayer ? 'Você' : att.name} causou ${dmg} dano.`);
    updateUI();

    if (def.hp <= 0) { isBattleActive = false; handleVictory(isPlayer); }
}

function handleVictory(isPlayer) {
    if (isPlayer) {
        player.gold += currentEnemy.gold;
        player.exp += currentEnemy.exp;
        defeatedInZone++;
        if (currentEnemy.isBoss) { currentZone++; defeatedInZone = 0; logMessage(`🚀 ZONA ${currentZone} DESBLOQUEADA!`); }
        checkLevelUp();
        rollLoot();
        setTimeout(() => { player.hp = Math.min(player.maxHp, player.hp + (player.maxHp * 0.5)); spawnEnemy(); }, 1500);
    } else {
        logMessage(`💀 Derrotado!`);
        defeatedInZone = 0;
        player.hp = player.maxHp;
        setTimeout(spawnEnemy, 3000);
    }
}

function rollLoot() {
    if (Math.random() < (currentEnemy.isBoss ? 1.0 : 0.3)) {
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
        player.nextLevelExp = Math.floor(player.nextLevelExp * 1.9);
        calculateStats();
        player.hp = player.maxHp;
        logMessage(`🎊 NÍVEL ${player.level}! 🎊`);
        if (player.level % 5 === 0) logMessage(`✨ NOVO SLOT DE ENCANTAMENTO! ✨`);
    }
}

// --- ENCANTAMENTOS ---

function rollEnchant(slotIndex) {
    const cost = 200 + (player.level * 50);
    if (player.gold < cost) { logMessage(`❌ Ouro insuficiente (${cost})`); return; }
    if (slotIndex >= Math.floor(player.level / 5) + 1) { logMessage(`❌ Slot bloqueado (Desbloqueia a cada 5 níveis)`); return; }

    player.gold -= cost;
    
    // Chance de Tier maior baseada em sorte
    const tierRoll = Math.random() * 100 / (1 + (player.upgrades.luck * 0.1));
    let tierIndex = 0;
    if (tierRoll < 0.5) tierIndex = Math.min(49, Math.floor(Math.random() * 10) + 40);
    else if (tierRoll < 5) tierIndex = Math.min(49, Math.floor(Math.random() * 15) + 25);
    else tierIndex = Math.floor(Math.random() * 25);

    const tier = enchantTiers[tierIndex];
    const stat = enchantStats[Math.floor(Math.random() * enchantStats.length)];
    
    let value = Math.floor(tier.power * 5);
    if (stat.id === 'hp') value *= 10;
    if (stat.id === 'crit' || stat.id === 'evade' || stat.id === 'lifeSteal') value = Math.floor(tier.power * 1.5);

    player.enchants[slotIndex] = {
        tier: tier,
        stat: stat.id,
        statName: stat.name,
        value: value,
        icon: stat.icon
    };

    calculateStats();
    updateUI();
    logMessage(`✨ Encantamento ${tier.name} [${stat.name} +${value}] aplicado!`);
}

// --- UI & TOOLTIPS ---

const tooltip = document.getElementById('tooltip');

function showTooltip(e, item) {
    tooltip.style.display = 'block';
    tooltip.style.left = (e.pageX + 20) + 'px';
    tooltip.style.top = (e.pageY + 20) + 'px';
    tooltip.style.borderColor = item.rarity.color;

    let statsHtml = '';
    const current = player.equipment[item.type];
    
    const allPossibleStats = ['atk', 'def', 'hp', 'crit', 'evade', 'lifeSteal'];
    allPossibleStats.forEach(s => {
        const val = item.stats[s] || 0;
        const currVal = current ? (current.stats[s] || 0) : 0;
        if (val === 0 && currVal === 0) return;
        
        const diff = val - currVal;
        const diffText = diff > 0 ? `<span class="stat-up">+${diff}</span>` : (diff < 0 ? `<span class="stat-down">${diff}</span>` : `<span style="color:#888">0</span>`);
        statsHtml += `<div class="tooltip-stat"><span>${s.toUpperCase()}:</span> <span>${val} (${diffText})</span></div>`;
    });

    tooltip.innerHTML = `
        <div class="tooltip-header" style="color:${item.rarity.color}">${item.name}</div>
        <div style="font-size:11px; color:#888; margin-bottom:10px;">Raridade: ${item.rarity.name}</div>
        <div style="background:#111; padding:10px; border-radius:5px;">${statsHtml}</div>
        <div style="font-size:10px; color:#f1c40f; margin-top:10px; text-align:center;">CLIQUE PARA EQUIPAR</div>
    `;
}

function hideTooltip() { tooltip.style.display = 'none'; }

function updateInventoryUI() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    player.inventory.slice(-20).forEach((item, i) => { // Mostra apenas os últimos 20
        const div = document.createElement('div');
        div.className = `item-slot ${item.rarity.name.toLowerCase()}`;
        div.textContent = item.icon;
        div.onmouseover = (e) => showTooltip(e, item);
        div.onmouseout = hideTooltip;
        div.onclick = () => { equipItem(player.inventory.indexOf(item)); hideTooltip(); };
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
    document.getElementById('player-gold').textContent = Math.floor(player.gold);
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
        if (item) { slot.onmouseover = (e) => showTooltip(e, item); slot.onmouseout = hideTooltip; }
    });

    // Atualizar Encantamentos na Loja
    const shop = document.getElementById('shop-container');
    shop.innerHTML = `
        <button class="shop-btn" id="upgrade-atk">Melhorar ATK (💰 ${100 + player.upgrades.atk * 150})</button>
        <button class="shop-btn" id="upgrade-hp">Melhorar HP (💰 ${100 + player.upgrades.hp * 150})</button>
        <button class="shop-btn" id="upgrade-luck">Melhorar SORTE (💰 ${500 + player.upgrades.luck * 1000})</button>
        <h3 style="font-size:12px; margin-top:15px; color:#f1c40f">GIRAR ENCANTAMENTOS</h3>
        <div class="enchant-grid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:5px;">
            ${player.enchants.map((en, i) => {
                const locked = i >= Math.floor(player.level / 5) + 1;
                return `<div class="enchant-slot ${locked ? 'locked' : ''}" 
                             style="border:1px solid ${en ? en.tier.color : '#444'}; 
                                    background:${locked ? '#000' : '#111'}; 
                                    aspect-ratio:1; display:flex; align-items:center; justify-content:center; 
                                    font-size:14px; cursor:${locked ? 'not-allowed' : 'pointer'}"
                             onclick="${locked ? '' : `rollEnchant(${i})`}"
                             title="${en ? `${en.tier.name}: ${en.statName} +${en.value}` : (locked ? 'Desbloqueia a cada 5 níveis' : 'Clique para Girar (💰)')}">
                             ${en ? en.icon : (locked ? '🔒' : '✨')}
                        </div>`;
            }).join('')}
        </div>
    `;

    // Re-bind buttons
    document.getElementById('upgrade-atk').onclick = () => buyUpgrade('atk', 100, 150);
    document.getElementById('upgrade-hp').onclick = () => buyUpgrade('hp', 100, 150);
    document.getElementById('upgrade-luck').onclick = () => buyUpgrade('luck', 500, 1000);

    updateInventoryUI();
}

function buyUpgrade(stat, base, scale) {
    const cost = base + player.upgrades[stat] * scale;
    if (player.gold >= cost) {
        player.gold -= cost;
        player.upgrades[stat]++;
        if (stat === 'luck') player.luck += 0.2;
        calculateStats();
        updateUI();
        logMessage(`🔥 Upgrade ${stat.toUpperCase()} comprado!`);
    }
}

function logMessage(msg) {
    const log = document.getElementById('battle-log');
    const p = document.createElement('p');
    p.innerHTML = msg;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 25) log.removeChild(log.firstChild);
}

window.onload = () => { calculateStats(); spawnEnemy(); };
