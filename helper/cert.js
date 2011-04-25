exec = require('child_process').exec;

module.exports.Cert = Object.create({}, {
    create: {
        value: function(uid, callback){
            exec('make uid=' + uid + ' adduser', {cwd: 'cert'}, callback || function(){});
        }
    },
    revoke: {
        value: function(uid, callback){
            exec('make uid=' + uid + ' revokeuser', {cwd: 'cert'}, callback || function(){});
        }
    }
});
