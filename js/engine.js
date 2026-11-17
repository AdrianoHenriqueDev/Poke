// Motor Principal de Batalha, Stats, Experiência e Evolução

class PokemonInstance {
    constructor(speciesKey, level = 5, customMoves = null) {
        this.speciesKey = speciesKey;
        const species = POKEMON_SPECIES[speciesKey];
        if (!species) {
            throw new Error(`Espécie não encontrada: ${speciesKey}`);
        }

        this.id = species.id;
        this.name = species.name;
        this.types = [...species.types];
        this.level = level;
        this.baseExp = species.baseExp;
        this.evolution = species.evolution ? { ...species.evolution } : null;

        // Experiência
        this.exp = this.getExpForLevel(this.level);
        this.expToNext = this.getExpForLevel(this.level + 1);

        // Status de combate temporário
        this.status = null; // 'burn', 'paralyze', 'poison', 'freeze'
        this.statStages = { atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 };

        // Inicializar stats
        this.stats = {};
        this.recalculateStats();
        this.currentHp = this.stats.hp;

        // Inicializar golpes
        this.moves = [];
        if (customMoves && Array.isArray(customMoves) && customMoves.length > 0) {
            this.moves = customMoves.map(m => this.createMoveInstance(m.id || m));
        } else {
            this.initDefaultMoves(species);
        }
    }

    // Calcula experiência cúbica necessária para cada nível
    getExpForLevel(lvl) {
        return Math.floor(Math.pow(lvl, 3));
    }

    // Calcula stats baseados na fórmula clássica de Pokémon
    recalculateStats() {
        const species = POKEMON_SPECIES[this.speciesKey];
        const bs = species.baseStats;

        // HP: ((2 * Base + 31) * Level / 100) + Level + 10
        const oldMaxHp = this.stats.hp || 0;
        this.stats.hp = Math.floor(((2 * bs.hp + 31) * this.level) / 100) + this.level + 10;

        // Outros stats: ((2 * Base + 31) * Level / 100) + 5
        this.stats.atk = Math.floor(((2 * bs.atk + 31) * this.level) / 100) + 5;
        this.stats.def = Math.floor(((2 * bs.def + 31) * this.level) / 100) + 5;
        this.stats.spAtk = Math.floor(((2 * bs.spAtk + 31) * this.level) / 100) + 5;
        this.stats.spDef = Math.floor(((2 * bs.spDef + 31) * this.level) / 100) + 5;
        this.stats.spd = Math.floor(((2 * bs.spd + 31) * this.level) / 100) + 5;

        // Se HP máximo aumentou, adiciona a diferença ao HP atual
        if (oldMaxHp > 0) {
            const diff = this.stats.hp - oldMaxHp;
            this.currentHp = Math.min(this.stats.hp, this.currentHp + Math.max(0, diff));
        }
    }

    // Cria instância de golpe com PP atual e máximo
    createMoveInstance(moveKey) {
        const moveData = MOVES_DATA[moveKey] || MOVES_DATA['tackle'];
        return {
            id: moveData.id,
            name: moveData.name,
            type: moveData.type,
            category: moveData.category,
            power: moveData.power,
            accuracy: moveData.accuracy,
            pp: moveData.pp,
            maxPp: moveData.pp,
            priority: moveData.priority || 0,
            description: moveData.description,
            effect: moveData.effect || null,
            drain: moveData.drain || 0,
            recoil: moveData.recoil || 0,
            critRate: moveData.critRate || 1
        };
    }

    // Inicializa golpes padrão da espécie
    initDefaultMoves(species) {
        const available = species.defaultMoves || ['tackle'];
        // Pega até 4 golpes disponíveis
        this.moves = available.slice(0, 4).map(mKey => this.createMoveInstance(mKey));
    }

    // URLs de Sprites com fallback
    getSpriteFront() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${this.id}.gif`;
    }

    getSpriteFrontStatic() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
    }

    getSpriteBack() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${this.id}.gif`;
    }

    getSpriteBackStatic() {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${this.id}.png`;
    }

    // Ganho de Experiência e Verificação de Level Up
    gainExp(amount) {
        const result = {
            gained: amount,
            leveledUp: false,
            levelsGained: 0,
            canEvolve: false,
            evolutionTarget: null,
            oldStats: { ...this.stats },
            newStats: null
        };

        this.exp += amount;

        while (this.exp >= this.expToNext && this.level < 100) {
            this.level++;
            result.leveledUp = true;
            result.levelsGained++;
            this.expToNext = this.getExpForLevel(this.level + 1);
        }

        if (result.leveledUp) {
            this.recalculateStats();
            result.newStats = { ...this.stats };

            // Verifica se atingiu nível de evolução
            if (this.evolution && this.level >= this.evolution.level) {
                result.canEvolve = true;
                result.evolutionTarget = this.evolution.to;
            }
        }

        return result;
    }

    // Uso de Rare Candy para subir 1 nível instantaneamente
    useRareCandy() {
        if (this.level >= 100) {
            return { success: false, reason: 'max_level' };
        }

        const oldStats = { ...this.stats };
        this.level++;
        this.exp = this.getExpForLevel(this.level);
        this.expToNext = this.getExpForLevel(this.level + 1);
        this.recalculateStats();

        const hpBonus = this.stats.hp - oldStats.hp;
        if (this.currentHp > 0) {
            this.currentHp = Math.min(this.stats.hp, this.currentHp + hpBonus);
        }

        let canEvolve = false;
        let evolutionTarget = null;
        if (this.evolution && this.level >= this.evolution.level) {
            canEvolve = true;
            evolutionTarget = this.evolution.to;
        }

        return {
            success: true,
            newLevel: this.level,
            canEvolve,
            evolutionTarget,
            oldStats,
            newStats: { ...this.stats }
        };
    }

    // Evoluir Pokémon
    evolve() {
        if (!this.evolution || !this.evolution.to) return false;
        const newSpeciesKey = this.evolution.to;
        const newSpecies = POKEMON_SPECIES[newSpeciesKey];
        if (!newSpecies) return false;

        const oldName = this.name;
        this.speciesKey = newSpeciesKey;
        this.id = newSpecies.id;
        this.name = newSpecies.name;
        this.types = [...newSpecies.types];
        this.baseExp = newSpecies.baseExp;
        this.evolution = newSpecies.evolution ? { ...newSpecies.evolution } : null;

        // Recalcular stats com nova base
        this.recalculateStats();
        // Cura total na evolução como celebração clássica
        this.currentHp = this.stats.hp;

        return {
            oldName,
            newName: this.name,
            newId: this.id
        };
    }

    // Aprender um novo golpe
    learnMove(moveKey, replaceIndex = -1) {
        const newMove = this.createMoveInstance(moveKey);
        // Se já possui esse golpe, ignora
        if (this.moves.some(m => m.id === newMove.id)) {
            return { success: false, reason: 'already_known' };
        }

        if (this.moves.length < 4) {
            this.moves.push(newMove);
            return { success: true, replaced: null, move: newMove };
        } else if (replaceIndex >= 0 && replaceIndex < 4) {
            const replaced = this.moves[replaceIndex];
            this.moves[replaceIndex] = newMove;
            return { success: true, replaced, move: newMove };
        } else {
            return { success: false, reason: 'full' };
        }
    }

    // Cura completa (usado em descanso / enfermaria)
    fullHeal() {
        this.currentHp = this.stats.hp;
        this.status = null;
        this.statStages = { atk: 0, def: 0, spAtk: 0, spDef: 0, spd: 0 };
        this.moves.forEach(m => m.pp = m.maxPp);
    }

    // Clonar para salvar ou transferir
    toSerializable() {
        return {
            speciesKey: this.speciesKey,
            level: this.level,
            exp: this.exp,
            currentHp: this.currentHp,
            status: this.status,
            moves: this.moves.map(m => ({
                id: m.id,
                pp: m.pp
            }))
        };
    }

    static fromSerializable(data) {
        const pkmn = new PokemonInstance(data.speciesKey, data.level);
        pkmn.exp = data.exp;
        pkmn.expToNext = pkmn.getExpForLevel(pkmn.level + 1);
        pkmn.recalculateStats();
        pkmn.currentHp = Math.min(pkmn.stats.hp, data.currentHp);
        pkmn.status = data.status || null;

        if (data.moves && Array.isArray(data.moves)) {
            pkmn.moves = data.moves.map(mObj => {
                const inst = pkmn.createMoveInstance(mObj.id);
                if (mObj.pp !== undefined) inst.pp = mObj.pp;
                return inst;
            });
        }
        return pkmn;
    }
}

// Classe de Regras de Combate e Cálculos de Batalha
class BattleEngine {
    // Calcula o dano de um golpe
    static calculateDamage(attacker, defender, move) {
        if (move.category === 'status') {
            return { damage: 0, isCrit: false, effectiveness: 1, isHit: true };
        }

        // Teste de Precisão
        const accuracyRoll = Math.random() * 100;
        if (accuracyRoll > move.accuracy) {
            return { damage: 0, isCrit: false, effectiveness: 1, isHit: false };
        }

        // Multiplicador de tipo
        const effectiveness = getTypeEffectiveness(move.type, defender.types);
        if (effectiveness === 0) {
            return { damage: 0, isCrit: false, effectiveness: 0, isHit: true };
        }

        // Ataque e Defesa baseados na categoria (Físico vs Especial)
        let attackStat = move.category === 'physical' ? attacker.stats.atk : attacker.stats.spAtk;
        let defenseStat = move.category === 'physical' ? defender.stats.def : defender.stats.spDef;

        // Modificadores de status
        if (attacker.status === 'burn' && move.category === 'physical') {
            attackStat = Math.floor(attackStat * 0.5);
        }

        // Crítico (1/16 padrão, ou 1/8 para golpes com alto critRate)
        const critChance = move.critRate && move.critRate > 1 ? 0.125 : 0.0625;
        const isCrit = Math.random() < critChance;
        const critMultiplier = isCrit ? 1.5 : 1.0;

        // STAB (Same Type Attack Bonus)
        const stab = attacker.types.includes(move.type) ? 1.5 : 1.0;

        // Fórmula Pokémon Gen 3+
        // Dano = (((2 * Nível / 5 + 2) * Poder * Atk / Def) / 50 + 2) * STAB * Efetividade * Crítico * Rnd(0.85-1.0)
        const levelFactor = Math.floor((2 * attacker.level) / 5) + 2;
        let baseDamage = Math.floor((levelFactor * move.power * (attackStat / Math.max(1, defenseStat))) / 50) + 2;

        const randomFactor = 0.85 + Math.random() * 0.15;
        let totalDamage = Math.floor(baseDamage * stab * effectiveness * critMultiplier * randomFactor);
        totalDamage = Math.max(1, totalDamage);

        return {
            damage: totalDamage,
            isCrit,
            effectiveness,
            isHit: true
        };
    }

    // Calcula XP concedido ao derrotar um Pokémon (balanceado para progressão agradável)
    static calculateExpYield(defeatedPokemon) {
        // Exp = (BaseExp * Level) / 5
        const yieldAmount = Math.floor((defeatedPokemon.baseExp * defeatedPokemon.level) / 5);
        return Math.max(15, yieldAmount);
    }

    // Gera um Pokémon selvagem escalado para o estágio / batalha atual de forma suave
    static generateWildPokemon(stage) {
        // Escala suave: cerca de 0.8 níveis por estágio (em vez de 1.6)
        // Estágio 1: Nível 2 a 3 (ideal contra o inicial Lv.5)
        // Estágio 2: Nível 3 a 4
        // Estágio 5: Nível 5 a 7
        // Estágio 10: Nível 9 a 11
        // Estágio 20: Nível 17 a 20
        const baseLevel = Math.max(2, Math.floor(1.4 + stage * 0.8));
        const variance = Math.floor(Math.random() * 3) - 1; // -1, 0 ou +1
        const level = Math.max(2, baseLevel + variance);

        // Determinar o tier apropriado com transição mais suave
        let targetTier = 1;
        if (stage >= 30 && stage % 5 === 0) {
            // Chefes / Lendários apenas nos estágios avançados a cada 5 estágios
            targetTier = 4;
        } else if (stage >= 18) {
            targetTier = Math.random() < 0.4 ? 3 : 2;
        } else if (stage >= 8) {
            targetTier = Math.random() < 0.35 ? 2 : 1;
        } else {
            targetTier = 1;
        }

        // Filtrar espécies pelo tier
        const candidates = Object.keys(POKEMON_SPECIES).filter(key => {
            return POKEMON_SPECIES[key].tier === targetTier;
        });

        const chosenKey = candidates[Math.floor(Math.random() * candidates.length)] || 'rattata';
        const wildPokemon = new PokemonInstance(chosenKey, level);

        // Se o Pokémon selvagem tiver nível alto, garante que ele tenha golpes mais fortes
        if (level >= 25) {
            wildPokemon.recalculateMovesForWild(level);
        }

        return wildPokemon;
    }
}

// Extensão para sortear golpes compatíveis em níveis mais altos
PokemonInstance.prototype.recalculateMovesForWild = function(level) {
    const species = POKEMON_SPECIES[this.speciesKey];
    // Se a espécie tem golpes padrão, adiciona golpes extras adequados ao tipo
    const typeMoves = Object.values(MOVES_DATA).filter(m => {
        return this.types.includes(m.type) && m.power > 0;
    });

    if (typeMoves.length > 0) {
        // Ordena por poder aproximado compatível com o nível
        const sorted = typeMoves.sort((a, b) => a.power - b.power);
        const selectedMove = sorted[Math.min(sorted.length - 1, Math.floor((level / 40) * sorted.length))];
        if (selectedMove && !this.moves.some(m => m.id === selectedMove.id)) {
            if (this.moves.length < 4) {
                this.moves.push(this.createMoveInstance(selectedMove.id));
            } else {
                this.moves[0] = this.createMoveInstance(selectedMove.id);
            }
        }
    }
};

