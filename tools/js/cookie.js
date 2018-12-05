var cookie = {
	set: function(name, value, expireSecond = 30 * 24 * 60 * 60) {
		var Days = 30;
		var exp = new Date();
		exp.setTime(new Date().getTime() + (expireSecond || Days * 24 * 60 * 60 * 1000));
		document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
	},
	get: function(name) {
		var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
		if (arr = document.cookie.match(reg)) {
			return unescape(arr[2]);
		} else {
			return null;
		}
	},
	del: function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if (cval != null) {
			document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
		}
	}
};