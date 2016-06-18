function default_item() {
    this.name = '';
    this.desc = '';
    this.cost = 0;
    this.mod = 0;
    this.img = '';
}

class Actor {
    constructor({
        name = 'Noname McGee',
        level = 1,
        exp = 0,
        gold = 0,
        str = 1,
        end = 1,
        spd = 1,
        hp = 1,
        mhp = 1,
        potion = 0,
        img = '',
        desc = ''
    } = {}) {
        Object.assign(this, { name, level, exp, gold, str, end, spd, hp, mhp, potion, img, desc });

        // better start this way!
        this.alive = true;
        // assuming that mhp is passed in instead of hp
        this.heal(Number.POSITIVE_INFINITY);
    }

    get gold() {
        return this._gold;
    }

    set gold(val) {
        if (typeof val === 'string') {
            val = roll(val);
        }
        this._gold = val;
    }

    get hp() {
        return this._hp;
    }

    set hp(val) {
        if (typeof val === 'string') {
            val = roll(val);
        }
        this._hp = val > this._mhp ? this._mhp : val;
    }

    get mhp() {
        return this._mhp;
    }

    set mhp(val) {
        if (typeof val === 'string') {
            val = roll(val);
        }
        this._mhp = val;
    }

    damage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }
    }

    heal(amount) {
        this.hp += amount;
        if (this.hp > this.mhp) {
            this.hp = this.mhp;
        }
    }
}

class Monster extends Actor {

}

class Player extends Actor {
    gainExp(amount) {
        this.exp += amount;
        printMsg(`You gained ${amount} experience!`);
        this.levelUp();
    }

    gainGold(amount) {
        this.gold += amount;
        printMsg(`You gained ${amount} gold!`);
    }

    levelUp() {
        if (this.exp >= getExpNeeded(this.level)) {
            this.level++;
            printMsg('<span class="levelupText">You have gained a level!!</span>');
            printMsg(`<span class="levelupText">You are now level ${this.level}!`);

            let hpGain = roll('1d8') + this.end;
            this.mhp += hpGain;
            this.hp = this.mhp;
            printMsg(`<span class="hpGainText">You have gained ${hpGain} health.</span>`);

            if (this.level % 2 === 0) {
                let stat = roll('1d3'),
                    statName = '';
                if (stat === 1) {
                    statName = 'strength';
                    this.str++;
                }
                if (stat === 2) {
                    statName = 'endurance';
                    this.end++;
                }
                if (stat === 3) {
                    statName = 'speed';
                    this.spd++;
                }
                printMsg(`<span class="statIncreaseText">You gained a point in ${statName}!</span>`);
            }

            this.renderStats();
        }
    }

    renderStats() {
        document.getElementById('playerName').innerHTML = `Name: ${this.name}`;
        document.getElementById('playerLevel').innerHTML = `Level: ${this.level}`;
        document.getElementById('playerExp').innerHTML = `XP: ${this.exp}`;
        document.getElementById('playerStr').innerHTML = `STR: ${this.str}`;
        document.getElementById('playerEnd').innerHTML = `END: ${this.end}`;
        document.getElementById('playerSpd').innerHTML = `SPD: ${this.spd}`;
        document.getElementById('playerGold').innerHTML = `Gold: ${this.gold}`;
        document.getElementById('playerHP').innerHTML = `HP: ${this.hp} / ${this.mhp}`;
    }
}

var locations = {
    town: {
        key: 'town',
        name: 'Town of Keekleos',
        img: 'town.gif',
        desc: 'A lovely town. Really.',
        encounterMsg: 'jumps out of an alley',
        commands: 'town-commands'
    },
    forest: {
        key: 'forest',
        name: 'The Dark Woods',
        img: 'forest.bmp',
        desc: 'A forest, there are trees here...',
        encounterMsg: 'leaps from the trees',
        commands: 'explore-commands'
    },
    mountain: {
        key: 'mountain',
        name: 'Trollkin Mountains',
        img: 'mountain.jpg',
        desc: 'Littered with scrub bushes and rocks, the mountain is home to unspeakable horrors.',
        encounterMsg: 'crawls out from under a rock',
        commands: 'explore-commands'
    },
    church: {
        key: 'church',
        name: 'Temple of Oog',
        img: 'church.gif',
        desc: 'A beautiful temple to the might god Oog.',
        encounterMsg: 'jumps out of the shadows',
        commands: 'church-commands'
    },
    shop: {
        key: 'shop',
        name: 'Brandar\'s Supplies',
        img: 'shop.gif',
        desc: 'All of the things that an adventurer might need can be found in this humble shop.',
        encounterMsg: 'jumps out of the shadows',
        commands: 'shop-commands'
    }
};

var createChar = new Player(),
    player;

function reroll() {
    createChar.str = roll('3d6');
    createChar.end = roll('3d6');
    createChar.spd = roll('3d6');
    createChar.mhp = roll('1d8') + createChar.end;
    createChar.gold = '2d10';
    createChar.heal(Number.POSITIVE_INFINITY);

    renderCreate();
}

function renderCreate() {
    document.getElementById('createStr').innerHTML = createChar.str;
    document.getElementById('createEnd').innerHTML = createChar.end;
    document.getElementById('createSpd').innerHTML = createChar.spd;
    document.getElementById('createHP').innerHTML = createChar.hp;
    document.getElementById('createGold').innerHTML = createChar.gold;
}

function acceptCreate() {
    createChar.name = document.getElementById('createName').value;

    player = createChar;

    goLocation('town');
}

function getExpNeeded(level) {
    return (level * 100) + ((level - 1) * (50 * level / 4));
}

function roll(dice) {
    let split = dice.split('d'),
        num = parseInt(split[0], 10),
        die = parseInt(split[1], 10),
        result = 0;

    for (let i = 0; i < num; i++) {
        result += Math.floor(Math.random() * die) + 1;
    }

    if (num === 1 && die === 20 && result === 20) {
        console.debug('NATURAL TWENTY!!! BOOM BABY!');
    }

    return result;
}

function printMsg(msg) {
    let log = document.getElementById('msglog'),
        line = document.createElement('li');
    line.innerHTML = msg;

    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
}

function clearInfoPanel() {
    let panel = document.getElementById('infview');

    for (let child of panel.children) {
        child.classList.add('hide');
    }
}

function setActiveInfo(info) {
    let panel = document.getElementById('infview');

    for (let child of panel.children) {
        if (child.classList.contains(info)) {
            child.classList.remove('hide');
        } else {
            child.classList.add('hide');
        }
    }
}

function showCreate() {
    reroll();
    setActiveInfo('create-char');
}

function showAbout() {
    setActiveInfo('about');
}

function showDocs() {
    console.debug('Ain\'t nobody got time for that!');
}

function activeCommands(cmds) {
    let panel = document.getElementById('cmdview');

    for (let child of panel.children) {
        if (child.classList.contains(cmds)) {
            child.classList.remove('hide');
        } else {
            child.classList.add('hide');
        }
    }
}

function setGfxBg(img) {
    let panel = document.getElementById('gfxview');

    panel.style.backgroundImage = `url("images/${img}")`;
}

var currentLoc = null;

function changeLoc(loc) {
    setGfxBg(loc.img);
    printMsg(`You enter ${loc.name}.`);
    currentLoc = loc;
}

function goLocation(name) {
    let destination = locations[name];

    clearInfoPanel();
    changeLoc(destination);
    activeCommands(destination.commands);
    player.renderStats();
}

function doExplore() {
    printMsg('You begin to explore...');
    generateEncounter();
}

let mobs = {
    skeleton: {
        name: 'Skeleton',
        exp: 10,
        gold: '1d10',
        str: 8,
        end: 5,
        spd: 2,
        mhp: '1d12',
        img: 'skeleton.gif',
        desc: 'A minion of the undead. Reanimated for your killing pleasure. heh...'
    },
    goblin: {
        name: 'Goblin',
        exp: 5,
        gold: '1d6',
        str: 7,
        end: 5,
        spd: 5,
        mhp: '2d4',
        img: 'goblin2.png',
        desc: 'A nasty little green thing.'
    }
};

var monster = null,
    combatTurn = 0,
    whosTurn = 'player';

function generateEncounter() {
    let dice = roll('1d12');

    if (dice === 1) {
        printMsg('You wander around for a bit but find nothing...');
        return;
    }

    // encounter table per location?
    let monster;
    if (dice > 6) {
        monster = new Monster(mobs.skeleton);
    }

    if (dice < 7) {
        monster = new Monster(mobs.goblin);
    }

    startCombat(monster);
}

function startCombat(mob) {
    monster = mob;
    combatTurn = 1;
    // base turn on speed?
    whosTurn = 'player';
    printMsg(`A ${mob.name} ${currentLoc.encounterMsg}!`);
    let el = document.getElementById('monster');
    el.src = `images/${mob.img}`;
    el.classList.remove('hide');
    activeCommands('combat-commands');
}

function endCombat() {
    monster = null;
    combatTurn = 0;
    whosTurn = 'player';
    let el = document.getElementById('monster');
    el.classList.add('hide');
    goLocation(currentLoc.key);
}

function advanceCombatTurn() {
    combatTurn++;
    if (whosTurn === 'player') {
        whosTurn = 'monster';
    } else {
        whosTurn = 'player';
    }
}

function combatFight() {
    if (!monster) {
        console.debug('not in combat!');
        return;
    }

    let attackRoll = roll('1d20'),
        dmgRoll = roll('1d8'),
        critical = 1,
        dmgBonus = Math.floor(player.str / 6),
        dmg = 0;

    printMsg(`You attack the ${monster.name}.`);

    if (attackRoll === 20) {
        critical = 2;
        printMsg('Critical hit!');
    }

    if (attackRoll === 1) {
        printMsg('You lose grip of your weapon and almost drop it! Miss!');
        advanceCombatTurn();
        return;
    }

    dmg = (dmgRoll + dmgBonus) * critical;
    monster.damage(dmg);
    printMsg(`You hit for ${dmg} damage.`);

    if (!monster.alive) {
        printMsg(`You have slain the ${monster.name}!`);
        player.gainExp(monster.exp);
        player.gainGold(monster.gold);
        endCombat();
    } else {
        advanceCombatTurn();
    }
}

function combatRun() {
    if (!monster) {
        // doesn't seem to be in combat
        console.warn('no monster? how u run?');
        goLocation('town');
        return;
    }

    let attempt = roll('1d20');

    advanceCombatTurn();

    if (attempt > 1) {
        printMsg('You flee in terror!');
        // reset combat for next time
        endCombat();
        goLocation('town');
    } else {
        printMsg('DOH! You critically fumble and are unable to escape!');
    }
}

function start() {
    setGfxBg('dragon.bmp');
    printMsg('Welcome to the Battle Arena!');
    printMsg('Your travels have brought you to a land of mystery and wonder.');
    printMsg('It has been many moons since you left your home in search of adventure, what will you find here?');
}

document.addEventListener('DOMContentLoaded', function() {
    start();
});