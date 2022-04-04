var exec = require('child_process').exec;
hexo.on('new', function(data){
  exec('start  "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Typora\Typora" ' + data.path);
});