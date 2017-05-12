$(document).ready(function(){
	$("#idform").submit(function(event){
		$("#result").text($("#wcaid").val()).show();
		event.preventDefault();
		$.get("../WCA-api-flask/main.cgi/pbs/" + $("#wcaid").val(), function(data){
			console.log(data);
		});
	});
});