$(document).ready(function(){
    $("#idform").submit(function(event){
        event.preventDefault();
        var average = []; var single = [];
        $.get("../cgi-bin/WCA-api-flask/main.cgi/events", function(data){
            events = data.result;
            $.get("../cgi-bin/WCA-api-flask/main.cgi/pbs/" + $("#wcaid").val(), function(data){
                average = data.result.average; single = data.result.single;
                $('#singleResult').empty(); $('#averageResult').empty();
                var singleResult = $('<table></table>').addClass('table');
                var averageResult = $('<table></table>').addClass('table');
                average.sort(function(a,b){ return a.worldRank - b.worldRank; });
                single.sort(function(a,b){ return a.worldRank - b.worldRank; });
                var head = '<thead><tr><td>Event</td><td>NR</td><td>CR</td><td>WR</td><td>Time</td></tr></thead>';
                singleResult.append(head); averageResult.append(head);
                var eventName = "";
                for (var i = 0; i < single.length; i++) {
                    var s = $('<tr></tr>').addClass('active');
                    for (var j = 0; j < events.length; j++) {
                        if (events[j].id == single[i].eventId) {
                            eventName = events[j].name;
                            break;
                        }
                    }
                    var content = '<td>' + eventName + '</td><td>' + single[i].countryRank + '</td><td>' + single[i].continentRank + '</td><td><b>' + single[i].worldRank + '</b></td><td>' + (single[i].best * 0.01).toFixed(2) + '</td>';
                    s.append(content);
                    singleResult.append(s);
                }
                for (var i = 0; i < average.length; i++) {
                    var s = $('<tr></tr>').addClass('active');
                    for (var j = 0; j < events.length; j++) {
                        if (events[j].id == single[i].eventId) {
                            eventName = events[j].name;
                            break;
                        }
                    }
                    var content = '<td>' + eventName + '</td><td>' + average[i].countryRank + '</td><td>' + average[i].continentRank + '</td><td><b>' + average[i].worldRank + '</b></td><td>' + (average[i].best * 0.01).toFixed(2) + '</td>';
                    s.append(content);
                    averageResult.append(s);
                }
                $('#singleResult').append(singleResult);
                $('#averageResult').append(averageResult);
            });
        });
    });
});
