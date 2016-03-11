function f1(str){
    return str.toUpperCase();
}
var colors = require('colors');
var log4j_2 = require('tracer').colorConsole({
    format : "{{timestamp}} {{file}}:{{line}} <{{title}}> ({{method}}) {{message}}",
    dateformat : "HH:MM",
    filters : [
        f1,
        //the last item can be custom filter. here is "warn" and "error" filter
        {
            trace : colors.magenta,
            debug : colors.blue,
            info : colors.green,
            warn : colors.yellow,
            error : [ colors.red, colors.bold ]
        }
    ]
});
module.exports = log4j_2;