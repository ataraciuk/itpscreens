var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/', function(req, res) {
	var isoDate = (new Date()).toISOString();
	request("https://www.googleapis.com/calendar/v3/calendars/i1i4ebeql2i6gui1prqc3c18c8%40group.calendar.google.com/events?orderBy=startTime&singleEvents=true&timeMin="+isoDate+"&key=AIzaSyAqfhA0ygWi1VzVxxFqgLp8TOGYrzGQjJg", function(error, response, body) {
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
	    	var ret = {
	    		summary: e.summary.toUpperCase(),
	    		description: e.description,
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
