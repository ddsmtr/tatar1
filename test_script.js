(function(){
	function getFormData(){
		const form = document.forms.data;
		const fx = form.fx.value.replace(/[\s*]/g,""); // Надо доработать, чтобы чепуху нельзя было ввести
		const a = Number(form.left_border.value);
		const b = Number(form.right_border.value); 
		//const e = Number(form.error.value);
		//const e = [0.1, 0.01, 0.001];
		const e = 0.1;

		//console.log("fx = "+fx+", a = "+a+", b = "+b + ", e = "+e);

		if(fx.match(/x/ig).length == 2){	// значит есть a и b


			if(~(fx.indexOf("^"))){// значит степень есть, работаем. Внимение, неочевидный вызов. тильда. означает что если результат отличен от -1

				//.. работаем
				const arrArg = fx.split(/[+-]/g);
				let fxSign = true;
				if(arrArg[0] == ""){
					//delete arrArg[0];
					arrArg.splice(0,1);
					fxSign = false;
					console.log("Отрицательная функция");
				}
				
				//console.log(arrArg);

				const sign1 = fx[fx.indexOf("x")+3];
				if(arrArg.length == 3){ // все лементы на месте (abc)	
					const sign2 = fx[fx.indexOf("x",fx.indexOf("x")+1)+1];// второй знак - это поиск x2 с позиции нахождения x1+1
					//console.log("sign1 = " + sign1 + ",sign2 = " + sign2);
					arrArg.forEach(function(value,i){
						if(~(value.indexOf("x"))){
							if(value[0] == "x" && fxSign == true){
								arrArg.splice(i,1,1);
								//value = 1;
								fxSign = true;// чтобы сбросить будевый тип, иначе он будет ко всем аргументам минус лепить
							}else if(value[0] == "x" && fxSign == false){
								arrArg.splice(i,1,-1);
								//value = -1;
								fxSign = true;
							}
							else if(fxSign == false){
								arrArg.splice(i,1,Number("-" + value.substr(0,value.indexOf("x"))));
								//value = Number("-" + value.substr(0,value.indexOf("x")));
								fxSign = true;
							}	
							else{
								arrArg.splice(i,1,Number(value.substr(0,value.indexOf("x"))));
								//value = Number(value.substr(0,value.indexOf("x")));
								fxSign = true;
							}		
						}
						else{
							arrArg.splice(i,1,Number(value));
							//value = Number(value)
							fxSign = true;
						}
						//console.log(value);
					});

					// данные готовы.
					// знаки в виде отдельных переменных
					// аргументы находятся в массиве по порядку
					// работаем

					let resFxA = calcFx(a,arrArg[0],arrArg[1],arrArg[2],sign1,sign2);
					let resFxB = calcFx(b,arrArg[0],arrArg[1],arrArg[2],sign1,sign2);
					if(resFxA*resFxB < 0){
						// do...
						//console.log("global a before function = "+a);
						//let resultDichotomy = dichotomy(arrArg[0],arrArg[1],sign1,a,b,e);
						//console.log(resultDichotomy);
						//console.log("-----------------------");
						//let resultGold = goldSection(a,b,e,arrArg[0],arrArg[1],arrArg[2],sign1,sign2);
						//console.log(resultGold);

					}else{
						console.log("знак не поменялся. необходимо выбрать другой интервал");
					}
					
				}
				else{ // отсутствует c
					//console.log("sign1 = " + sign1);
					arrArg.forEach(function(value,i){
						if(value[0] == "x" && fxSign == true){
							arrArg.splice(i,1,1);
							//value = 1;
							fxSign = true;
						}else if(value[0] == "x" && fxSign == false){
							arrArg.splice(i,1,-1);
							//value = -1;
							fxSign = true;
						}
						else if(fxSign == false){
							arrArg.splice(i,1,Number("-" + value.substr(0,value.indexOf("x"))));
							//value = Number("-" + value.substr(0,value.indexOf("x")));
							fxSign = true;
						}	
						else{
							arrArg.splice(i,1,Number(value.substr(0,value.indexOf("x"))));
							//value = Number(value.substr(0,value.indexOf("x")));
							fxSign = true;
						}	
						//console.log(value);
					});
					let resFxA = calcFx(a,arrArg[0],arrArg[1],sign1);
					let resFxB = calcFx(b,arrArg[0],arrArg[1],sign1);
					if(resFxA*resFxB < 0){
						// do...
						// console.log("global a before function = "+a);
						// dichotomy(a);
						// console.log("global a after function= " + a);
					}else{
						console.log("знак не поменялся. необходимо выбрать другой интервал");
					}

				}

				// действия все должны проискходить выше, в блоках иф-елсе.
				// это чисто декоратиыный вывод
				// arrArg.forEach(function(val,i,arr){
				// 	console.log("item = " + val + ", i = " + i + ", (массив:" + arr + ")");
				// });

			}else{// степени нет, работы нет
				console.log("нет степенной функции. Определить нельзя");
			}
		}
		else{ // есть a или b
			if(~(~(fx.indexOf("^")))){// значит степень есть, работаем
				console.log("c = 0");	// есть а
			}else{// степени нет, работы нет
				console.log("нет степенной функции. Определить нельзя");
			}
		}


	}
	goform.addEventListener("click", getFormData);
})();
function calcFx(param,...args){
	//console.log(args);// выведет только последующие введенные аргументы после 3х
	if(args.length == 5){ // (arg1,arg2,arg3,sign1,sign2)
		if(args[3] == '+'){
			if(args[4] == '+'){
				return args[0]*Math.pow(param,2)+args[1]*param+args[2];
			}else{
				return args[0]*Math.pow(param,2)+args[1]*param-args[2];
			}
		}else{
			if(args[4] == '+'){
				return args[0]*Math.pow(param,2)-args[1]*param+args[2];
			}else{
				return args[0]*Math.pow(param,2)-args[1]*param-args[2];
			}
		}
	}
	else if(args.length == 3){// (arg1,arg2, sign1)
		if(args[3] == '+'){
			return args[0]*Math.pow(param,2)+args[1]*param;
		}else{
			return args[0]*Math.pow(param,2)-args[1]*param;
		}
	}
	else{
		console.log("ошибочка");
	}
};
function dichotomy(arg1,arg2,sign1,a,b,e){
	let intervalLengthStart = Math.abs(b-a);
	let c, valueDxFx;
	let i = 0;
	while((b-a) >= e && valueDxFx != 0){
		c = (a+b)/2;
		if(sign1 == '+'){
			valueDxFx = (2*arg1)*c + arg2;
			if(valueDxFx > 0) b = c;
			else a = c;
		}else{
			valueDxFx = (2*arg1)*c - arg2;
			if(valueDxFx > 0) b = c;
			else a = c;
		}
		//console.log("["+a+";"+b+"]  c = "+ c);
		i++;
	}
	return {"x" : c,
			"a" : (Math.abs(b-a))/intervalLengthStart,
			"N" : i
			};
};
function goldSection(a,b,e,...args){//	(arg1,arg2,arg3,sign1,sign2) or (arg1,arg2,sign1)
	let intervalLengthStart = Math.abs(b-a);
	let lambda = a + 0.382 * (b - a);
	let tau = a + 0.618 * (b - a);
	let valueFxFromLambda, valueFxFromTau;

	let i = 0;

	while((b-a) >= e){
		if(args.length == 5){
			valueFxFromLambda = calcFx(lambda, args[0],args[1],args[2],args[3],args[4]);
			valueFxFromTau = calcFx(tau, args[0],args[1],args[2],args[3],args[4]);
		}
		else if(args.length == 3){
			valueFxFromLambda = calcFx(lambda, args[0],args[1],args[2],a,args[4]);
			valueFxFromTau = calcFx(tau, args[0],args[1],args[2],args[3],args[4]);
		}
		else{
			console.log("Ошибка");
		}
		
		if(valueFxFromLambda > valueFxFromTau){
			a = lambda;
			lambda = tau;
			tau = a+0.618*(b-a);
			valueFxFromTau = calcFx(tau, args.forEach(function(value,i){return value;}));
		}else{
			b = tau;
			tau = lambda;
			lambda = a + 0.382 * (b - a);
			valueFxFromLambda = calcFx(lambda, args.forEach(function(value,i){return value;}));
		}
		//console.log("["+a+";"+b+"]  c = " + (a+b)/2);
		i++;
	}
	return {"x" : (a+b)/2, 
			"a" : (Math.abs(b-a))/intervalLengthStart,
			"N" : i
			};
};