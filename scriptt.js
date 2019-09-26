

let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange =function() {
    if(this.readyState== 4 && this.status == 200) {
        sorteerObj.data = JSON.parse(this.responseText);
        sorteerObj.voegJSDatumIn();
        sorteerObj.sorteren();
    } else {
        console.log("readyState: " + this.readyState);
        console.log("status: " + this.status);
    }
}
xmlhttp.open('GET', "landen.json", true);
xmlhttp.send();
//object uitvoert en sorteert

// een tabelkop in markup uitvoeren
const maakTabelKop = (arr) => {
    let kop ="<table class='Selectie'><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>"
    });
    kop += "</tr>";
    return kop;
}

const maakTabelRij = (arr, accent) => {
    let rij ="";
    if(accent==true){
        rij = "<tr class='Selectie__rij--accent'>";
    } else {
        rij = "<tr class='Selectie__rij'>";
    }
    arr.forEach((item) => {
        rij += "<td class='Selectie__data'>" + item + "</td>"
    });
    rij += "</tr>";
    return rij;
}
// van maand naar string januari 0 december 11
const geefMaand = (maand) => {
    let nummer;
    switch (maand) {
        case "januari": nummer = 0; break;
        case "februari": nummer = 1; break;
        case "maart": nummer = 2; break;
        case "april": nummer = 3; break;
        case "mei": nummer = 4; break;
        case "juni": nummer = 5; break;
        case "juli": nummer = 6; break;
        case "augustus": nummer = 7; break;
        case "september": nummer = 8; break;
        case "october": nummer = 9; break;
        case "november": nummer = 10; break;
        case "december": nummer = 11; break;
        default: nummer = 0     
    }
    return nummer;
}

// functie die een string van maand omzet in date 
const MaakJSdatum =(maandJaar) => {
    let mjArray = maandJaar.split(" ");
    let datum = new Date(mjArray[1], geefMaand(mjArray[0]));
    return datum;
}
//functie maakt van een array
const maakOpsomming = (array) => {
	let string = "";
	for(let i = 0; i < array.length; i++) {
		switch (i) {
			case array.length-1 : string += array[i]; break;
			case array.length-2 : string += array[i] + " en "; break;
			default: string += array[i] + ", ";
		}
	}
	return string;
}
// object dat sorteert
//eigenschappen: data kenmerk
//methods: sorteren en uitvoeren
let sorteerObj = {
    data: "", //komt van xmhttp.onreadystatechange

    kenmerk: "land",
    //sorteer volghorde en factor
    oplopend: 1,

    // een datumObject toevoegen uit string
    voegJSDatumIn: function() {
        this.data.forEach((item) => {
            item.jsDatum = MaakJSdatum(item.Sinds);
        });    
    },
    
    //data sorteren
sorteren: function() {
    this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend);
    this.uitvoeren(this.data);
},

    uitvoeren: function(data) {
        let uitvoer = maakTabelKop(["land", 
        "cover", 
        "Staatshoofd", 
        "Sinds", 
        "Inwoners", 
        "taal", 
        "code"]);
        for(let i=0; i<data.length; i++) {
            //geef rijen afwisselend een accent mee
            let accent = false;
            i%2 == 0 ? accent = true : accent = false;
            let imgElement = "<img src='" 
            + data[i].cover +
             "' class='Selectie__cover' alt'"
              +data[i].land+"'>";

              let staats = maakOpsomming(data[i].Staatshoofd);
           uitvoer += maakTabelRij([data[i].land,
            imgElement,
            staats,
            data[i].Sinds,
            data[i].Inwoners,
            data[i].taal,
            data[i].code], accent)
        }
        document.getElementById('uitvoer').innerHTML = uitvoer;
    }
}
// keuze voor sorteer opties
let kenmerk = document.getElementById('kenmerk');
kenmerk.addEventListener('change', (e) => {
    sorteerObj.kenmerk = e.target.value;
    sorteerObj.sorteren();
})

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e)=> {
        sorteerObj.oplopend = parseInt(e.target.value);
        sorteerObj.sorteren();
    })

})