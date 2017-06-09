function updateGoing(idPlace){
    $.ajax({
        url: "/going",
        dataType: "json",
        data: {
            q: idPlace
        },
        success: function( data ) {
	        //alert(data);
	        $('#' + idPlace).html(parseInt($('#' + idPlace).html()) + parseInt(data));
            //response( data );
            //response( data.slice(0, 5) );
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
    //alert(idPlace);
}