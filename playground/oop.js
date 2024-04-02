
class class1 {
    static number = 10
    marks = 30
    constructor (name) {
        console.log("Ithe yeto ka taripan..?")
        this.name = name
    }

    printName () {
        console.log("Name is " + this.name + " " + this.marks)
        console.log(this.number)
    }

    static printAgain () {
        return 10
    }

    static canPrint () {
        console.log(this.number + this.printAgain())
    }
}

// console.log(class1.number)
// class1.number = 20;
// console.log(class1.number)

class1.canPrint()

new class1().printName()

return

class class2 extends class1 {
    constructor (name) {
        super(name)
    }

    // c2PrintName () {
    //     super.printName()
    // }
}

let obOfC2 = new class2("Niranjan");
// obOfC2.c2PrintName()
obOfC2.printName()
console.log("Numer => ", class2.number)

