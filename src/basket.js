const data = require("../inventory.json");
const INVENTORY = data["inventory"];
const small = 5;
const medium = 10;
const large = 30;

class Basket {
    constructor(size = small) {
        this.items = [];
        this.size = size;
    }

    add(item) {
        if (this.isFull())
            return "You cannot add more items, your basket is full";

        const element = INVENTORY.filter(x => x.sku == item)
        this.items.push(...element)

        if (this.inBasket(item) > 1)
            return "This item is already in your basket"
    }

    remove(item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].sku === item) {
                this.items.splice(i, 1);
                return "Item Removed";
            }
        }
        return "You cannot remove items that are not in your basket";
    }

    isFull() {
        return this.items.length >= this.size;
    }

    changeBasketSize(size) {
        if (size !== small && size !== medium && size !== large) {
            return `Pick small, medium or large`;
        }
        if (this.items.length > size) {
            return `Pick a basket bigger than ${this.items.length}`;
        } this.size = size;
    }

    inBasket(item) {
        return this.items.filter(x => x.sku === item).length
    }

    checkout() {
        const arr = new Set
        for (let n of this.items) {
            arr.add(n)
        } return [...arr]
    }

    priceOfBagel(item) {
        for (let product of INVENTORY) {
            if (product.sku === item) {
                return product.price;
            }
        }
    }

    multiOffer(item) {
        let c = 0
        let freq = this.inBasket(item)
        if (item == 'BGLO' || item == 'BGLE') {
            c = Math.floor(freq / 6)
        } else if (item == 'BGLP') {
            c = Math.floor(freq / 12)
        } return c
    }

    applyOffer(item) {
        let saved = 0
        if (item == 'BGLO' || item == 'BGLE') {
            saved = 0.45 * this.multiOffer(item)
        } else if (item == 'BGLP') {
            saved = 0.69 * this.multiOffer(item)
        } else if (item == 'COF' || item == 'BGLP' && this.items.length == 2) {
            saved = 0.13
        } return saved
    }

    totalSaved() {
        let total = 0
        for (let n of this.checkout()) {
            total += this.applyOffer(n.sku)
        } return total
    }

    priceOfBasket() {
        let total = 0;
        for (let product of this.items) {
            total += Number(product.price);
        } if (this.inBasket('BGLE') >= 6) {
            total -= this.applyOffer('BGLE')
        } else if (this.inBasket('BGLO') >= 6) {
            total -= this.applyOffer('BGLO')
        } else if (this.inBasket('BGLP') >= 12) {
            total -= this.applyOffer('BGLP')
        } else if (this.inBasket('COF') === 1 && this.inBasket('BGLP') === 1 && this.items.length === 2) {
            total = 1.25
        } return Math.floor(total * 100) / 100
    }

    printReceipt() {
        let items = "\n"

        for (let n of this.checkout()) {
            if (this.applyOffer(n.sku) == 0) {
                items += `        ${n['variant']} ${n.name.padEnd(13 - n['variant'].length + n.name.length, ' ')} ${this.inBasket(n.sku)}  £${Math.ceil((n.price * this.inBasket(n.sku).toFixed(2) - this.applyOffer(n.sku)) * 100) / 100} ` + "\n"
            } else if (this.applyOffer(n.sku) != 0) {
                items += `        ${n['variant']} ${n.name.padEnd(13 - n['variant'].length + n.name.length, ' ')} ${this.inBasket(n.sku)}  £${Math.ceil((n.price * this.inBasket(n.sku).toFixed(2) - this.applyOffer(n.sku)) * 100) / 100} ` + "\n" + `(-£${this.applyOffer(n.sku).toFixed(2)})`.padStart(37, ' ') + "\n"
            }
        }

        return (`
            ~~~ Bob's Bagels ~~~
        
           ${Date().substring(3, 24)}
        
        ----------------------------
        ${items}
        ----------------------------
        Total                  £${this.priceOfBasket().toFixed(2)}

         You saved a total of £${this.totalSaved().toFixed(2)}
                on this shop

                 Thank you
               for your order!
        
        `)
    }
}




const basket = new Basket()
basket.changeBasketSize(large)
// basket.add('BGLO')
// basket.add('BGLO')
// basket.add('BGLO')
// basket.add('BGLO')
// basket.add('BGLO')
// basket.add('BGLO')


// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')
// basket.add('BGLP')

// basket.add('BGLE')
// basket.add('BGLE')
// basket.multiOffer('BGLE')

// console.log(basket.multiOffer('BGLO'))
// console.log(basket.totalSaved())
// // basket.add('BGLE')
// // basket.add('BGLE')
// // basket.add('BGLE')
// // basket.add('BGLE')

// // basket.add('COF')
// // basket.add('COF')
basket.add('COF')




console.log(basket.printReceipt())

// console.log(basket.checkout())
module.exports = Basket;

