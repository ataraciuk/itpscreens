var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function(req, res) {
	//test calendar is i1i4ebeql2i6gui1prqc3c18c8
	//empty calendar is mm781483e48kpfjnm88asbglmc
	var isoDate = (new Date()).toISOString();
	var nextWeek = new Date();
	nextWeek.setDate(nextWeek.getDate()+7);
	nextWeek = nextWeek.toISOString();
	var calId = req.query.calendar || 'rj39klpe7dkg03r82dv5ip8rco'; //itp calendar
	request("https://www.googleapis.com/calendar/v3/calendars/"+calId+"%40group.calendar.google.com/events?orderBy=startTime&singleEvents=true&timeMin="+isoDate+"&timeMax="+nextWeek+"&key=AIzaSyBilHKdjV4H419PzJEt18rhWW2NpCUOfGM", function(error, response, body) {
	    var result = JSON.parse(body).items;
	    result.splice(12, result.length - 12); //setting max length of 12
	    var rows = result.length === 3 ? 2 : Math.ceil(result.length / 3);
	    var columns;
	    if (result.length === 1) {
	    	columns = 1;
	    } else if (result.length < 5) {
	    	columns = 2;
	    } else {
	    	columns = 3;
	    }
	    console.log(result);
	    result = result.map(function(e) {
	    	var dateTime = e.start.dateTime || e.start.date;
	    	var theDate = new Date(dateTime);
	    	var myTimeZone = new Date();
	    	var description = e.description || '';
	    	var summary = e.summary.toUpperCase();
	    	var ret = {
	    		summary: summary.length > 40 ? (summary.substr(0,40) + '...') : summary,
	    		description: description.length > 100 ? (description.substr(0,100) + '...') : description,
	    		weekDay: getStringDay(theDate.getDay()),
	    		dateStr: getStringMonth(theDate.getMonth()) + ' ' + theDate.getDate(),
	    		location: e.location
	    	};
	    	if(e.start.dateTime) ret.timeStr = getStringTime(theDate);
	    	return ret;
	    });
	    res.render('index', { items: result, rows: rows, columns: columns });
	});
});

var getStringDay = function(n) {
	switch (n) {
		case 0:
			return 'SUNDAY';
		case 1:
			return 'MONDAY';
		case 2:
			return 'TUESDAY';
		case 3:
			return 'WEDNESDAY';
		case 4:
			return 'THURSDAY';
		case 5:
			return 'FRIDAY';
		case 6:
			return 'SATURDAY';
	}
}

var getStringMonth = function(n) {
	var myMonths=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	return myMonths[n].toUpperCase();
}

var getStringTime = function(d) {
	var hour = d.getHours(), meridianStr = ' AM';
	if(hour >= 12) {
		meridianStr = ' PM';
		if(hour > 12) {
			hour-= 12;
		}
	}
	var minutes = d.getMinutes();
	minutes = (minutes < 10 ? '0' : '') + minutes;
	return hour + ':' + minutes + ' ' + meridianStr;
}

module.exports = router;
