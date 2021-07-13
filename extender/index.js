const fs = require('fs')

let loadedAdditions = [];
function addAddition(addition, Eris) {
	let mod = require(`./extensions/${addition.replace(".", "/")}`);
	if(!~loadedAdditions.indexOf(addition)) {
		mod(Eris);
		loadedAdditions.push(addition);
	}

	if(mod.deps) mod.deps.forEach(dep => addAddition(dep, Eris));
}

module.exports = (Eris) => {
    
	let structs = fs.readdirSync(`${__dirname}/extensions`);
	structs.forEach(struct => {
		let additions = fs.readdirSync(`${__dirname}/extensions/${struct}/`);
		additions = additions.map(script => script.substring(0, script.length - 3));
		additions.forEach(addition => addAddition(`${struct}.${addition}`, Eris));
	});

	return Eris;
};