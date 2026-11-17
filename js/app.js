// Aplicação Principal - Controle de Estado, Fluxo de Batalha, PC, Itens e Time

// Catálogo Oficial de Itens do Poké-Mart
const SHOP_CATALOG = [
    { key: 'pokeball', name: 'Poké Ball', icon: '🔴', price: 200, desc: 'Bola padrão para captura de selvagens.' },
    { key: 'great_ball', name: 'Great Ball', icon: '🔵', price: 600, desc: '1.5x mais chance de capturar.' },
    { key: 'ultra_ball', name: 'Ultra Ball', icon: '🟡', price: 1200, desc: '2.0x mais chance de capturar.' },
    { key: 'potion', name: 'Potion', icon: '🧪', price: 250, desc: 'Restaura 20 HP do Pokémon ativo.' },
    { key: 'super_potion', name: 'Super Potion', icon: '🍶', price: 600, desc: 'Restaura 50 HP do Pokémon ativo.' },
    { key: 'hyper_potion', name: 'Hyper Potion', icon: '🧴', price: 1200, desc: 'Restaura 120 HP do Pokémon ativo.' },
    { key: 'revive', name: 'Revive', icon: '💎', price: 1400, desc: 'Revive um Pokémon desmaiado com 50% HP.' },
    { key: 'rare_candy', name: 'Rare Candy', icon: '🍬', price: 2000, desc: 'Sobe 1 Nível imediato e ativa evolução!' }
];

class GameApp {
    constructor() {
        this.playerTeam = [];
        this.playerPC = [];
        this.activePokemonIndex = 0;
        this.currentEnemy = null;
        this.stage = 1;
        this.battlesWon = 0;
        this.isBattleActive = false;
        this.inTurn = false;
        this.money = 500; // Saldo inicial em Poké-Dólares

        // Mochila de itens inicial (o jogador já começa com alguns para experimentar)
        this.itemBag = {
            potion: 3,
            super_potion: 1,
            hyper_potion: 0,
            revive: 1,
            rare_candy: 1,
            pokeball: 5,
            great_ball: 2,
            ultra_ball: 0
        };

        // Limite estrito de 3 usos para o Centro Pokémon
        this.centerUses = 0;
        this.maxCenterUses = 3;
        this.gameOver = false;
    }

    init() {
        ui.init();
        this.setupEventListeners();

        // Tentar carregar jogo salvo do LocalStorage
        const hasSave = this.loadGame();
        if (!hasSave || !this.playerTeam || this.playerTeam.length === 0) {
            this.showStarterSelection();
        } else {
            this.updateHeaderStats();
            this.startNextBattle();
        }
    }

    // Retorna o Pokémon atualmente ativo em combate
    getActivePokemon() {
        if (!this.playerTeam || this.playerTeam.length === 0) return null;
        if (this.playerTeam[this.activePokemonIndex] && this.playerTeam[this.activePokemonIndex].currentHp > 0) {
            return this.playerTeam[this.activePokemonIndex];
        }
        const aliveIdx = this.playerTeam.findIndex(p => p.currentHp > 0);
        if (aliveIdx !== -1) {
            this.activePokemonIndex = aliveIdx;
            return this.playerTeam[aliveIdx];
        }
        return this.playerTeam[0];
    }

    // Configuração dos Event Listeners do DOM
    setupEventListeners() {
        // Áudio
        const btnAudio = document.getElementById('btn-toggle-audio');
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                if (typeof audio !== 'undefined') {
                    const isMuted = audio.toggleMute();
                    btnAudio.innerHTML = isMuted ? '🔇 Mudo' : '🔊 Som';
                }
            });
        }

        // Time
        const btnTeam = document.getElementById('btn-open-team');
        if (btnTeam) {
            btnTeam.addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                this.openTeamModal();
            });
        }

        // PC Box
        const btnPC = document.getElementById('btn-open-pc');
        if (btnPC) {
            btnPC.addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                this.openPCModal();
            });
        }

        // Mochila / Bag no Cabeçalho
        const btnBag = document.getElementById('btn-open-bag');
        if (btnBag) {
            btnBag.addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                ui.renderItemBag(this.itemBag);
            });
        }

        // Loja / Poké-Mart
        const btnShop = document.getElementById('btn-open-shop');
        if (btnShop) {
            btnShop.addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                this.openShopModal();
            });
        }

        // Centro Pokémon (Cura rápida)
        const btnHeal = document.getElementById('btn-heal-center');
        if (btnHeal) {
            btnHeal.addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                this.healTeam(true);
            });
        }

        // Reiniciar / Novo Jogo
        const btnReset = document.getElementById('btn-reset-game');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm('Tem certeza de que deseja apagar todo o progresso e reiniciar o jogo do zero?')) {
                    localStorage.removeItem('pokemon_rpg_save');
                    window.location.reload();
                }
            });
        }

        // Botões de Ação na Batalha
        const btnFight = document.getElementById('btn-action-fight');
        const btnSwitch = document.getElementById('btn-action-switch');
        const btnItem = document.getElementById('btn-action-item');
        const btnRun = document.getElementById('btn-action-run');
        const btnMovesBack = document.getElementById('btn-moves-back');

        if (btnFight) {
            btnFight.addEventListener('click', () => {
                if (this.inTurn || !this.isBattleActive) return;
                if (typeof audio !== 'undefined') audio.playClick();
                this.showMovesPanel(true);
            });
        }

        if (btnMovesBack) {
            btnMovesBack.addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                this.showMovesPanel(false);
            });
        }

        if (btnSwitch) {
            btnSwitch.addEventListener('click', () => {
                if (this.inTurn || !this.isBattleActive) return;
                if (typeof audio !== 'undefined') audio.playClick();
                this.openSwitchInBattleModal(false);
            });
        }

        if (btnItem) {
            btnItem.addEventListener('click', () => {
                if (this.inTurn || !this.isBattleActive) return;
                if (typeof audio !== 'undefined') audio.playClick();
                ui.renderItemBag(this.itemBag);
            });
        }

        if (btnRun) {
            btnRun.addEventListener('click', () => {
                if (this.inTurn || !this.isBattleActive) return;
                if (typeof audio !== 'undefined') audio.playClick();
                this.tryRunAway();
            });
        }

        // Fechamento de Modais
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (typeof audio !== 'undefined') audio.playClick();
                const modal = e.target.closest('.modal-overlay');
                if (modal) modal.classList.remove('active');
            });
        });
    }

    // Alterna visualização entre painel de comandos e painel de golpes
    showMovesPanel(show) {
        const commandPad = document.getElementById('battle-commands');
        const movesPad = document.getElementById('battle-moves');
        if (!commandPad || !movesPad) return;

        if (show) {
            commandPad.classList.add('hidden');
            movesPad.classList.remove('hidden');
            const active = this.getActivePokemon();
            if (active) {
                ui.renderMoveButtons(active.moves, (selectedMove) => {
                    this.executePlayerMove(selectedMove);
                });
            }
        } else {
            commandPad.classList.remove('hidden');
            movesPad.classList.add('hidden');
        }
    }

    // Atualiza cabeçalho com estatísticas gerais do jogo
    updateHeaderStats() {
        const stageEl = document.getElementById('header-stage');
        const winsEl = document.getElementById('header-wins');
        const teamCountEl = document.getElementById('header-team-count');
        const pcCountEl = document.getElementById('header-pc-count');
        const moneyEl = document.getElementById('header-money');
        const centerPill = document.getElementById('header-center-uses');
        const centerBtnSpan = document.getElementById('center-btn-uses');

        if (stageEl) stageEl.textContent = `Estágio ${this.stage}`;
        if (winsEl) winsEl.textContent = `${this.battlesWon}`;
        if (teamCountEl) teamCountEl.textContent = `${this.playerTeam.length}/6`;
        if (pcCountEl) pcCountEl.textContent = `${this.playerPC.length}`;
        if (moneyEl) moneyEl.textContent = `₽ ${this.money}`;

        const remainingUses = Math.max(0, this.maxCenterUses - this.centerUses);
        const centerText = `${this.centerUses}/${this.maxCenterUses}`;

        if (centerPill) {
            centerPill.textContent = centerText;
            centerPill.style.color = remainingUses === 0 ? '#ff4d4d' : '#4df0a0';
        }
        if (centerBtnSpan) {
            centerBtnSpan.textContent = centerText;
        }
    }

    // Iniciar uma nova batalha com Pokémon selvagem escalonado
    async startNextBattle() {
        this.inTurn = true;
        this.isBattleActive = true;
        this.showMovesPanel(false);

        // Gera oponente selvagem baseado no estágio atual
        this.currentEnemy = BattleEngine.generateWildPokemon(this.stage);

        const activePlayer = this.getActivePokemon();
        ui.updateBattleDisplay(activePlayer, this.currentEnemy);

        if (typeof audio !== 'undefined') audio.startBattleBgm();

        await ui.showMessage(`Um ${this.currentEnemy.name} selvagem (Lv.${this.currentEnemy.level}) apareceu!`);
        await ui.showMessage(`Vai, ${activePlayer.name}!`);

        this.inTurn = false;
        this.updateHeaderStats();
    }

    // Executa a rodada completa de combate quando o jogador ataca
    async executePlayerMove(playerMove) {
        if (this.inTurn || !this.isBattleActive) return;
        this.inTurn = true;
        this.showMovesPanel(false);

        const playerPkmn = this.getActivePokemon();
        const enemyPkmn = this.currentEnemy;

        // Consumir 1 PP do golpe do jogador
        playerMove.pp = Math.max(0, playerMove.pp - 1);

        // Escolha da IA do Pokémon Inimigo
        const enemyMove = this.chooseEnemyMove(enemyPkmn);
        if (enemyMove) {
            enemyMove.pp = Math.max(0, enemyMove.pp - 1);
        }

        // Determinar ordem de ataque (prioridade do golpe primeiro, depois velocidade)
        const playerPriority = playerMove.priority || 0;
        const enemyPriority = (enemyMove && enemyMove.priority) || 0;

        let playerGoesFirst = true;
        if (playerPriority > enemyPriority) {
            playerGoesFirst = true;
        } else if (enemyPriority > playerPriority) {
            playerGoesFirst = false;
        } else {
            playerGoesFirst = playerPkmn.stats.spd >= enemyPkmn.stats.spd;
        }

        const first = playerGoesFirst ? { pkmn: playerPkmn, move: playerMove, isPlayer: true } : { pkmn: enemyPkmn, move: enemyMove, isPlayer: false };
        const second = playerGoesFirst ? { pkmn: enemyPkmn, move: enemyMove, isPlayer: false } : { pkmn: playerPkmn, move: playerMove, isPlayer: true };

        // 1º Ataque
        const firstKnockedOut = await this.performAttack(first.pkmn, second.pkmn, first.move, first.isPlayer);
        if (firstKnockedOut) {
            await this.handleFaint(second.pkmn, second.isPlayer);
            this.inTurn = false;
            return;
        }

        // 2º Ataque (se o segundo ainda estiver vivo)
        const secondKnockedOut = await this.performAttack(second.pkmn, first.pkmn, second.move, second.isPlayer);
        if (secondKnockedOut) {
            await this.handleFaint(first.pkmn, first.isPlayer);
            this.inTurn = false;
            return;
        }

        // Fim do turno - atualizar displays
        ui.updateBattleDisplay(playerPkmn, enemyPkmn);
        await ui.showMessage(`O que ${playerPkmn.name} deve fazer?`);
        this.inTurn = false;
    }

    // Executa um ataque individual com cálculos, sons e animações
    async performAttack(attacker, defender, move, isPlayerAttacking) {
        if (!move) return false;

        await ui.showMessage(`${attacker.name} usou ${move.name}!`);

        // Teste de paralisia se houver status
        if (attacker.status === 'paralyze' && Math.random() < 0.25) {
            await ui.showMessage(`${attacker.name} está paralisado! Não consegue se mover!`);
            return false;
        }

        // Executar animação de impacto
        await ui.animateAttack(isPlayerAttacking);

        // Cálculo de dano
        const result = BattleEngine.calculateDamage(attacker, defender, move);

        if (!result.isHit) {
            await ui.showMessage(`O ataque de ${attacker.name} errou!`);
            return false;
        }

        if (result.effectiveness === 0) {
            await ui.showMessage(`Não teve efeito sobre ${defender.name}...`);
            return false;
        }

        // Som de impacto
        if (typeof audio !== 'undefined') {
            if (result.effectiveness >= 2) {
                audio.playSuperEffectiveHit();
            } else {
                audio.playHit();
            }
        }

        // Aplicar dano
        defender.currentHp = Math.max(0, defender.currentHp - result.damage);
        ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);

        // Textos flutuantes
        ui.showCombatFloatingText(!isPlayerAttacking, `-${result.damage} HP`);

        if (result.isCrit) {
            ui.showCombatFloatingText(!isPlayerAttacking, 'CRÍTICO!', 'crit');
            await ui.showMessage('Um acerto crítico!');
        }

        if (result.effectiveness >= 2) {
            ui.showCombatFloatingText(!isPlayerAttacking, 'SUPER EFETIVO!', 'effective');
            await ui.showMessage('É super efetivo!');
        } else if (result.effectiveness < 1) {
            await ui.showMessage('Não é muito efetivo...');
        }

        // Dreno de HP
        if (move.drain && result.damage > 0) {
            const healAmount = Math.max(1, Math.floor(result.damage * move.drain));
            attacker.currentHp = Math.min(attacker.stats.hp, attacker.currentHp + healAmount);
            ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
            await ui.showMessage(`${attacker.name} drenou ${healAmount} de HP!`);
        }

        return defender.currentHp <= 0;
    }

    // IA Simples do Inimigo para escolha de golpe
    chooseEnemyMove(enemy) {
        if (!enemy || !enemy.moves || enemy.moves.length === 0) return null;
        const available = enemy.moves.filter(m => m.pp > 0);
        if (available.length === 0) return enemy.moves[0];

        const damaging = available.filter(m => m.power > 0);
        if (damaging.length > 0 && Math.random() < 0.8) {
            return damaging[Math.floor(Math.random() * damaging.length)];
        }
        return available[Math.floor(Math.random() * available.length)];
    }

    // Trata o desmaio de um dos combatentes
    async handleFaint(faintedPkmn, isPlayer) {
        await ui.animateFaint(isPlayer);
        await ui.showMessage(`${faintedPkmn.name} desmaiou!`);

        if (isPlayer) {
            // Jogador desmaiou
            const hasAlive = this.playerTeam.some(p => p.currentHp > 0);
            if (hasAlive) {
                await ui.showMessage('Escolha outro Pokémon do seu time para continuar!');
                this.openSwitchInBattleModal(true);
            } else {
                // Todo o time desmaiou
                if (typeof audio !== 'undefined') audio.playFaint();
                await ui.showMessage('Todos os seus Pokémons foram derrotados!');
                await ui.showMessage('Você foi levado às pressas para o Centro Pokémon.');
                this.healTeam(false);
                setTimeout(() => {
                    this.startNextBattle();
                }, 1000);
            }
        } else {
            // Inimigo desmaiou - VITÓRIA!
            this.isBattleActive = false;
            this.battlesWon++;
            if (typeof audio !== 'undefined') audio.playVictory();

            // Distribuir Experiência
            const activePlayer = this.getActivePokemon();
            const expGained = BattleEngine.calculateExpYield(faintedPkmn);
            await ui.showMessage(`${activePlayer.name} ganhou ${expGained} pontos de experiência!`);

            const expResult = activePlayer.gainExp(expGained);
            ui.updateBattleDisplay(activePlayer, this.currentEnemy);

            if (expResult.leveledUp) {
                if (typeof audio !== 'undefined') audio.playLevelUp();
                await ui.showMessage(`Parabéns! ${activePlayer.name} subiu para o Nível ${activePlayer.level}!`);

                if (expResult.canEvolve) {
                    await this.triggerEvolutionSequence(activePlayer);
                }
            }

            // Recompensa em Poké-Dólares pela vitória
            const rewardMoney = Math.floor(100 + (faintedPkmn.level * 25) + (this.stage * 15));
            this.money += rewardMoney;
            this.updateHeaderStats();
            await ui.showMessage(`Vitória! Você recebeu ₽ ${rewardMoney}!`);

            // Drop de item aleatório pós-vitória
            this.handleItemDrop();

            // Exibir a Tela de Recompensa (Capturar OU Aprender Golpe)
            this.pendingRewardEnemy = faintedPkmn;
            this.showPostBattleRewardModal(faintedPkmn);
            this.saveGame();
        }
    }

    // Drop aleatório de itens, Rare Candies e Poké Balls após vitória
    handleItemDrop() {
        if (Math.random() < 0.75) {
            const itemPool = [
                { key: 'potion', name: 'Potion', weight: 28 },
                { key: 'pokeball', name: 'Poké Ball', weight: 24 },
                { key: 'super_potion', name: 'Super Potion', weight: 16 },
                { key: 'great_ball', name: 'Great Ball', weight: 12 },
                { key: 'revive', name: 'Revive', weight: 8 },
                { key: 'rare_candy', name: 'Rare Candy', weight: 8 },
                { key: 'ultra_ball', name: 'Ultra Ball', weight: 4 }
            ];

            const totalWeight = itemPool.reduce((acc, i) => acc + i.weight, 0);
            let roll = Math.random() * totalWeight;
            let selectedItem = itemPool[0];

            for (const item of itemPool) {
                if (roll < item.weight) {
                    selectedItem = item;
                    break;
                }
                roll -= item.weight;
            }

            this.itemBag[selectedItem.key] = (this.itemBag[selectedItem.key] || 0) + 1;
            this.saveGame();
            this.updateHeaderStats();
            ui.showMessage(`🎁 Recompensa: Você encontrou 1x ${selectedItem.name}!`);
        }
    }

    // Modal e Lógica do Shop / Poké-Mart
    openShopModal() {
        ui.renderShop(this.money, SHOP_CATALOG, (item) => {
            this.buyShopItem(item);
        });
    }

    buyShopItem(item) {
        if (this.money < item.price) {
            alert(`Saldo insuficiente! Você tem ₽ ${this.money} e o item custa ₽ ${item.price}.`);
            return;
        }
        this.money -= item.price;
        this.itemBag[item.key] = (this.itemBag[item.key] || 0) + 1;
        if (typeof audio !== 'undefined') audio.playCoin();
        this.updateHeaderStats();
        this.saveGame();
        this.openShopModal();
    }

    // Usar item da Mochila durante a batalha ou fora dela
    async useItem(key) {
        if (this.inTurn) return;
        const qty = this.itemBag[key] || 0;
        if (qty <= 0) {
            await ui.showMessage(`Você não possui mais este item!`);
            return;
        }

        const activePkmn = this.getActivePokemon();

        // --- USO EM BATALHA ---
        if (this.isBattleActive) {
            // POKÉ BALLS (Com cálculo visível de taxa e animação dinâmica)
            if (key === 'pokeball' || key === 'great_ball' || key === 'ultra_ball') {
                this.inTurn = true;
                this.itemBag[key]--;
                this.saveGame();
                this.updateHeaderStats();

                const ballNames = {
                    pokeball: 'Poké Ball',
                    great_ball: 'Great Ball',
                    ultra_ball: 'Ultra Ball'
                };
                const ballMultipliers = {
                    pokeball: 1.0,
                    great_ball: 1.5,
                    ultra_ball: 2.0
                };

                const enemy = this.currentEnemy;
                const hpRatio = enemy.currentHp / Math.max(1, enemy.stats.hp);
                // Taxa clássica: quanto menos HP, maior a taxa de captura
                const baseCatchRate = Math.max(0.20, 0.20 + (1 - hpRatio) * 0.55);
                const finalChance = Math.min(0.95, baseCatchRate * (ballMultipliers[key] || 1.0));
                const percentDisplay = Math.round(finalChance * 100);

                await ui.showMessage(`Você arremessou ${ballNames[key]}! [Taxa de Captura: ${percentDisplay}%]`);

                const captured = Math.random() < finalChance;
                // Animação visual da Pokébola arremessada e shakes
                await ui.animatePokeballThrow(key, captured);

                if (captured) {
                    await ui.showMessage(`Gotcha! ${enemy.name} foi capturado com sucesso!`);
                    this.isBattleActive = false;
                    this.executeCaptureReward(enemy, false);
                    this.inTurn = false;
                    return;
                } else {
                    await ui.showMessage(`Oh não! O ${enemy.name} escapou da Poké Ball!`);
                    // Inimigo ataca como penalidade por gastar o turno
                    const enemyMove = this.chooseEnemyMove(enemy);
                    const knockedOut = await this.performAttack(enemy, activePkmn, enemyMove, false);
                    if (knockedOut) {
                        await this.handleFaint(activePkmn, true);
                    } else {
                        ui.updateBattleDisplay(activePkmn, enemy);
                        await ui.showMessage(`O que ${activePkmn.name} deve fazer?`);
                    }
                    this.inTurn = false;
                    return;
                }
            }

            // RARE CANDY EM BATALHA
            if (key === 'rare_candy') {
                if (activePkmn.level >= 100) {
                    await ui.showMessage(`${activePkmn.name} já atingiu o nível máximo (100)!`);
                    return;
                }

                this.inTurn = true;
                this.itemBag[key]--;
                const result = activePkmn.useRareCandy();
                if (typeof audio !== 'undefined') audio.playLevelUp();
                ui.updateBattleDisplay(activePkmn, this.currentEnemy);
                this.updateHeaderStats();
                this.saveGame();

                await ui.showMessage(`Você usou Rare Candy! ${activePkmn.name} subiu para o Nível ${activePkmn.level}!`);
                if (result.canEvolve) {
                    await this.triggerEvolutionSequence(activePkmn);
                }

                // Consome turno: o inimigo ataca
                const enemy = this.currentEnemy;
                const enemyMove = this.chooseEnemyMove(enemy);
                const knockedOut = await this.performAttack(enemy, activePkmn, enemyMove, false);
                if (knockedOut) {
                    await this.handleFaint(activePkmn, true);
                } else {
                    ui.updateBattleDisplay(activePkmn, enemy);
                    await ui.showMessage(`O que ${activePkmn.name} deve fazer?`);
                }
                this.inTurn = false;
                return;
            }

            // POÇÕES
            if (key === 'potion' || key === 'super_potion' || key === 'hyper_potion') {
                const healAmounts = { potion: 20, super_potion: 50, hyper_potion: 120 };
                const healAmt = healAmounts[key] || 20;

                if (activePkmn.currentHp >= activePkmn.stats.hp) {
                    await ui.showMessage(`${activePkmn.name} já está com o HP máximo!`);
                    return;
                }

                this.inTurn = true;
                this.itemBag[key]--;
                const oldHp = activePkmn.currentHp;
                activePkmn.currentHp = Math.min(activePkmn.stats.hp, activePkmn.currentHp + healAmt);
                const healed = activePkmn.currentHp - oldHp;

                if (typeof audio !== 'undefined') audio.playLevelUp();
                ui.updateBattleDisplay(activePkmn, this.currentEnemy);
                ui.showCombatFloatingText(false, `+${healed} HP`, 'effective');
                this.saveGame();
                this.updateHeaderStats();

                await ui.showMessage(`Você usou ${key.replace('_', ' ')}! ${activePkmn.name} recuperou ${healed} HP!`);

                // Consome turno: o inimigo ataca!
                const enemy = this.currentEnemy;
                const enemyMove = this.chooseEnemyMove(enemy);
                const knockedOut = await this.performAttack(enemy, activePkmn, enemyMove, false);
                if (knockedOut) {
                    await this.handleFaint(activePkmn, true);
                } else {
                    ui.updateBattleDisplay(activePkmn, enemy);
                    await ui.showMessage(`O que ${activePkmn.name} deve fazer?`);
                }
                this.inTurn = false;
                return;
            }

            // REVIVE
            if (key === 'revive') {
                const fainted = this.playerTeam.find(p => p.currentHp <= 0);
                if (!fainted) {
                    await ui.showMessage(`Nenhum Pokémon do seu time está desmaiado!`);
                    return;
                }

                this.inTurn = true;
                this.itemBag[key]--;
                fainted.currentHp = Math.max(1, Math.floor(fainted.stats.hp * 0.5));

                if (typeof audio !== 'undefined') audio.playLevelUp();
                this.saveGame();
                this.updateHeaderStats();
                ui.updateBattleDisplay(activePkmn, this.currentEnemy);

                await ui.showMessage(`Você usou Revive! ${fainted.name} reviveu com metade da vida!`);

                // Consome turno: o inimigo ataca!
                const enemy = this.currentEnemy;
                const enemyMove = this.chooseEnemyMove(enemy);
                const knockedOut = await this.performAttack(enemy, activePkmn, enemyMove, false);
                if (knockedOut) {
                    await this.handleFaint(activePkmn, true);
                } else {
                    ui.updateBattleDisplay(activePkmn, enemy);
                    await ui.showMessage(`O que ${activePkmn.name} deve fazer?`);
                }
                this.inTurn = false;
                return;
            }
        } else {
            // --- USO FORA DE BATALHA ---
            if (key === 'potion' || key === 'super_potion' || key === 'hyper_potion') {
                const healAmounts = { potion: 20, super_potion: 50, hyper_potion: 120 };
                const wounded = this.playerTeam.find(p => p.currentHp > 0 && p.currentHp < p.stats.hp);
                if (!wounded) {
                    await ui.showMessage(`Nenhum Pokémon ferido no time no momento!`);
                    return;
                }

                this.itemBag[key]--;
                const oldHp = wounded.currentHp;
                wounded.currentHp = Math.min(wounded.stats.hp, wounded.currentHp + (healAmounts[key] || 20));
                const healed = wounded.currentHp - oldHp;

                if (typeof audio !== 'undefined') audio.playLevelUp();
                this.saveGame();
                this.updateHeaderStats();
                ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
                await ui.showMessage(`Curou ${wounded.name} em +${healed} HP!`);
                return;
            }

            if (key === 'revive') {
                const fainted = this.playerTeam.find(p => p.currentHp <= 0);
                if (!fainted) {
                    await ui.showMessage(`Nenhum Pokémon desmaiado no time!`);
                    return;
                }

                this.itemBag[key]--;
                fainted.currentHp = Math.max(1, Math.floor(fainted.stats.hp * 0.5));
                if (typeof audio !== 'undefined') audio.playLevelUp();
                this.saveGame();
                this.updateHeaderStats();
                ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
                await ui.showMessage(`${fainted.name} reviveu com ${fainted.currentHp} HP!`);
                return;
            }

            if (key === 'rare_candy') {
                const target = this.getActivePokemon();
                if (!target || target.level >= 100) {
                    await ui.showMessage(`Seu Pokémon ativo já está no nível máximo!`);
                    return;
                }

                this.itemBag['rare_candy']--;
                const result = target.useRareCandy();
                if (typeof audio !== 'undefined') audio.playLevelUp();
                this.updateHeaderStats();
                this.saveGame();
                ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
                await ui.showMessage(`Você usou Rare Candy! ${target.name} subiu para o Nível ${target.level}!`);

                if (result.canEvolve) {
                    await this.triggerEvolutionSequence(target);
                }
                return;
            }

            if (key.includes('ball')) {
                await ui.showMessage(`Poké Balls só podem ser usadas durante a batalha contra Pokémons selvagens!`);
                return;
            }
        }
    }

    // Modal de Recompensa Pós-Batalha (Capturar OU Aprender Golpe)
    showPostBattleRewardModal(defeatedEnemy) {
        const modal = document.getElementById('modal-post-battle');
        if (!modal) return;

        const enemyImg = document.getElementById('reward-enemy-sprite');
        const enemyName = document.getElementById('reward-enemy-name');
        const enemyLevel = document.getElementById('reward-enemy-level');
        const enemyTypes = document.getElementById('reward-enemy-types');

        if (enemyImg) {
            UIManager.setupImageFallback(
                enemyImg,
                defeatedEnemy.getSpriteFront(),
                defeatedEnemy.getSpriteFrontStatic(),
                UIManager.getFallbackSvg(defeatedEnemy.name, defeatedEnemy.types[0], defeatedEnemy.id)
            );
        }
        if (enemyName) enemyName.textContent = defeatedEnemy.name;
        if (enemyLevel) enemyLevel.textContent = `Nível ${defeatedEnemy.level}`;
        if (enemyTypes) {
            enemyTypes.innerHTML = defeatedEnemy.types.map(t => ui.renderTypeBadge(t)).join('');
        }

        const captureHint = document.getElementById('reward-capture-hint');
        if (captureHint) {
            if (this.playerTeam.length < 6) {
                captureHint.textContent = `O Pokémon entrará para o seu Time ativo (${this.playerTeam.length + 1}/6).`;
                captureHint.className = 'reward-hint hint-team';
            } else {
                captureHint.textContent = `Seu time está completo (6/6)! O Pokémon irá diretamente para a Caixa do PC.`;
                captureHint.className = 'reward-hint hint-pc';
            }
        }

        const btnCapture = document.getElementById('btn-reward-capture');
        const btnLearnMove = document.getElementById('btn-reward-learn-move');
        const moveSelectionArea = document.getElementById('reward-move-selection');
        const mainChoicesArea = document.getElementById('reward-main-choices');

        if (moveSelectionArea) moveSelectionArea.classList.add('hidden');
        if (mainChoicesArea) mainChoicesArea.classList.remove('hidden');

        btnCapture.onclick = () => {
            if (typeof audio !== 'undefined') audio.playClick();
            this.executeCaptureReward(defeatedEnemy, true);
        };

        btnLearnMove.onclick = () => {
            if (typeof audio !== 'undefined') audio.playClick();
            this.showMoveLearningSelection(defeatedEnemy);
        };

        modal.classList.add('active');
    }

    // Executa a captura do Pokémon derrotado ou capturado por bola
    executeCaptureReward(defeatedEnemy, advanceStage = true) {
        if (typeof audio !== 'undefined') audio.playCatch();
        defeatedEnemy.fullHeal();

        let message = '';
        if (this.playerTeam.length < 6) {
            this.playerTeam.push(defeatedEnemy);
            message = `Incrível! ${defeatedEnemy.name} foi adicionado ao seu Time (${this.playerTeam.length}/6)!`;
        } else {
            this.playerPC.push(defeatedEnemy);
            message = `Seu time já tem 6 Pokémons! ${defeatedEnemy.name} foi enviado para a Caixa do PC.`;
        }

        const modal = document.getElementById('modal-post-battle');
        if (modal) modal.classList.remove('active');

        if (advanceStage) {
            this.stage++;
        }
        this.updateHeaderStats();
        this.saveGame();

        alert(message);
        this.startNextBattle();
    }

    // Apresenta os golpes do Pokémon derrotado para o jogador escolher um
    showMoveLearningSelection(defeatedEnemy) {
        const moveSelectionArea = document.getElementById('reward-move-selection');
        const mainChoicesArea = document.getElementById('reward-main-choices');
        const moveListContainer = document.getElementById('reward-enemy-moves-list');

        if (mainChoicesArea) mainChoicesArea.classList.add('hidden');
        if (moveSelectionArea) moveSelectionArea.classList.remove('hidden');

        if (!moveListContainer) return;
        moveListContainer.innerHTML = '';

        defeatedEnemy.moves.forEach(move => {
            const card = document.createElement('div');
            const typeInfo = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[move.type]) || { name: move.type, color: '#666' };
            card.className = 'reward-move-card';
            card.style.borderLeft = `5px solid ${typeInfo.color}`;
            card.innerHTML = `
                <div class="rm-header">
                    <strong>${move.name}</strong>
                    <span class="type-badge" style="background:${typeInfo.color}">${typeInfo.name}</span>
                </div>
                <div class="rm-info">
                    <span>${move.power > 0 ? `Poder: ${move.power}` : 'Status'}</span>
                    <span>Precisão: ${move.accuracy}%</span>
                    <span>PP: ${move.maxPp}</span>
                </div>
                <div class="rm-desc">${move.description}</div>
            `;

            card.addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                this.selectedRewardMove = move;
                this.showTeamMemberSelectorForMove(move);
            });

            moveListContainer.appendChild(card);
        });

        const btnBack = document.getElementById('btn-reward-back-to-choices');
        if (btnBack) {
            btnBack.onclick = () => {
                if (typeof audio !== 'undefined') audio.playClick();
                moveSelectionArea.classList.add('hidden');
                mainChoicesArea.classList.remove('hidden');
            };
        }
    }

    // Mostra os membros do time para escolher quem vai aprender o golpe
    showTeamMemberSelectorForMove(move) {
        const moveSelectionArea = document.getElementById('reward-move-selection');
        const teamSelectionArea = document.getElementById('reward-team-selection');
        const teamContainer = document.getElementById('reward-target-team-list');
        const titleMoveName = document.getElementById('reward-learning-move-name');

        if (moveSelectionArea) moveSelectionArea.classList.add('hidden');
        if (teamSelectionArea) teamSelectionArea.classList.remove('hidden');
        if (titleMoveName) titleMoveName.textContent = move.name;

        if (!teamContainer) return;
        teamContainer.innerHTML = '';

        this.playerTeam.forEach((member) => {
            const item = document.createElement('div');
            item.className = 'team-target-item';
            const knowsMove = member.moves.some(m => m.id === move.id);

            item.innerHTML = `
                <img src="${member.getSpriteFrontStatic()}" onerror="this.src='${UIManager.getFallbackSvg(member.name, member.types[0], member.id)}'">
                <div class="target-meta">
                    <strong>${member.name} (Lv.${member.level})</strong>
                    <div class="target-moves-preview">
                        Golpes atuais (${member.moves.length}/4): ${member.moves.map(m => m.name).join(', ')}
                    </div>
                </div>
                <button class="btn-select-target ${knowsMove ? 'disabled' : ''}">
                    ${knowsMove ? 'Já sabe' : 'Ensinar'}
                </button>
            `;

            if (!knowsMove) {
                item.addEventListener('click', () => {
                    if (typeof audio !== 'undefined') audio.playClick();
                    this.applyMoveToMember(member, move);
                });
            }

            teamContainer.appendChild(item);
        });

        const btnBack = document.getElementById('btn-reward-back-to-moves');
        if (btnBack) {
            btnBack.onclick = () => {
                if (typeof audio !== 'undefined') audio.playClick();
                teamSelectionArea.classList.add('hidden');
                moveSelectionArea.classList.remove('hidden');
            };
        }
    }

    // Aplica o golpe ao membro do time (ou abre substituição se já tiver 4)
    applyMoveToMember(member, move) {
        if (member.moves.length < 4) {
            member.learnMove(move.id);
            if (typeof audio !== 'undefined') audio.playLevelUp();
            alert(`Sucesso! ${member.name} aprendeu o golpe ${move.name}!`);

            const modalPost = document.getElementById('modal-post-battle');
            if (modalPost) modalPost.classList.remove('active');
            const teamSel = document.getElementById('reward-team-selection');
            if (teamSel) teamSel.classList.add('hidden');

            this.stage++;
            this.updateHeaderStats();
            this.saveGame();
            this.startNextBattle();
        } else {
            this.showReplaceMoveModal(member, move);
        }
    }

    // Modal para escolher qual golpe substituir
    showReplaceMoveModal(member, newMove) {
        const modal = document.getElementById('modal-replace-move');
        if (!modal) return;

        const title = document.getElementById('replace-move-title');
        const desc = document.getElementById('replace-move-desc');
        const currentMovesList = document.getElementById('current-moves-to-replace');

        if (title) title.textContent = `Ensinar ${newMove.name} a ${member.name}`;
        if (desc) desc.textContent = `${member.name} já conhece 4 golpes. Escolha um golpe antigo para ser esquecido:`;

        if (currentMovesList) {
            currentMovesList.innerHTML = '';
            member.moves.forEach((oldMove, idx) => {
                const btn = document.createElement('button');
                const typeInfo = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[oldMove.type]) || { name: oldMove.type, color: '#666' };
                btn.className = 'replace-move-btn';
                btn.innerHTML = `
                    <div><strong>${oldMove.name}</strong> <span class="type-badge" style="background:${typeInfo.color}">${typeInfo.name}</span></div>
                    <small>${oldMove.power > 0 ? `Poder: ${oldMove.power}` : 'Status'} | PP: ${oldMove.pp}/${oldMove.maxPp}</small>
                `;

                btn.onclick = () => {
                    if (typeof audio !== 'undefined') audio.playClick();
                    member.learnMove(newMove.id, idx);
                    if (typeof audio !== 'undefined') audio.playLevelUp();
                    alert(`1, 2, 3... e puff! ${member.name} esqueceu ${oldMove.name} e aprendeu ${newMove.name}!`);

                    modal.classList.remove('active');
                    const modalPost = document.getElementById('modal-post-battle');
                    if (modalPost) modalPost.classList.remove('active');
                    const teamSel = document.getElementById('reward-team-selection');
                    if (teamSel) teamSel.classList.add('hidden');

                    this.stage++;
                    this.updateHeaderStats();
                    this.saveGame();
                    this.startNextBattle();
                };

                currentMovesList.appendChild(btn);
            });
        }

        const btnCancel = document.getElementById('btn-cancel-replace');
        if (btnCancel) {
            btnCancel.onclick = () => {
                if (typeof audio !== 'undefined') audio.playClick();
                modal.classList.remove('active');
            };
        }

        modal.classList.add('active');
    }

    // Sequência Animada de Evolução
    async triggerEvolutionSequence(pokemon) {
        return new Promise(resolve => {
            const modal = document.getElementById('modal-evolution');
            if (!modal) {
                pokemon.evolve();
                resolve();
                return;
            }

            const spriteEl = document.getElementById('evolution-sprite');
            const textEl = document.getElementById('evolution-text');
            const oldName = pokemon.name;

            if (typeof audio !== 'undefined') audio.playEvolutionFanfare();
            modal.classList.add('active');

            if (spriteEl) {
                spriteEl.src = pokemon.getSpriteFrontStatic();
                spriteEl.className = 'evolution-sprite-anim';
            }
            if (textEl) {
                textEl.textContent = `O quê?! ${oldName} está evoluindo!`;
            }

            setTimeout(() => {
                const evoInfo = pokemon.evolve();
                if (spriteEl) {
                    spriteEl.src = pokemon.getSpriteFrontStatic();
                }
                if (textEl) {
                    textEl.textContent = `Parabéns! Seu ${oldName} evoluiu para ${evoInfo.newName}!`;
                }
                ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);

                setTimeout(() => {
                    modal.classList.remove('active');
                    if (spriteEl) spriteEl.className = '';
                    resolve();
                }, 3000);
            }, 3000);
        });
    }

    // Tentar fugir da batalha
    async tryRunAway() {
        this.inTurn = true;
        const player = this.getActivePokemon();
        const enemy = this.currentEnemy;

        const escapeChance = (player.stats.spd * 32) / (Math.max(1, enemy.stats.spd) + 30);
        if (Math.random() * 100 < escapeChance || player.stats.spd >= enemy.stats.spd) {
            await ui.showMessage('Você conseguiu fugir com segurança!');
            this.isBattleActive = false;
            setTimeout(() => {
                this.startNextBattle();
            }, 1000);
        } else {
            await ui.showMessage('Não conseguiu escapar!');
            const enemyMove = this.chooseEnemyMove(enemy);
            const knockedOut = await this.performAttack(enemy, player, enemyMove, false);
            if (knockedOut) {
                await this.handleFaint(player, true);
            }
            this.inTurn = false;
        }
    }

    // Modal para trocar de Pokémon durante a batalha
    openSwitchInBattleModal(forced = false) {
        const modal = document.getElementById('modal-team');
        if (!modal) return;
        this.renderTeamModalContent(true, forced);
        modal.classList.add('active');
    }

    // Modal normal do Time
    openTeamModal() {
        const modal = document.getElementById('modal-team');
        if (!modal) return;
        this.renderTeamModalContent(false, false);
        modal.classList.add('active');
    }

    // Renderiza a lista de membros do Time
    renderTeamModalContent(isInBattle = false, isForced = false) {
        const list = document.getElementById('team-members-list');
        if (!list) return;

        list.innerHTML = '';

        this.playerTeam.forEach((member, index) => {
            const card = document.createElement('div');
            card.className = `team-member-card ${index === this.activePokemonIndex ? 'lead-active' : ''} ${member.currentHp <= 0 ? 'fainted' : ''}`;
            const hpPercent = (member.currentHp / Math.max(1, member.stats.hp)) * 100;

            card.innerHTML = `
                <div class="tm-top">
                    <img src="${member.getSpriteFrontStatic()}" onerror="this.src='${UIManager.getFallbackSvg(member.name, member.types[0], member.id)}'">
                    <div class="tm-info">
                        <div class="tm-name-row">
                            <strong>${member.name}</strong>
                            <span class="tm-level">Lv.${member.level}</span>
                            ${index === this.activePokemonIndex ? '<span class="lead-tag">Líder</span>' : ''}
                        </div>
                        <div class="tm-types">
                            ${member.types.map(t => ui.renderTypeBadge(t)).join('')}
                        </div>
                        <div class="tm-hp-bar-wrap">
                            <div class="tm-hp-bar" style="width: ${hpPercent}%"></div>
                        </div>
                        <small>HP: ${member.currentHp}/${member.stats.hp}</small>
                    </div>
                </div>
                <div class="tm-actions">
                    ${isInBattle ? `
                        <button class="btn-sm btn-action-send" ${member.currentHp <= 0 || index === this.activePokemonIndex ? 'disabled' : ''}>
                            ${index === this.activePokemonIndex ? 'Em Campo' : 'Entrar na Batalha'}
                        </button>
                    ` : `
                        <button class="btn-sm btn-action-lead" ${index === this.activePokemonIndex ? 'disabled' : ''}>Tornar Líder</button>
                        <button class="btn-sm btn-action-deposit" ${this.playerTeam.length <= 1 ? 'disabled' : ''}>Mover p/ PC</button>
                        <button class="btn-sm btn-action-details">Detalhes</button>
                    `}
                </div>
            `;

            if (isInBattle) {
                const btnSend = card.querySelector('.btn-action-send');
                if (btnSend && member.currentHp > 0 && index !== this.activePokemonIndex) {
                    btnSend.onclick = async () => {
                        if (typeof audio !== 'undefined') audio.playClick();
                        document.getElementById('modal-team').classList.remove('active');
                        this.activePokemonIndex = index;
                        ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
                        await ui.showMessage(`Vai, ${member.name}!`);

                        if (!isForced && this.isBattleActive) {
                            this.inTurn = true;
                            const enemyMove = this.chooseEnemyMove(this.currentEnemy);
                            const knockedOut = await this.performAttack(this.currentEnemy, member, enemyMove, false);
                            if (knockedOut) {
                                await this.handleFaint(member, true);
                            }
                            this.inTurn = false;
                        }
                    };
                }
            } else {
                const btnLead = card.querySelector('.btn-action-lead');
                const btnDeposit = card.querySelector('.btn-action-deposit');
                const btnDetails = card.querySelector('.btn-action-details');

                if (btnLead) {
                    btnLead.onclick = () => {
                        if (typeof audio !== 'undefined') audio.playClick();
                        this.activePokemonIndex = index;
                        this.renderTeamModalContent(false, false);
                        ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
                        this.saveGame();
                    };
                }

                if (btnDeposit) {
                    btnDeposit.onclick = () => {
                        if (typeof audio !== 'undefined') audio.playClick();
                        if (this.playerTeam.length <= 1) {
                            alert('Você deve ter pelo menos 1 Pokémon no seu time!');
                            return;
                        }
                        const deposited = this.playerTeam.splice(index, 1)[0];
                        this.playerPC.push(deposited);
                        this.activePokemonIndex = 0;
                        this.renderTeamModalContent(false, false);
                        this.updateHeaderStats();
                        ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
                        this.saveGame();
                    };
                }

                if (btnDetails) {
                    btnDetails.onclick = () => {
                        if (typeof audio !== 'undefined') audio.playClick();
                        this.showPokemonDetailsModal(member);
                    };
                }
            }

            list.appendChild(card);
        });
    }

    // Modal de Detalhes completos do Pokémon
    showPokemonDetailsModal(pokemon) {
        const modal = document.getElementById('modal-details');
        if (!modal) return;

        const img = document.getElementById('detail-sprite');
        if (img) {
            img.src = pokemon.getSpriteFrontStatic();
            img.onerror = () => {
                img.src = UIManager.getFallbackSvg(pokemon.name, pokemon.types[0], pokemon.id);
            };
        }

        document.getElementById('detail-name').textContent = pokemon.name;
        document.getElementById('detail-level').textContent = `Nível ${pokemon.level}`;
        document.getElementById('detail-types').innerHTML = pokemon.types.map(t => ui.renderTypeBadge(t)).join('');

        document.getElementById('stat-hp').textContent = `${pokemon.currentHp}/${pokemon.stats.hp}`;
        document.getElementById('stat-atk').textContent = pokemon.stats.atk;
        document.getElementById('stat-def').textContent = pokemon.stats.def;
        document.getElementById('stat-spatk').textContent = pokemon.stats.spAtk;
        document.getElementById('stat-spdef').textContent = pokemon.stats.spDef;
        document.getElementById('stat-spd').textContent = pokemon.stats.spd;

        const currentLvlExp = pokemon.getExpForLevel(pokemon.level);
        const nextLvlExp = pokemon.expToNext;
        document.getElementById('stat-xp').textContent = `${pokemon.exp - currentLvlExp} / ${nextLvlExp - currentLvlExp}`;

        const evoInfo = document.getElementById('detail-evolution');
        if (pokemon.evolution) {
            const target = (typeof POKEMON_SPECIES !== 'undefined' && POKEMON_SPECIES[pokemon.evolution.to]) || null;
            evoInfo.textContent = `Evolui para ${target ? target.name : pokemon.evolution.to} no Lv. ${pokemon.evolution.level}`;
        } else {
            evoInfo.textContent = 'Estágio Final (Não evolui mais)';
        }

        const movesList = document.getElementById('detail-moves-list');
        movesList.innerHTML = '';
        pokemon.moves.forEach(m => {
            const div = document.createElement('div');
            const typeInfo = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[m.type]) || { name: m.type, color: '#666' };
            div.className = 'detail-move-item';
            div.innerHTML = `
                <div><strong>${m.name}</strong> <span class="type-badge" style="background:${typeInfo.color}">${typeInfo.name}</span></div>
                <small>${m.power > 0 ? `Poder: ${m.power}` : 'Status'} | PP: ${m.pp}/${m.maxPp} | ${m.description}</small>
            `;
            movesList.appendChild(div);
        });

        modal.classList.add('active');
    }

    // Modal de Gerenciamento do PC (Caixas de Armazenamento)
    openPCModal() {
        const modal = document.getElementById('modal-pc');
        if (!modal) return;
        this.renderPCModalContent();
        modal.classList.add('active');
    }

    renderPCModalContent() {
        const teamGrid = document.getElementById('pc-team-grid');
        const boxGrid = document.getElementById('pc-box-grid');
        const countBox = document.getElementById('pc-stored-count');

        if (countBox) countBox.textContent = `Total Armazenado: ${this.playerPC.length} Pokémons`;

        // Renderizar Time no PC
        if (teamGrid) {
            teamGrid.innerHTML = '';
            for (let i = 0; i < 6; i++) {
                const member = this.playerTeam[i];
                const slot = document.createElement('div');
                slot.className = 'pc-slot' + (member ? ' filled' : ' empty');

                if (member) {
                    slot.innerHTML = `
                        <img src="${member.getSpriteFrontStatic()}" onerror="this.src='${UIManager.getFallbackSvg(member.name, member.types[0], member.id)}'">
                        <div class="pc-slot-name">${member.name}</div>
                        <div class="pc-slot-lvl">Lv.${member.level}</div>
                        <button class="pc-btn-action" title="Depositar no PC">Depositar</button>
                    `;
                    const btn = slot.querySelector('.pc-btn-action');
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        if (typeof audio !== 'undefined') audio.playClick();
                        if (this.playerTeam.length <= 1) {
                            alert('Você deve manter ao menos 1 Pokémon no time!');
                            return;
                        }
                        this.playerPC.push(this.playerTeam.splice(i, 1)[0]);
                        this.activePokemonIndex = 0;
                        this.renderPCModalContent();
                        this.updateHeaderStats();
                        ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
                        this.saveGame();
                    };
                } else {
                    slot.innerHTML = '<span class="empty-text">Vazio</span>';
                }
                teamGrid.appendChild(slot);
            }
        }

        // Renderizar Pokémons guardados no PC
        if (boxGrid) {
            boxGrid.innerHTML = '';
            if (this.playerPC.length === 0) {
                boxGrid.innerHTML = '<div class="empty-pc-msg">Sua caixa do PC está vazia. Capture novos Pokémons para vê-los aqui!</div>';
            } else {
                this.playerPC.forEach((pkmn, pcIndex) => {
                    const card = document.createElement('div');
                    card.className = 'pc-box-card';
                    card.innerHTML = `
                        <img src="${pkmn.getSpriteFrontStatic()}" onerror="this.src='${UIManager.getFallbackSvg(pkmn.name, pkmn.types[0], pkmn.id)}'">
                        <strong>${pkmn.name}</strong>
                        <small>Lv.${pkmn.level}</small>
                        <div class="pc-card-btns">
                            <button class="btn-pc-withdraw" ${this.playerTeam.length >= 6 ? 'disabled' : ''}>Puxar p/ Time</button>
                            <button class="btn-pc-details">Ver</button>
                            <button class="btn-pc-release">Soltar</button>
                        </div>
                    `;

                    const btnWithdraw = card.querySelector('.btn-pc-withdraw');
                    if (btnWithdraw && this.playerTeam.length < 6) {
                        btnWithdraw.onclick = () => {
                            if (typeof audio !== 'undefined') audio.playClick();
                            const removed = this.playerPC.splice(pcIndex, 1)[0];
                            this.playerTeam.push(removed);
                            this.renderPCModalContent();
                            this.updateHeaderStats();
                            this.saveGame();
                        };
                    }

                    const btnDetails = card.querySelector('.btn-pc-details');
                    if (btnDetails) {
                        btnDetails.onclick = () => {
                            if (typeof audio !== 'undefined') audio.playClick();
                            this.showPokemonDetailsModal(pkmn);
                        };
                    }

                    const btnRelease = card.querySelector('.btn-pc-release');
                    if (btnRelease) {
                        btnRelease.onclick = () => {
                            if (typeof audio !== 'undefined') audio.playClick();
                            if (confirm(`Tem certeza de que deseja libertar ${pkmn.name} na natureza?`)) {
                                this.playerPC.splice(pcIndex, 1);
                                this.renderPCModalContent();
                                this.updateHeaderStats();
                                this.saveGame();
                            }
                        };
                    }

                    boxGrid.appendChild(card);
                });
            }
        }
    }

    // Curar o time inteiro (Centro Pokémon com limite estrito de 3 usos)
    healTeam(showMessage = true) {
        if (this.centerUses >= this.maxCenterUses) {
            this.gameOver = true;
            if (typeof audio !== 'undefined') audio.playFaint();
            if (showMessage) {
                alert('💀 GAME OVER! Você esgotou todos os 3 usos permitidos do Centro Pokémon!\n\nO jogo será reiniciado.');
            }
            ui.showMessage('❌ GAME OVER – Usos do Centro Pokémon esgotados!');
            localStorage.removeItem('pokemon_rpg_save');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            return;
        }

        this.centerUses++;

        // Cura completa de todos os Pokémons do time
        this.playerTeam.forEach(pkmn => {
            if (typeof pkmn.fullHeal === 'function') {
                pkmn.fullHeal();
            } else {
                pkmn.currentHp = pkmn.stats.hp;
                pkmn.status = null;
                if (pkmn.moves) pkmn.moves.forEach(m => m.pp = m.maxPp);
            }
        });

        if (typeof audio !== 'undefined') audio.playLevelUp();
        this.updateHeaderStats();
        ui.updateBattleDisplay(this.getActivePokemon(), this.currentEnemy);
        this.saveGame();

        const remaining = this.maxCenterUses - this.centerUses;
        if (showMessage) {
            ui.showMessage(`❤️ Centro Pokémon usado! Time curado. (Usos restantes: ${remaining})`);
        }
    }

    // Tela de Escolha de Inicial (Primeira vez que abre o jogo)
    showStarterSelection() {
        const modal = document.getElementById('modal-starter');
        if (!modal) return;

        const startersGrid = document.getElementById('starters-grid');
        if (!startersGrid) return;

        startersGrid.innerHTML = '';

        STARTER_POKEMON_KEYS.forEach(key => {
            const species = POKEMON_SPECIES[key];
            const card = document.createElement('div');
            card.className = 'starter-card';
            const firstType = species.types[0];
            const typeColor = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[firstType] && POKEMON_TYPES[firstType].color) || '#777';

            card.style.borderColor = typeColor;
            card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png" onerror="this.src='${UIManager.getFallbackSvg(species.name, firstType, species.id)}'">
                <h3>${species.name}</h3>
                <div class="starter-types">
                    ${species.types.map(t => ui.renderTypeBadge(t)).join('')}
                </div>
                <div class="starter-stats-preview">
                    <span>HP: ${species.baseStats.hp}</span>
                    <span>ATK: ${species.baseStats.atk}</span>
                    <span>DEF: ${species.baseStats.def}</span>
                    <span>VEL: ${species.baseStats.spd}</span>
                </div>
                <button class="btn-choose-starter">Escolher ${species.name}</button>
            `;

            const btn = card.querySelector('.btn-choose-starter');
            btn.onclick = () => {
                if (typeof audio !== 'undefined') audio.playClick();
                this.selectStarter(key);
                modal.classList.remove('active');
            };

            startersGrid.appendChild(card);
        });

        modal.classList.add('active');
    }

    // Seleciona o Inicial e começa a aventura
    selectStarter(speciesKey) {
        const starter = new PokemonInstance(speciesKey, 5);
        this.playerTeam = [starter];
        this.playerPC = [];
        this.stage = 1;
        this.battlesWon = 0;
        this.activePokemonIndex = 0;
        this.centerUses = 0;
        this.money = 500;
        this.itemBag = {
            potion: 3,
            super_potion: 1,
            hyper_potion: 0,
            revive: 1,
            rare_candy: 1,
            pokeball: 5,
            great_ball: 2,
            ultra_ball: 0
        };

        this.updateHeaderStats();
        this.saveGame();
        this.startNextBattle();
    }

    // Salvar jogo no LocalStorage
    saveGame() {
        try {
            const data = {
                stage: this.stage,
                battlesWon: this.battlesWon,
                activePokemonIndex: this.activePokemonIndex,
                centerUses: this.centerUses,
                money: this.money,
                itemBag: this.itemBag,
                playerTeam: this.playerTeam.map(p => p.toSerializable()),
                playerPC: this.playerPC.map(p => p.toSerializable())
            };
            localStorage.setItem('pokemon_rpg_save', JSON.stringify(data));
        } catch (e) {
            console.error('Falha ao salvar o jogo:', e);
        }
    }

    // Carregar jogo do LocalStorage
    loadGame() {
        try {
            const savedStr = localStorage.getItem('pokemon_rpg_save');
            if (!savedStr) return false;
            const data = JSON.parse(savedStr);

            this.stage = data.stage || 1;
            this.battlesWon = data.battlesWon || 0;
            this.activePokemonIndex = data.activePokemonIndex || 0;
            this.centerUses = data.centerUses || 0;
            this.money = typeof data.money === 'number' ? data.money : 500;

            this.itemBag = Object.assign({
                potion: 3,
                super_potion: 1,
                hyper_potion: 0,
                revive: 1,
                rare_candy: 1,
                pokeball: 5,
                great_ball: 2,
                ultra_ball: 0
            }, data.itemBag || {});

            if (data.playerTeam && Array.isArray(data.playerTeam) && data.playerTeam.length > 0) {
                this.playerTeam = data.playerTeam.map(item => PokemonInstance.fromSerializable(item));
            } else {
                return false;
            }

            if (data.playerPC && Array.isArray(data.playerPC)) {
                this.playerPC = data.playerPC.map(item => PokemonInstance.fromSerializable(item));
            } else {
                this.playerPC = [];
            }

            return true;
        } catch (e) {
            console.error('Falha ao carregar save:', e);
            return false;
        }
    }
}

// Inicialização Global
window.game = new GameApp();
window.gameApp = window.game;

window.addEventListener('DOMContentLoaded', () => {
    window.game.init();
});
