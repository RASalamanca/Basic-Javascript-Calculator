(function(){

/* 
 * View
 */
const updateView = (function(){
	function history(num){
		document.getElementById("history-value").innerText = num;
	}

	function output(num){
		document.getElementById("output-value").innerText = num;
	}

	return {
		history: history,
		output: output
	};
})();

/*
 * State Objects
 */
const formula = (function(){
	var registry = "";

	function add(element){
		registry = registry.concat(element);
	}

	function remove(size){
		registry = registry.substr(0, registry.length - size);
	}

	function evaluate(){
		return eval(registry.replace(/,/g,''));
	}

	function get(){
		return registry;
	}

	function clear(){
		registry = "";
	}

	return {
		add: add,
		remove: remove,
		evaluate: evaluate,
		get: get,
		clear: clear
	};
})();

const inputNumber = (function(){
	var lastNumber = "";

	function add(digit){
		lastNumber = lastNumber.concat(digit);
	}

	function remove(){
		if(lastNumber != ""){
			lastNumber = lastNumber.substr(0, lastNumber.length - 1);
		}
	}

	function get(){
		let fnum = Number(lastNumber).toLocaleString();
		let num = lastNumber;

		return {
			formatted: fnum,
			unformatted: num
		};
	}

	function clear(){
		lastNumber = "";
	}

	return {
		add: add,
		remove: remove,
		get: get,
		clear: clear
	};
})();

const numberHistory = (function(){
	var numberStack = [];

	function pushNumber(number){
		numberStack.push(number)
	}

	function popNumber(){
		return numberStack.pop();
	}

	function dump(){
		numberStack.length = 0;
	}

	return {
		pushNumber: pushNumber,
		popNumber: popNumber,
		dump: dump
	};
})();

/*
 * Buttons
 */
const button = {
	clear : document.getElementById("clear"),
	backspace : document.getElementById("backspace"),
	equal : document.getElementById("="),
	dot : document.getElementById("."),
	operators : document.getElementsByClassName("operator"),
	numbers : document.getElementsByClassName("number"),

	pressClear: function(){	
		inputNumber.clear();
		numberHistory.dump();
		formula.clear();
		updateView.output("");
		updateView.history("");
	},

	pressBackspace: function(){
		if(inputNumber.get().unformatted == ""){
			inputNumber.add(numberHistory.popNumber());
			formula.remove(inputNumber.get().formatted.length + 1);
		}
		else{
			inputNumber.remove();
		}
		updateView.output(formula.get() + inputNumber.get().formatted);
	},

	pressEqual: function(){
		if(inputNumber.get().unformatted != ""){
			formula.add(inputNumber.get().formatted);
			inputNumber.clear();
			numberHistory.dump();
			inputNumber.add(formula.evaluate())
			updateView.output(inputNumber.get().formatted);
			updateView.history(formula.get());
			formula.clear();
		}
	},

	pressDot: function(){
		if(inputNumber.get().unformatted == ""){
			inputNumber.add("0.");
			updateView.output(formula.get() + inputNumber.get().formatted);
		}
		else if(inputNumber.get().unformatted.search(/[.]/g) == -1){
			inputNumber.add(".");
			updateView.output(formula.get() + inputNumber.get().formatted);
		}
	},

	pressNumber: function(){
		inputNumber.add(this.id);
		updateView.output(formula.get() + inputNumber.get().formatted);
	},

	pressOperator: function(){
		if(inputNumber.get().unformatted != ""){
			formula.add(inputNumber.get().formatted);
			numberHistory.pushNumber(inputNumber.get().unformatted);
			inputNumber.clear();
			formula.add(this.id);
			updateView.output(formula.get());
		}
		else{
			formula.remove(1);
			if(formula.get() != "" || this.id == "-"){
				formula.add(this.id);
				updateView.output(formula.get());
			}
		}
	}
};

//Event Listeners
button.clear.addEventListener('click', button.pressClear);
button.backspace.addEventListener('click', button.pressBackspace);
button.equal.addEventListener('click', button.pressEqual);
button.dot.addEventListener('click', button.pressDot);

for(let i = 0; i < button.numbers.length; i++){
	button.numbers[i].addEventListener('click', button.pressNumber);
}
for(let i = 0; i < button.operators.length; i++){
	button.operators[i].addEventListener('click', button.pressOperator);
}

})();
