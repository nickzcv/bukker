$( document ).ready(function() {

	$(".bookPage .info .stars .totalCount").on('click', function(){
		$(this).children().toggle();
	});

	$(".main .pagination .disabled a").on('click', function(e){
		e.preventDefault();
	});

	//Cookies.set('sorting', 'test');

});


(function ($) {
	'use strict';

	if( window.location.hash === '#exist' ){
		alert('Уже есть в базе.')
	}
	if( window.location.hash === '#eroor' ){
		alert('Произошла ошибка :(')
	}


	$(".ganre > a").on('click', function(e){
		e.preventDefault();
		$(this).parent().toggleClass("active");
	});


	//rating UI part
	$(".ratingBox").each(function(){
		var $emptyStars = '<div class="no-rate"><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i><i class="ion-android-star-outline"></i></div>',
			$star = '<i class="ion-android-star"></i>',
			$starHalf = '<i class="ion-android-star-half"></i>',
			$starEmpty = '<i class="ion-android-star-outline"></i>';

		//find generated meta tags
		var	title = $(this).children().attr("ratingtitle"),
			scale = $(this).children().next().attr("ratingscale"),
			value = $(this).children().next().next().attr("ratingvalue"),
			count = $(this).children().next().next().next().attr("ratingcount");

		if(!title || title == "") {
			return $(this).html($emptyStars);
		}

		if(!value || value == "") {
			return $(this).html($emptyStars);
		}
		// 5 - rate scale
		if(scale == 5){
			var TotalCount = parseInt(count);// console.log( TotalCount ); // всего голосов
			var decimial = parseFloat(value) - parseInt(value); //console.log( decimial ); // остаток
			var fullStars = parseInt(value); //console.log( fullStars ); // целая часть
			var $dom = "";
			var step = 0;

			for (var i= 0; i < fullStars; i++){
				$dom = $dom + $star;
				step++;
			}

			if(decimial > 0.19){
				$dom = $dom + $starHalf;
				step++;
			}

			if(step < scale) {
				while(step!=scale){
					$dom = $dom + $starEmpty;
					step++;
				}
			}
		}
		// 10 - rate scale
		if(scale == 10){

		}
		var $end = "<span class='count'>"+value+"</span><span class='totalCount arrow_box'>"+ TotalCount+" <span style='display: none'> оценок от <strong>"+title+"</strong></span></span>";
		//update html
		$(this).html($dom + $end);
	});


}($));