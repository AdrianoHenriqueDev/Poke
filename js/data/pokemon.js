// Banco de Dados de Pokémons
// Contém espécies, stats base, tipos, cadeia evolutiva e movesets
const POKEMON_SPECIES = {
    // --- LINHA BULBASAUR ---
    bulbasaur: {
        id: 1, name: 'Bulbasaur', types: ['grass', 'poison'], tier: 1,
        baseStats: { hp: 45, atk: 49, def: 49, spAtk: 65, spDef: 65, spd: 45 },
        baseExp: 64,
        evolution: { level: 16, to: 'ivysaur' },
        defaultMoves: ['tackle', 'vine_whip']
    },
    ivysaur: {
        id: 2, name: 'Ivysaur', types: ['grass', 'poison'], tier: 2,
        baseStats: { hp: 60, atk: 62, def: 63, spAtk: 80, spDef: 80, spd: 60 },
        baseExp: 142,
        evolution: { level: 32, to: 'venusaur' },
        defaultMoves: ['vine_whip', 'razor_leaf', 'poison_sting', 'mega_drain']
    },
    venusaur: {
        id: 3, name: 'Venusaur', types: ['grass', 'poison'], tier: 3,
        baseStats: { hp: 80, atk: 82, def: 83, spAtk: 100, spDef: 100, spd: 80 },
        baseExp: 236,
        evolution: null,
        defaultMoves: ['razor_leaf', 'solar_beam', 'sludge_bomb', 'giga_drain']
    },

    // --- LINHA CHARMANDER ---
    charmander: {
        id: 4, name: 'Charmander', types: ['fire'], tier: 1,
        baseStats: { hp: 39, atk: 52, def: 43, spAtk: 60, spDef: 50, spd: 65 },
        baseExp: 62,
        evolution: { level: 16, to: 'charmeleon' },
        defaultMoves: ['scratch', 'ember']
    },
    charmeleon: {
        id: 5, name: 'Charmeleon', types: ['fire'], tier: 2,
        baseStats: { hp: 58, atk: 64, def: 58, spAtk: 80, spDef: 65, spd: 80 },
        baseExp: 142,
        evolution: { level: 36, to: 'charizard' },
        defaultMoves: ['ember', 'flame_wheel', 'slash', 'dragon_breath']
    },
    charizard: {
        id: 6, name: 'Charizard', types: ['fire', 'flying'], tier: 3,
        baseStats: { hp: 78, atk: 84, def: 78, spAtk: 109, spDef: 85, spd: 100 },
        baseExp: 240,
        evolution: null,
        defaultMoves: ['flamethrower', 'air_slash', 'dragon_claw', 'fire_blast']
    },

    // --- LINHA SQUIRTLE ---
    squirtle: {
        id: 7, name: 'Squirtle', types: ['water'], tier: 1,
        baseStats: { hp: 44, atk: 48, def: 65, spAtk: 50, spDef: 64, spd: 43 },
        baseExp: 63,
        evolution: { level: 16, to: 'wartortle' },
        defaultMoves: ['tackle', 'water_gun']
    },
    wartortle: {
        id: 8, name: 'Wartortle', types: ['water'], tier: 2,
        baseStats: { hp: 59, atk: 63, def: 80, spAtk: 65, spDef: 80, spd: 58 },
        baseExp: 142,
        evolution: { level: 36, to: 'blastoise' },
        defaultMoves: ['water_gun', 'water_pulse', 'bite', 'body_slam']
    },
    blastoise: {
        id: 9, name: 'Blastoise', types: ['water'], tier: 3,
        baseStats: { hp: 79, atk: 83, def: 100, spAtk: 85, spDef: 105, spd: 78 },
        baseExp: 239,
        evolution: null,
        defaultMoves: ['surf', 'hydro_pump', 'ice_beam', 'flash_cannon']
    },

    // --- LINHA CATERPIE ---
    caterpie: {
        id: 10, name: 'Caterpie', types: ['bug'], tier: 1,
        baseStats: { hp: 45, atk: 30, def: 35, spAtk: 20, spDef: 20, spd: 45 },
        baseExp: 39,
        evolution: { level: 7, to: 'metapod' },
        defaultMoves: ['tackle', 'bug_bite']
    },
    metapod: {
        id: 11, name: 'Metapod', types: ['bug'], tier: 1,
        baseStats: { hp: 50, atk: 25, def: 55, spAtk: 25, spDef: 25, spd: 30 },
        baseExp: 72,
        evolution: { level: 10, to: 'butterfree' },
        defaultMoves: ['tackle', 'bug_bite']
    },
    butterfree: {
        id: 12, name: 'Butterfree', types: ['bug', 'flying'], tier: 2,
        baseStats: { hp: 60, atk: 45, def: 50, spAtk: 90, spDef: 80, spd: 70 },
        baseExp: 178,
        evolution: null,
        defaultMoves: ['confusion', 'gust', 'air_slash', 'bug_buzz']
    },

    // --- LINHA PIDGEY ---
    pidgey: {
        id: 16, name: 'Pidgey', types: ['normal', 'flying'], tier: 1,
        baseStats: { hp: 40, atk: 45, def: 40, spAtk: 35, spDef: 35, spd: 56 },
        baseExp: 50,
        evolution: { level: 18, to: 'pidgeotto' },
        defaultMoves: ['tackle', 'gust', 'quick_attack']
    },
    pidgeotto: {
        id: 17, name: 'Pidgeotto', types: ['normal', 'flying'], tier: 2,
        baseStats: { hp: 63, atk: 60, def: 55, spAtk: 50, spDef: 50, spd: 71 },
        baseExp: 122,
        evolution: { level: 36, to: 'pidgeot' },
        defaultMoves: ['quick_attack', 'gust', 'wing_attack', 'slash']
    },
    pidgeot: {
        id: 18, name: 'Pidgeot', types: ['normal', 'flying'], tier: 3,
        baseStats: { hp: 83, atk: 80, def: 75, spAtk: 70, spDef: 70, spd: 101 },
        baseExp: 216,
        evolution: null,
        defaultMoves: ['wing_attack', 'air_slash', 'brave_bird', 'slash']
    },

    // --- LINHA RATTATA ---
    rattata: {
        id: 19, name: 'Rattata', types: ['normal'], tier: 1,
        baseStats: { hp: 30, atk: 56, def: 35, spAtk: 25, spDef: 35, spd: 72 },
        baseExp: 51,
        evolution: { level: 20, to: 'raticate' },
        defaultMoves: ['tackle', 'quick_attack', 'bite']
    },
    raticate: {
        id: 20, name: 'Raticate', types: ['normal'], tier: 2,
        baseStats: { hp: 55, atk: 81, def: 60, spAtk: 50, spDef: 70, spd: 97 },
        baseExp: 145,
        evolution: null,
        defaultMoves: ['quick_attack', 'crunch', 'body_slam', 'swords_dance']
    },

    // --- LINHA PIKACHU ---
    pikachu: {
        id: 25, name: 'Pikachu', types: ['electric'], tier: 1,
        baseStats: { hp: 35, atk: 55, def: 40, spAtk: 50, spDef: 50, spd: 90 },
        baseExp: 112,
        evolution: { level: 26, to: 'raichu' },
        defaultMoves: ['thunder_shock', 'quick_attack', 'spark']
    },
    raichu: {
        id: 26, name: 'Raichu', types: ['electric'], tier: 3,
        baseStats: { hp: 60, atk: 90, def: 55, spAtk: 90, spDef: 80, spd: 110 },
        baseExp: 218,
        evolution: null,
        defaultMoves: ['thunderbolt', 'thunder_punch', 'quick_attack', 'thunder']
    },

    // --- LINHA ABRA ---
    abra: {
        id: 63, name: 'Abra', types: ['psychic'], tier: 1,
        baseStats: { hp: 25, atk: 20, def: 15, spAtk: 105, spDef: 55, spd: 90 },
        baseExp: 62,
        evolution: { level: 16, to: 'kadabra' },
        defaultMoves: ['confusion', 'psybeam']
    },
    kadabra: {
        id: 64, name: 'Kadabra', types: ['psychic'], tier: 2,
        baseStats: { hp: 40, atk: 35, def: 30, spAtk: 120, spDef: 70, spd: 105 },
        baseExp: 140,
        evolution: { level: 36, to: 'alakazam' },
        defaultMoves: ['confusion', 'psybeam', 'recover', 'shadow_ball']
    },
    alakazam: {
        id: 65, name: 'Alakazam', types: ['psychic'], tier: 3,
        baseStats: { hp: 55, atk: 50, def: 45, spAtk: 135, spDef: 95, spd: 120 },
        baseExp: 250,
        evolution: null,
        defaultMoves: ['psychic', 'shadow_ball', 'dazzling_gleam', 'recover']
    },

    // --- LINHA MACHOP ---
    machop: {
        id: 66, name: 'Machop', types: ['fighting'], tier: 1,
        baseStats: { hp: 70, atk: 80, def: 50, spAtk: 35, spDef: 35, spd: 35 },
        baseExp: 61,
        evolution: { level: 28, to: 'machoke' },
        defaultMoves: ['karate_chop', 'tackle', 'rock_throw']
    },
    machoke: {
        id: 67, name: 'Machoke', types: ['fighting'], tier: 2,
        baseStats: { hp: 80, atk: 100, def: 70, spAtk: 50, spDef: 60, spd: 45 },
        baseExp: 142,
        evolution: { level: 40, to: 'machamp' },
        defaultMoves: ['karate_chop', 'brick_break', 'fire_punch', 'rock_slide']
    },
    machamp: {
        id: 68, name: 'Machamp', types: ['fighting'], tier: 3,
        baseStats: { hp: 90, atk: 130, def: 80, spAtk: 65, spDef: 85, spd: 55 },
        baseExp: 253,
        evolution: null,
        defaultMoves: ['close_combat', 'cross_chop', 'thunder_punch', 'stone_edge']
    },

    // --- LINHA GEODUDE ---
    geodude: {
        id: 74, name: 'Geodude', types: ['rock', 'ground'], tier: 1,
        baseStats: { hp: 40, atk: 80, def: 100, spAtk: 30, spDef: 30, spd: 20 },
        baseExp: 60,
        evolution: { level: 25, to: 'graveler' },
        defaultMoves: ['tackle', 'rock_throw', 'mud_slap']
    },
    graveler: {
        id: 75, name: 'Graveler', types: ['rock', 'ground'], tier: 2,
        baseStats: { hp: 55, atk: 95, def: 115, spAtk: 45, spDef: 45, spd: 35 },
        baseExp: 137,
        evolution: { level: 38, to: 'golem' },
        defaultMoves: ['rock_throw', 'rock_slide', 'dig', 'brick_break']
    },
    golem: {
        id: 76, name: 'Golem', types: ['rock', 'ground'], tier: 3,
        baseStats: { hp: 80, atk: 120, def: 130, spAtk: 55, spDef: 65, spd: 45 },
        baseExp: 223,
        evolution: null,
        defaultMoves: ['stone_edge', 'earthquake', 'rock_slide', 'body_slam']
    },

    // --- LINHA GASTLY ---
    gastly: {
        id: 92, name: 'Gastly', types: ['ghost', 'poison'], tier: 1,
        baseStats: { hp: 30, atk: 35, def: 30, spAtk: 100, spDef: 35, spd: 80 },
        baseExp: 62,
        evolution: { level: 25, to: 'haunter' },
        defaultMoves: ['lick', 'confusion', 'sludge_bomb']
    },
    haunter: {
        id: 93, name: 'Haunter', types: ['ghost', 'poison'], tier: 2,
        baseStats: { hp: 45, atk: 50, def: 45, spAtk: 115, spDef: 55, spd: 95 },
        baseExp: 142,
        evolution: { level: 38, to: 'gengar' },
        defaultMoves: ['shadow_ball', 'sludge_bomb', 'psybeam', 'dark_pulse']
    },
    gengar: {
        id: 94, name: 'Gengar', types: ['ghost', 'poison'], tier: 3,
        baseStats: { hp: 60, atk: 65, def: 60, spAtk: 130, spDef: 75, spd: 110 },
        baseExp: 250,
        evolution: null,
        defaultMoves: ['shadow_ball', 'sludge_bomb', 'dark_pulse', 'dazzling_gleam']
    },

    // --- LINHA MAGIKARP / GYARADOS ---
    magikarp: {
        id: 129, name: 'Magikarp', types: ['water'], tier: 1,
        baseStats: { hp: 20, atk: 10, def: 55, spAtk: 15, spDef: 20, spd: 80 },
        baseExp: 40,
        evolution: { level: 20, to: 'gyarados' },
        defaultMoves: ['tackle']
    },
    gyarados: {
        id: 130, name: 'Gyarados', types: ['water', 'flying'], tier: 3,
        baseStats: { hp: 95, atk: 125, def: 79, spAtk: 60, spDef: 100, spd: 81 },
        baseExp: 189,
        evolution: null,
        defaultMoves: ['waterfall', 'crunch', 'dragon_claw', 'hydro_pump']
    },

    // --- LINHA EEVEE ---
    eevee: {
        id: 133, name: 'Eevee', types: ['normal'], tier: 1,
        baseStats: { hp: 55, atk: 55, def: 50, spAtk: 45, spDef: 65, spd: 55 },
        baseExp: 65,
        evolution: { level: 25, to: 'vaporeon' }, // pode evoluir no nível 25
        defaultMoves: ['tackle', 'quick_attack', 'bite']
    },
    vaporeon: {
        id: 134, name: 'Vaporeon', types: ['water'], tier: 3,
        baseStats: { hp: 130, atk: 65, def: 60, spAtk: 110, spDef: 95, spd: 65 },
        baseExp: 184,
        evolution: null,
        defaultMoves: ['surf', 'ice_beam', 'hydro_pump', 'quick_attack']
    },
    jolteon: {
        id: 135, name: 'Jolteon', types: ['electric'], tier: 3,
        baseStats: { hp: 65, atk: 65, def: 60, spAtk: 110, spDef: 95, spd: 130 },
        baseExp: 184,
        evolution: null,
        defaultMoves: ['thunderbolt', 'quick_attack', 'thunder', 'shadow_ball']
    },
    flareon: {
        id: 136, name: 'Flareon', types: ['fire'], tier: 3,
        baseStats: { hp: 65, atk: 130, def: 60, spAtk: 95, spDef: 110, spd: 65 },
        baseExp: 184,
        evolution: null,
        defaultMoves: ['flamethrower', 'fire_blast', 'bite', 'quick_attack']
    },

    // --- LINHA SNORLAX ---
    snorlax: {
        id: 143, name: 'Snorlax', types: ['normal'], tier: 3,
        baseStats: { hp: 160, atk: 110, def: 65, spAtk: 65, spDef: 110, spd: 30 },
        baseExp: 189,
        evolution: null,
        defaultMoves: ['body_slam', 'crunch', 'earthquake', 'hyper_beam']
    },

    // --- LINHA DRATINI ---
    dratini: {
        id: 147, name: 'Dratini', types: ['dragon'], tier: 1,
        baseStats: { hp: 41, atk: 64, def: 45, spAtk: 50, spDef: 50, spd: 50 },
        baseExp: 60,
        evolution: { level: 30, to: 'dragonair' },
        defaultMoves: ['dragon_breath', 'tackle', 'water_pulse']
    },
    dragonair: {
        id: 148, name: 'Dragonair', types: ['dragon'], tier: 2,
        baseStats: { hp: 61, atk: 84, def: 65, spAtk: 70, spDef: 70, spd: 70 },
        baseExp: 147,
        evolution: { level: 55, to: 'dragonite' },
        defaultMoves: ['dragon_breath', 'surf', 'thunderbolt', 'dragon_claw']
    },
    dragonite: {
        id: 149, name: 'Dragonite', types: ['dragon', 'flying'], tier: 3,
        baseStats: { hp: 91, atk: 134, def: 95, spAtk: 100, spDef: 100, spd: 80 },
        baseExp: 270,
        evolution: null,
        defaultMoves: ['outrage', 'wing_attack', 'earthquake', 'fire_punch']
    },

    // --- OUTROS POPULARES ---
    lapras: {
        id: 131, name: 'Lapras', types: ['water', 'ice'], tier: 3,
        baseStats: { hp: 130, atk: 85, def: 80, spAtk: 85, spDef: 95, spd: 60 },
        baseExp: 187,
        evolution: null,
        defaultMoves: ['surf', 'ice_beam', 'body_slam', 'hydro_pump']
    },
    onix: {
        id: 95, name: 'Onix', types: ['rock', 'ground'], tier: 2,
        baseStats: { hp: 35, atk: 45, def: 160, spAtk: 30, spDef: 45, spd: 70 },
        baseExp: 77,
        evolution: { level: 35, to: 'steelix' },
        defaultMoves: ['rock_throw', 'dig', 'iron_head', 'earthquake']
    },
    steelix: {
        id: 208, name: 'Steelix', types: ['steel', 'ground'], tier: 3,
        baseStats: { hp: 75, atk: 85, def: 200, spAtk: 55, spDef: 65, spd: 30 },
        baseExp: 179,
        evolution: null,
        defaultMoves: ['iron_head', 'earthquake', 'stone_edge', 'crunch']
    },
    scyther: {
        id: 123, name: 'Scyther', types: ['bug', 'flying'], tier: 2,
        baseStats: { hp: 70, atk: 110, def: 80, spAtk: 55, spDef: 80, spd: 105 },
        baseExp: 100,
        evolution: { level: 35, to: 'scizor' },
        defaultMoves: ['wing_attack', 'x_scissor', 'slash', 'quick_attack']
    },
    scizor: {
        id: 212, name: 'Scizor', types: ['bug', 'steel'], tier: 3,
        baseStats: { hp: 70, atk: 130, def: 100, spAtk: 55, spDef: 80, spd: 65 },
        baseExp: 175,
        evolution: null,
        defaultMoves: ['metal_claw', 'iron_head', 'x_scissor', 'swords_dance']
    },
    lucario: {
        id: 448, name: 'Lucario', types: ['fighting', 'steel'], tier: 3,
        baseStats: { hp: 70, atk: 110, def: 70, spAtk: 115, spDef: 70, spd: 90 },
        baseExp: 184,
        evolution: null,
        defaultMoves: ['aura_sphere', 'close_combat', 'flash_cannon', 'dragon_pulse']
    },
    garchomp: {
        id: 445, name: 'Garchomp', types: ['dragon', 'ground'], tier: 3,
        baseStats: { hp: 108, atk: 130, def: 95, spAtk: 80, spDef: 85, spd: 102 },
        baseExp: 270,
        evolution: null,
        defaultMoves: ['earthquake', 'dragon_claw', 'stone_edge', 'crunch']
    },

    // --- LENDÁRIOS / CHEFES ---
    articuno: {
        id: 144, name: 'Articuno', types: ['ice', 'flying'], tier: 4,
        baseStats: { hp: 90, atk: 85, def: 100, spAtk: 95, spDef: 125, spd: 85 },
        baseExp: 261,
        evolution: null,
        defaultMoves: ['ice_beam', 'blizzard', 'air_slash', 'brave_bird']
    },
    zapdos: {
        id: 145, name: 'Zapdos', types: ['electric', 'flying'], tier: 4,
        baseStats: { hp: 90, atk: 90, def: 85, spAtk: 125, spDef: 90, spd: 100 },
        baseExp: 261,
        evolution: null,
        defaultMoves: ['thunderbolt', 'thunder', 'air_slash', 'brave_bird']
    },
    moltres: {
        id: 146, name: 'Moltres', types: ['fire', 'flying'], tier: 4,
        baseStats: { hp: 90, atk: 100, def: 90, spAtk: 125, spDef: 85, spd: 90 },
        baseExp: 261,
        evolution: null,
        defaultMoves: ['flamethrower', 'fire_blast', 'air_slash', 'solar_beam']
    },
    mewtwo: {
        id: 150, name: 'Mewtwo', types: ['psychic'], tier: 4,
        baseStats: { hp: 106, atk: 110, def: 90, spAtk: 154, spDef: 90, spd: 130 },
        baseExp: 306,
        evolution: null,
        defaultMoves: ['psychic', 'shadow_ball', 'aura_sphere', 'recover']
    },
    rayquaza: {
        id: 384, name: 'Rayquaza', types: ['dragon', 'flying'], tier: 4,
        baseStats: { hp: 105, atk: 150, def: 90, spAtk: 150, spDef: 90, spd: 95 },
        baseExp: 340,
        evolution: null,
        defaultMoves: ['outrage', 'air_slash', 'earthquake', 'hyper_beam']
    }
};

// Lista de iniciais disponíveis para escolha no início do jogo
const STARTER_POKEMON_KEYS = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'eevee'];

