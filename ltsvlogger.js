var url = require("url"),
	fs = require("fs"),
	logger = require("connect").logger,
	moment = require("moment-timezone");

var ltsvTokens = [
	"time",
	"method",
	"uri",
	"protocol",
	"status",
	"host",
	"vhost",
	"size",
	"reqtime",
	"reqtime_microsec",
	"referer",
	"ua",
	"dnt",
	"language",
	"os_version",
];

logger.token("time", function() {
	return moment().tz("Asia/Tokyo").format();
});

logger.token("method", function(req, res) {
	return req.method;
});

logger.token("uri", function(req, res) {
	return url.parse(req.url).href;
});

logger.token("protocol", function(req, res) {
	return url.parse(req.url).protocol;
});

logger.token("status", function(req, res) {
	return res.statusCode;
});

logger.token("host", function(req, res) {
	return req.connection.address().address || "-";
});

logger.token("vhost", function(req, res) {
	return req.headers["host"];
});

logger.token("size", function(req, res) {
	return res.getHeader("content-length");
});

logger.token("reqtime", function(req, res) {
	return new Date - req._startTime;
});

logger.token("reqtime_microsec", function(req, res) {
	return "-";
});

logger.token("referer", function(req, res) {
	return req.headers["referer"] || req.headers["referrer"];
});

logger.token("ua", function(req, res) {
	return req.headers["user-agent"];
});

logger.token("os_version", function(req, res) {
	return "-";
});

function setFormat(arr) {
	var i, len, fmt = [];
	for (i = 0, len = arr.length; i < len; i++) {
		if (ltsvTokens.indexOf(arr[i]) >= 0) {
			fmt.push(arr[i] + "::" + arr[i]);
		}
	}
	logger.format("ltsv", fmt.join("\t"));
}

var out = fs.createWriteStream("/var/log/node/ltsv.log", {
	flags: "a+"
});
var ltsv = [];
ltsv.push("time");
ltsv.push("method");
ltsv.push("uri");
ltsv.push("protocol");
ltsv.push("status");
ltsv.push("host");
ltsv.push("vhost");
ltsv.push("size");
ltsv.push("reqtime");
ltsv.push("reqtime_microsec");
ltsv.push("referer");
ltsv.push("ua");
ltsv.push("dnt");
ltsv.push("language");
ltsv.push("os_version");

exports = module.exports = function ltsvLogger() {
	var options = {
		format: ltsv,
		stream: out
	};
	var toString = Object.prototype.toString;
	var typeOf = function(that) {
		var t = toString.call(that);
		return t.split(" ")[1].replace("]", "");
	};
	if (typeOf(options) === "Object") {
		options = options;
		if (typeOf(options.format) === "Array") {
			setFormat(options.format);
			options.format = "ltsv";
		}
	} else if (typeOf(options) === "Array") {
		setFormat(options);
		options.format = "ltsv";
	} else if (typeOf(options) === "String") {
		options = {
			format: options
		};
	} else {
		options = {};
	}
	return logger(options);
};
