// Configurações do Jogador
const player = {
    name: "Herói Pixel",
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    gold: 0,
    baseHp: 100,
    maxHp: 100,
    hp: 100,
    baseAtk: 18,
    baseDef: 6,
    atk: 18,
    def: 6,
    equipment: {
        weapon: null,
        armor: null
    },
    inventory: [],
    sprite: document.getElementById('player-sprite'),
    hpBar: document.getElementById('player-hp-bar-inner'),
    hpText: document.getElementById('player-hp-text'),
    expBar: document.getElementById('player-exp-bar'),
    levelText: document.getElementById('player-level'),
    goldText: document.getElementById('player-gold')
};

// Banco de Dados de Itens (Drops)
const itemDatabase = {
    weapons: [
        { id: 'w1', name: 'Espada de Madeira', icon: '🗡️', atk: 5, rarity: 'common' },
        { id: 'w2', name: 'Machado de Ferro', icon: '🪓', atk: 12, rarity: 'uncommon' },
        { id: 'w3', name: 'Cajado Místico', icon: '🪄', atk: 25, rarity: 'rare' },
        { id: 'w4', name: 'Lâmina do Destino', icon: '⚔️', atk: 50, rarity: 'epic' }
    ],
    armors: [
        { id: 'a1', name: 'Trapos Velhos', icon: '👕', def: 3, rarity: 'common' },
        { id: 'a2', name: 'Cota de Malha', icon: '🛡️', def: 10, rarity: 'uncommon' },
        { id: 'a3', name: 'Armadura de Placas', icon: '🧱', def: 20, rarity: 'rare' },
        { id: 'a4', name: 'Escudo Sagrado', icon: '✨', def: 40, rarity: 'epic' }
    ]
};

// Banco de Dados de Monstros
const monsterDatabase = [
    { name: "Slime", hp: 60, atk: 10, def: 2, exp: 25, gold: 10, type: "COMUM", color: "#27ae60", scale: 0.8 },
    { name: "Morcego", hp: 80, atk: 14, def: 4, exp: 40, gold: 15, type: "COMUM", color: "#34495e", scale: 0.7 },
    { name: "Esqueleto", hp: 120, atk: 20, def: 8, exp: 70, gold: 30, type: "ELITE", color: "#ecf0f1", scale: 1.0 },
    { name: "Golem de Pedra", hp: 250, atk: 25, def: 20, exp: 150, gold: 100, type: "BOSS", color: "#7f8c8d", scale: 1.3 }
];

let currentEnemy = null;
let isBattleOver = false;
let currentTurn = 'player';

const battleLog = document.getElementById('battle-log');
const restartBtn = document.getElementById('restart-btn');
const inventoryGrid = document.getElementById('inventory-grid');

// Inicializar Interface
function updateUI() {
    // Stats de Batalha
    const playerHpPercent = (player.hp / player.maxHp) * 100;
    player.hpBar.style.width = `${Math.max(0, playerHpPercent)}%`;
    player.hpText.textContent = `${Math.max(0, Math.ceil(player.hp))}/${player.maxHp}`;

    if (currentEnemy) {
        const enemyHpPercent = (currentEnemy.hp / currentEnemy.maxHp) * 100;
        document.getElementById('enemy-hp-bar-inner').style.width = `${Math.max(0, enemyHpPercent)}%`;
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, Math.ceil(currentEnemy.hp))}/${currentEnemy.maxHp}`;
        document.getElementById('enemy-name').textContent = currentEnemy.name;
        const badge = document.getElementById('enemy-type');
        badge.textContent = currentEnemy.type;
        badge.className = `badge ${currentEnemy.type.toLowerCase()}`;
    }

    // Top Bar
    player.levelText.textContent = player.level;
    player.goldText.textContent = player.gold;
    const expPercent = (player.exp / player.nextLevelExp) * 100;
    player.expBar.style.width = `${expPercent}%`;

    // Equipamentos
    const wSlot = document.getElementById('slot-weapon');
    const aSlot = document.getElementById('slot-armor');
    
    wSlot.textContent = player.equipment.weapon ? player.equipment.weapon.icon : '⚔️';
    wSlot.className = `slot ${player.equipment.weapon ? player.equipment.weapon.rarity : ''}`;
    
    aSlot.textContent = player.equipment.armor ? player.equipment.armor.icon : '🛡️';
    aSlot.className = `slot ${player.equipment.armor ? player.equipment.armor.rarity : ''}`;

    updateInventoryUI();
}

function updateInventoryUI() {
    inventoryGrid.innerHTML = '';
    player.inventory.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = `item-slot ${item.rarity}`;
        div.textContent = item.icon;
        div.title = `${item.name} (${item.atk ? 'ATK +' + item.atk : 'DEF +' + item.def})`;
        div.onclick = () => equipItem(index);
        inventoryGrid.appendChild(div);
    });
}

// Lógica de Equipamento
function equipItem(index) {
    const item = player.inventory[index];
    const type = item.atk ? 'weapon' : 'armor';
    
    // Trocar item se já houver um equipado
    if (player.equipment[type]) {
        player.inventory.push(player.equipment[type]);
    }
    
    player.equipment[type] = item;
    player.inventory.splice(index, 1);
    
    calculateStats();
    updateUI();
    logMessage(`Você equipou: ${item.name}!`);
}

function calculateStats() {
    let bonusAtk = player.equipment.weapon ? player.equipment.weapon.atk : 0;
    let bonusDef = player.equipment.armor ? player.equipment.armor.def : 0;
    
    player.atk = player.baseAtk + bonusAtk;
    player.def = player.baseDef + bonusDef;
    player.maxHp = player.baseHp + (player.level - 1) * 20;
}

// Lógica de Batalha
function spawnEnemy() {
    // Escolher inimigo baseado no nível (simplificado)
    let monsterData;
    const rand = Math.random();
    if (player.level < 3) {
        monsterData = rand < 0.8 ? monsterDatabase[0] : monsterDatabase[1];
    } else if (player.level < 6) {
        monsterData = rand < 0.6 ? monsterDatabase[1] : monsterDatabase[2];
    } else {
        monsterData = rand < 0.7 ? monsterDatabase[2] : monsterDatabase[3];
    }

    currentEnemy = { 
        ...monsterData, 
        maxHp: monsterData.hp,
        hp: monsterData.hp 
    };

    const sprite = document.getElementById('enemy-sprite');
    sprite.style.backgroundColor = currentEnemy.color;
    sprite.style.transform = `scale(${currentEnemy.scale})`;
    
    isBattleOver = false;
    currentTurn = 'player';
    updateUI();
}

function logMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    p.style.margin = "2px 0";
    battleLog.appendChild(p);
    battleLog.scrollTop = battleLog.scrollHeight;
}

function performAttack(attacker, defender) {
    if (isBattleOver) return;

    const isPlayerAttacking = attacker === player;
    const attackerSprite = isPlayerAttacking ? player.sprite : document.getElementById('enemy-sprite');
    const defenderSprite = isPlayerAttacking ? document.getElementById('enemy-sprite') : player.sprite;

    attackerSprite.classList.add(isPlayerAttacking ? 'attack-player' : 'attack-enemy');
    
    const variance = Math.random() * 0.4 + 0.8;
    let damage = Math.floor((attacker.atk - (defender.def * 0.5)) * variance);
    damage = Math.max(isPlayerAttacking ? 8 : 5, damage);

    defender.hp -= damage;
    
    setTimeout(() => {
        attackerSprite.classList.remove(isPlayerAttacking ? 'attack-player' : 'attack-enemy');
        defenderSprite.classList.add('damage-flash');
        setTimeout(() => defenderSprite.classList.remove('damage-flash'), 300);
    }, 200);

    logMessage(`${attacker.name} causou ${damage} de dano!`);
    updateUI();

    if (defender.hp <= 0) {
        handleVictory(isPlayerAttacking);
    } else {
        setTimeout(processNextTurn, 1000);
    }
}

function processNextTurn() {
    if (isBattleOver) return;
    if (currentTurn === 'player') {
        currentTurn = 'enemy';
        performAttack(currentEnemy, player);
    } else {
        currentTurn = 'player';
        performAttack(player, currentEnemy);
    }
}

function handleVictory(isPlayerWinner) {
    isBattleOver = true;
    if (isPlayerWinner) {
        logMessage(`--- Vitória! ---`);
        player.exp += currentEnemy.exp;
        player.gold += currentEnemy.gold;
        logMessage(`Ganhou ${currentEnemy.exp} EXP e ${currentEnemy.gold} Ouro.`);
        
        checkLevelUp();
        rollLoot();
        
        restartBtn.textContent = "Próxima Batalha";
    } else {
        logMessage(`--- Você foi derrotado... ---`);
        restartBtn.textContent = "Tentar Novamente";
    }
    restartBtn.style.display = 'block';
}

function checkLevelUp() {
    if (player.exp >= player.nextLevelExp) {
        player.level++;
        player.exp -= player.nextLevelExp;
        player.nextLevelExp = Math.floor(player.nextLevelExp * 1.5);
        player.baseAtk += 5;
        player.baseDef += 2;
        calculateStats();
        player.hp = player.maxHp;
        logMessage(`✨ LEVEL UP! Agora você é nível ${player.level}! ✨`);
    }
}

function rollLoot() {
    const chance = Math.random();
    if (chance < 0.4) { // 40% de chance de drop
        let itemPool = Math.random() > 0.5 ? itemDatabase.weapons : itemDatabase.armors;
        // Selecionar raridade baseado no tipo do monstro
        let itemIndex = 0;
        if (currentEnemy.type === "BOSS") itemIndex = Math.floor(Math.random() * 2) + 2; // Raro ou Épico
        else if (currentEnemy.type === "ELITE") itemIndex = Math.floor(Math.random() * 2) + 1; // Incomum ou Raro
        else itemIndex = Math.random() > 0.8 ? 1 : 0; // Comum ou Incomum
        
        const droppedItem = itemPool[itemIndex];
        player.inventory.push(droppedItem);
        logMessage(`🎁 ITEM ENCONTRADO: ${droppedItem.name}!`);
    }
}

function restartBattle() {
    restartBtn.style.display = 'none';
    battleLog.innerHTML = '<p>Uma nova criatura aparece!</p>';
    player.hp = player.maxHp;
    spawnEnemy();
    setTimeout(() => performAttack(player, currentEnemy), 1000);
}

restartBtn.addEventListener('click', restartBattle);

window.onload = () => {
    calculateStats();
    updateUI();
    spawnEnemy();
    logMessage("A aventura começa!");
    setTimeout(() => performAttack(player, currentEnemy), 2000);
};
