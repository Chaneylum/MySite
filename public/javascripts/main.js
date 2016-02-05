(function () {

	var content = "Suspendisse vel volutpat elit.";

	var contentElem;

	window.onload = function () {
		var addContent = document.getElementById('add-content');

		contentElem = document.getElementsByClassName('main-content')[0];

		addContent.onclick = function () {
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(content));
			contentElem.appendChild(div);
		};
	};

}())