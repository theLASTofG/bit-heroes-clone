// --- CONFIGURAÇÕES DO JOGADOR (STATS AVANÇADOS) ---
const player = {
    name: "Herói Pixel",
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    gold: 0,
    
    // Stats Base
    baseHp: 100,
    baseAtk: 15,
    
    // Stats Calculados
    maxHp: 100,
    hp: 100,
    atk: 15,
    def: 5,
    critChance: 5, // %
    evadeChance: 5, // %
    lifeSteal: 0, // %
    
    equipment: { weapon: null, armor: null },
    inventory: [],
    
    elements: {
        hpBar: document.getElementById('player-hp-bar-inner'),
        hpText: document.getElementById('player-hp-text'),
        expBar: document.getElementById('player-exp-bar'),
        levelText: document.getElementById('player-level'),
        goldText: document.getElementById('player-gold'),
        sprite: document.getElementById('player-sprite')
    }
};

// --- SISTEMA DE ZONAS ---
let currentZone = 1;
let monstersDefeatedInZone = 0;
const MONSTERS_PER_ZONE = 10;

// --- BANCO DE DADOS DE ITENS ---
const itemDatabase = {
    weapons: [
        { id: 'w1', name: 'Adaga Comum', icon: '🗡️', atk: 5, crit: 2, rarity: 'common' },
        { id: 'w2', name: 'Arco Longo', icon: '🏹', atk: 12, crit: 10, rarity: 'uncommon' },
        { id: 'w3', name: 'Lâmina Vampírica', icon: '🧛', atk: 25, lifeSteal: 15, rarity: 'rare' },
        { id: 'w4', name: 'Martelo do Trovão', icon: '⚡', atk: 50, crit: 25, rarity: 'epic' },
        { id: 'w5', name: 'Excalibur', icon: '✨', atk: 120, crit: 40, lifeSteal: 20, rarity: 'legendary' }
    ],
    armors: [
        { id: 'a1', name: 'Túnica Leve', icon: '👕', def: 3, evade: 2, rarity: 'common' },
        { id: 'a2', name: 'Couro Reforçado', icon: '🧥', def: 10, evade: 5, rarity: 'uncommon' },
        { id: 'a3', name: 'Manto das Sombras', icon: '🌑', def: 20, evade: 20, rarity: 'rare' },
        { id: 'a4', name: 'Armadura de Titã', icon: '🧱', def: 50, evade: 10, rarity: 'epic' },
        { id: 'a5', name: 'Aura Divina', icon: '😇', def: 100, evade: 30, lifeSteal: 10, rarity: 'legendary' }
    ]
};

const monsterTypes = [
    { name: "Slime", hpMult: 1.0, atkMult: 1.0, exp: 20, gold: 5, color: "#27ae60", scale: 0.8 },
    { name: "Globin", hpMult: 1.3, atkMult: 1.3, exp: 40, gold: 15, color: "#d35400", scale: 0.9 },
    { name: "Esqueleto", hpMult: 1.8, atkMult: 1.6, exp: 70, gold: 30, color: "#ecf0f1", scale: 1.0 },
    { name: "Orc", hpMult: 3.0, atkMult: 2.2, exp: 150, gold: 60, color: "#16a085", scale: 1.2 }
];

let currentEnemy = null;
let isBattleActive = false;
let currentTurn = 'player'; // 'player' ou 'enemy'

// --- CORE LOGIC ---

function calculateStats() {
    player.maxHp = player.baseHp + (player.level * 20);
    player.atk = player.baseAtk + (player.level * 4);
    player.def = 5 + (player.level * 2);
    player.critChance = 5;
    player.evadeChance = 5;
    player.lifeSteal = 0;

    Object.values(player.equipment).forEach(item => {
        if (!item) return;
        if (item.atk) player.atk += item.atk;
        if (item.def) player.def += item.def;
        if (item.crit) player.critChance += item.crit;
        if (item.evade) player.evadeChance += item.evade;
        if (item.lifeSteal) player.lifeSteal += item.lifeSteal;
    });
}

function spawnEnemy() {
    const isBoss = (monstersDefeatedInZone + 1) % MONSTERS_PER_ZONE === 0;
    const typeIndex = Math.min(currentZone - 1, monsterTypes.length - 1);
    const typeBase = monsterTypes[typeIndex];
    
    const zoneMult = 1 + (currentZone - 1) * 0.6;
    const bossMult = isBoss ? 3.5 : 1;

    currentEnemy = {
        name: isBoss ? `CHEFE ${typeBase.name.toUpperCase()}` : typeBase.name,
        maxHp: Math.floor(typeBase.hpMult * 60 * zoneMult * bossMult),
        atk: Math.floor(typeBase.atkMult * 12 * zoneMult * bossMult),
        def: Math.floor(5 * zoneMult),
        exp: Math.floor(typeBase.exp * zoneMult * bossMult),
        gold: Math.floor(typeBase.gold * zoneMult * bossMult),
        isBoss: isBoss,
        color: typeBase.color,
        scale: typeBase.scale * (isBoss ? 1.5 : 1)
    };
    currentEnemy.hp = currentEnemy.maxHp;

    const sprite = document.getElementById('enemy-sprite');
    sprite.style.backgroundColor = currentEnemy.color;
    sprite.style.transform = `scale(${currentEnemy.scale})`;
    
    const badge = document.getElementById('enemy-type');
    badge.textContent = isBoss ? "BOSS" : "ZONA " + currentZone;
    badge.className = `badge ${isBoss ? 'boss' : ''}`;

    updateUI();
    logMessage(`--- Um ${currentEnemy.name} apareceu! ---`);
    
    isBattleActive = true;
    currentTurn = 'player';
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

    if (isBattleActive) {
        setTimeout(battleLoop, 1200); // Delay entre turnos
    }
}

function performAttack(attacker, defender) {
    const isPlayerAttacking = attacker === player;
    
    // Lógica de Esquiva
    const evadeChance = isPlayerAttacking ? 0 : player.evadeChance;
    if (Math.random() * 100 < evadeChance) {
        logMessage(`💨 ${defender.name} ESQUIVOU!`);
        return;
    }

    // Lógica de Crítico
    let damageMult = 1;
    let isCrit = false;
    if (isPlayerAttacking && Math.random() * 100 < player.critChance) {
        damageMult = 2.5;
        isCrit = true;
    }

    const variance = Math.random() * 0.3 + 0.85;
    let damage = Math.floor((attacker.atk - (defender.def * 0.5)) * variance * damageMult);
    damage = Math.max(Math.floor(attacker.atk * 0.25), damage);

    defender.hp -= damage;
    
    // Life Steal
    if (isPlayerAttacking && player.lifeSteal > 0) {
        const heal = Math.floor(damage * (player.lifeSteal / 100));
        player.hp = Math.min(player.maxHp, player.hp + heal);
    }

    // Visual
    const attSprite = isPlayerAttacking ? player.elements.sprite : document.getElementById('enemy-sprite');
    const defSprite = isPlayerAttacking ? document.getElementById('enemy-sprite') : player.elements.sprite;
    
    attSprite.classList.add(isPlayerAttacking ? 'attack-player' : 'attack-enemy');
    setTimeout(() => {
        attSprite.classList.remove(isPlayerAttacking ? 'attack-player' : 'attack-enemy');
        defSprite.classList.add('damage-flash');
        setTimeout(() => defSprite.classList.remove('damage-flash'), 200);
    }, 150);

    logMessage(`${isCrit ? '💥 CRÍTICO! ' : ''}${attacker.name} causou ${damage} de dano.`);
    updateUI();

    if (defender.hp <= 0) {
        isBattleActive = false;
        handleVictory(isPlayerAttacking);
    }
}

function handleVictory(isPlayerWinner) {
    if (isPlayerWinner) {
        logMessage(`✨ Vitória! +${currentEnemy.exp} EXP, +${currentEnemy.gold} Ouro.`);
        player.exp += currentEnemy.exp;
        player.gold += currentEnemy.gold;
        monstersDefeatedInZone++;
        
        if (currentEnemy.isBoss) {
            currentZone++;
            monstersDefeatedInZone = 0;
            logMessage(`🚀 ZONA AVANÇADA! Bem-vindo à Zona ${currentZone}`);
        }

        checkLevelUp();
        rollLoot();
        
        setTimeout(() => {
            player.hp = Math.min(player.maxHp, player.hp + (player.maxHp * 0.3)); // Recupera 30% HP
            spawnEnemy();
        }, 2000);
    } else {
        logMessage(`💀 Você morreu. Reiniciando Zona...`);
        monstersDefeatedInZone = 0;
        player.hp = player.maxHp;
        isBattleActive = false;
        setTimeout(spawnEnemy, 3000);
    }
}

function rollLoot() {
    const chance = Math.random();
    let dropChance = currentEnemy.isBoss ? 0.9 : 0.2;
    
    if (chance < dropChance) {
        const pool = Math.random() > 0.5 ? itemDatabase.weapons : itemDatabase.armors;
        let r = Math.random() * 100;
        let item;

        if (r > 98) item = pool[4];
        else if (r > 90) item = pool[3];
        else if (r > 75) item = pool[2];
        else if (r > 45) item = pool[1];
        else item = pool[0];

        player.inventory.push({...item});
        logMessage(`🎁 DROP: [${item.rarity.toUpperCase()}] ${item.name}!`);
        updateInventoryUI();
    }
}

function checkLevelUp() {
    if (player.exp >= player.nextLevelExp) {
        player.level++;
        player.exp -= player.nextLevelExp;
        player.nextLevelExp = Math.floor(player.nextLevelExp * 1.7);
        calculateStats();
        player.hp = player.maxHp;
        logMessage(`🎊 LEVEL UP! Nível ${player.level}! 🎊`);
    }
}

function equipItem(index) {
    const item = player.inventory[index];
    const type = item.atk ? 'weapon' : 'armor';
    
    if (player.equipment[type]) {
        player.inventory.push(player.equipment[type]);
    }
    
    player.equipment[type] = item;
    player.inventory.splice(index, 1);
    
    calculateStats();
    updateUI();
    logMessage(`Equipado: ${item.name}`);
}

function logMessage(msg) {
    const p = document.createElement('p');
    p.innerHTML = msg;
    const log = document.getElementById('battle-log');
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > 40) log.removeChild(log.firstChild);
}

function updateUI() {
    player.elements.levelText.textContent = player.level;
    player.elements.goldText.textContent = player.gold;
    player.elements.hpText.textContent = `${Math.max(0, Math.ceil(player.hp))}/${player.maxHp}`;
    player.elements.hpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
    player.elements.expBar.style.width = `${(player.exp / player.nextLevelExp) * 100}%`;

    if (currentEnemy) {
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, Math.ceil(currentEnemy.hp))}/${currentEnemy.maxHp}`;
        document.getElementById('enemy-hp-bar-inner').style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;
        document.getElementById('enemy-name').textContent = currentEnemy.name;
    }

    const wSlot = document.getElementById('slot-weapon');
    wSlot.textContent = player.equipment.weapon ? player.equipment.weapon.icon : '⚔️';
    wSlot.className = `slot ${player.equipment.weapon?.rarity || ''}`;
    
    const aSlot = document.getElementById('slot-armor');
    aSlot.textContent = player.equipment.armor ? player.equipment.armor.icon : '🛡️';
    aSlot.className = `slot ${player.equipment.armor?.rarity || ''}`;
    
    updateInventoryUI();
}

function updateInventoryUI() {
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    player.inventory.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = `item-slot ${item.rarity}`;
        div.textContent = item.icon;
        div.onclick = () => equipItem(i);
        grid.appendChild(div);
    });
}

window.onload = () => {
    calculateStats();
    spawnEnemy();
};
