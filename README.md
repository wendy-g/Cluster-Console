# Cluster-Console
Creates a console that can connect to multiple servers and check status, processes, and power consumption. This information can be posted to a google site.
website: https://sites.google.com/site/scaleclusterconsole/ 

# nodetable.py
This python file contains multiple functions which check the status of a number of servers. This is meant to be executed every 10 min - 1hr
through crontab. Ultimately, when run, this python script sends information to two google appscripts in the form of parameters
(https://developers.google.com/apps-script/guides/web#url_parameters for more information). Whenever the google appscripts are "called" 
through the requests.get() function, the scripts receive the parameters  and parse the information into google sheets. There are seperate
app scripts that use the information in the google sheets to generate visual aids on the website as well.

The status function checks if server is online by pinging each one (this can be improved by using nmap I believe). 
The metrics function uses vmstat to check CPU and memory utilization as well as processes being run.
The layer function determines if the server is running the load balancer, database, cache, and/or web serving software. 
Below these functions, power measurements are compiled by taking the first measurement displayed (this can be improved by taking the average of all of the power measurements therefore receiving a more accurate reading).

There are two variables containing parameters sent to google scripts: parameters and params1. Parameters contain the vmstat output (CPU,
memory, and processes) and params1 contain the power measurements. 

# NodeTable.gs
In google app script the equivalent of printing something to console is Logger.log() and the output can be seen in View >> Logs. The script 
starts with a word to number dictionary/translator which makes it easier to indicate which parameter should appear in which row on the 
google sheet. Thee script then places the information gathered from the python script onto the google sheet. The table seen there was 
created manually and simply exported to the google site. 

# PowerMeasurements.gs
This script also starts with the row translator. The power data for each server is inserted into the sheet PowerDash while the total power
for the cluster is placed in the sheet TotalPower. The TotalPower sheet contains the history of the cluster's power consumption. 

# ClusterPower.gs
This script opens up the TotalPower sheet and creates a data table with the time stamp and the total power consumed at that time. The data 
table is composed of the last 30 recorded measurements. With this data table, a chart can be created and placed on the google site.

# PowerDashboard.gs
This script also creates a data table using the PowerDash sheet by iterating through each row. It creates both a table and a pie chart to 
have multiply ways with which to visualize the power consumption of each server and as a whole. Filters for each category are created as 
well and the final result is an UI App. 
