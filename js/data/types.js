// Matriz e Definições de Tipos Pokémon
const POKEMON_TYPES = {
    normal: { name: 'Normal', color: '#A8A77A' },
    fire: { name: 'Fogo', color: '#EE8130' },
    water: { name: 'Água', color: '#6390F0' },
    grass: { name: 'Grama', color: '#7AC74C' },
    electric: { name: 'Elétrico', color: '#F7D02C' },
    ice: { name: 'Gelo', color: '#96D9D6' },
    fighting: { name: 'Lutador', color: '#C22E28' },
    poison: { name: 'Veneno', color: '#A33EA1' },
    ground: { name: 'Terra', color: '#E2BF65' },
    flying: { name: 'Voador', color: '#A98FF3' },
    psychic: { name: 'Psíquico', color: '#F95587' },
    bug: { name: 'Inseto', color: '#A6B91A' },
    rock: { name: 'Pedra', color: '#B6A136' },
    ghost: { name: 'Fantasma', color: '#735797' },
    dragon: { name: 'Dragão', color: '#6F35FC' },
    dark: { name: 'Sombrio', color: '#705746' },
    steel: { name: 'Aço', color: '#B7B7CE' },
    fairy: { name: 'Fada', color: '#D685AD' }
};

// Tabela de Efetividade: [Atacante][Defensor] -> Multiplicador
const TYPE_EFFECTIVENESS = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Função para calcular efetividade de um golpe contra um ou dois tipos
function getTypeEffectiveness(attackType, defenderTypes) {
    if (!attackType || !defenderTypes || !TYPE_EFFECTIVENESS[attackType]) return 1;
    let multiplier = 1;
    for (const defType of defenderTypes) {
        if (TYPE_EFFECTIVENESS[attackType] && TYPE_EFFECTIVENESS[attackType][defType] !== undefined) {
            multiplier *= TYPE_EFFECTIVENESS[attackType][defType];
        }
    }
    return multiplier;
}

