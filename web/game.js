// --- SISTEMA DE RARIDADES (10 Tiers) ---
const rarities = [
    { name: "Common", color: "#7f8c8d", weight: 60, bonusMult: 1.0, relicBonus: 5 },
    { name: "Uncommon", color: "#2ecc71", weight: 25, bonusMult: 1.5, relicBonus: 10 },
    { name: "Rare", color: "#3498db", weight: 10, bonusMult: 2.2, relicBonus: 15 },
    { name: "Epic", color: "#9b59b6", weight: 4, bonusMult: 3.5, relicBonus: 20 },
    { name: "Legendary", color: "#f1c40f", weight: 0.8, bonusMult: 6.0, relicBonus: 25 },
    { name: "Mythic", color: "#e67e22", weight: 0.15, bonusMult: 10.0, relicBonus: 35 },
    { name: "Celestial", color: "#1abc9c", weight: 0.04, bonusMult: 18.0, relicBonus: 50 },
    { name: "Void", color: "#8e44ad", weight: 0.008, bonusMult: 30.0, relicBonus: 75 },
    { name: "Ancient", color: "#c0392b", weight: 0.0015, bonusMult: 50.0, relicBonus: 100 },
    { name: "Godly", color: "#ffffff", weight: 0.0004, bonusMult: 100.0, relicBonus: 200 }
];

// --- SISTEMA DE PETS ---
const petBases = [
    { name: "Mini Slime", icon: "💧", stat: "hp", val: 50, rarity: "Common" },
    { name: "Fada", icon: "🧚", stat: "lifeSteal", val: 5, rarity: "Rare" },
    { name: "Dragão Bebê", icon: "🐲", stat: "atk", val: 100, rarity: "Epic" },
    { name: "Fênix", icon: "🔥", stat: "crit", val: 15, rarity: "Legendary" },
    { name: "Anjo Guardião", icon: "👼", stat: "evade", val: 20, rarity: "Mythic" }
];

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
    { id: 'goldBonus', name: 'Bônus Ouro', icon: '💰', base: 5 },
    { id: 'expBonus', name: 'Bônus EXP', icon: '✨', base: 5 }
];

// --- JOGADOR ---
const player = {
    level: 1, exp: 0, nextLevelExp: 100, gold: 1000,
    baseHp: 200, baseAtk: 25, baseDef: 15,
    hp: 200, maxHp: 200, atk: 25, def: 15,
    crit: 5, evade: 5, lifeSteal: 0, goldBonus: 0, expBonus: 0,
    luck: 1.0, powerRating: 0,
    
    equipment: { weapon: null, armor: null, mount: null, pet: null },
    relics: [null, null, null, null, null], // 5 slots de relíquias
    inventory: [],
    enchants: Array(10).fill(null),
    upgrades: { atk: 0, hp: 0, luck: 0 }
};

// --- MASMORRAS (DUNGEONS) ---
let inDungeon = false;
let dungeonFloor = 0;
const MAX_DUNGEON_FLOORS = 5;

const monsterBases = [
    { name: "Slime", color: "#27ae60", hp: 100, atk: 20 },
    { name: "Bat", color: "#34495e", hp: 150, atk: 30 },
    { name: "Spider", color: "#8e44ad", hp: 250, atk: 50 },
    { name: "Skeleton", color: "#ecf0f1", hp: 450, atk: 80 },
    { name: "Demon", color: "#c0392b", hp: 1000, atk: 150 }
];

let currentEnemy = null;
let currentZone = 1;
let defeatedInZone = 0;
let isBattleActive = false;
let currentTurn = 'player';
let battleTimer = null;

// --- CORE FUNCTIONS ---

function calculateStats() {
    // 1. Calcular Stats Base
    let totalHp = (player.baseHp + (player.level * 40) + (player.upgrades.hp * 100));
    let totalAtk = (player.baseAtk + (player.level * 8) + (player.upgrades.atk * 20));
    let totalDef = (player.baseDef + (player.level * 4));
    let totalCrit = 5;
    let totalEvade = 5;
    let totalLifeSteal = 0;
    player.goldBonus = 0;
    player.expBonus = 0;

    // 2. Adicionar Equipamentos & Pets (Aditivos)
    Object.values(player.equipment).forEach(item => {
        if (!item) return;
        if (item.stats) {
            if (item.stats.atk) totalAtk += item.stats.atk;
            if (item.stats.def) totalDef += item.stats.def;
            if (item.stats.hp) totalHp += item.stats.hp;
            if (item.stats.crit) totalCrit += item.stats.crit;
            if (item.stats.evade) totalEvade += item.stats.evade;
            if (item.stats.lifeSteal) totalLifeSteal += item.stats.lifeSteal;
        } else if (item.stat) { // Pet
            const val = item.val * (1 + player.level * 0.1);
            if (item.stat === 'atk') totalAtk += val;
            if (item.stat === 'hp') totalHp += val;
            if (item.stat === 'crit') totalCrit += val;
            if (item.stat === 'evade') totalEvade += val;
            if (item.stat === 'lifeSteal') totalLifeSteal += val;
        }
    });

    // 3. Adicionar Encantamentos (Aditivos)
    player.enchants.forEach(en => {
        if (!en) return;
        if (en.stat === 'atk') totalAtk += en.value;
        if (en.stat === 'hp') totalHp += en.value;
        if (en.stat === 'crit') totalCrit += en.value;
        if (en.stat === 'evade') totalEvade += en.value;
        if (en.stat === 'lifeSteal') totalLifeSteal += en.value;
        if (en.stat === 'goldBonus') player.goldBonus += en.value;
        if (en.stat === 'expBonus') player.expBonus += en.value;
    });

    // 4. Sinergia (+25% multiplicativo)
    if (player.equipment.weapon && player.equipment.armor && 
        player.equipment.weapon.rarity.name === player.equipment.armor.rarity.name) {
        totalAtk *= 1.25;
        totalHp *= 1.25;
    }

    // 5. Aplicar Relíquias (Multiplicativo %)
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

    player.powerRating = Math.floor((player.atk * 2) + (player.maxHp / 5) + (player.def * 3) + (player.crit * 10) + (player.evade * 10) + (player.lifeSteal * 20));
}

function updateUI() {
    document.getElementById('player-level').textContent = player.level;
    document.getElementById('player-gold').textContent = Math.floor(player.gold);
    document.getElementById('player-hp-text').textContent = `${Math.max(0, Math.ceil(player.hp))}/${Math.ceil(player.maxHp)}`;
    document.getElementById('player-hp-bar-inner').style.width = `${(player.hp / player.maxHp) * 100}%`;
    document.getElementById('player-exp-bar').style.width = `${(player.exp / player.nextLevelExp) * 100}%`;
    document.getElementById('zone-display').textContent = inDungeon ? `DUNGEON F${dungeonFloor}` : currentZone;

    document.getElementById('stat-atk').textContent = Math.floor(player.atk);
    document.getElementById('stat-hp').textContent = Math.floor(player.maxHp);
    document.getElementById('stat-def').textContent = Math.floor(player.def);
    document.getElementById('stat-crit').textContent = player.crit.toFixed(1) + "%";
    document.getElementById('stat-evade').textContent = player.evade.toFixed(1) + "%";
    document.getElementById('stat-lifesteal').textContent = player.lifeSteal.toFixed(1) + "%";
    document.getElementById('stat-luck').textContent = player.luck.toFixed(1) + "x";
    document.getElementById('stat-pr').textContent = player.powerRating;

    if (currentEnemy) {
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, Math.ceil(currentEnemy.hp))}/${currentEnemy.maxHp}`;
        document.getElementById('enemy-hp-bar-inner').style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;
        document.getElementById('enemy-name').textContent = currentEnemy.name;
    }

    // Equipamento & Pet
    ['weapon', 'armor', 'mount', 'pet'].forEach(type => {
        const slot = document.getElementById(`slot-${type}`);
        const item = player.equipment[type];
        slot.textContent = item ? item.icon : (type === 'weapon' ? '⚔️' : type === 'armor' ? '🛡️' : type === 'mount' ? '🐎' : '🐾');
        slot.className = `slot ${item?.rarity?.name?.toLowerCase() || item?.rarity?.toLowerCase() || ''}`;
        if (item) { slot.onmouseover = (e) => showTooltip(e, item); slot.onmouseout = hideTooltip; }
        else { slot.onmouseover = null; }
    });

    // Relíquias
    const relicContainer = document.getElementById('relic-slots');
    relicContainer.innerHTML = '';
    player.relics.forEach((relic, i) => {
        const div = document.createElement('div');
        div.className = `slot relic-slot ${relic ? relic.rarity.name.toLowerCase() : ''}`;
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
}

function updateShopUI() {
    const shop = document.getElementById('shop-container');
    shop.innerHTML = `
        <button class="shop-btn" id="upgrade-atk">Melhorar ATK (💰 ${100 + player.upgrades.atk * 200})</button>
        <button class="shop-btn" id="upgrade-hp">Melhorar HP (💰 ${100 + player.upgrades.hp * 200})</button>
        <button class="shop-btn" id="upgrade-luck">Melhorar SORTE (💰 ${1000 + player.upgrades.luck * 2000})</button>
        <button class="shop-btn" id="btn-dungeon" style="background:#8e44ad; margin-top:5px;">${inDungeon ? 'SAIR DA DUNGEON' : 'ENTRAR NA DUNGEON'}</button>
        <h3 style="font-size:11px; margin-top:10px; color:#f1c40f">ENCANTAMENTOS</h3>
        <div class="enchant-grid" style="display:grid; grid-template-columns:repeat(5, 20%); gap:2px;">
            ${player.enchants.map((en, i) => {
                const locked = i >= Math.floor(player.level / 5) + 1;
                return `<div class="enchant-slot ${locked ? 'locked' : ''}" 
                             style="border:1px solid ${en ? en.color : '#444'}; background:${locked ? '#000' : '#111'}; aspect-ratio:1; display:flex; align-items:center; justify-content:center; cursor:${locked ? 'not-allowed' : 'pointer'}"
                             onclick="${locked ? '' : `rollEnchant(${i})`}"
                             title="${en ? `${en.name}: ${en.statName} +${en.value}` : (locked ? 'Bloqueado' : 'Girar (💰)')}">
                             ${en ? en.icon : (locked ? '🔒' : '✨')}
                        </div>`;
            }).join('')}
        </div>
    `;
    document.getElementById('upgrade-atk').onclick = () => buyUpgrade('atk', 100, 200);
    document.getElementById('upgrade-hp').onclick = () => buyUpgrade('hp', 100, 200);
    document.getElementById('upgrade-luck').onclick = () => buyUpgrade('luck', 1000, 2000);
    document.getElementById('btn-dungeon').onclick = toggleDungeon;
}

function toggleDungeon() {
    isBattleActive = false;
    clearTimeout(battleTimer);
    if (inDungeon) {
        inDungeon = false;
        dungeonFloor = 0;
        logMessage(`🚪 Você saiu da masmorra.`);
    } else {
        inDungeon = true;
        dungeonFloor = 1;
        logMessage(`🏰 Você entrou na Masmorra Ancestral!`);
    }
    spawnEnemy();
}

function spawnEnemy() {
    isBattleActive = false;
    clearTimeout(battleTimer);
    
    const isBoss = inDungeon ? (dungeonFloor === MAX_DUNGEON_FLOORS) : ((defeatedInZone + 1) % 10 === 0);
    const base = monsterBases[Math.min(currentZone - 1, monsterBases.length - 1)];
    const zMult = 1 + (currentZone - 1) * 1.2 + (inDungeon ? dungeonFloor * 0.5 : 0);
    const bMult = isBoss ? (inDungeon ? 8 : 5) : 1;

    currentEnemy = {
        name: isBoss ? (inDungeon ? `DUNGEON OVERLORD` : `BOSS ${base.name.toUpperCase()}`) : (inDungeon ? `DUNGEON MINION F${dungeonFloor}` : base.name),
        hp: Math.floor(base.hp * zMult * bMult), maxHp: Math.floor(base.hp * zMult * bMult),
        atk: Math.floor(base.atk * zMult * bMult), def: Math.floor(20 * zMult),
        gold: Math.floor(100 * zMult * bMult), exp: Math.floor(200 * zMult * bMult),
        isBoss: isBoss, color: inDungeon ? "#000" : base.color, scale: isBoss ? 1.7 : 1
    };
    const sprite = document.getElementById('enemy-sprite');
    sprite.style.backgroundColor = currentEnemy.color;
    sprite.style.transform = `scale(${currentEnemy.scale})`;
    document.getElementById('enemy-type').textContent = isBoss ? "BOSS" : (inDungeon ? `F${dungeonFloor}` : "ZONA " + currentZone);
    document.getElementById('enemy-type').className = `badge ${isBoss ? 'boss' : ''}`;
    
    isBattleActive = true; 
    currentTurn = 'player';
    updateUI();
    battleTimer = setTimeout(battleLoop, 1000);
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
    
    if (isBattleActive) {
        battleTimer = setTimeout(battleLoop, 1200);
    }
}

function performAttack(att, def) {
    if (!isBattleActive || !currentEnemy) return;
    
    const isPlayer = att === player;
    if (!isPlayer && Math.random() * 100 < player.evade) { logMessage(`💨 ESQUIVA!`); return; }
    
    let mult = 1; let crit = false;
    if (isPlayer && Math.random() * 100 < player.crit) { mult = 3.5; crit = true; }
    
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
    
    if (def.hp <= 0) { 
        isBattleActive = false; 
        clearTimeout(battleTimer);
        handleVictory(isPlayer); 
    }
}

function handleVictory(isPlayer) {
    if (isPlayer) {
        const goldGain = Math.floor(currentEnemy.gold * (1 + player.goldBonus / 100));
        const expGain = Math.floor(currentEnemy.exp * (1 + player.expBonus / 100));
        player.gold += goldGain; player.exp += expGain;
        logMessage(`✨ Vitória! +${goldGain} Ouro, +${expGain} EXP.`);
        
        if (inDungeon) {
            if (dungeonFloor < MAX_DUNGEON_FLOORS) { 
                dungeonFloor++; 
                logMessage(`🔼 Avançando para o andar ${dungeonFloor}...`); 
            } else { 
                inDungeon = false; 
                dungeonFloor = 0; 
                logMessage(`🏆 DUNGEON CONCLUÍDA!`); 
                rollLoot(true); 
            }
        } else {
            defeatedInZone++;
            if (currentEnemy.isBoss) { 
                currentZone++; 
                defeatedInZone = 0; 
                logMessage(`🚀 ZONA ${currentZone}!`); 
            }
        }
        checkLevelUp(); rollLoot();
        setTimeout(() => { 
            player.hp = Math.min(player.maxHp, player.hp + (player.maxHp * 0.5)); 
            spawnEnemy(); 
        }, 1500);
    } else {
        logMessage(`💀 Derrotado!`);
        if (inDungeon) { inDungeon = false; dungeonFloor = 0; }
        defeatedInZone = 0; player.hp = player.maxHp;
        setTimeout(spawnEnemy, 3000);
    }
}

function rollLoot(guaranteedLegendary = false) {
    if (!currentEnemy) return;
    
    // Chance de Relíquia (Exclusivo de Bosses)
    if (currentEnemy.isBoss && Math.random() < 0.4) {
        const relic = generateRelic();
        player.inventory.push(relic);
        logMessage(`💠 RELÍQUIA: <span style="color:${relic.rarity.color}">[${relic.rarity.name}] ${relic.name}</span>`);
    }

    let chance = currentEnemy.isBoss ? 1.0 : 0.3;
    if (Math.random() < chance) {
        const item = guaranteedLegendary ? generateItem(null, rarities[4]) : generateItem();
        player.inventory.push(item);
        logMessage(`🎁 DROP: <span style="color:${item.rarity.color || '#fff'}">[${item.rarity.name || item.rarity}] ${item.name}</span>`);
        updateInventoryUI();
    }
    if (Math.random() < 0.05) {
        const pet = petBases[Math.floor(Math.random() * petBases.length)];
        player.inventory.push({...pet, type: 'pet'});
        logMessage(`🐾 PET ENCONTRADO: ${pet.icon} ${pet.name}!`);
        updateInventoryUI();
    }
}

function generateRelic() {
    const template = relicTemplates[Math.floor(Math.random() * relicTemplates.length)];
    const roll = Math.random() * 100 / player.luck;
    let cumulative = 0;
    let rarity = rarities[0];
    for (const r of rarities) {
        cumulative += r.weight;
        if (roll <= cumulative) { rarity = r; break; }
    }
    return {
        id: Math.random().toString(36).substr(2, 9),
        name: template.name,
        icon: template.icon,
        type: 'relic',
        stat: template.stat,
        rarity: rarity,
        bonusValue: rarity.relicBonus
    };
}

function generateItem(type = null, forcedRarity = null) {
    if (!type) type = ['weapon', 'armor', 'mount'][Math.floor(Math.random() * 3)];
    const template = itemTemplates[type][Math.floor(Math.random() * itemTemplates[type].length)];
    let rarity = forcedRarity;
    if (!rarity) {
        const roll = Math.random() * 100 / player.luck;
        let cumulative = 0; rarity = rarities[0];
        for (const r of rarities) { cumulative += r.weight; if (roll <= cumulative) { rarity = r; break; } }
    }
    const m = rarity.bonusMult; const stats = {};
    if (type === 'weapon') { stats.atk = Math.floor(20 * m); stats.crit = Math.floor(4 * m); }
    else if (type === 'armor') { stats.def = Math.floor(10 * m); stats.evade = Math.floor(3 * m); }
    else { stats.hp = Math.floor(100 * m); stats.lifeSteal = Math.floor(3 * m); }
    return { id: Math.random().toString(36).substr(2, 9), name: `${rarity.name} ${template.name}`, icon: template.icon, type, rarity, stats };
}

function equipRelic(inventoryIndex) {
    const relic = player.inventory[inventoryIndex];
    let equipped = false;
    for (let i = 0; i < player.relics.length; i++) {
        if (player.relics[i] === null) {
            player.relics[i] = relic;
            player.inventory.splice(inventoryIndex, 1);
            equipped = true;
            break;
        }
    }
    if (!equipped) {
        logMessage(`❌ Slots de relíquias cheios!`);
    } else {
        calculateStats();
        updateUI();
        logMessage(`💠 Relíquia equipada!`);
    }
}

function unequipRelic(relicIndex) {
    const relic = player.relics[relicIndex];
    if (relic) {
        player.inventory.push(relic);
        player.relics[relicIndex] = null;
        calculateStats();
        updateUI();
    }
}

function rollEnchant(slotIndex) {
    const cost = 500 + (player.level * 100);
    if (player.gold < cost) { logMessage(`❌ Ouro insuficiente`); return; }
    player.gold -= cost;
    const tier = Math.floor(Math.random() * 50);
    const stat = enchantStats[Math.floor(Math.random() * enchantStats.length)];
    const power = 1 + (tier * 0.6);
    let val = Math.floor(stat.base * power);
    player.enchants[slotIndex] = { name: `Tier ${tier+1}`, stat: stat.id, statName: stat.name, value: val, icon: stat.icon, color: `hsl(${(tier * 7) % 360}, 70%, 50%)` };
    calculateStats(); updateUI();
    logMessage(`✨ Encanto ${stat.name} +${val} aplicado!`);
}

function checkLevelUp() {
    if (player.exp >= player.nextLevelExp) {
        player.level++; player.exp -= player.nextLevelExp; player.nextLevelExp = Math.floor(player.nextLevelExp * 2.0);
        calculateStats(); player.hp = player.maxHp;
        logMessage(`🎊 NÍVEL ${player.level}! 🎊`);
    }
}

const tooltip = document.getElementById('tooltip');
function showTooltip(e, item) {
    tooltip.style.display = 'block'; tooltip.style.borderColor = item.rarity?.color || '#fff';
    let sHtml = '';
    if (item.type === 'relic') {
        sHtml = `<div class="tooltip-stat"><span>BÔNUS:</span> <span class="stat-up">+${item.bonusValue}% ${item.stat.toUpperCase()}</span></div>`;
    } else if (item.stats) {
        const current = player.equipment[item.type];
        ['atk', 'def', 'hp', 'crit', 'evade', 'lifeSteal'].forEach(s => {
            const v = item.stats[s] || 0; const cV = current ? (current.stats[s] || 0) : 0;
            if (v === 0 && cV === 0) return;
            const diff = v - cV;
            const dText = diff > 0 ? `<span class="stat-up">+${diff}</span>` : (diff < 0 ? `<span class="stat-down">${diff}</span>` : `<span style="color:#888">0</span>`);
            sHtml += `<div class="tooltip-stat"><span>${s.toUpperCase()}:</span> <span>${v} (${dText})</span></div>`;
        });
    } else {
        sHtml = `<div class="tooltip-stat"><span>${item.stat.toUpperCase()}:</span> <span>+${item.val}</span></div>`;
    }
    tooltip.innerHTML = `<div class="tooltip-header" style="color:${item.rarity?.color || '#fff'}">${item.name}</div><div style="font-size:11px; color:#888; margin-bottom:10px;">Tipo: ${item.type.toUpperCase()}</div><div style="background:#111; padding:10px; border-radius:5px;">${sHtml}</div><div style="font-size:10px; color:#f1c40f; margin-top:10px; text-align:center;">CLIQUE PARA EQUIPAR</div>`;
    const rect = e.target.getBoundingClientRect(); tooltip.style.visibility = 'hidden'; tooltip.style.display = 'block'; const tRect = tooltip.getBoundingClientRect(); tooltip.style.visibility = 'visible';
    let left = rect.left + (rect.width / 2) - (tRect.width / 2); let top = rect.top - tRect.height - 15;
    if (left < 20) left = 20; if (left + tRect.width > window.innerWidth - 20) left = window.innerWidth - tRect.width - 20;
    if (top < 20) top = rect.bottom + 15;
    tooltip.style.left = left + 'px'; tooltip.style.top = top + 'px';
}
function hideTooltip() { tooltip.style.display = 'none'; }

function updateInventoryUI() {
    const grid = document.getElementById('inventory-grid'); grid.innerHTML = '';
    player.inventory.slice(-24).forEach((item, i) => {
        const div = document.createElement('div'); div.className = `item-slot ${item.rarity?.name?.toLowerCase() || item.rarity?.toLowerCase() || ''}`; div.textContent = item.icon;
        div.onmouseover = (e) => showTooltip(e, item); div.onmouseout = hideTooltip;
        div.onclick = () => { 
            if (item.type === 'relic') equipRelic(player.inventory.indexOf(item));
            else equipItem(player.inventory.indexOf(item)); 
            hideTooltip(); 
        };
        grid.appendChild(div);
    });
}

function equipItem(i) {
    const item = player.inventory[i];
    if (player.equipment[item.type]) player.inventory.push(player.equipment[item.type]);
    player.equipment[item.type] = item; player.inventory.splice(i, 1);
    calculateStats(); updateUI();
}

function buyUpgrade(stat, base, scale) {
    const cost = base + player.upgrades[stat] * scale;
    if (player.gold >= cost) { player.gold -= cost; player.upgrades[stat]++; if (stat === 'luck') player.luck += 0.25; calculateStats(); updateUI(); logMessage(`🔥 Upgrade ${stat.toUpperCase()}!`); }
}

function logMessage(msg) {
    const log = document.getElementById('battle-log'); const p = document.createElement('p'); p.innerHTML = msg; log.appendChild(p);
    log.scrollTop = log.scrollHeight; if (log.children.length > 25) log.removeChild(log.firstChild);
}

window.onload = () => { calculateStats(); spawnEnemy(); };
