(function ($) {
	'use strict';

	//cover overlay toggle
	$(".cover").on('click', function(){
		$(".cover").removeClass("active");
		$(this).toggleClass("active");

	});

	//rating UI part

	$(".ratingBox").each(function(){
		var title = $(this).children().attr("ratingtitle");
		var	scale = $(this).children().next().attr("ratingscale");
		var	value = $(this).children().next().next().attr("ratingvalue");
		var	count = $(this).children().next().next().next().attr("ratingcount");

		if(!value) {
			return console.log( "false" );
		}

		if(scale == 5){
			var $star = '<i class="ion-android-star"></i> ';
			var $starHalf = '<i class="ion-android-star-half"></i> ';
			var $starEmpty = '<i class="ion-android-star-outline"></i> ';

			var TotalCount = parseInt(count);
			var decimial = parseFloat(value) - parseInt(value);
			var fullStars = parseInt(value);
			var $dom = "";


			for (var i= 0; i < fullStars; i++){
				$dom = $dom + $star;
			}

			if(decimial>0){
				$dom = $dom + $starHalf;
			} else {
				$dom = $dom + $starEmpty;
			}

		}

		$(this).html($dom);

	});

}($));
