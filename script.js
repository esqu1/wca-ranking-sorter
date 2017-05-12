function pad(n,d) {
    var numZeros = d - n.toString().length;
    return new Array(numZeros + 1).join(0) + n.toString();
}

function convTime(time,arg) {
    // arg = 0 for normal, 1 for fmc single, 2 for mbld
    if (arg == 0) {
	minutes = Math.floor(time * 0.01 / 60)
	if (minutes != 0) {
	    return minutes.toString() + ":" + pad((time * 0.01 - minutes * 60).toFixed(2),5);
	} else {
	    return (time * 0.01).toFixed(2);
	}
    } else if (arg == 1) {
	return time;
    } else if (arg == 2) {
	difference = 99 - parseInt(time.toString().substring(0,2));
	timeInSeconds = parseInt(time.toString().substring(2,7));
	solved = difference + parseInt(time.toString().substring(7,9));
	attempted = solved + parseInt(time.toString().substring(7,9));
	return solved.toString() + "/" + attempted + " " + Math.floor(timeInSeconds / 60) + ":" + pad((timeInSeconds - Math.floor(timeInSeconds / 60) * 60),2);
    }
}

$(document).ready(function(){
    $("#idform").submit(function(event){
	$('#singleResult').empty(); $('#averageResult').empty();
        event.preventDefault();
	$('#singleResult').append('<center><h4>Loading...</h4></center>')
	$('#averageResult').append('<center><h4>Loading...</h4></center>')
        var average = []; var single = [];
        $.get("../cgi-bin/WCA-api-flask/main.cgi/events", function(data1){
            events = data1.result;
            $.get("../cgi-bin/WCA-api-flask/main.cgi/persons/" + $("#wcaid").val(), function(data2) {
		$('#resulttitle').empty();
		if (data2.result.length == 0) {
		    $('#resulttitle').append('<h2>Invalid WCA ID.</h2>');
		    $('#singleResult').empty(); $('#averageResult').empty();
		    return;
		}		
		$('#resulttitle').append('<h1>Sorted Rankings for ' + data2.result[data2.result.length - 1].name + '</h1>');
		$.get("../cgi-bin/WCA-api-flask/main.cgi/pbs/" + $("#wcaid").val(), function(data){
                    average = data.result.average; single = data.result.single;
                    var singleResult = $('<table></table>').addClass('table');
                    var averageResult = $('<table></table>').addClass('table');
                    average.sort(function(a,b){ return a.worldRank - b.worldRank; });
                    single.sort(function(a,b){ return a.worldRank - b.worldRank; });
                    var head = '<thead><tr><td>Event</td><td>NR</td><td>CR</td><td>WR</td><td>Time</td></tr></thead>';
                    singleResult.append(head); averageResult.append(head);
                    var eventName = "";
                    for (var i = 0; i < single.length; i++) {
			var s = $('<tr></tr>').addClass('active');
			var arg = 0;
			for (var j = 0; j < events.length; j++) {
                            if (events[j].id == single[i].eventId) {
				eventName = events[j].name;
				if (events[j].id == '333mbf') {
				    arg = 2;
				} else if (events[j].id == '333fm') {
				    arg = 1;
				}
				break;
                            }
			}
			
			var content = '<td>' + eventName + '</td><td>' + single[i].countryRank + '</td><td>' + single[i].continentRank + '</td><td><b>' + single[i].worldRank + '</b></td><td>' + convTime(single[i].best,arg) + '</td>';
			s.append(content);
			singleResult.append(s);
                    }
                    for (var i = 0; i < average.length; i++) {
			var s = $('<tr></tr>').addClass('active');
			var arg = 0;
			for (var j = 0; j < events.length; j++) {
                            if (events[j].id == average[i].eventId) {
				eventName = events[j].name;
				if (events[j].id == '333mbf') {
				    arg = 2;
				}
				break;
                            }
			}
			var content = '<td>' + eventName + '</td><td>' + average[i].countryRank + '</td><td>' + average[i].continentRank + '</td><td><b>' + average[i].worldRank + '</b></td><td>' + convTime(average[i].best,arg) + '</td>';
			s.append(content);
			averageResult.append(s);
                    }
                    $('#singleResult').empty(); $('#averageResult').empty();
                    $('#singleResult').append(singleResult);
                    $('#averageResult').append(averageResult);
		});
	    });
        });
    });
});
