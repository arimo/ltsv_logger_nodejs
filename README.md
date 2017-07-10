# ltsv_logger_nodejs
##app.jsで下記のように呼び出す
```
var express = require('express');
var ltsvlogger = require('./ltsvlogger');
var app = express();
app.use(ltsvlogger());
```
