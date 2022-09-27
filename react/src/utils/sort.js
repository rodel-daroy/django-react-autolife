export const sortListByAlphabetsOrder = array => {
	const sortedArray = (array ? array.sort((obj1, obj2) => {
		if (obj1.name < obj2.name) return -1;
		else if (obj1.name > obj2.name) return 1;
		return 0;
	}) : '');

	return sortedArray;
};