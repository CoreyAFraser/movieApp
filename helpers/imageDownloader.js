var http = require('http')
var fs   = require('fs');

module.exports = {
    downloadPoster: function(path, name, callback) {
        var request = http.get(path, function(res){
            var imagedata = ''
            res.setEncoding('binary')

            res.on('data', function(chunk){
                imagedata += chunk
            })

            res.on('end', function(){
                fs.writeFile(name, imagedata, 'binary', function(err){
                    if (err) console.log(err)
                    callback();
                })
            })
        });
    }
};




    