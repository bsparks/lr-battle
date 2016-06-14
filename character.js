class Character {
    constructor({
        name = 'Name',
        xp = 0,
        gold = 0,
        str = 1,
        sta = 1,
        spd = 1,
        hp = maxHp,
        maxHp = 1,
        img = 'none.png',
        descr = 'An amorphous blob of nothingness.'
    } = {}) {
        this.name = name;
        this.xp = xp;
        this.gold = gold;
        this.str = str;
        this.sta = sta;
        this.spd = spd;
        this.hp = hp;
        this.maxHp = maxHp;
        this.img = img;
        this.descr = descr;
    }
}