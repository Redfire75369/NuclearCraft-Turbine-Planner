class TurbineBlade {
	constructor(name, minEff, coeff) {
		this.name = name;
	    this.efficiency = minEff;
	    this.coefficientFactor = coeff;
	}
}
class DynamoCoil {
	constructor(name, eff = 1) {
		this.name = name;
		this.efficiency = eff;
	}
}

function selectRotor(rotor) {
	document.getElementById("rotor_" + planner.activeRotor).parentElement.className = "turbinebox border";
	document.getElementById("rotor_" + rotor).parentElement.className = "turbinebox border selected";
	planner.activeRotor = rotor;
}
function setRotor(shaftPos) {
	planner.rotors[shaftPos] = planner.activeRotor;
}

function selectCoil(coil) {
	document.getElementById("coil_" + planner.activeCoil).className = "flex__col turbinebox turbinecoil border " + planner.activeCoil;
	document.getElementById("coil_" + coil).className = "flex__col turbinebox turbinecoil border selected " + coil;
	document.getElementById("coil_desc_" + planner.activeCoil).style.display = "none";
	document.getElementById("coil_desc_" + coil).style.display = "block";
	planner.activeCoil = coil;
}
function setCoil(x, y) {
	if (planner.coils[x][y] != "bearing") {
		planner.coils[x][y] = planner.activeCoil;
		activeDynamoCoils();
	}
}

function activeDynamoCoils() {
	for (let i = 1; i < planner.diameter + 1; i++) {
		for (let j = 1; j < planner.diameter + 1; j++) {
			switch (planner.coils[i - 1][j - 1]) {
				case "bearing":
					activeCoils[i - 1][j - 1] = true;
					break;
				case "connector":
					activeCoils[i - 1][j - 1] = atLeast(1, "magnesium", i - 1, j - 1) || atLeast(1, "beryllium", i - 1, j - 1) || atLeast(1, "aluminium", i - 1, j - 1) || atLeast(1, "copper", i - 1, j - 1) || atLeast(1, "gold", i - 1, j - 1) || atLeast(1, "silver", i - 1, j - 1);
					break;
				case "magnesium":
					activeCoils[i - 1][j - 1] = atLeast(1, "bearing", i - 1, j - 1) || atLeast(1, "connector", i - 1, j - 1);
					break;
				case "beryllium":
					activeCoils[i - 1][j - 1] = atLeast(1, "magnesium", i - 1, j - 1);
					break;
				case "aluminium":
					activeCoils[i - 1][j - 1] = atLeast(2, "magnesium", i - 1, j - 1);
					break;
				case "gold":
					activeCoils[i - 1][j - 1] = atLeast(1, "aluminium", i - 1, j - 1);
					break;
				case "copper":
					activeCoils[i - 1][j - 1] = atLeast(1, "beryllium", i - 1, j - 1);
					break;
				case "silver":
					activeCoils[i - 1][j - 1] = atLeast(1, "copper", i - 1, j - 1) && atLeast(1, "gold", i - 1, j - 1);
					break;
				default:
					activeCoils[i - 1][j - 1] = false;
			}
		}
	}
}

function getHorizontalCoils(x, y) {
	if (x == 0 && y == 0) {
		return {
			2: planner.coils[x + 1][y],
			3: planner.coils[x][y + 1]
		};
	} else if (x == 0 && y == planner.diameter - 1) {
		return {
			1: planner.coils[x][y - 1],
			2: planner.coils[x + 1][y]
		};
	} else if (x == planner.diameter - 1 && y == 0) {
		return {
			0: planner.coils[x - 1][y],
			3: planner.coils[x][y + 1]
		}
	} else if (x == planner.diameter - 1 && y == planner.diameter - 1) {
		return {
			0: planner.coils[x - 1][y],
			1: planner.coils[x][y - 1]
		}
	} else if (x == 0) {
		return {
			1: planner.coils[x][y - 1],
			2: planner.coils[x + 1][y],
			3: planner.coils[x][y + 1]
		}
	} else if (y == 0) {
		return {
			0: planner.coils[x - 1][y],
			2: planner.coils[x + 1][y],
			3: planner.coils[x][y + 1]
		}
	} else if (x == planner.diameter - 1) {
		return {
			0: planner.coils[x - 1][y],
			1: planner.coils[x][y - 1],
			2: planner.coils[x][y + 1]
		}
	} else if (y == planner.diameter - 1) {
		return [planner.coils[x - 1][y], planner.coils[x][y - 1], planner.coils[x + 1][y]];
	} else {
		return [planner.coils[x - 1][y], planner.coils[x][y - 1], planner.coils[x + 1][y], planner.coils[x][y + 1]];
	}
}

function keyIntoActivation(key, x, y) {
	if (key === undefined) {
		return false;
	}
	switch (key.toString()) {
		case "0":
			return activeCoils[y][x - 1];
		case "1":
			return activeCoils[y - 1][x];
		case "2":
			return activeCoils[y][x + 1];
		case "3":
			return activeCoils[y + 1][x];
		default:
			return false;
	}
}

function atLeast(amount, type, x, y) {
	let adjacent = getHorizontalCoils(x, y);
	let keys = Object.keys(adjacent);
	let bool = true;
	let activated = true;
	let key = 4;
	for (let i = 0; i < amount; i++) {
		adjacent[key] = undefined;
		key = Object.keys(adjacent).filter(key => adjacent[key] == type)[0];
		bool &= adjacent[key] == type;
		activated &= keyIntoActivation(key, x, y);
		for (let j = 0; j < 4 && !keyIntoActivation(key, x, y); j++) {
			adjacent[key] = undefined;
			key = Object.keys(adjacent).filter(key => adjacent[key] == type)[0];
			bool &= adjacent[key] == type;
			activated = keyIntoActivation(key, x, y);
		}
	}
	return bool && activated;
}