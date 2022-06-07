const namesArr = [
	"Anna",
	"Elizaveta",
	"Vlad",
	"Lera",
	"Luizsa",
	"Dragunich",
	"Slifter",
	"Morbuis"
]

function getNewShopper() {
	const newPeople = {}
	newPeople.name = namesArr[Math.floor(Math.random() * namesArr.length)]
	newPeople.shoppingСart = Math.ceil(Math.random() * 15)

	return newPeople
}

export default getNewShopper
