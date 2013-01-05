var requests = {};

addEventListener('message', function(e){
	var data = e.data,
		url = data.url,
		timeout = data.timeout || 0;
	var r = requests[url] || new XMLHttpRequest();
	if (r._timeout) clearTimeout(r._timeout);
	r._timeout = setTimeout(function(){
		r.abort();
	}, timeout);
	r.onload = function(){
		clearTimeout(this._timeout);
		delete requests[url];
		var responseText = this.responseText;
		postMessage({
			url: url,
			response: JSON.parse(responseText)
		});
	};
	r.onerror = r.onabort = r.ontimeout = function(e){
		clearTimeout(this._timeout);
		delete requests[url];
		if (e) throw e;
	}
	if (r.readyState <= 1){
		r.open('GET', url + '?' + (+new Date()), true);
		r.send();
	}
	requests[url] = r;
});