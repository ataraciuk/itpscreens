var itp = itp || {},
	main = $('#main');
itp.init = function(){
	setInterval(function(){
		main.height(window.innerHeight).width(window.innerWidth);
	}, 1000);
};

$(function(){
	itp.init();
});
