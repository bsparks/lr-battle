const ITEM_TYPES = {

};

class Item {
    constructor({
        name = 'Item',
        descr = 'A non-descript item.',
        cost = 1,
        mod = 0,
        img = 'item.png',
        type = 'misc'
    } = {}) {
        this.name = name;
        this.descr = descr;
        this.cost = cost;
        this.mod = mod;
        this.img = img;
        this.type = type;
    }
}