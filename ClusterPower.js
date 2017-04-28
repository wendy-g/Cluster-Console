function doGet() {
  var ss = SpreadsheetApp.openById('1BxyWN3irH0AN5XegvCjNRYsPaSKV-SqTbR_S-so-z7I');
  var PowerSheet = ss.setActiveSheet(ss.getSheetByName('TotalPower'));
  var chartdata = Charts.newDataTable()
                  .addColumn(Charts.ColumnType.STRING, "TimeStamp")
                  .addColumn(Charts.ColumnType.NUMBER, "Total Power");
  var lastRow = PowerSheet.getLastRow()
  Logger.log(lastRow)
  for (i=lastRow-30;i<=lastRow;i++) {
    Logger.log(PowerSheet.getRange(3,1,1,2).getValues())
    chartdata.addRow(PowerSheet.getRange(i,1,1,2).getValues()[0]);
  }
  chartdata.build();
  var chart = Charts.newLineChart().setDataTable(chartdata)
                                   .setDimensions(800, 500)
                                   .setLegendPosition(Charts.Position.NONE)
                                   .setXAxisTitle("Timestamp")
                                   .setYAxisTitle("Cluster Power Consumption (W)")
                                   .build();                                                  
                                              
  return UiApp.createApplication().add(chart);
}
