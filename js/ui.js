// Gerenciador de Interface de Usuário (UI), Modais, Animações e Telas

class UIManager {
    constructor() {
        this.battleLogElement = null;
        this.dialogueQueue = [];
        this.isTyping = false;
    }

    init() {
        this.battleLogElement = document.getElementById('battle-dialogue-text');
    }

    // Gerador de Sprite Fallback SVG codificado em Base64 para nunca quebrar aspas no HTML
    static getFallbackSvg(name, type, dexId) {
        const typeColor = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[type] && POKEMON_TYPES[type].color) || '#777';
        const safeName = (name || 'Poke').slice(0, 8);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
            <defs>
                <radialGradient id="grad_${dexId || 0}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="${typeColor}" stop-opacity="1"/>
                </radialGradient>
            </defs>
            <circle cx="60" cy="60" r="50" fill="url(#grad_${dexId || 0})" stroke="#222" stroke-width="4"/>
            <circle cx="60" cy="60" r="22" fill="#fff" stroke="#222" stroke-width="3"/>
            <text x="60" y="55" font-family="monospace, sans-serif" font-size="13" font-weight="bold" fill="#111" text-anchor="middle">#${dexId || '?'}</text>
            <text x="60" y="73" font-family="sans-serif" font-size="11" font-weight="bold" fill="#333" text-anchor="middle">${safeName}</text>
        </svg>`;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }

    // -------------------------------------------------
    // Renderiza o modal de inventário de itens
    // -------------------------------------------------
    renderItemBag(bag) {
        let modal = document.getElementById('modal-item-bag');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-item-bag';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-card modal-items">
                    <div class="modal-header">
                        <h2>🎒 MOCHILA DE ITENS</h2>
                        <button class="modal-close-btn">&times;</button>
                    </div>
                    <p class="modal-subtitle">Selecione um item para utilizar:</p>
                    <div class="items-grid"></div>
                </div>`;
            document.body.appendChild(modal);

            modal.querySelector('.modal-close-btn').addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                modal.classList.remove('active');
            });
        }

        const grid = modal.querySelector('.items-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const itemDefinitions = {
            potion: { name: 'Potion', icon: '🧪', desc: 'Restaura 20 HP do Pokémon ativo.' },
            super_potion: { name: 'Super Potion', icon: '🍶', desc: 'Restaura 50 HP do Pokémon ativo.' },
            hyper_potion: { name: 'Hyper Potion', icon: '🧴', desc: 'Restaura 120 HP do Pokémon ativo.' },
            revive: { name: 'Revive', icon: '💎', desc: 'Revive um Pokémon desmaiado com 50% de HP.' },
            pokeball: { name: 'Poké Ball', icon: '🔴', desc: 'Arremessa em batalha para tentar capturar.' },
            great_ball: { name: 'Great Ball', icon: '🔵', desc: 'Bola aprimorada com 1.5x de chance de captura.' },
            ultra_ball: { name: 'Ultra Ball', icon: '🟡', desc: 'Bola de alta performance com 2.0x de chance.' },
            rare_candy: { name: 'Rare Candy', icon: '🍬', desc: 'Aumenta em 1 o Nível do Pokémon e pode evoluí-lo!' }
        };

        const currentBag = bag || {};
        let totalItems = 0;

        Object.entries(itemDefinitions).forEach(([key, info]) => {
            const qty = currentBag[key] || 0;
            if (qty <= 0) return;
            totalItems += qty;

            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-icon">${info.icon}</div>
                <div class="item-info">
                    <span class="item-name">${info.name}</span>
                    <span class="item-desc">${info.desc}</span>
                    <span class="item-qty-badge">Quantidade: x${qty}</span>
                </div>
                <button class="btn-use-item" data-key="${key}">Usar</button>
            `;
            grid.appendChild(card);
        });

        if (totalItems === 0) {
            grid.innerHTML = `
                <div class="empty-bag-notice" style="grid-column: 1/-1; text-align: center; padding: 30px; color: #9aa8b8;">
                    <div style="font-size: 40px; margin-bottom: 10px;">🎒</div>
                    <strong style="color: #ffd02c; font-size: 15px;">Sua mochila está vazia no momento!</strong>
                    <p style="margin-top: 6px; font-size: 13px;">Vença batalhas para encontrar poções, revives e Poké Balls aleatórias.</p>
                </div>
            `;
        }

        // Event listener dos botões "Usar"
        grid.querySelectorAll('.btn-use-item').forEach(btn => {
            btn.addEventListener('click', e => {
                const key = e.currentTarget.getAttribute('data-key');
                if (typeof audio !== 'undefined') audio.playClick();
                modal.classList.remove('active');
                const app = window.game || window.gameApp;
                if (app && typeof app.useItem === 'function') {
                    app.useItem(key);
                }
            });
        });

        modal.classList.add('active');
    }

    static setupImageFallback(imgElement, showdownUrl, staticUrl, fallbackSvg) {
        if (!imgElement) return;
        imgElement.src = showdownUrl;
        imgElement.onerror = () => {
            if (imgElement.src !== staticUrl) {
                imgElement.src = staticUrl;
            } else {
                imgElement.src = fallbackSvg;
                imgElement.onerror = null;
            }
        };
    }

    // Sistema de Diálogo com efeito de texto digitado suave
    async showMessage(text, speed = 18) {
        return new Promise(resolve => {
            if (!this.battleLogElement) {
                this.battleLogElement = document.getElementById('battle-dialogue-text');
            }
            if (!this.battleLogElement) {
                resolve();
                return;
            }

            this.battleLogElement.innerHTML = '';
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    this.battleLogElement.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    setTimeout(resolve, 350);
                }
            }, speed);
        });
    }

    // Atualiza a visualização do Pokémon em batalha
    updateBattleDisplay(playerPkmn, enemyPkmn) {
        if (!playerPkmn || !enemyPkmn) return;

        // --- Jogador ---
        const playerSprite = document.getElementById('player-pokemon-sprite');
        const playerName = document.getElementById('player-pokemon-name');
        const playerLevel = document.getElementById('player-pokemon-level');
        const playerHpBar = document.getElementById('player-hp-bar');
        const playerHpText = document.getElementById('player-hp-text');
        const playerXpBar = document.getElementById('player-xp-bar');
        const playerTypes = document.getElementById('player-pokemon-types');

        if (playerName) playerName.textContent = playerPkmn.name;
        if (playerLevel) playerLevel.textContent = `Lv.${playerPkmn.level}`;
        if (playerHpText) playerHpText.textContent = `${Math.max(0, playerPkmn.currentHp)}/${playerPkmn.stats.hp}`;

        const playerHpPercent = Math.max(0, Math.min(100, (playerPkmn.currentHp / playerPkmn.stats.hp) * 100));
        if (playerHpBar) {
            playerHpBar.style.width = `${playerHpPercent}%`;
            playerHpBar.className = 'hp-fill ' + this.getHpColorClass(playerHpPercent);
        }

        // XP Bar
        if (playerXpBar) {
            const currentLevelExp = playerPkmn.getExpForLevel(playerPkmn.level);
            const nextLevelExp = playerPkmn.expToNext;
            const expDiff = nextLevelExp - currentLevelExp;
            const currentProgress = playerPkmn.exp - currentLevelExp;
            const xpPercent = Math.max(0, Math.min(100, (currentProgress / Math.max(1, expDiff)) * 100));
            playerXpBar.style.width = `${xpPercent}%`;
        }

        // Tipos Jogador
        if (playerTypes) {
            playerTypes.innerHTML = playerPkmn.types.map(t => this.renderTypeBadge(t)).join('');
        }

        // Sprite Jogador (Costas)
        if (playerSprite) {
            UIManager.setupImageFallback(
                playerSprite,
                playerPkmn.getSpriteBack(),
                playerPkmn.getSpriteBackStatic(),
                UIManager.getFallbackSvg(playerPkmn.name, playerPkmn.types[0], playerPkmn.id)
            );
        }

        // --- Inimigo ---
        const enemySprite = document.getElementById('enemy-pokemon-sprite');
        const enemyName = document.getElementById('enemy-pokemon-name');
        const enemyLevel = document.getElementById('enemy-pokemon-level');
        const enemyHpBar = document.getElementById('enemy-hp-bar');
        const enemyHpText = document.getElementById('enemy-hp-text');
        const enemyTypes = document.getElementById('enemy-pokemon-types');

        if (enemyName) enemyName.textContent = enemyPkmn.name;
        if (enemyLevel) enemyLevel.textContent = `Lv.${enemyPkmn.level}`;
        if (enemyHpText) enemyHpText.textContent = `${Math.max(0, enemyPkmn.currentHp)}/${enemyPkmn.stats.hp}`;

        const enemyHpPercent = Math.max(0, Math.min(100, (enemyPkmn.currentHp / enemyPkmn.stats.hp) * 100));
        if (enemyHpBar) {
            enemyHpBar.style.width = `${enemyHpPercent}%`;
            enemyHpBar.className = 'hp-fill ' + this.getHpColorClass(enemyHpPercent);
        }

        // Tipos Inimigo
        if (enemyTypes) {
            enemyTypes.innerHTML = enemyPkmn.types.map(t => this.renderTypeBadge(t)).join('');
        }

        // Sprite Inimigo (Frente)
        if (enemySprite) {
            UIManager.setupImageFallback(
                enemySprite,
                enemyPkmn.getSpriteFront(),
                enemyPkmn.getSpriteFrontStatic(),
                UIManager.getFallbackSvg(enemyPkmn.name, enemyPkmn.types[0], enemyPkmn.id)
            );
        }
    }

    // Classe de cor do HP (Verde > 50%, Amarelo > 20%, Vermelho <= 20%)
    getHpColorClass(percent) {
        if (percent > 50) return 'hp-high';
        if (percent > 20) return 'hp-mid';
        return 'hp-low';
    }

    // Renderiza uma pill/badge com o tipo do Pokémon
    renderTypeBadge(type) {
        const info = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[type]) || { name: type, color: '#888' };
        return `<span class="type-badge" style="background-color: ${info.color};">${info.name}</span>`;
    }

    // Renderiza os botões de golpes do jogador
    renderMoveButtons(moves, onSelectMove) {
        const movesContainer = document.getElementById('moves-container');
        if (!movesContainer) return;

        movesContainer.innerHTML = '';
        moves.forEach(move => {
            const btn = document.createElement('button');
            const typeInfo = (typeof POKEMON_TYPES !== 'undefined' && POKEMON_TYPES[move.type]) || { name: move.type, color: '#666' };
            btn.className = 'move-btn';
            btn.style.borderColor = typeInfo.color;
            btn.innerHTML = `
                <div class="move-header">
                    <span class="move-name">${move.name}</span>
                    <span class="move-type" style="background:${typeInfo.color}">${typeInfo.name}</span>
                </div>
                <div class="move-details">
                    <span>PP: ${move.pp}/${move.maxPp}</span>
                    <span>${move.power > 0 ? `Poder: ${move.power}` : 'Status'}</span>
                </div>
            `;

            if (move.pp <= 0) {
                btn.disabled = true;
                btn.classList.add('disabled');
            } else {
                btn.addEventListener('click', () => {
                    if (typeof audio !== 'undefined') audio.playClick();
                    onSelectMove(move);
                });
            }

            movesContainer.appendChild(btn);
        });
    }

    // Animação de ataque com impacto visual
    async animateAttack(isPlayerAttacking) {
        const attackerId = isPlayerAttacking ? 'player-pokemon-sprite' : 'enemy-pokemon-sprite';
        const defenderId = isPlayerAttacking ? 'enemy-pokemon-sprite' : 'player-pokemon-sprite';
        const arena = document.getElementById('battle-arena');

        const attacker = document.getElementById(attackerId);
        const defender = document.getElementById(defenderId);

        if (attacker) {
            attacker.classList.add(isPlayerAttacking ? 'anim-lunge-forward' : 'anim-lunge-down');
        }

        await new Promise(r => setTimeout(r, 200));

        if (defender) {
            defender.classList.add('anim-hit-flash');
        }
        if (arena) {
            arena.classList.add('anim-screen-shake');
        }

        await new Promise(r => setTimeout(r, 350));

        if (attacker) {
            attacker.classList.remove('anim-lunge-forward', 'anim-lunge-down');
        }
        if (defender) {
            defender.classList.remove('anim-hit-flash');
        }
        if (arena) {
            arena.classList.remove('anim-screen-shake');
        }
    }

    // Animação de desmaio / derrota
    async animateFaint(isPlayer) {
        const spriteId = isPlayer ? 'player-pokemon-sprite' : 'enemy-pokemon-sprite';
        const sprite = document.getElementById(spriteId);
        if (sprite) {
            if (typeof audio !== 'undefined') audio.playFaint();
            sprite.classList.add('anim-faint');
            await new Promise(r => setTimeout(r, 650));
            sprite.classList.remove('anim-faint');
        }
    }

    // Mostra indicador flutuante de dano ou efetividade
    showCombatFloatingText(targetIsPlayer, text, type = 'normal') {
        const container = document.getElementById(targetIsPlayer ? 'player-zone' : 'enemy-zone');
        if (!container) return;

        const floater = document.createElement('div');
        floater.className = `combat-floater floater-${type}`;
        floater.textContent = text;
        container.appendChild(floater);

        setTimeout(() => {
            if (floater.parentNode) floater.parentNode.removeChild(floater);
        }, 1200);
    }

    // Renderiza a Loja de Itens (Poké-Mart)
    renderShop(money, catalog, onBuy) {
        let modal = document.getElementById('modal-shop');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-shop';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-card modal-shop">
                    <div class="modal-header">
                        <h2>🏪 POKÉ-MART - LOJA DE ITENS</h2>
                        <button class="modal-close-btn">&times;</button>
                    </div>
                    <div class="shop-money-banner">
                        <span>Seu Saldo:</span>
                        <strong id="shop-player-money" class="money-text">₽ ${money}</strong>
                    </div>
                    <div class="shop-grid"></div>
                </div>`;
            document.body.appendChild(modal);

            modal.querySelector('.modal-close-btn').addEventListener('click', () => {
                if (typeof audio !== 'undefined') audio.playClick();
                modal.classList.remove('active');
            });
        }

        const moneyEl = modal.querySelector('#shop-player-money');
        if (moneyEl) moneyEl.textContent = `₽ ${money}`;

        const grid = modal.querySelector('.shop-grid');
        if (!grid) return;
        grid.innerHTML = '';

        catalog.forEach(item => {
            const card = document.createElement('div');
            card.className = 'shop-item-card';
            const canAfford = money >= item.price;

            card.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-desc">${item.desc}</span>
                    <span class="shop-price-badge">₽ ${item.price}</span>
                </div>
                <button class="btn-buy-item ${canAfford ? '' : 'disabled'}" ${canAfford ? '' : 'disabled'} data-key="${item.key}">
                    Comprar
                </button>
            `;

            if (canAfford) {
                const btnBuy = card.querySelector('.btn-buy-item');
                btnBuy.addEventListener('click', () => {
                    onBuy(item);
                });
            }

            grid.appendChild(card);
        });

        modal.classList.add('active');
    }

    // Animação completa de arremesso, absorção e balanço da Pokébola
    async animatePokeballThrow(ballType, isCaptured) {
        return new Promise(async (resolve) => {
            const enemySprite = document.getElementById('enemy-pokemon-sprite');
            const arena = document.getElementById('battle-arena');
            if (!enemySprite || !arena) {
                resolve();
                return;
            }

            const ballColors = {
                pokeball: '#ee4949',
                great_ball: '#2980b9',
                ultra_ball: '#f39c12'
            };
            const topColor = ballColors[ballType] || '#ee4949';

            const ball = document.createElement('div');
            ball.className = 'pokeball-projectile';
            ball.innerHTML = `
                <div class="pb-half pb-top" style="background: ${topColor};"></div>
                <div class="pb-center-line"></div>
                <div class="pb-button"></div>
                <div class="pb-half pb-bottom"></div>
            `;
            arena.appendChild(ball);

            // 1. Voo em arco até o oponente
            await new Promise(r => setTimeout(r, 450));

            // 2. Luz vermelha de absorção
            enemySprite.classList.add('anim-capture-absorb');
            if (typeof audio !== 'undefined') audio.playTone(550, 0.25, 'sine', 0.2);

            await new Promise(r => setTimeout(r, 450));
            enemySprite.style.opacity = '0';
            ball.classList.add('pb-landed');

            // 3. Balanços da bola no chão
            const shakes = isCaptured ? 3 : (Math.random() < 0.5 ? 2 : 1);
            for (let i = 1; i <= shakes; i++) {
                await new Promise(r => setTimeout(r, 550));
                ball.classList.remove('pb-shake-left', 'pb-shake-right');
                void ball.offsetWidth;
                ball.classList.add(i % 2 === 1 ? 'pb-shake-left' : 'pb-shake-right');
                if (typeof audio !== 'undefined') audio.playBallWobble();
            }

            await new Promise(r => setTimeout(r, 500));

            if (isCaptured) {
                ball.classList.add('pb-captured-stars');
                if (typeof audio !== 'undefined') audio.playCatch();
                await new Promise(r => setTimeout(r, 800));
                ball.remove();
                resolve();
            } else {
                if (typeof audio !== 'undefined') audio.playBallBreak();
                ball.classList.add('pb-burst-open');
                await new Promise(r => setTimeout(r, 200));
                ball.remove();
                enemySprite.style.opacity = '1';
                enemySprite.classList.remove('anim-capture-absorb');
                enemySprite.classList.add('anim-capture-escape');
                await new Promise(r => setTimeout(r, 400));
                enemySprite.classList.remove('anim-capture-escape');
                resolve();
            }
        });
    }
}

const ui = new UIManager();
