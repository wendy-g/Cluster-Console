function doGet() {
  var ss = SpreadsheetApp.openById('1BxyWN3irH0AN5XegvCjNRYsPaSKV-SqTbR_S-so-z7I');
  var DashSheet = ss.setActiveSheet(ss.getSheetByName('PowerDash'));
  var PowerSheet = ss.setActiveSheet(ss.getSheetByName('TotalPower'));
//creates data tables, almost like matrices with a header
  var chartdata = Charts.newDataTable()
                  .addColumn(Charts.ColumnType.STRING, "IP Address")
                  .addColumn(Charts.ColumnType.STRING, "Status")
                  .addColumn(Charts.ColumnType.STRING, "Server Type")
                  .addColumn(Charts.ColumnType.NUMBER, "Power Consumption (W)");
//add rows to data table  
  for (i=2;i<20;i++) {
    chartdata.addRow(DashSheet.getRange(i,1,1,4).getValues()[0])
  }
  chartdata.build()
  //creates table and bar chart with data table
  // bar chart is created with coulmns 1 and 4
  var table = Charts.newTableChart().setDimensions(400, 500).build();
  var pieChart = Charts.newBarChart()
                       .setDataViewDefinition(Charts.newDataViewDefinition()
                                                    .setColumns([0,3]))
                       .setDimensions(500, 600)
                       .setLegendPosition(Charts.Position.NONE)
                       .build();
  
  //filters for dashboard
  var powerFilter = Charts.newNumberRangeFilter()
      .setFilterColumnLabel("Power Consumption (W)")
      .build();

  var ServerFilter = Charts.newCategoryFilter()
      .setFilterColumnLabel("Server Type")
      .build();
  var dashboard = Charts.newDashboardPanel()
      .setDataTable(chartdata)
      .bind([powerFilter, ServerFilter], [pieChart, table])
      .build();

  var uiApp = UiApp.createApplication();
  dashboard.add(uiApp.createVerticalPanel()
                .add(uiApp.createHorizontalPanel()
                    .add(powerFilter).add(ServerFilter)
                    .setSpacing(20))
                .add(uiApp.createHorizontalPanel()
                    .add(pieChart).add(table)
                    .setSpacing(20)));

  uiApp.add(dashboard);
  return uiApp;
  
}
