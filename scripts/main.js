var username = config.username;
var password = config.password;
var stationID = 'asd';

$('.current-time').html(moment().format('HH:mm'));
getTrains();

setInterval(function() {
	$('.current-time').html(moment().format('HH:mm'));
}, 1000);

setInterval(function() {
	$('.current-time').html(moment().format('HH:mm'));
    getTrains();
}, 60000);

function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

function getTrains() {
    $.get({
        url:'https://crossorigin.me/https://'+username+':'+password+'@webservices.ns.nl/ns-api-avt?station='+stationID,
        datatype: "xml",
        data:{},
        success:function(data, status, xhr){
            var treinData = xmlToJson(data);
            updateTrains(treinData);
        }
    });
}

function updateTrains(train) {
    for (i = 0; i < 10; i++) {
        $('#row'+i+'-EindBestemming').html(train.ActueleVertrekTijden.VertrekkendeTrein[i].EindBestemming['#text']);
		$('#row'+i+'-TreinSoort').html(train.ActueleVertrekTijden.VertrekkendeTrein[i].TreinSoort['#text']);

		if(train.ActueleVertrekTijden.VertrekkendeTrein[i].TreinSoort['#text'].length > 12) {
			$('#row'+i+'-TreinSoort').addClass('TreinSoortTekstKlein');
		} else {
			$('#row'+i+'-TreinSoort').removeClass('TreinSoortTekstKlein');
		}
		console.log(train.ActueleVertrekTijden.VertrekkendeTrein[i].Vervoerder['#text']);

		if(train.ActueleVertrekTijden.VertrekkendeTrein[i].Vervoerder['#text'] == "NS" || train.ActueleVertrekTijden.VertrekkendeTrein[i].Vervoerder['#text'] == "NS international") {
			$('#logo'+i).attr('src', 'https://ns.nl/static/generic/2.21.0/images/nslogo.svg');
		} else if (train.ActueleVertrekTijden.VertrekkendeTrein[i].TreinSoort['#text'] == "Thalys") {
			$('#logo'+i).attr('src', 'images/Thalys.svg');
		} else {
			$('#logo'+i).removeAttr('src');
		}

		$('#row'+i+'-VertrekSpoor').html(train.ActueleVertrekTijden.VertrekkendeTrein[i].VertrekSpoor['#text']);

		if (train.ActueleVertrekTijden.VertrekkendeTrein[i].VertrekSpoor['@attributes'].wijziging == 'true') {	
			$('#row'+i+'-VertrekSpoor').addClass('verandering');
		} else {
			$('#row'+i+'-VertrekSpoor').removeClass('verandering');
		}

		if(train.ActueleVertrekTijden.VertrekkendeTrein[i].RouteTekst !== undefined ) {
			$('#row'+i+'-RouteTekst').html('via '+train.ActueleVertrekTijden.VertrekkendeTrein[i].RouteTekst['#text']);
		} else {
			$('#row'+i+'-RouteTekst').html("&nbsp;");
		}

		if(train.ActueleVertrekTijden.VertrekkendeTrein[i].VertrekVertragingTekst !== undefined) {
			$('#row'+i+'-VertrekVertragingTekst').html(train.ActueleVertrekTijden.VertrekkendeTrein[i].VertrekVertragingTekst['#text']);
		} else {
			$('#row'+i+'-VertrekVertragingTekst').html("&nbsp;");
		}
		if(train.ActueleVertrekTijden.VertrekkendeTrein[i].ReisTip !== undefined) {
			$('#row'+i+'-RouteTekst').html(train.ActueleVertrekTijden.VertrekkendeTrein[i].ReisTip['#text']);
			$('#row'+i+'-RouteTekst').addClass('opmerking');
		}
		else {
			$('#row'+i+'-RouteTekst').removeClass('opmerking');
		}

		if (train.ActueleVertrekTijden.VertrekkendeTrein[i].Opmerkingen !== undefined) {
			$('#row'+i+'-RouteTekst').html(train.ActueleVertrekTijden.VertrekkendeTrein[i].Opmerkingen.Opmerking['#text']);
			$('#row'+i+'-RouteTekst').addClass('Comments');
		} else {
			$('#row'+i+'-RouteTekst').removeClass('Comments');
		}
        var VertrekTijdRaw = train.ActueleVertrekTijden.VertrekkendeTrein[i].VertrekTijd['#text'];
        var VertrekTijd = VertrekTijdRaw.substring(11, 16);
        $('#row'+i+'-VertrekTijd').html(VertrekTijd);
    }
}