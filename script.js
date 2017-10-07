(function(){
	function getFormData(){
		const form = document.forms.data;
		const fx = form.fx.value.replace(/[\s*]/g,"");//звездочки убраны
		const a = Number(form.left_border.value);
		const b = Number(form.right_border.value); 
		const e = 0.1;//Number(form.error.value);
		//проверить корректность данных. В случае неверного заполнения дать понять пользователю информатиынфм окном

		let arr,arg1,arg2,arg3,sign1,sign2;
		let count_x = fx.match(/x/ig);

		if(count_x === null){
			console.log("Некорректная функция");
		}

		if(count_x.length == 2){ // a и b есть точно
			arr = fx.split(/[+-]/g);
			sign1 = fx[fx.indexOf("x")+3];
			if(arr.length == 3){ // значит все элементы на месте
				sign2 = fx[fx.indexOf("x",5)+1];
				for(let tmp,i = 0; i < arr.length; i++){
					tmp = arr[i].indexOf("x");
					if(tmp == -1) {
						arr[i] = Number(arr[i]);
						continue;
					}
					if(tmp == 0){
						arr[i] = 1;
					}else{
						arr[i] = Number(arr[i].substr(0,tmp));
					}	
				}
				arg1 = arr[0];
				arg2 = arr[1];
				arg3 = arr[2];

				let f_a = calcFx(a,arg1,arg2,arg3,sign1,sign2);
		 		let f_b = calcFx(b,arg1,arg2,arg3,sign1,sign2);
		 		if(a*b < 0){
					//console.log("все нормально. знак поменялся");
					document.getElementById("error").innerHTML = "";
					let x = dichotomy(arg1,arg2,sign1,a,b,e);
					document.getElementById("dih_n1").innerHTML = x.N;
					document.getElementById("dih_a1").innerHTML = x.a;
					//console.log(x);
					//GOLD SECTION
					let x2 = goldSection(arg1,arg2,arg3,sign1,sign2,a,b,e);
					console.log(x2);

					//-----------
					//let x3 = search(arg1,arg2,arg3,sign1,sign2,a,b,e);
					console.log("search = "+ x3);

				}else{
					document.getElementById("error").innerHTML = "<br>Знак не поменялся, выберите другой интервал";
				}
			}else{ // нету цешки
				delete sign2;
				for(let tmp,i = 0; i < arr.length; i++){
					tmp = arr[i].indexOf("x");
					if(tmp == 0){
						arr[i] = 1;
					}else{
						arr[i] = Number(arr[i].substr(0,tmp));
					}
				}
				arg1 = arr[0];
				arg2 = arr[1];
				let f_a = calcFx(a,arg1,arg2,sign1);
		 		let f_b = calcFx(b,arg1,arg2.sign1);
		 		if(a*b < 0){
					//console.log("все нормально. знак поменялся");
					document.getElementById("error").innerHTML = "";
					let x = dichotomy(arg1,arg2,sign1,a,b,e);
					//console.log(x);
					let x2 = goldSection(arg1,arg2,sign1,a,b,e);

				}else{
					//console.log("Знак не менялся");
					document.getElementById("error").innerHTML = "<br>Знак не поменялся, выберите другой интервал";
				}

			}
		}else{ // один икс в квадрате(первая проверка отмела вариант с несуществованием)
			console.log("c = "+ 0);
		}
		
	}

	goform.addEventListener("click", getFormData);

})();
function calcFx(par,arg1,arg2,arg3,sign1,sign2){ // Надо разобраться. либо сделать явное присваивание своим переменным в пробежке по аргументам. но такая хуйня не катит
	if(arguments.length == 6){
		if(sign1 == '+'){
			if(sign2 == '+'){
				return arg1*Math.pow(par,2)+arg2*par+arg3;
			}else{
				return arg1*Math.pow(par,2)+arg2*par-arg3;
			}
		}else{
			if(sign2 == '+'){
				return arg1*Math.pow(par,2)-arg2*par+arg3;
			}else{
				return arg1*Math.pow(par,2)-arg2*par-arg3;
			}
		}
	}
	else if(arguments.length == 4){	// else if каряво в данном случе, где ELSE?
		if(sign1 == '+'){
			return arg1*Math.pow(par,2)+arg2*par;
		}else{
			return arg1*Math.pow(par,2)-arg2*par;
		}
	}
	
};

function dichotomy(arg1,arg2,sign1,a,b,e){
	this.a = a;
	this.b = b;
	let dif = Math.abs(b-a);
	let c;
	let tmp;
	let arr;
	let i = 0;

	let dichotomy = document.getElementById("dichotomy");
	let result = document.createElement("p");
	dichotomy.appendChild(result);
	// dx_f = 2*arg1 sign1 arg2
	while((b-a) >= e && tmp != 0){
		c = (a+b)/2;
		if(sign1 == '+'){
			tmp = (2*arg1)*c + arg2;
			if(tmp > 0) b = c;
			else a = c;
		}else{
			tmp = (2*arg1)*c - arg2;
			if(tmp > 0) b = c;
			else a = c;
		}
		result.innerHTML = "["+a+";"+b+"] c = "+ c + "<br>";
		//console.log("["+a+";"+b+"]  c = "+ c);
		i++;
	}
	 result.innerHTML += "<br> x* = "+c;
	 let alpha = (Math.abs(b-a))/dif; // а N это и есть i. хз.
	 console.log(alpha);
	 return {"c":c,
	 		 "N":i,
	 		 "a": alpha,
	 		};//можно будет вернуть объект из полей середины, и оценок
};

// не работает с x^2 -10x!!!!!!!!!!!!!!!!
function goldSection(arg1,arg2,arg3,sign1,sign2,a,b,e){
	this.a = a;
	this.b = b;
	//1)
	let lambda = a + 0.382 * (b - a);
	let tau = a + 0.618 * (b - a);
	console.log("lambda = " + lambda + " tau = "+ tau);

	let f_lambda; 
	let f_tau; 
	//console.log("f_lambda = " + f_lambda + " f_tau = "+ f_tau);

	let i = 0;
	while((b-a) >=e){
		f_lambda = calcFx(lambda,arg1,arg2,arg3,sign1,sign2);
		f_tau = calcFx(tau,arg1,arg2,arg3,sign1,sign2);
		if(f_lambda > f_tau){
			a = lambda;
			lambda = tau;
			tau = a+0.618*(b-a);
			f_tau = calcFx(tau,arg1,arg2,arg3,sign1,sign2);
		}else{
			b = tau;
			tau = lambda;
			lambda = a + 0.382 * (b - a);
			f_lambda = calcFx(lambda,arg1,arg2,arg3,sign1,sign2);
		}
		i++;
	}
	let x = (a+b)/2;
	return x;
};
function search(arg1,arg2,arg3,sign1,sign2,a,b,e){
	this.a = a;
	this.b = b;
	let n = (b-a)/e - 1;
	//console.log("n = "+n);
	let arr_x = [];
	for(let i = 0; i < n;i++){
		arr_x.push((a+i*(b-a)/(n+1)).toFixed(1));
		console.log("arr["+i+"] = "+ arr_x[i]);
	}
	console.log("arr search length = " + arr_x.length);
	let min = calcFx(arr_x[0],arg1,arg2,arg3,sign1,sign2);
	let x;
	let tmp;
	for(i in arr_x){
		tmp = calcFx(arr_x[i],arg1,arg2,arg3,sign1,sign2);
		if(tmp < min){
			min = tmp;
			x = arr_x[i];
		}
		else continue;
	}
	return x;
};