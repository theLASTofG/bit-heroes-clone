// Configurações iniciais
const player = {
    name: "Herói Pixel",
    maxHp: 100,
    hp: 100,
    atk: 18,
    def: 6,
    sprite: document.getElementById('player-sprite'),
    hpBar: document.getElementById('player-hp-bar-inner'),
    hpText: document.getElementById('player-hp-text')
};

const enemy = {
    name: "Slime Gigante",
    maxHp: 150,
    hp: 150,
    atk: 14,
    def: 4,
    sprite: document.getElementById('enemy-sprite'),
    hpBar: document.getElementById('enemy-hp-bar-inner'),
    hpText: document.getElementById('enemy-hp-text')
};

let isBattleOver = false;
let currentTurn = 'player'; // 'player' ou 'enemy'

const battleLog = document.getElementById('battle-log');
const restartBtn = document.getElementById('restart-btn');

// Função para adicionar mensagens ao log
function logMessage(message) {
    const p = document.createElement('p');
    p.textContent = message;
    p.style.margin = "4px 0";
    battleLog.appendChild(p);
    battleLog.scrollTop = battleLog.scrollHeight;
}

// Função para atualizar a interface
function updateUI() {
    // Player
    const playerHpPercent = (player.hp / player.maxHp) * 100;
    player.hpBar.style.width = `${Math.max(0, playerHpPercent)}%`;
    player.hpText.textContent = `${Math.max(0, Math.ceil(player.hp))}/${player.maxHp}`;

    // Enemy
    const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;
    enemy.hpBar.style.width = `${Math.max(0, enemyHpPercent)}%`;
    enemy.hpText.textContent = `${Math.max(0, Math.ceil(enemy.hp))}/${enemy.maxHp}`;
}

// Função de ataque
function performAttack(attacker, defender) {
    if (isBattleOver) return;

    // Animação de ataque (movimento visual)
    const attackerClass = attacker === player ? 'attack-player' : 'attack-enemy';
    attacker.sprite.classList.add(attackerClass);
    
    // Cálculo de dano (com um pouco de aleatoriedade)
    const variance = Math.random() * 0.4 + 0.8; // 0.8 a 1.2
    let damage = Math.floor((attacker.atk - (defender.def * 0.5)) * variance);
    damage = Math.max(5, damage); // Dano mínimo de 5

    defender.hp -= damage;
    if (defender.hp < 0) defender.hp = 0;
    
    // Feedback visual do dano
    setTimeout(() => {
        attacker.sprite.classList.remove(attackerClass);
        defender.sprite.classList.add('damage-flash');
        setTimeout(() => defender.sprite.classList.remove('damage-flash'), 300);
    }, 200);

    logMessage(`${attacker.name} atacou ${defender.name} causando ${damage} de dano!`);
    
    updateUI();

    if (defender.hp <= 0) {
        endBattle(attacker);
    } else {
        // Próximo turno após um delay
        setTimeout(processNextTurn, 1200);
    }
}

function processNextTurn() {
    if (isBattleOver) return;

    if (currentTurn === 'player') {
        currentTurn = 'enemy';
        performAttack(enemy, player);
    } else {
        currentTurn = 'player';
        performAttack(player, enemy);
    }
}

function endBattle(winner) {
    isBattleOver = true;
    logMessage(`--- Batalha encerrada! ---`);
    logMessage(`${winner.name} saiu vitorioso!`);
    restartBtn.style.display = 'block';
}

function restartBattle() {
    player.hp = player.maxHp;
    enemy.hp = enemy.maxHp;
    isBattleOver = false;
    currentTurn = 'player';
    restartBtn.style.display = 'none';
    battleLog.innerHTML = '<p>--- Nova Batalha Iniciada ---</p>';
    updateUI();
    setTimeout(() => performAttack(player, enemy), 1000);
}

restartBtn.addEventListener('click', restartBattle);

// Iniciar o jogo
window.onload = () => {
    updateUI();
    logMessage("Prepare-se para o combate!");
    setTimeout(() => performAttack(player, enemy), 2000);
};
