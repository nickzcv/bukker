(function ($) {
	'use strict';


	//cover overlay toggle
	$(".cover").on('click', function(){
		$(".cover").removeClass("active");
		$(this).toggleClass("active");

	})

}($));
