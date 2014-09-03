var itp = itp || {},
	main = $('#main');
itp.init = function(){
	/*setInterval(function(){
		main.height(window.innerHeight).width(window.innerWidth);
	}, 1000);*/
	$('.item').each(function(){
		var e = $(this), rndA = Math.random() * 0.2 + 0.1, rndB = Math.ceil((Math.random() * 0.5 + 0.5) * 255), rndG = Math.random();
		rndG = Math.ceil(255 * rndG + rndB * (1 - rndG));
		e.css('background-color', 'rgba(255,'+rndG+','+rndB+','+rndA+')');
	});
	$('.item h2').fitText(1.7);
	$('.item h3').fitText(2.2);
	$('.item div').fitText(2.6);
	$('.item div.location').fitText(3);
	$('.your').fitText();
	$('.centered p').fitText(3);
};

$(function(){
	itp.init();
});
