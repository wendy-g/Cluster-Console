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

//the above was emulated from code found on google docs
//function doGet() {
//  var data = Charts.newDataTable()
//      .addColumn(Charts.ColumnType.STRING, "Name")
//      .addColumn(Charts.ColumnType.STRING, "Gender")
//      .addColumn(Charts.ColumnType.NUMBER, "Age")
//      .addColumn(Charts.ColumnType.NUMBER, "Donuts eaten")
//      .addRow(["Michael", "Male", 12, 5])
//      .addRow(["Elisa", "Female", 20, 7])
//      .addRow(["Robert", "Male", 7, 3])
//      .addRow(["John", "Male", 54, 2])
//      .addRow(["Jessica", "Female", 22, 6])
//      .addRow(["Aaron", "Male", 3, 1])
//      .addRow(["Margareth", "Female", 42, 8])
//      .addRow(["Miranda", "Female", 33, 6])
//      .build();
//
//  var ageFilter = Charts.newNumberRangeFilter()
//      .setFilterColumnLabel("Age")
//      .build();
//
//  var genderFilter = Charts.newCategoryFilter()
//      .setFilterColumnLabel("Gender")
//      .build();
//
//  var pieChart = Charts.newPieChart()
//      .setDataViewDefinition(Charts.newDataViewDefinition()
//                            .setColumns([0, 3]))
//      .build();
//
//  var tableChart = Charts.newTableChart()
//      .build();
//
//  var dashboard = Charts.newDashboardPanel()
//      .setDataTable(data)
//      .bind([ageFilter, genderFilter], [pieChart, tableChart])
//      .build();
//
//  var uiApp = UiApp.createApplication();
//
//  dashboard.add(uiApp.createVerticalPanel()
//                .add(uiApp.createHorizontalPanel()
//                    .add(ageFilter).add(genderFilter)
//                    .setSpacing(70))
//                .add(uiApp.createHorizontalPanel()
//                    .add(pieChart).add(tableChart)
//                    .setSpacing(10)));
//
//  uiApp.add(dashboard);
//  return uiApp;
//
//}