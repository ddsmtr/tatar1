(function(){
	goform.addEventListener("click", getFormData);
})();
// function test(){
// 	let path = window.location.href;
// 	let arr = path.split('/');
// 	console.log(arr);
//     // document.getElementsByTagName('a').each(function() {
//     //     if ('http://site.ru'+$(this).attr('href') == window.location.href)
//     //     {
//     //         $(this).addClass('active');
//     //     }
//     // });
// };
function getFormData(){
	const form = document.forms.data;
	const fx = form.fx.value.replace(/[\s*]/g,"");
	const a = Number(form.left_border.value);
	const b = Number(form.right_border.value); 
	const e = [0.1, 0.01, 0.001];

	let regFx = /[^\dx\*\-\+\^.]/ig;
	try{
		document.getElementById("error").style.display="none";
		form.fx.style.border="none";
		document.getElementById("error").innerHTML = "";
		if(fx.match(regFx) != null){
			throw new Error("нельзя вводить символы типа : " + fx.match(regFx));
		}
		if(isNaN(a) || isNaN(b)){
		 	throw new Error("некорректный интервал. Допустим только ввод чисел");	
		}

		//весь код
		if(fx.match(/x/ig).length == 2){// значит есть a и b
			if(~(fx.indexOf("^"))){// значит степень есть, работаем. Внимение, неочевидный вызов. тильда. означает что если результат отличен от -1
				const arrArg = fx.split(/[+-]/g);
				let fxSign = true;
				if(arrArg[0] == ""){
					arrArg.splice(0,1);
					fxSign = false;
					console.log("Отрицательная функция");
				}
				//--------------
				const sign1 = fx[fx.indexOf("x")+3];
				let sign2;
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
				});
				if(arrArg.length ==2){ // чисто последний шаг, дополнение аргументов до одинакового количесва у всех выражений
					sign2 = "+";
					arrArg.push(0);
				}else{
					sign2 = fx[fx.indexOf("x",fx.indexOf("x")+1)+1];
				}
				 console.log(arrArg);
				 console.log("sign1 = "+sign1+" , sign2 = "+sign2);

				// working...
				//let resFxA = calcFx(a,arrArg[0],arrArg[1],arrArg[2],sign1,sign2);
				//let resFxB = calcFx(b,arrArg[0],arrArg[1],arrArg[2],sign1,sign2);
				//console.log("check sign: fxa"+ resFxA+" , fxb = "+ resFxB);
				//if(resFxA*resFxB < 0){
					e.forEach(function(value,i){
						i+=1;
						let dih_n = "dih_n"+i;
						let dih_a = "dih_a"+i;
						let gold_n = "gold_n"+i;
						let gold_a = "gold_a"+i;
						let search_n = "search_n"+i;
						let search_a = "search_a"+i;

						let resultDichotomy = dichotomy(arrArg[0],arrArg[1],sign1,a,b,value);
						console.log(resultDichotomy);
						document.getElementById(dih_n).innerHTML = resultDichotomy.N;
						document.getElementById(dih_a).innerHTML = resultDichotomy.a.toFixed(4);
						console.log("-----------------------");
						let resultGold = goldSection(a,b,value,arrArg[0],arrArg[1],arrArg[2],sign1,sign2);
						console.log(resultGold);
						document.getElementById(gold_n).innerHTML = resultGold.N;
						document.getElementById(gold_a).innerHTML = resultGold.a.toFixed(4);

						console.log("-----------------------");
						let resultSearch = search(a,b,value,arrArg[0],arrArg[1],arrArg[2],sign1,sign2);
						console.log(resultSearch);
						document.getElementById(search_n).innerHTML = resultSearch.N;
						document.getElementById(search_a).innerHTML = resultSearch.a.toFixed(4);

						//document.getElementById("gold_decision").innerHTML += "------------ <br>" ;

					});
				//}else{
				//	console.log("знак не поменялся. необходимо выбрать другой интервал");
				//}

			}
			else{	// нет степени - нет работы
				throw new Error("нет степенной функции. Определить нельзя");
			}
		}
		else{ // есть a или b
			let message = (~(fx.indexOf("^"))) ? "c = 0" : "нет степенной функции. Определить нельзя"; // c=0 это не ошибка
			throw new Error(message);
		}
		//
	}
	catch(e){
		document.getElementById("error").innerHTML = "Произошла ошибка : " + e.message;
		document.getElementById("error").style.display="block";
		//form.fx.style.border="1px solid red";
	}
};
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
function goldSection(a,b,e,...args){//	(arg1,arg2,arg3,sign1,sign2)
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
		else{
			console.log("Ошибка");
		}
		
		if(valueFxFromLambda > valueFxFromTau){
			a = lambda;
			lambda = tau;
			tau = a+0.618*(b-a);
			valueFxFromTau = calcFx(tau, args[0],args[1],args[2],args[3],args[4]);
		}else{
			b = tau;
			tau = lambda;
			lambda = a + 0.382 * (b - a);
			valueFxFromLambda = calcFx(lambda, args[0],args[1],args[2],args[3],args[4]);
		}
		//console.log("["+a+";"+b+"]  c = " + (a+b)/2);
		//document.getElementById("gold_decision").innerHTML += "[" + a.toFixed(3) + ";" + b.toFixed(3) + "]  c = " + ((a+b)/2).toFixed(3) + "<br>";
		i++;
	}
	return {"x" : (a+b)/2, 
			"a" : (Math.abs(b-a))/intervalLengthStart,
			"N" : i
			};
};
function search(a,b,e,...args){
	let intervalLengthStart = Math.abs(b-a);
	let n = (b-a)/e - 1;
	let arr_x = [];
	for(let i = 0; i < n;i++){
		arr_x.push((a+i*(b-a)/(n+1)).toFixed(1));
		//console.log("arr["+i+"] = "+ arr_x[i]);
	}
	//console.log("arr search length = " + arr_x.length);
	let min = calcFx(arr_x[0],args[0],args[1],args[2],args[3],args[4]);
	let x,tmp;

	for(i in arr_x){
		tmp = calcFx(arr_x[i],args[0],args[1],args[2],args[3],args[4]);
		if(tmp < min){
			min = tmp;
			x = arr_x[i];
		}
		else continue;
	}
	return {"x" : Number(x),
			"a" : ((Math.abs(b-a))/n)/intervalLengthStart, //  УТОЧНИТЬ!
			"N" : Number(n)
			};
};