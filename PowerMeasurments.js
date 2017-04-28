function doGet(e) {
//dictionary to "translate" word to number row
  var wordToNum = {'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10,
                   'eleven':11,'twelve':12,'thirteen':13,'fourteen':14,'fifteen':15,'sixteen':16,
                   'seventeen':17,'eighteen':18,'nineteen':19}
  var ss = SpreadsheetApp.openById('1BxyWN3irH0AN5XegvCjNRYsPaSKV-SqTbR_S-so-z7I');
  //Opends two of the three sheets int eh spreadsheet
  var DashSheet = ss.setActiveSheet(ss.getSheetByName('PowerDash'));
  var PowerSheet = ss.setActiveSheet(ss.getSheetByName('TotalPower'));
  
//Only iterates over individual server power consumption
  for (var key in e.parameters) {
    if (key !== 'total') {
      var data = [[e.parameters[key][0],Number(e.parameters[key][1])]];
      Logger.log(data)
      DashSheet.getRange(wordToNum[key],3,1,2).setValues(data);
      }
  }
  
//Total and timestamp are placed in another sheet
//Note: had to change setting in Sheet for timestamp column
  //was automatically changing my timsamp to date type and not allowing to graph
  //set column A as plain text
  var lastRow = PowerSheet.getLastRow();
  var pdata = [[e.parameters['total'][0],Number(e.parameters['total'][1])]];
  PowerSheet.getRange(lastRow+1,1,1,2).setValues(pdata);
}
