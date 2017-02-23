if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " result.json");
    process.exit(-1);
}

var param = process.argv[2];

//path = './' + param;
path = param;

try {
    var obj = require(path);
	console.log("LogResult:     " + new Buffer(obj.LogResult, 'base64').toString('utf8'));
	console.log("FunctionError: " + obj.FunctionError);
	console.log("StatusCode:    " + obj.StatusCode);
}
catch (e) {
    if (e instanceof Error && e.code === "MODULE_NOT_FOUND")
        console.log("Can't load result file: " + path);
    else
        throw e;
}



//console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))

//process.argv.forEach((val, index) => {
//      console.log(`${index}: ${val}`);
//});
