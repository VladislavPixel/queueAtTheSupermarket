import { arrShoppers } from "./utils/core.js"
import getNewShopper from "./utils/getNewShopper.js"

class QueueX{
	// Структура очереди с поддержкой циклического переноса
	#array
	#maxSize
	#top
	#rear
	#numberElements
	constructor(size) {
		this.#maxSize = size
		this.#array = new Array(this.#maxSize)
		this.#numberElements = 0
		this.#top = 0
		this.#rear = -1
	}
	getMaxSize() {
		return this.#maxSize
	}
	getSize() {
		return this.#numberElements
	}
	isEmpty() {
		return this.#numberElements === 0
	}
	isFull() {
		return this.#numberElements === this.#maxSize
	}
	peek() {
		if (this.isEmpty()) {
			console.log("queue is Empty!")
			return
		}
		return this.#array[this.#top]
	}
	push(newElement) {
		if (this.isFull()) {
			console.log("queue is full!")
			return false
		}
		if (this.#rear === this.#maxSize - 1) this.#rear = -1
		++this.#rear
		this.#array[this.#rear] = newElement
		++this.#numberElements
		return true
	}
	pop() {
		if (this.isEmpty()) {
			console.log("queue is empty!")
			return null
		}
		const deleteElement = this.#array[this.#top]
		++this.#top
		if (this.#top === this.#maxSize) this.#top = 0
		--this.#numberElements
		return deleteElement
	}
	displayQueue() {
		if (this.isEmpty()) {
			console.log("queue is empty")
			return
		}
		if (this.#top === this.#rear) {
			const { name, shoppingСart } = this.#array[this.#top]
			console.log(`Shopper: ${name}; У него в корзине: ${shoppingСart} позиций`)
			return
		}
		const isRingTransfer = this.#rear < this.#top
		const maxBorder = isRingTransfer ? this.#maxSize: this.#rear + 1
		let flag = true
		let m = this.#top
		let auxIndex = 0
		while(flag) {
			if (m < maxBorder) {
				const { name, shoppingСart } = this.#array[m]
				console.log(`Shopper: ${name}; У него в корзине: ${shoppingСart} позиций`)
				++m
			} else if (isRingTransfer && auxIndex <= this.#rear) {
				const { name, shoppingСart } = this.#array[auxIndex]
				console.log(`Shopper: ${name}; У него в корзине: ${shoppingСart} позиций`)
				++auxIndex
			} else {
				flag = false
			}
		}
	}
}

class BoxOffice{
	// Класс конкретной кассы (пользователь структурой)
	#maxSizeQueue
	#queueX
	#isCall
	#queuePromises
	constructor(size) {
		this.#maxSizeQueue = size
		this.#queueX = new QueueX(this.#maxSizeQueue)
		this.#queuePromises = new QueueX(this.#maxSizeQueue)
		this.#isCall = false
	}
	getSizeQueue() {
		return this.#queueX.getSize()
	}
	getMaxSizeQueue() {
		return this.#queueX.getMaxSize()
	}
	pushShopperInQueue(shopper) {
		this.#queueX.push(shopper)
		const promiseInstance = new Promise((resolve, reject) => {
			resolve(shopper.shoppingСart * 1000)
		})
		this.#queuePromises.push(promiseInstance)
	}
	showService() {
		if (this.#queuePromises.getSize() !== 0 && !this.#isCall) {
			this.#isCall = true
			this.#queuePromises.pop()
				.then((time) => {
					setTimeout(() => {
						this.#isCall = false
						this.#queueX.pop()
					}, time)
				})
		}
	}
	displayQueue() {
		this.#queueX.displayQueue()
		this.showService()
	}
}

class PullBoxOffice{
	// Класс символизирующий все кассы магазина, он внутри себя создает нужное количество BoxOffice
	#maxBoxOffice
	#pull
	constructor(numberBoxOffice, sizeQueue) {
		this.#maxBoxOffice = numberBoxOffice
		this.#pull = (function() {
			const result = []
			for (let m = 0; m < numberBoxOffice; m++) {
				result.push(new BoxOffice(sizeQueue))
			}
			return result
		})()
	}
	controllerShoppers(shopper) {
		// Распределяет людей, где меньше всего народу на кассе
		let indexBoxOffice = 0
		for (let m = 1; m < this.#maxBoxOffice; m++) {
			if (this.#pull[m].getSizeQueue() < this.#pull[indexBoxOffice].getSizeQueue()) indexBoxOffice = m
			if (m === this.#maxBoxOffice - 1) this.#pull[indexBoxOffice].pushShopperInQueue(shopper)
		}
	}
	globalDisplay() {
		for(let m = 0; m < this.#maxBoxOffice; m++) {
			console.log(`Вывод очереди под номером №${m + 1} ==============================================================`)
			this.#pull[m].displayQueue()
			console.log(`Вывод очереди завершен! =============================================================================================`)
		}
	}
}

class BoxOfficeApp{
	// Класс приложения
	static main() {
		const pullBoxOffice = new PullBoxOffice(4, 100)
		arrShoppers.forEach(people => pullBoxOffice.controllerShoppers(people))

		const btnMoreShopper = document.querySelector(".content__btn")
		btnMoreShopper.addEventListener("click", () => {
			const shopper = getNewShopper()
			pullBoxOffice.controllerShoppers(shopper)
		})
		setInterval(() => {
			console.clear()
			pullBoxOffice.globalDisplay()
			console.log(pullBoxOffice)
		}, 20000)
	}
}
BoxOfficeApp.main()
