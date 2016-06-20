class Item {
    constructor({
        name = 'An Item',
        desc = 'An amorphous blob of ether',
        cost = 1,
        img = '',
        dmg = 1, // heals or hurts
        armor = 0,
        slot = 'weapon'
    } = {}) {
        Object.assign(this, {
            name, desc, cost, img, dmg, slot, armor
        });
    }
}

let items = {
    dagger0: {
        name: 'rusty dagger',
        desc: 'old and worn it gets the job done, barely...',
        cost: 1,
        img: 'dagger.gif',
        dmg: '1d4',
        slot: 'weapon'
    },
    axe0: {
        name: 'hand axe',
        desc: 'good for chopping wood, and heads',
        cost: 5,
        img: 'axe.png',
        dmg: '1d6',
        slot: 'weapon'
    },
    body0: {
        name: 'cloth clothes',
        desc: 'a simple shirt and pants to cover you up',
        cost: 1,
        img: 'clothes.png',
        armor: 0,
        slot: 'body'
    }
};

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
        desc = '',
        equipment = {
            head: null,
            body: null,
            feet: null,
            ring: null,
            weapon: null,
            shield: null
        },
        inv = []
    } = {}) {
        Object.assign(this, {
            name, level, exp, gold, str, end, spd,
            hp, mhp, potion, img, desc, equipment,
            inv
        });

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

    giveItem(item) {
        this.inv.push(item);
    }

    removeItem(item) {
        if (this.inv.indexOf(item) < 0) {
            return;
        }

        if(this.equipment[item.slot] === item) {
            this.equipment[item.slot] = null;
        }

        this.inv.splice(this.inv.indexOf(item), 1);

        return item;
    }

    equip(item) {
        if (this.inv.indexOf(item) < 0) {
            return;
        }

        this.equipment[item.slot] = item;
    }

    get armor() {
        let total = 0;

        if (this.equipment.head) {
            total += this.equipment.head.armor;
        }

        if (this.equipment.body) {
            total += this.equipment.head.body;
        }

        if (this.equipment.feet) {
            total += this.equipment.feet.armor;
        }

        return total;
    }

    get dmg() {
        if (this.equipment.weapon) {
            return this.equipment.weapon.dmg;
        }

        return '1d2'; // fists of fury
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

var createChar,
    player;

function showCreate() {
    createChar = new Player();

    createChar.giveItem(new Item(items.dagger0));
    createChar.giveItem(new Item(items.body0));

    for(let item of createChar.inv) {
        createChar.equip(item);
    }

    reroll();
    setActiveInfo('create-char');
}

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
        die,
        bonus = 0,
        result = 0;

    if(split[1].indexOf('+') >= 0) {
        let mod = split[1].split('+');
        die = parseInt(mod[0], 10);
        bonus = parseInt(mod[1], 10);
    } else {
        die = parseInt(split[1], 10);
    }

    for (let i = 0; i < num; i++) {
        result += Math.floor(Math.random() * die) + 1;
    }

    if (num === 1 && die === 20 && result === 20) {
        console.debug('NATURAL TWENTY!!! BOOM BABY!');
    }

    result += bonus;

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
        spd: 12,
        mhp: '1d12',
        img: 'skeleton.gif',
        desc: 'A minion of the undead. Reanimated for your killing pleasure. heh...'
    },
    goblin: {
        name: 'Goblin',
        exp: 5,
        gold: '1d6',
        str: 5,
        end: 5,
        spd: 15,
        mhp: '2d4',
        img: 'goblin2.png',
        desc: 'A nasty little green thing.'
    },
    kobold: {
        name: 'Kobold',
        exp: 5,
        gold: '2d4',
        str: 5,
        end: 5,
        spd: 13,
        mhp: '1d8',
        img: 'kobold.gif',
        desc: 'A dog like monster.'
    },
    zombie: {
        name: 'Zombie',
        exp: 5,
        gold: '1d6',
        str: 8,
        end: 5,
        spd: 9,
        mhp: '1d12',
        img: 'zombie2.png',
        desc: 'An undead human feasting for brains.'
    }
};

var monster = null,
    monsterEl = null,
    combatTurn = 0,
    whosTurn = 'player';

function generateEncounter() {
    let dice = roll('1d12');

    if (dice === 1) {
        printMsg('You wander around for a bit but find nothing...');
        return;
    }

    // encounter table per location?
    let types = Object.keys(mobs),
        choose = roll(`1d${types.length}`) - 1,
        mob = mobs[types[choose]],
        monster = new Monster(mob);

    console.debug(types, choose, mob);

    startCombat(monster);
}

function startCombat(mob) {
    monster = mob;
    combatTurn = 1;
    // base turn on speed?
    whosTurn = 'player';
    printMsg(`A ${mob.name} ${currentLoc.encounterMsg}!`);

    let slot = roll('1d3');

    let el = document.getElementById(`actor${slot}`);
    monsterEl = el;
    el.src = `images/${mob.img}`;
    el.classList.remove('hide');

    activeCommands('combat-commands');
}

function endCombat() {
    monster = null;
    combatTurn = 0;
    whosTurn = 'player';

    monsterEl.classList.add('hide');
    monsterEl = null;

    goLocation(currentLoc.key);
}

function advanceCombatTurn() {
    combatTurn++;
    if (whosTurn === 'player') {
        whosTurn = 'monster';
    } else {
        whosTurn = 'player';
    }

    if (whosTurn === 'monster') {
        combatMonster();
    }

    player.renderStats();
}

function combatMonster() {
    // ai?
    let spdMod = Math.floor(monster.spd / 6),
        strMod = Math.floor(monster.str / 6),
        attackRoll = roll(`1d20`),
        dmgRoll = roll(monster.dmg),
        critical = attackRoll === 20 ? 2 : 1;

    printMsg(`The ${monster.name} attacks you...`);

    if (attackRoll + spdMod > player.spd) {
        let dmg = dmgRoll + strMod;
        player.damage(dmg);
        printMsg(`and hits for ${dmg} damage.`);
        if (!player.alive) {
            playerDied();
        } else {
            advanceCombatTurn();
        }
    } else {
        printMsg('and misses!');
        advanceCombatTurn();
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