# 🎮 Pokémon Turn RPG (Navegador)

Um jogo completo de RPG de batalhas Pokémon por turno direto no seu navegador, desenvolvido com HTML5, CSS3 moderno e JavaScript puro.

---

## 🌟 Principais Recursos

1. **Batalhas por Turno Clássicas**:
   - Menu com comandos de **Lutar**, **Trocar Pokémon** e **Fugir**.
   - Barra de HP dinâmica com cores (Verde, Amarelo, Vermelho).
   - Barra de EXP com preenchimento em tempo real.
   - Cálculo de dano fiel à fórmula de Pokémon (STAB, Fraquezas/Resistências, Acertos Críticos e Precisão).
   - Animações de investida, impacto visual, trepidação de tela e desmaio.

2. **Dificuldade Progressiva por Rotas / Estágios**:
   - Oponentes selvagens aleatórios que escalam em nível, atributos e golpes a cada batalha vencida.
   - Estágios iniciais: Pokémons básicos (Pidgey, Rattata, Caterpie, iniciais).
   - Estágios intermediários: Formas evoluídas (Ivysaur, Charmeleon, Wartortle, Kadabra, Haunter).
   - Estágios avançados: Formas finais e chefes lendários (Charizard, Dragonite, Mewtwo, Zapdos, Rayquaza).

3. **Recompensa Pós-Batalha (Captura ou Aprender Golpe)**:
   - Ao derrotar um Pokémon selvagem, você escolhe entre duas grandes opções:
     - 🔴 **Capturar Pokémon**: Adiciona o Pokémon derrotado à sua equipe (ou envia para o PC se o time estiver com 6).
     - ⚡ **Aprender um Ataque**: Permite escolher um dos golpes conhecidos pelo Pokémon derrotado e ensiná-lo a qualquer membro do seu time! Se o seu Pokémon já tiver 4 golpes, você escolhe qual golpe esquecer.

4. **Time de 6 Pokémons & Sistema de Armazenamento do PC**:
   - Equipe ativa de até 6 Pokémons.
   - Quando o time atinge 6 membros, os novos Pokémons capturados são enviados automaticamente para a **Caixa do PC**.
   - Tela de PC completa para gerenciar, depositar, retirar ou libertar Pokémons.
   - Opção de escolher o líder do time (quem entra primeiro na batalha).

5. **Ganho de Experiência e Evolução**:
   - O Pokémon ativo ganha XP ao vencer batalhas.
   - Ao subir de nível, todos os atributos aumentam (HP Máximo, Ataque, Defesa, Atq. Especial, Def. Especial, Velocidade).
   - Ao atingir o nível necessário, a **Tela de Evolução** é ativada com efeitos visuais e sonoros comemorativos!

6. **Sprites Animados & Efeitos Sonoros Retro**:
   - Importa sprites animados de frente e costas via **Pokémon Showdown / PokeAPI**.
   - Sistema de fallback triplo (GIF animado -> PNG estático -> SVG vetorial procedural caso esteja offline).
   - Efeitos sonoros 8-bit e música de batalha em chiptune gerados diretamente pela **Web Audio API** nativa (100% autônomo, sem dependência de MP3 externos ou falhas de carregamento).

7. **Salvamento Automático**:
   - Todo o progresso, time, PC e estágio atual são salvos automaticamente no `localStorage` do seu navegador.

---

## 🚀 Como Jogar

Você tem duas formas simples de iniciar o jogo:

### Opção 1 (Mais Rápida):
Dê um duplo clique no arquivo **`iniciar_jogo.bat`** ou abra diretamente o arquivo **`index.html`** em qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).

### Opção 2 (Via Servidor Local):
Se tiver Node.js instalado no terminal:
```bash
npm start
```
E acesse `http://localhost:3000` no seu navegador.

