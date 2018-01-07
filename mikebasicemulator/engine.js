
var hettotalebestand;
var instructionpointer = 0;
var ticks = 5;
var intervalcontainer;
var scrnW = 640;
var scrnH = 480;
var ctx;
var curX = 0;
var curY = 0;
var curMX = 80;
var curMY = 24;
var curstate = 0;
var regelnummer = 1;
var isstring;
var canvastrigger;

var numbervars = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var stringvars = ["","","","","","","","",""];
var callstack = [0];

var functionslist = [
	["ALERT",alert]
];

function insertFunction(name,token){
	console.info("Adding function "+name);
	functionslist.push([name,token]);
}

function getFunction(name){
	for(var i = 0 ; i < functionslist.length ; i++){
		if(name==functionslist[i][0]){
			return functionslist[i][1];
		}
	}
	return null;
}

function vardump(){
	poputables.innerHTML = "";
	for(var i = 0 ; i < numbervars.length ; i++){
		poputables.innerHTML += "<tr><td>Numbervar "+i+"</td><td>"+(numbervars[i])+"</td></tr>";
	}
	for(var i = 0 ; i < stringvars.length ; i++){
		poputables.innerHTML += "<tr><td>Stringvar "+i+"</td><td>"+(stringvars[i])+"</td></tr>";
	}
}

function fgetc(add){
	if(add){
		if(hettotalebestand[instructionpointer]=='\n'){
			regelnummer++;
		}
	}
	return hettotalebestand[add?instructionpointer++:instructionpointer];
}

function loadBASfromFile(event){
	console.info("loadBASfromFile called");
	if(event.target.files.length>0){
		var sellectedfile = event.target.files[0];
		document.title = sellectedfile.name + " - MikeBASIC Interpeter by Sanderslando";
		var filereader = new FileReader();
		filereader.onerror = function(e){
			window.alert("Unable to open file");
			console.err("Unable to open file");
		};
		filereader.onload = function(e){
			console.info("Load finished");
			hettotalebestand = e.target.result;
			setupEnv();
		}
		filereader.readAsText(sellectedfile);
	}else{
		window.alert("You sellected none or more as one file");
		console.err("Too much files selected");
	}
}

function printf(string){
	for(var i = 0 ; i < string.length ; i++){
		putc(string[i]);
	}
}

function putc(ch){
	if(ch=='\n'){
		curY++;
		curX = 0;
		if(curY==25){
			cls();
		}
	}else{
		ctx.font = "12px bold Consolas";
		ctx.fillStyle = "white";
		ctx.fillText(ch+"",curX*(scrnW/curMX),curY*(scrnH/25));
		curX++;
		if(curX==curMX){
			curY++;
			curX = 0;
		} 
	}
}

function cls(){
	curX = 0;
	curY = 1;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,scrnW,scrnH);
}

function halt(){
	window.clearInterval(intervalcontainer);
	cls();
	printf(" >>> BASIC PROGRAM FINISHED <<< ");
}

function syntaxisError(reason){
	halt();
	var y = 1;
	var z = 0;
	while(z < instructionpointer){
		if(hettotalebestand[z]=='\n'){
			y++;
		}
		z++;
	}
	var message = "Syntaxis error at line "+y+"!\n"+(hettotalebestand.split("\n")[y-1])+"\n"+reason+"\n\nSystem halted";
	window.alert(message);
	console.warn(message);
}

function nextWord(istext){
	var commandbuffer = "";
	var deze;
	var cmos = fgetc(false)=='\"';
	if(cmos){
		fgetc(true);
	}
	isstring = cmos;
	while((deze = fgetc(true))!='\n'){
		if((deze==' '&&!cmos)||(cmos&&deze=='\"')){
			if(commandbuffer.length>0||cmos){
				break;
			}
		}else{
			commandbuffer += deze;
		}
	}
	return commandbuffer;
}

function skipToEndOfLine(){
	var deze;
	while((deze = fgetc(true))!='\n'){}
	if(fgetc(false)=='\r'){
		fgetc(true);
	}
}



function getStringVariabele(stringvar){
	if(stringvar[0]=='$'){
		if(stringvar.length==2){
			return stringvars[Number(stringvar[1])];
		}else{
			syntaxisError("String variabele invalid");
		}
	}else{
		return stringvar;
	}
}

function setStringVariabele(stringvar,stringset){
	stringvars[Number(stringvar[1])] = stringset;
	vardump();
}

function getCodeFromA(stringvar){
	return Number((stringvar[0].toUpperCase()).charCodeAt(0))-Number("A".charCodeAt(0));
}

function isStringvar(stringvar){
	return stringvar[0]=='$'; 
}

function getNumberVariabele(stringvar){
	if ('0123456789'.indexOf(stringvar[0]) !== -1) {
		return Number(stringvar);
	}else{
		return numbervars[getCodeFromA(stringvar)];
	}
}

function setNumberVariabele(stringvar,stringset){
	numbervars[getCodeFromA(stringvar)] = stringset;
	vardump();
}

var reqinp = false;
var bfrt;
var targz = "";
var lstp;
var waitkey = false;

function registerkeypress(e){
	var t = e.keyCode? e.keyCode : e.charCode;
	if(t!=13){
		lstp = String.fromCharCode(t);
	}else{
		lstp = '\n';
	}
}

function tick(){
	if(reqinp){
		canvastrigger.focus();
		if(lstp!=null){
			if(lstp!='\n'){
				targz += lstp;
				putc(lstp);
			}else{
				reqinp = false;
				setStringVariabele(bfrt,targz);
			}
			lstp = null;
		}
		return;
	}
	if(waitkey){
		if(lstp!=null){
			setNumberVariabele(bfrt,lstp);
			lstp = null;
			waitkey = false;
		}
		return;
	}
	var commandbuffer = nextWord(false);
	if(commandbuffer.length>0){
		var func = getFunction(commandbuffer.toUpperCase());
		if(func!=null){
			func();
		}else{
			if(commandbuffer[commandbuffer.length-1]==':'){
					// is een functiepoointer
			}else if(commandbuffer.toUpperCase()==commandbuffer&&commandbuffer[0]!='$'&&commandbuffer.length!=1){
				// is in hoofdletters, is een functie, functie bestaat niet
				syntaxisError("Unknown token: "+commandbuffer);
			}else{
				// is in kleine letters, is een statement
				// een statement is meestal a = 1
				// als een statement begint met een $ dan is het tweede deel een string, anders is het een int
				if(nextWord(false)!="="){
					syntaxisError("Expected: = ");
				}
				var tweede = nextWord(false);
				if(isstring){
					setStringVariabele(commandbuffer,tweede);
				}else{
					setNumberVariabele(commandbuffer,tweede);
				}
			}
		}
	}
}

function setupEnv(){
	instructionpointer = 0;
	curX = 0;
	curY = 0;
	regelnummer = 1;
	for(var i = 0 ; i < stringvars.length ; i++){
		stringvars[i] = "                                                                                                                                         ";
	}
	for(var i = 0 ; i < numbervars.length ; i++){
		numbervars[i] = 0;
	}
	window.clearInterval(intervalcontainer);
	vardump();
	console.info("setup interpeterprocessor ticks to "+ticks);
	intervalcontainer = window.setInterval(tick,ticks);
}


function registerFileListeners(idname){
	console.info("Adding loadfile triggers");
	var tar = document.getElementById(idname);
	tar.addEventListener('change', loadBASfromFile, false);
}

function registerCanvasListeners(idname){
	console.info("Adding canvas triggers");
	canvastrigger = document.getElementById(idname);
	ctx = canvastrigger.getContext("2d");
	canvastrigger.focus();
}

var nextand = false;
function handleBoolean(){
	var word1 = nextWord(false);
	var word2 = nextWord(false);
	var word3 = nextWord(false);
	var word4 = nextWord(false).toUpperCase();
	if(word4=="AND"){
		nextand = true;
	}else if(word4=="THEN"){
		nextand = false;
	}else{
		nextand = false;
		syntaxisError("Expected: AND or THEN");
	}
	if(word2=="="){
		if(isStringvar(word1)){
			return getStringVariabele(word1)==getStringVariabele(word3);
		}else{
			return getNumberVariabele(word1)==getNumberVariabele(word3);
		}
	}else if(word2=="<"){
		if(isStringvar(word1)){
			syntaxisError("< operator only for numbercomparing");
		}else{
			return getNumberVariabele(word1)<getNumberVariabele(word3);
		}
	}else if(word2==">"){
		if(isStringvar(word1)){
			syntaxisError("> operator only for numbercomparing");
		}else{
			return getNumberVariabele(word1)>getNumberVariabele(word3);
		}
	}else{
		syntaxisError("Expected EXPR1 = EXPR2 or EXPR1 < EXPR2 or EXPR1 > EXPR2");
	}
	return false;
}


function init(){
	document.body.addEventListener('keypress',registerkeypress,true);
	insertFunction("REM",function(e){
		skipToEndOfLine();
	});
	insertFunction("ALERT",function(e){
		window.alert(getStringVariabele(nextWord(false)));
	});
	insertFunction("ASKFILE",function(e){syntaxisError("Not supported yet");});
	insertFunction("BREAK",function(e){syntaxisError("Not supported yet");});
	insertFunction("CALL",function(e){syntaxisError("Not supported yet");});
	insertFunction("CASE",function(e){
		var type = nextWord(false);
	    	var name = nextWord(false);
	    	if(type=="LOWER"){
	    		setStringVariabele(name,getStringVariabele(name).toLowerCase());
	    	}else if(type=="UPPER"){
	    		setStringVariabele(name,getStringVariabele(name).toUpperCase());
	    	}
	});
	insertFunction("CLS",function(e){
		// CLS
	    	// clears the screen
	    	cls();
	});
	insertFunction("CURSOR",function(e){syntaxisError("Not supported yet");});
	insertFunction("CURSCHAR",function(e){syntaxisError("Not supported yet");});
	insertFunction("CURSCOL",function(e){syntaxisError("Not supported yet");});
	insertFunction("CURSPOS",function(e){syntaxisError("Not supported yet");});
	insertFunction("DELETE",function(e){syntaxisError("Not supported yet");});
	insertFunction("DO",function(e){syntaxisError("Not supported yet");});
	insertFunction("END",function(e){
		halt();
	});
	insertFunction("FILES",function(e){syntaxisError("Not supported yet");});
	insertFunction("FOR",function(e){syntaxisError("Not supported yet");});
	insertFunction("GETKEY",function(e){syntaxisError("Not supported yet");});
	insertFunction("GOSUB",function(e){
		var location = nextWord(false);
		console.info("Calling label "+location);
		callstack.push(instructionpointer);
		instructionpointer = hettotalebestand.indexOf(location+":");
	});
	insertFunction("GOTO",function(e){
		var location = nextWord(false);
		console.info("Jumping to label "+location);
		instructionpointer = hettotalebestand.indexOf(location+":");
	});
	insertFunction("IF",function(e){
		var bools = true;
		nextand = true;
		while(nextand){
			var res = handleBoolean();
			if(!res){
				bools = false;
			}
		}
		if(bools){
			tick();
		}else{
			skipToEndOfLine();
		}
	});
	insertFunction("INCLUDE",function(e){syntaxisError("Not supported yet");});
	insertFunction("CALL",function(e){syntaxisError("Not supported yet");});
	insertFunction("INK",function(e){syntaxisError("Not supported yet");});
	insertFunction("INPUT",function(e){
		// INPUT var
	    	reqinp = true;
	    	bfrt = nextWord(false);
	    	targz = "";
	});
	insertFunction("LEN",function(e){syntaxisError("Not supported yet");});
	insertFunction("LISTBOX",function(e){syntaxisError("Not supported yet");});
	insertFunction("LOAD",function(e){syntaxisError("Not supported yet");});
	insertFunction("MOVE",function(e){syntaxisError("Not supported yet");});
	insertFunction("NEXT",function(e){syntaxisError("Not supported yet");});
	insertFunction("NUMBER",function(e){syntaxisError("Not supported yet");});
	insertFunction("PAGE",function(e){syntaxisError("Not supported yet");});
	insertFunction("PAUSE",function(e){syntaxisError("Not supported yet");});
	insertFunction("PEEK",function(e){syntaxisError("Not supported yet");});
	insertFunction("POKE",function(e){syntaxisError("Not supported yet");});
	insertFunction("PORT",function(e){syntaxisError("Not supported yet");});
	insertFunction("PRINT",function(e){
	    	// systeem print een string PRINT string ;
	    	// systeem print een string PRINT string
	    	var x = nextWord(false);
	    	printf(getStringVariabele(x));
	    	if(nextWord(false)!=";"){
	    		printf("\n");
	    	}
	});
	insertFunction("RAND",function(e){
		var writeto = nextWord(false);
		var minimal = nextWord(false);
		var maximal = nextWord(false);
		setNumberVariabele(writeto,Math.floor(Math.random() * getNumberVariabele(maximal)) + getNumberVariabele(minimal)) ;
	});
	insertFunction("READ",function(e){syntaxisError("Not supported yet");});
	insertFunction("RENAME",function(e){syntaxisError("Not supported yet");});
	insertFunction("RETURN",function(e){
		instructionpointer = callstack.pop();
	});
	insertFunction("SAVE",function(e){syntaxisError("Not supported yet");});
	insertFunction("SERIAL",function(e){syntaxisError("Not supported yet");});
	insertFunction("SIZE",function(e){syntaxisError("Not supported yet");});
	insertFunction("SOUND",function(e){syntaxisError("Not supported yet");});
	insertFunction("STRING",function(e){syntaxisError("Not supported yet");});
	insertFunction("WAITKEY",function(e){
		waitkey = true;
		bfrt = nextWord(false);
	});
	cls();
	printf(" >> press OPEN to open a MikeBASIC file on your computer << ");
}

