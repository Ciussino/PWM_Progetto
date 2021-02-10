function Data() {
    var today = new Date();
	
	var mese = today.getMonth()+1;
	if(mese<10){
		mese = "0" + mese;
	}
	var gg = today.getDate();
	if(gg<10){
		gg = "0" + gg;
	}

	var oggi = today.getFullYear() + "-" + mese + "-" + gg;
	var date = document.getElementById("data").value;
	var dayOfWeek = new Date(date).getDay();

	if(oggi >= date){
		document.getElementById("data").value = "";
		alert("E' possibile prenotare un'aula con almeno un giorno di anticipo!");
	} else if(dayOfWeek == 6 || dayOfWeek == 0) {
		document.getElementById("data").value = "";
		alert("E' possibile prenotare un'aula solo dal Lunedì al Venerdì!");
	};
};

function CheckData(){
	
	var data = document.getElementById("data").value;
	var aula = document.getElementById("aula").value;

	if(data == "" || aula == ""){
		alert("Per effettuare una prenotazione è necessario compilare tutti i campi!");
	}
}