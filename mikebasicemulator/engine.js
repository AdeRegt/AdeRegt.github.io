
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
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,scrnW,scrnH);
}

function syntaxisError(reason){
	window.clearInterval(intervalcontainer);
	window.alert("Syntaxis error at line "+regelnummer+"!\n"+(hettotalebestand.split("\n")[regelnummer-1])+"\n"+reason+"\n\nSystem halted");
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


function init(){
	document.body.addEventListener('keypress',registerkeypress,true);
	insertFunction("REM",function(e){
		skipToEndOfLine();
	});
	insertFunction("ALERT",function(e){
		window.alert(getStringVariabele(nextWord(false)));
	});
	insertFunction("ASKFILE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("BREAK",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("CALL",function(e){syntaxisError("Momenteel niet ondersteund");});
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
	insertFunction("CURSOR",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("CURSCHAR",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("CURSCOL",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("CURSPOS",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("DELETE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("DO",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("END",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("FILES",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("FOR",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("GETKEY",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("GOSUB",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("GOTO",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("IF",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("INCLUDE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("CALL",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("INK",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("INPUT",function(e){
		// INPUT var
	    	reqinp = true;
	    	bfrt = nextWord(false);
	});
	insertFunction("LEN",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("LISTBOX",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("LOAD",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("MOVE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("NEXT",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("NUMBER",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("PAGE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("PAUSE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("PEEK",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("POKE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("PORT",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("PRINT",function(e){
	    	// systeem print een string PRINT string ;
	    	// systeem print een string PRINT string
	    	var x = nextWord(false);
	    	if(x[0]=='$'){
	    		
	    	}else{
	    		printf(x);
	    	}
	    	if(nextWord(false)!=";"){
	    		printf("\n");
	    	}
	});
	insertFunction("RAND",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("READ",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("RENAME",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("RETURN",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("SAVE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("SERIAL",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("SIZE",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("SOUND",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("STRING",function(e){syntaxisError("Momenteel niet ondersteund");});
	insertFunction("WAITKEY",function(e){syntaxisError("Momenteel niet ondersteund");});
	cls();
	
}

