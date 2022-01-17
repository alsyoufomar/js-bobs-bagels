const Basket = require("../../src/basket.js")

const small = 5
const medium = 10
const large = 30

describe("Basket", () => {
    let basket

    beforeEach(() => {
        basket = new Basket()
    })

    it("new basket is empty array", () => {
        // set up
        const expected = []
        // verify
        expect(basket.items).toEqual(expected)
    })

    it("add items to basket", () => {
        // set up
        const expected = [{
            "sku": "BGLO",
            "price": "0.49",
            "name": "Bagel",
            "variant": "Onion"
        }]
        // execute
        const result = basket.items
        // verify
        basket.add("BGLO")
        expect(result).toEqual(expected)
    })

    it("add existing items to basket", () => {
        // set up
        const expected = [{
            "sku": "BGLO",
            "price": "0.49",
            "name": "Bagel",
            "variant": "Onion"
        },
        {
            "sku": "BGLO",
            "price": "0.49",
            "name": "Bagel",
            "variant": "Onion"
        }]
        // execute
        basket.add("BGLO")
        // verify
        expect(basket.add("BGLO")).toEqual("This item is already in your basket")
        expect(basket.items).toEqual(expected)
    })

    it("remove items from basket", () => {
        // set up
        const expected = [{
            "sku": "BGLS",
            "price": "0.49",
            "name": "Bagel",
            "variant": "Sesame"
        }]
        // execute
        basket.add("BGLO")
        basket.add("BGLS")
        basket.remove("BGLO")
        // verify
        expect(basket.items).toEqual(expected)
    })

    it("know if full and not full", () => {

        // verify
        basket.add("BGLO")
        basket.add("BGLS")
        expect(basket.isFull()).toEqual(false)
    })

    it("know if full and is full", () => {

        // verify
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        expect(basket.isFull()).toEqual(true)
    })

    it("know if basket is full so cannot add items", () => {
        // set up
        const expected = "You cannot add more items, your basket is full"
        // execute
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        // verify
        expect(basket.add("BGLO")).toEqual(expected)
        expect(basket.items.length).toEqual(5)
    })

    it("change basket size", () => {
        // set up
        // execute
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.changeBasketSize(medium)
        basket.add("BGLS")
        basket.add("BGLO")
        // verify
        expect(basket.items.length).toEqual(7)
        expect(basket.size).toEqual(10)
    })

    it("cannot change basket size to random", () => {
        // set up
        const expected = `Pick small, medium or large`
        // execute
        // verify
        expect(basket.changeBasketSize(250)).toEqual(expected)
        expect(basket.size).toEqual(5)
    })

    it("change basket size", () => {
        // set up
        const expected = `Pick a basket bigger than 7`
        // verify
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        basket.changeBasketSize(medium)
        basket.add("BGLS")
        basket.add("BGLO")
        expect(basket.changeBasketSize(small)).toEqual(expected)
        expect(basket.size).toEqual(10)

    })

    it("cannot remove items that are not in basket", () => {
        // set up
        const expected = "You cannot remove items that are not in your basket"
        // verify
        basket.add("BGLO")
        basket.add("BGLS")
        basket.remove("BBB")
        expect(basket.remove("BBB")).toEqual(expected)
    })

    it("check if item exists in basket, not there", () => {
        // verify
        basket.add("BGLO")
        basket.add("BGLS")
        expect(basket.inBasket("BGLW")).toEqual(0)
    })

    it("check if item exists in basket, not there", () => {
        // execute
        basket.add("BGLO")
        basket.add("BGLS")
        // verify
        expect(basket.inBasket("BGLO")).toEqual(1)
    })

    it("check price of basket", () => {
        // set up
        // execute
        basket.add("BGLO")
        basket.add("BGLS")
        basket.add("BGLO")
        basket.add("BGLS")
        // verify
        expect(basket.priceOfBasket()).toEqual(1.96)
    })

    it("check price of item", () => {
        expect(basket.priceOfBagel("BGLO")).toEqual("0.49")
    })

    it("check price of basket after special offer", () => {
        // set up
        // execute
        basket.changeBasketSize(large)
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        // verify
        expect(basket.priceOfBasket()).toEqual(2.49)
    })

    it("check price of basket after special offer", () => {
        // set up
        // execute
        basket.changeBasketSize(large)
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        basket.add("BGLO")
        // verify
        expect(basket.priceOfBasket()).toEqual(2.98)
    })

    it("check price of basket after special offer", () => {
        // set up
        // execute
        basket.changeBasketSize(large)
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        basket.add("BGLP")
        // verify
        expect(basket.priceOfBasket()).toEqual(3.99)
    })

    it("check price of basket after special offer", () => {
        // set up
        // execute
        basket.changeBasketSize(large)
        basket.add("COF")
        basket.add("BGLP")
        // verify
        expect(basket.priceOfBasket()).toEqual(1.25)
    })

    it("check price of basket after special offer", () => {
        // set up
        // execute
        basket.changeBasketSize(large)
        basket.add("COF")
        basket.add("BGLP")
        basket.add("BGLO")
        // verify
        expect(basket.priceOfBasket()).toEqual(1.87)
    })

    // it("check for receipt", () => {
    //     // set up
    //     // execute
    //     basket.changeBasketSize(large)
    //     basket.add('BGLO')
    //     basket.add('BGLP')
    //     basket.add('BGLE')
    //     // verify
    //     expect(basket.printReceipt()).toEqual(`.
    //     ~~~ Bob's Bagels ~~~

    //    ${Date().substring(3, 24)}

    // ----------------------------


    // Onion Bagel   1    £0.49 
    // Plain Bagel   1    £0.39 
    // Everything Bagel   1    £0.49 


    // ----------------------------
    // Total                  £1.37


    //        Thank you
    //      for your order!

    // .`)
    // })

})

