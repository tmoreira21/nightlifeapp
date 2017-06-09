function updateGoing(idPlace){
    $.ajax({
        url: "/going",
        dataType: "json",
        data: {
            q: idPlace
        },
        success: function( data ) {
	        $('#' + idPlace).html(parseInt($('#' + idPlace).html()) + parseInt(data));
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}