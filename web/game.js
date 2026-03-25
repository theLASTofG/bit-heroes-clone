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
    baseAgility: 10, // Agilidade determina chance de esquiva e velocidade de ataque
    
    // Stats Calculados
    maxHp: 100,
    hp: 100,
    atk: 15,
    def: 5,
    critChance: 5, // %
    evadeChance: 5, // %
    lifeSteal: 0, // %
    
    equipment: { weapon: null, armor: null, accessory: null },
    inventory: [],
    
    // Referências DOM
    elements: {
        hpBar: document.getElementById('player-hp-bar-inner'),
        hpText: document.getElementById('player-hp-text'),
        expBar: document.getElementById('player-exp-bar'),
        levelText: document.getElementById('player-level'),
        goldText: document.getElementById('player-gold'),
        sprite: document.getElementById('player-sprite')
    }
};

// --- SISTEMA DE ZONAS (PROGRESSÃO) ---
let currentZone = 1;
let monstersDefeatedInZone = 0;
const MONSTERS_PER_ZONE = 10;

// --- BANCO DE DADOS DE ITENS (RARIDADES ÚNICAS) ---
const itemDatabase = {
    weapons: [
        { id: 'w1', name: 'Adaga Comum', icon: '🗡️', atk: 5, crit: 2, rarity: 'common' },
        { id: 'w2', name: 'Arco Longo', icon: '🏹', atk: 12, crit: 10, rarity: 'uncommon' },
        { id: 'w3', name: 'Lâmina Vampírica', icon: '🧛', atk: 20, lifeSteal: 15, rarity: 'rare' },
        { id: 'w4', name: 'Martelo do Trovão', icon: '⚡', atk: 45, crit: 25, rarity: 'epic' },
        { id: 'w5', name: 'Excalibur', icon: '✨', atk: 100, crit: 40, lifeSteal: 20, rarity: 'legendary' }
    ],
    armors: [
        { id: 'a1', name: 'Túnica Leve', icon: '👕', def: 3, evade: 2, rarity: 'common' },
        { id: 'a2', name: 'Couro Reforçado', icon: '🧥', def: 8, evade: 5, rarity: 'uncommon' },
        { id: 'a3', name: 'Manto das Sombras', icon: '🌑', def: 15, evade: 20, rarity: 'rare' },
        { id: 'a4', name: 'Armadura de Titã', icon: '🧱', def: 40, evade: 10, rarity: 'epic' },
        { id: 'a5', name: 'Aura Divina', icon: '😇', def: 80, evade: 30, lifeSteal: 10, rarity: 'legendary' }
    ]
};

// --- MONSTROS E CHEFES ---
const monsterTypes = [
    { name: "Slime", hpMult: 1.0, atkMult: 1.0, exp: 20, gold: 5, color: "#27ae60", scale: 0.8 },
    { name: "Globin", hpMult: 1.2, atkMult: 1.3, exp: 35, gold: 12, color: "#d35400", scale: 0.9 },
    { name: "Esqueleto", hpMult: 1.5, atkMult: 1.5, exp: 60, gold: 25, color: "#ecf0f1", scale: 1.0 },
    { name: "Orc", hpMult: 2.5, atkMult: 2.0, exp: 120, gold: 50, color: "#16a085", scale: 1.2 }
];

let currentEnemy = null;
let isBattleOver = false;
let autoBattleInterval = null;

// --- LÓGICA DE CORE ---

function calculateStats() {
    // Reset para base
    player.maxHp = player.baseHp + (player.level * 15);
    player.atk = player.baseAtk + (player.level * 3);
    player.def = 5 + (player.level * 1);
    player.critChance = 5;
    player.evadeChance = 5;
    player.lifeSteal = 0;

    // Aplicar Equipamentos
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
    const typeBase = monsterTypes[Math.min(currentZone - 1, monsterTypes.length - 1)];
    
    const zoneMult = 1 + (currentZone - 1) * 0.5;
    const bossMult = isBoss ? 3 : 1;

    currentEnemy = {
        name: isBoss ? `CHEFE ${typeBase.name.toUpperCase()}` : typeBase.name,
        maxHp: Math.floor(typeBase.hpMult * 50 * zoneMult * bossMult),
        atk: Math.floor(typeBase.atkMult * 10 * zoneMult * bossMult),
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
    
    document.getElementById('enemy-type').textContent = isBoss ? "BOSS" : "ZONA " + currentZone;
    document.getElementById('enemy-type').className = `badge ${isBoss ? 'boss' : ''}`;

    isBattleOver = false;
    updateUI();
    logMessage(`--- Um ${currentEnemy.name} apareceu! ---`);
}

function performAttack(attacker, defender) {
    if (isBattleOver) return;

    const isPlayer = attacker === player;
    
    // Lógica de Esquiva
    const evadeChance = isPlayer ? 0 : player.evadeChance; // Inimigos não esquivam nesta versão simples
    if (Math.random() * 100 < evadeChance) {
        logMessage(`💨 ${defender.name} ESQUIVOU do ataque!`);
        return;
    }

    // Lógica de Crítico
    let damageMult = 1;
    let isCrit = false;
    if (isPlayer && Math.random() * 100 < player.critChance) {
        damageMult = 2;
        isCrit = true;
    }

    const variance = Math.random() * 0.3 + 0.85; // 0.85 a 1.15
    let damage = Math.floor((attacker.atk - (defender.def * 0.4)) * variance * damageMult);
    damage = Math.max(Math.floor(attacker.atk * 0.2), damage);

    defender.hp -= damage;
    
    // Life Steal
    if (isPlayer && player.lifeSteal > 0) {
        const heal = Math.floor(damage * (player.lifeSteal / 100));
        player.hp = Math.min(player.maxHp, player.hp + heal);
        if (heal > 0) logMessage(`🩸 Life Steal: +${heal} HP`);
    }

    // Visual
    const sprite = isPlayer ? player.elements.sprite : document.getElementById('enemy-sprite');
    const defSprite = isPlayer ? document.getElementById('enemy-sprite') : player.elements.sprite;
    sprite.classList.add(isPlayer ? 'attack-player' : 'attack-enemy');
    setTimeout(() => {
        sprite.classList.remove(isPlayer ? 'attack-player' : 'attack-enemy');
        defSprite.classList.add('damage-flash');
        setTimeout(() => defSprite.classList.remove('damage-flash'), 200);
    }, 150);

    logMessage(`${isCrit ? '💥 CRÍTICO! ' : ''}${attacker.name} causou ${damage} de dano.`);
    updateUI();

    if (defender.hp <= 0) {
        handleVictory(isPlayer);
    }
}

function handleVictory(isPlayerWinner) {
    isBattleOver = true;
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
        
        // Loop Ocioso: Próxima batalha em 2 segundos
        setTimeout(() => {
            if (isBattleOver) {
                player.hp = Math.min(player.maxHp, player.hp + (player.maxHp * 0.2)); // Recupera 20% HP entre lutas
                spawnEnemy();
            }
        }, 2000);
    } else {
        logMessage(`💀 Você morreu. Retornando ao início da Zona...`);
        monstersDefeatedInZone = 0;
        player.hp = player.maxHp;
        setTimeout(spawnEnemy, 3000);
    }
}

function rollLoot() {
    const chance = Math.random();
    let dropChance = currentEnemy.isBoss ? 0.8 : 0.15;
    
    if (chance < dropChance) {
        const pool = Math.random() > 0.5 ? itemDatabase.weapons : itemDatabase.armors;
        let rarityRoll = Math.random() * 100;
        let item;

        if (rarityRoll > 98) item = pool[4]; // Legendary
        else if (rarityRoll > 90) item = pool[3]; // Epic
        else if (rarityRoll > 70) item = pool[2]; // Rare
        else if (rarityRoll > 40) item = pool[1]; // Uncommon
        else item = pool[0]; // Common

        player.inventory.push({...item});
        logMessage(`🎁 DROP: [${item.rarity.toUpperCase()}] ${item.name}!`);
        updateInventoryUI();
    }
}

function checkLevelUp() {
    if (player.exp >= player.nextLevelExp) {
        player.level++;
        player.exp -= player.nextLevelExp;
        player.nextLevelExp = Math.floor(player.nextLevelExp * 1.6);
        calculateStats();
        player.hp = player.maxHp;
        logMessage(`🎊 LEVEL UP! Você alcançou o nível ${player.level}! 🎊`);
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
    battleLog.appendChild(p);
    battleLog.scrollTop = battleLog.scrollHeight;
    if (battleLog.children.length > 50) battleLog.removeChild(battleLog.firstChild);
}

function updateUI() {
    player.elements.levelText.textContent = player.level;
    player.elements.goldText.textContent = player.gold;
    player.elements.hpText.textContent = `${Math.ceil(player.hp)}/${player.maxHp}`;
    player.elements.hpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
    player.elements.expBar.style.width = `${(player.exp / player.nextLevelExp) * 100}%`;

    if (currentEnemy) {
        document.getElementById('enemy-hp-text').textContent = `${Math.ceil(currentEnemy.hp)}/${currentEnemy.maxHp}`;
        document.getElementById('enemy-hp-bar-inner').style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;
        document.getElementById('enemy-name').textContent = currentEnemy.name;
    }

    // Equip Slots
    document.getElementById('slot-weapon').textContent = player.equipment.weapon ? player.equipment.weapon.icon : '⚔️';
    document.getElementById('slot-weapon').className = `slot ${player.equipment.weapon?.rarity || ''}`;
    document.getElementById('slot-armor').textContent = player.equipment.armor ? player.equipment.armor.icon : '🛡️';
    document.getElementById('slot-armor').className = `slot ${player.equipment.armor?.rarity || ''}`;
    
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

// Loop de Combate Ocioso
function startAutoBattle() {
    setInterval(() => {
        if (!isBattleOver && currentEnemy) {
            // Turno do Jogador
            performAttack(player, currentEnemy);
            
            // Turno do Inimigo (com pequeno delay)
            if (!isBattleOver) {
                setTimeout(() => performAttack(currentEnemy, player), 500);
            }
        }
    }, 1500);
}

window.onload = () => {
    calculateStats();
    spawnEnemy();
    startAutoBattle();
};
