var APRIL = 3;
var MARCH = 2;

initCalendar();

function initCalendar(){
	// CODE FROM: https://stackoverflow.com/questions/563406/add-days-to-javascript-date
	Date.prototype.addDays = function(days) {
	  var dat = new Date(this.valueOf());
	  dat.setDate(dat.getDate() + days);
	  return dat;
	};
	// END FROM
	
	// Implements all features!
	Date.prototype.getOrthodoxEaster = function() {
	  return getEaster(this.getFullYear());
	};
}

function getEaster(year){
	// METHOD FROM: https://www.assa.org.au/edm#OrthCalculator
	var jaardoor19 = year/19;
	var localdecimalennajaar = (jaardoor19+"").split(".");
	var decimalennajaar = 0;
	if(localdecimalennajaar.length>0){
		var clx = localdecimalennajaar[1];
		if(clx!=null){
			decimalennajaar = clx.substring(0,3);
		}
	}
	var paschalfullmoondate;
	var paschalfullmoonstri;
	var tableBres;
	var tableCres;
	var tableDres;
	var year1 = String(year).substring(0,2);
	var year2 = String(year).substring(3,5);
	if(year>=1900&&year<=2199){
		switch(Number(decimalennajaar)){
			case 0:   paschalfullmoonstri = "A14" ; paschalfullmoondate = new Date(year,APRIL,14);break;
			case 52:  paschalfullmoonstri = "A3" ; paschalfullmoondate = new Date(year,APRIL,3);break;
			case 105: paschalfullmoonstri = "M23" ; paschalfullmoondate = new Date(year,MARCH,23);break;
			case 157: paschalfullmoonstri = "A11" ; paschalfullmoondate = new Date(year,APRIL,11);break;
			case 210: paschalfullmoonstri = "M31" ; paschalfullmoondate = new Date(year,MARCH,31);break;
			case 263: paschalfullmoonstri = "A18" ; paschalfullmoondate = new Date(year,APRIL,18);break;
			case 315: paschalfullmoonstri = "A8" ; paschalfullmoondate = new Date(year,APRIL,8);break;
			case 368: paschalfullmoonstri = "M28" ; paschalfullmoondate = new Date(year,MARCH,28);break;
			case 421: paschalfullmoonstri = "A16" ; paschalfullmoondate = new Date(year,APRIL,16);break;
			case 473: paschalfullmoonstri = "A5" ; paschalfullmoondate = new Date(year,APRIL,5);break;
			case 526: paschalfullmoonstri = "M25" ; paschalfullmoondate = new Date(year,MARCH,25);break;
			case 578: paschalfullmoonstri = "A13" ; paschalfullmoondate = new Date(year,APRIL,13);break;
			case 631: paschalfullmoonstri = "A2" ; paschalfullmoondate = new Date(year,APRIL,2);break;
			case 684: paschalfullmoonstri = "M22" ; paschalfullmoondate = new Date(year,MARCH,22);break;
			case 736: paschalfullmoonstri = "A10" ; paschalfullmoondate = new Date(year,APRIL,10);break;
			case 789: paschalfullmoonstri = "M30" ; paschalfullmoondate = new Date(year,MARCH,30);break;
			case 842: paschalfullmoonstri = "A17" ; paschalfullmoondate = new Date(year,APRIL,17);break;
			case 894: paschalfullmoonstri = "A7" ; paschalfullmoondate = new Date(year,APRIL,7);break;
			case 947: paschalfullmoonstri = "M27" ; paschalfullmoondate = new Date(year,MARCH,27);break;
		}
		switch(String(paschalfullmoonstri)){
			case "M26":
			case "A2":
			case "A9":
			case "A16":
			tableBres = 0;
			break;
			
			case "M27":
			case "A3":
			case "A10":
			case "A17":
			tableBres = 1;
			break;
			
			case "M21":
			case "M28":
			case "A4":
			case "A11":
			case "A18":
			tableBres = 2;
			break;
			
			case "M22":
			case "M29":
			case "A5":
			case "A12":
			tableBres = 3;
			break;
			
			case "M23":
			case "M30":
			case "A6":
			case "A13":
			tableBres = 4;
			break;
			
			case "M24":
			case "M31":
			case "A7":
			case "A14":
			tableBres = 5;
			break;
			
			case "M25":
			case "A1":
			case "A8":
			case "A15":
			tableBres = 6;
			break;
		}
		switch(Number(year1)){
			case 19:tableCres = 1;break;
			case 20:tableCres = 0;break;
			case 21:tableCres = 5;break;
		}
		switch(Number(year2)){
			case 0:
			case 6:
			case 17:
			case 23:
			case 28:
			case 34:
			case 45:
			case 51:
			case 56:
			case 62:
			case 73:
			case 79:
			case 84:
			case 90:
			tableDres = 0;
			break;
			
			case 1:
			case 7:
			case 12:
			case 18:
			case 29:
			case 35:
			case 40:
			case 46:
			case 57:
			case 63:
			case 68:
			case 74:
			case 85:
			case 91:
			case 96:
			tableDres = 1;
			break;
			
			case 2:
			case 13:
			case 19:
			case 24:
			case 30:
			case 41:
			case 47:
			case 52:
			case 58:
			case 69:
			case 75:
			case 80:
			case 86:
			case 97:
			tableDres = 2;
			break;
			
			case 3:
			case 8:
			case 14:
			case 25:
			case 31:
			case 36:
			case 42:
			case 53:
			case 59:
			case 64:
			case 70:
			case 81:
			case 87:
			case 92:
			case 98:
			tableDres = 3;
			break;
			
			case 9:
			case 15:
			case 20:
			case 26:
			case 37:
			case 43:
			case 48:
			case 54:
			case 65:
			case 71:
			case 76:
			case 82:
			case 93:
			case 99:
			tableDres = 4;
			break;
			
			case 4:
			case 10:
			case 21:
			case 27:
			case 32:
			case 38:
			case 49:
			case 55:
			case 60:
			case 66:
			case 77:
			case 83:
			case 88:
			case 94:
			tableDres = 5;
			break;
			
			case 5:
			case 11:
			case 16:
			case 22:
			case 33:
			case 39:
			case 44:
			case 50:
			case 61:
			case 67:
			case 72:
			case 78:
			case 89:
			case 95:
			tableDres = 6;
			break;
		}
		var totaltableres = tableBres+tableCres+tableDres;
		var totaaltoevoegendata = 0;
		switch(Number(totaltableres)){
			case 0:
			case 7:
			case 14:
			totaaltoevoegendata = 7;
			break;
			
			case 1:
			case 8:
			case 15:
			totaaltoevoegendata = 6;
			break;
			
			case 2:
			case 9:
			case 16:
			totaaltoevoegendata = 5;
			break;
			
			case 3:
			case 10:
			case 17:
			totaaltoevoegendata = 4;
			break;
			
			case 4:
			case 11:
			case 18:
			totaaltoevoegendata = 3;
			break;
			
			case 5:
			case 12:
			totaaltoevoegendata = 2;
			break;
			
			case 6:
			case 13:
			totaaltoevoegendata  = 1;
			break;
		}
		return paschalfullmoondate.addDays(totaaltoevoegendata+1);
	}else{
		console.warn("Unable to calculate Easter before 1900 and after 2199!");
	}
	return "ERROR";
}
