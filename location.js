class Location {
    constructor({
        name = 'A dark place.',
        img = 'background.png',
        descr = 'A dark and endless void',
        battleMsg = 'leaps from the darkness'
    } = {}) {
        this.name = name;
        this.img = img;
        this.descr = descr;
        this.battleMsg = battleMsg;
    }

    onEnter() {

    }

    onExit() {

    }

    onLook() {

    }
}