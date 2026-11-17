// Banco de Dados de Golpes (Moves)
const MOVES_DATA = {
    // Normal
    tackle: {
        id: 'tackle', name: 'Investida', type: 'normal', category: 'physical',
        power: 40, accuracy: 100, pp: 35, description: 'Um ataque físico com todo o corpo.'
    },
    scratch: {
        id: 'scratch', name: 'Arranhão', type: 'normal', category: 'physical',
        power: 40, accuracy: 100, pp: 35, description: 'Arranha o oponente com garras afiadas.'
    },
    quick_attack: {
        id: 'quick_attack', name: 'Ataque Rápido', type: 'normal', category: 'physical',
        power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Ataca em velocidade extrema, sempre atacando primeiro.'
    },
    slash: {
        id: 'slash', name: 'Talho', type: 'normal', category: 'physical',
        power: 70, accuracy: 100, pp: 20, critRate: 2, description: 'Corta com lâminas ou garras. Alta taxa de acerto crítico.'
    },
    body_slam: {
        id: 'body_slam', name: 'Golpe Corporal', type: 'normal', category: 'physical',
        power: 85, accuracy: 100, pp: 15, effect: { type: 'paralyze', chance: 0.3 }, description: 'Um golpe pesado que pode paralisar o adversário.'
    },
    hyper_beam: {
        id: 'hyper_beam', name: 'Hiper Raio', type: 'normal', category: 'special',
        power: 150, accuracy: 90, pp: 5, description: 'Um raio devastador de pura energia concentrada.'
    },
    swords_dance: {
        id: 'swords_dance', name: 'Dança das Espadas', type: 'normal', category: 'status',
        power: 0, accuracy: 100, pp: 20, effect: { type: 'buff_atk', stages: 2 }, description: 'Uma dança frenética que aumenta muito o Ataque.'
    },
    recover: {
        id: 'recover', name: 'Recuperação', type: 'normal', category: 'status',
        power: 0, accuracy: 100, pp: 10, effect: { type: 'heal', percent: 0.5 }, description: 'Restaura até metade do HP máximo.'
    },

    // Fogo
    ember: {
        id: 'ember', name: 'Brasas', type: 'fire', category: 'special',
        power: 40, accuracy: 100, pp: 25, effect: { type: 'burn', chance: 0.1 }, description: 'Dispara pequenas brasas ardentes que podem queimar.'
    },
    flame_wheel: {
        id: 'flame_wheel', name: 'Roda de Fogo', type: 'fire', category: 'physical',
        power: 60, accuracy: 100, pp: 25, effect: { type: 'burn', chance: 0.1 }, description: 'Investe envolto em chamas contra o inimigo.'
    },
    flamethrower: {
        id: 'flamethrower', name: 'Lança-Chamas', type: 'fire', category: 'special',
        power: 90, accuracy: 100, pp: 15, effect: { type: 'burn', chance: 0.15 }, description: 'Um jato intenso de fogo que pode queimar.'
    },
    fire_punch: {
        id: 'fire_punch', name: 'Soco de Fogo', type: 'fire', category: 'physical',
        power: 75, accuracy: 100, pp: 15, effect: { type: 'burn', chance: 0.1 }, description: 'Um soco incandescente que pode causar queimadura.'
    },
    fire_blast: {
        id: 'fire_blast', name: 'Explosão de Fogo', type: 'fire', category: 'special',
        power: 110, accuracy: 85, pp: 5, effect: { type: 'burn', chance: 0.3 }, description: 'Uma imensa estrela de fogo que causa destruição maciça.'
    },

    // Água
    water_gun: {
        id: 'water_gun', name: 'Jato de Água', type: 'water', category: 'special',
        power: 40, accuracy: 100, pp: 25, description: 'Dispara um jato forte de água contra o alvo.'
    },
    water_pulse: {
        id: 'water_pulse', name: 'Pulso de Água', type: 'water', category: 'special',
        power: 60, accuracy: 100, pp: 20, description: 'Ondas ultra-sônicas de água que atingem o alvo.'
    },
    surf: {
        id: 'surf', name: 'Surfe', type: 'water', category: 'special',
        power: 90, accuracy: 100, pp: 15, description: 'Uma onda gigantesca que engole o oponente.'
    },
    waterfall: {
        id: 'waterfall', name: 'Cascata', type: 'water', category: 'physical',
        power: 80, accuracy: 100, pp: 15, description: 'Investida rápida como a força de uma cachoeira.'
    },
    hydro_pump: {
        id: 'hydro_pump', name: 'Hidro Bomba', type: 'water', category: 'special',
        power: 110, accuracy: 80, pp: 5, description: 'Um canhão violento de água sob altíssima pressão.'
    },

    // Grama
    vine_whip: {
        id: 'vine_whip', name: 'Chicote de Vinha', type: 'grass', category: 'physical',
        power: 45, accuracy: 100, pp: 25, description: 'Chicoteia o oponente com cipós fortes e flexíveis.'
    },
    razor_leaf: {
        id: 'razor_leaf', name: 'Folha Navalha', type: 'grass', category: 'physical',
        power: 55, accuracy: 95, pp: 25, critRate: 2, description: 'Lança folhas afiadas. Alta chance de acerto crítico.'
    },
    mega_drain: {
        id: 'mega_drain', name: 'Mega Dreno', type: 'grass', category: 'special',
        power: 40, accuracy: 100, pp: 15, drain: 0.5, description: 'Drena a energia do alvo, recuperando metade do dano.'
    },
    giga_drain: {
        id: 'giga_drain', name: 'Giga Dreno', type: 'grass', category: 'special',
        power: 75, accuracy: 100, pp: 10, drain: 0.5, description: 'Um poderoso dreno que recupera 50% do dano causado.'
    },
    solar_beam: {
        id: 'solar_beam', name: 'Raio Solar', type: 'grass', category: 'special',
        power: 120, accuracy: 100, pp: 10, description: 'Dispara um feixe concentrado de luz e energia vegetal.'
    },

    // Elétrico
    thunder_shock: {
        id: 'thunder_shock', name: 'Choque do Trovão', type: 'electric', category: 'special',
        power: 40, accuracy: 100, pp: 30, effect: { type: 'paralyze', chance: 0.1 }, description: 'Uma descarga elétrica fraca que pode paralisar.'
    },
    spark: {
        id: 'spark', name: 'Faísca', type: 'electric', category: 'physical',
        power: 65, accuracy: 100, pp: 20, effect: { type: 'paralyze', chance: 0.3 }, description: 'Uma investida carregada de eletricidade.'
    },
    thunderbolt: {
        id: 'thunderbolt', name: 'Relâmpago', type: 'electric', category: 'special',
        power: 90, accuracy: 100, pp: 15, effect: { type: 'paralyze', chance: 0.15 }, description: 'Um poderoso raio elétrico que pode paralisar.'
    },
    thunder_punch: {
        id: 'thunder_punch', name: 'Soco do Trovão', type: 'electric', category: 'physical',
        power: 75, accuracy: 100, pp: 15, effect: { type: 'paralyze', chance: 0.1 }, description: 'Um soco elétrico crepitante.'
    },
    thunder: {
        id: 'thunder', name: 'Trovão', type: 'electric', category: 'special',
        power: 110, accuracy: 70, pp: 10, effect: { type: 'paralyze', chance: 0.3 }, description: 'Um estrondo elétrico que desce dos céus com força total.'
    },

    // Gelo
    ice_shard: {
        id: 'ice_shard', name: 'Cacos de Gelo', type: 'ice', category: 'physical',
        power: 40, accuracy: 100, pp: 30, priority: 1, description: 'Dispara pedaços de gelo instantaneamente com prioridade.'
    },
    ice_beam: {
        id: 'ice_beam', name: 'Raio Congelante', type: 'ice', category: 'special',
        power: 90, accuracy: 100, pp: 10, effect: { type: 'freeze', chance: 0.1 }, description: 'Um feixe gelado que pode congelar o adversário.'
    },
    ice_punch: {
        id: 'ice_punch', name: 'Soco de Gelo', type: 'ice', category: 'physical',
        power: 75, accuracy: 100, pp: 15, effect: { type: 'freeze', chance: 0.1 }, description: 'Um soco congelante que pode paralisar de frio.'
    },
    blizzard: {
        id: 'blizzard', name: 'Nevasca', type: 'ice', category: 'special',
        power: 110, accuracy: 70, pp: 5, effect: { type: 'freeze', chance: 0.2 }, description: 'Uma tempestade de gelo violenta que atinge tudo.'
    },

    // Lutador
    karate_chop: {
        id: 'karate_chop', name: 'Golpe de Caratê', type: 'fighting', category: 'physical',
        power: 50, accuracy: 100, pp: 25, critRate: 2, description: 'Um corte marcial afiado com alta taxa crítica.'
    },
    brick_break: {
        id: 'brick_break', name: 'Quebra-Telha', type: 'fighting', category: 'physical',
        power: 75, accuracy: 100, pp: 15, description: 'Golpeia com as mãos firmes como se quebrasse tijolos.'
    },
    cross_chop: {
        id: 'cross_chop', name: 'Golpe Cruzado', type: 'fighting', category: 'physical',
        power: 100, accuracy: 80, pp: 5, critRate: 2, description: 'Um ataque com braços cruzados de tremendo impacto.'
    },
    close_combat: {
        id: 'close_combat', name: 'Combate Corpo-a-Corpo', type: 'fighting', category: 'physical',
        power: 120, accuracy: 100, pp: 5, description: 'Um ataque feroz e desenfreado sem medir esforços.'
    },
    aura_sphere: {
        id: 'aura_sphere', name: 'Esfera de Aura', type: 'fighting', category: 'special',
        power: 80, accuracy: 100, pp: 20, description: 'Dispara uma esfera de pura energia de aura que nunca erra.'
    },

    // Veneno
    poison_sting: {
        id: 'poison_sting', name: 'Ferrão Venenoso', type: 'poison', category: 'physical',
        power: 35, accuracy: 100, pp: 35, effect: { type: 'poison', chance: 0.3 }, description: 'Pica o alvo com um ferrão envenenado.'
    },
    sludge_bomb: {
        id: 'sludge_bomb', name: 'Bomba de Lodo', type: 'poison', category: 'special',
        power: 90, accuracy: 100, pp: 10, effect: { type: 'poison', chance: 0.3 }, description: 'Arremessa lodo tóxico no oponente.'
    },
    poison_jab: {
        id: 'poison_jab', name: 'Golpe Venenoso', type: 'poison', category: 'physical',
        power: 80, accuracy: 100, pp: 20, effect: { type: 'poison', chance: 0.3 }, description: 'Apunhala com um tentáculo ou garra embebida em toxinas.'
    },

    // Terra
    mud_slap: {
        id: 'mud_slap', name: 'Tapa de Lama', type: 'ground', category: 'special',
        power: 35, accuracy: 100, pp: 30, description: 'Joga lama no rosto do adversário.'
    },
    dig: {
        id: 'dig', name: 'Cavar', type: 'ground', category: 'physical',
        power: 80, accuracy: 100, pp: 15, description: 'Cava sob a terra e ataca violentamente por baixo.'
    },
    earthquake: {
        id: 'earthquake', name: 'Terremoto', type: 'ground', category: 'physical',
        power: 100, accuracy: 100, pp: 10, description: 'Causa um terremoto colossal que rasga o chão.'
    },
    earth_power: {
        id: 'earth_power', name: 'Poder da Terra', type: 'ground', category: 'special',
        power: 90, accuracy: 100, pp: 10, description: 'Faz o solo sob o adversário entrar em erupção de energia.'
    },

    // Voador
    gust: {
        id: 'gust', name: 'Rajada de Vento', type: 'flying', category: 'special',
        power: 40, accuracy: 100, pp: 35, description: 'Bate as asas criando uma ventania cortante.'
    },
    wing_attack: {
        id: 'wing_attack', name: 'Ataque de Asa', type: 'flying', category: 'physical',
        power: 60, accuracy: 100, pp: 35, description: 'Golpeia o adversário abrindo asas poderosas.'
    },
    air_slash: {
        id: 'air_slash', name: 'Golpe Aéreo', type: 'flying', category: 'special',
        power: 75, accuracy: 95, pp: 15, description: 'Lâminas cortantes de ar comprimido disparadas em alta velocidade.'
    },
    brave_bird: {
        id: 'brave_bird', name: 'Pássaro Valente', type: 'flying', category: 'physical',
        power: 120, accuracy: 100, pp: 15, recoil: 0.25, description: 'Mergulha a toda velocidade em uma investida kamikaze.'
    },

    // Psíquico
    confusion: {
        id: 'confusion', name: 'Confusão', type: 'psychic', category: 'special',
        power: 50, accuracy: 100, pp: 25, description: 'Uma onda telecinética fraca que atinge a mente.'
    },
    psybeam: {
        id: 'psybeam', name: 'Raio Psíquico', type: 'psychic', category: 'special',
        power: 65, accuracy: 100, pp: 20, description: 'Dispara um estranho feixe de energia psíquica multicolorida.'
    },
    psychic: {
        id: 'psychic', name: 'Psíquico', type: 'psychic', category: 'special',
        power: 90, accuracy: 100, pp: 10, description: 'Uma poderosa força telecinética esmaga o oponente.'
    },
    zen_headbutt: {
        id: 'zen_headbutt', name: 'Cabeçada Zen', type: 'psychic', category: 'physical',
        power: 80, accuracy: 90, pp: 15, description: 'Concentra a vontade e atinge o oponente com uma cabeçada.'
    },

    // Inseto
    bug_bite: {
        id: 'bug_bite', name: 'Mordida de Inseto', type: 'bug', category: 'physical',
        power: 60, accuracy: 100, pp: 20, description: 'Morde o alvo com mandíbulas afiadas de inseto.'
    },
    x_scissor: {
        id: 'x_scissor', name: 'Tesoura X', type: 'bug', category: 'physical',
        power: 80, accuracy: 100, pp: 15, description: 'Cruza garras ou foices em forma de X cortando o alvo.'
    },
    bug_buzz: {
        id: 'bug_buzz', name: 'Zumbido de Inseto', type: 'bug', category: 'special',
        power: 90, accuracy: 100, pp: 10, description: 'Vibra o corpo gerando uma onda sonora estridente.'
    },

    // Pedra
    rock_throw: {
        id: 'rock_throw', name: 'Lançamento de Pedra', type: 'rock', category: 'physical',
        power: 50, accuracy: 90, pp: 15, description: 'Arremessa pequenas pedras pesadas no adversário.'
    },
    rock_slide: {
        id: 'rock_slide', name: 'Deslizamento de Pedras', type: 'rock', category: 'physical',
        power: 75, accuracy: 90, pp: 10, description: 'Faz pedras gigantescas despencarem sobre o oponente.'
    },
    stone_edge: {
        id: 'stone_edge', name: 'Gume de Pedra', type: 'rock', category: 'physical',
        power: 100, accuracy: 80, pp: 5, critRate: 2, description: 'Apunhala o adversário por baixo com pedras pontiagudas.'
    },

    // Fantasma
    lick: {
        id: 'lick', name: 'Lambida', type: 'ghost', category: 'physical',
        power: 30, accuracy: 100, pp: 30, effect: { type: 'paralyze', chance: 0.3 }, description: 'Lambe o oponente com uma língua gélida assustadora.'
    },
    shadow_punch: {
        id: 'shadow_punch', name: 'Soco Sombrio', type: 'ghost', category: 'physical',
        power: 60, accuracy: 100, pp: 20, description: 'Um soco vindo do além que nunca falha.'
    },
    shadow_ball: {
        id: 'shadow_ball', name: 'Bola Sombria', type: 'ghost', category: 'special',
        power: 80, accuracy: 100, pp: 15, description: 'Dispara uma esfera escura e sinistra de ectoplasma.'
    },
    shadow_claw: {
        id: 'shadow_claw', name: 'Garra das Sombras', type: 'ghost', category: 'physical',
        power: 70, accuracy: 100, pp: 15, critRate: 2, description: 'Rasga o alvo com garras envoltas em trevas.'
    },

    // Dragão
    dragon_breath: {
        id: 'dragon_breath', name: 'Sopro do Dragão', type: 'dragon', category: 'special',
        power: 60, accuracy: 100, pp: 20, effect: { type: 'paralyze', chance: 0.3 }, description: 'Exala uma lufada mística que pode paralisar.'
    },
    dragon_claw: {
        id: 'dragon_claw', name: 'Garra de Dragão', type: 'dragon', category: 'physical',
        power: 80, accuracy: 100, pp: 15, description: 'Corta o adversário com garras draconianas cortantes.'
    },
    dragon_pulse: {
        id: 'dragon_pulse', name: 'Pulso do Dragão', type: 'dragon', category: 'special',
        power: 85, accuracy: 100, pp: 10, description: 'Gera uma onda de choque explosiva da sua boca.'
    },
    outrage: {
        id: 'outrage', name: 'Fúria Draconiana', type: 'dragon', category: 'physical',
        power: 120, accuracy: 100, pp: 10, description: 'Entra em fúria desenfreada desferindo golpes avassaladores.'
    },

    // Sombrio
    bite: {
        id: 'bite', name: 'Mordida', type: 'dark', category: 'physical',
        power: 60, accuracy: 100, pp: 25, description: 'Morde cruelmente com dentes afiados.'
    },
    crunch: {
        id: 'crunch', name: 'Triturar', type: 'dark', category: 'physical',
        power: 80, accuracy: 100, pp: 15, description: 'Esmaga o alvo com uma mordida feroz e implacável.'
    },
    dark_pulse: {
        id: 'dark_pulse', name: 'Pulso Sombrio', type: 'dark', category: 'special',
        power: 80, accuracy: 100, pp: 15, description: 'Libera uma aura horrível cheia de maus pensamentos.'
    },
    night_slash: {
        id: 'night_slash', name: 'Golpe Noturno', type: 'dark', category: 'physical',
        power: 70, accuracy: 100, pp: 15, critRate: 2, description: 'Corta no instante da escuridão. Alta taxa de acerto crítico.'
    },

    // Aço
    metal_claw: {
        id: 'metal_claw', name: 'Garra de Metal', type: 'steel', category: 'physical',
        power: 50, accuracy: 95, pp: 35, description: 'Ataca com garras duras como aço puro.'
    },
    iron_head: {
        id: 'iron_head', name: 'Cabeça de Ferro', type: 'steel', category: 'physical',
        power: 80, accuracy: 100, pp: 15, description: 'Atinge com uma cabeçada de dureza férrea.'
    },
    flash_cannon: {
        id: 'flash_cannon', name: 'Canhão de Luz', type: 'steel', category: 'special',
        power: 80, accuracy: 100, pp: 10, description: 'Reúne toda a energia luminosa e dispara um projétil de aço.'
    },

    // Fada
    fairy_wind: {
        id: 'fairy_wind', name: 'Vento de Fada', type: 'fairy', category: 'special',
        power: 40, accuracy: 100, pp: 30, description: 'Gera uma brisa mística que agride o adversário.'
    },
    dazzling_gleam: {
        id: 'dazzling_gleam', name: 'Brilho Deslumbrante', type: 'fairy', category: 'special',
        power: 80, accuracy: 100, pp: 10, description: 'Emana um clarão radiante mágico que cega o adversário.'
    },
    moonblast: {
        id: 'moonblast', name: 'Explosão Lunar', type: 'fairy', category: 'special',
        power: 95, accuracy: 100, pp: 15, description: 'Pede forças à lua para disparar uma esfera resplandecente.'
    },
    play_rough: {
        id: 'play_rough', name: 'Brincadeira Bruta', type: 'fairy', category: 'physical',
        power: 90, accuracy: 90, pp: 10, description: 'Brinca violentamente e sem dó com o oponente.'
    }
};

