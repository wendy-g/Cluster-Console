function doGet(e) {
  var wordToNum = {'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10,
                   'eleven':11,'twelve':12,'thirteen':13,'fourteen':14,'fifteen':15,'sixteen':16,
                   'seventeen':17,'eighteen':18,'nineteen':19}
  Logger.log(e.parameters);
  var ss = SpreadsheetApp.openById('1BxyWN3irH0AN5XegvCjNRYsPaSKV-SqTbR_S-so-z7I');
  var sheet = ss.setActiveSheet(ss.getSheetByName('NodeTable'));
  for (var key in e.parameters) {
//http://stackoverflow.com/questions/17469148/google-script-setvalues-issue
    var data = [e.parameters[key]]
    Logger.log(key);
    sheet.getRange(wordToNum[key],1,1,6).setValues(data); 
  }
//  var chart = sheet.newChart()
//                   .addRange(sheet.getRange(1,1,19,6))
//                   .setChartType(Charts.ChartType.TABLE)
//                   .setPosition(20, 7, 0, 0)
//                   .build();
//  sheet.insertChart(chart); 
}
