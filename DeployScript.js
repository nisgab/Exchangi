const fs = require("fs");

var devCode = fs.readFileSync('./ExchangiDev.js', "utf-8");

devCode = devCode.replace('350677624:AAEawDrTMsOSvPidgTv24M-nGBBCts0dbuE', '323882318:AAHBLbKiTKTfBY-tG0RkiJldYufiucKROWE')

fs.writeFileSync('./Exchangi.js', devCode);