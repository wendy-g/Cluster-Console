#!/usr/bin/python

import subprocess
import requests
from time import sleep
import datetime

#list of ip addresses for cluster
iplist = ['10.0.0.25','10.0.0.26','10.0.0.27','10.0.0.28','10.0.0.29','10.0.0.30',\
	'10.0.0.31','10.0.0.32','10.0.0.33','10.0.0.34','10.0.0.35','10.0.0.36',\
	'10.0.0.37','10.0.0.38','10.0.0.39','10.0.0.40','10.0.0.41','10.0.0.42']

#This helps in organizing information into sheet, give row as key parameter
row = ['two','three','four','five','six','seven','eight','nine','ten','eleven','twelve',\
	'thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']

parameters= {}

def status(ip):
#Ping a server
#http://stackoverflow.com/questions/35750041/check-if-ping-was-successful-using-subprocess-in-python
	stat=subprocess.Popen(['ping',ip,'-c3'],stdout=subprocess.PIPE)
	stat.wait()
	if stat.poll():
		return 'DOWN'
	else:
		return 'UP'

def metrics(ip):
#call vmstat function, take output and turn to a list, getting rid of blanks
#return desired measurements
	func = subprocess.check_output(['ssh',ip,'vmstat'])
#http://stackoverflow.com/questions/19875595/removing-empty-elements-from-an-array-in-python	
	lst = filter(None,func.split(' '))
#The vmstat function is a little different on ARM servers and if statement gets rid of undesired string
	if 'st\n' in lst:
		lst.remove('st\n')
	CPUus = lst[34]
	mem = int(float(lst[25])/(float(lst[25])+float(lst[26])+float(lst[27]))*100)
	proc = lst[22]
	return CPUus, mem, proc
	
def layer(ip):
#checks if it is running particular processes to determine its layer in the set-update
#also helps if it is running multiplt of these processes, they should be killed
	lay = []
	commands = ['haproxy','mysqld','memcached','apache2']
	responses = ['Load Balancer','Database','Cache','Web Server']
	for com,resp in zip(commands,responses):
#http://stackoverflow.com/questions/4760215/running-shell-command-from-python-and-capturing-the-output
		p = subprocess.Popen(['ssh',ip,'pidof',com],stdout=subprocess.PIPE)
		out = p.communicate()
#http://stackoverflow.com/questions/5690491/best-way-to-do-a-not-none-test-in-python-for-a-normal-and-unicode-empty-string
		if out[0]:
			lay.append(resp)
	if len(lay) > 1:
		return 'MULTIPLE'
	elif len(lay) == 1:
		return lay[0]
	else:
		return 'NONE'

#Lists dictating what kind of processers these ip addresses pertain to
xgene = ['10.0.0.41','10.0.0.42']
xeon = ['10.0.0.25','10.0.0.26','10.0.0.27','10.0.0.28','10.0.0.29','10.0.0.30',\
        '10.0.0.31','10.0.0.32','10.0.0.33','10.0.0.34','10.0.0.35','10.0.0.36',\
        '10.0.0.37','10.0.0.38']

#ssh into power measurement server and start and stop bash script to get measurement
#copies file into server running python script
Powerproc = subprocess.Popen(['ssh','-tt', 'jie'], stdin=subprocess.PIPE, stdout = subprocess.PIPE)
Powerproc.stdin.write("./power_start &\n")
sleep(10)     
Powerproc.stdin.write("./power_stop &\n")
Powerproc.kill()
subprocess.Popen(['scp','scale@10.0.0.24:/usr/local/natinst/nidaqmxbase/examples/ai/ServerVoltage0','/home/scale/console_scripts/ServerVoltage0']).wait()

#Opens resulting power measurement file and reads first line and creates list
with open('/home/scale/console_scripts/ServerVoltage0','r') as f:
	first_line = f.readline().split()

#last item in list is the total power consumption
#saves and removes value since we don't need to iterate through it
totalpower = first_line[len(first_line)-1]
first_line.remove(totalpower)
params1= {}
#removes two rows since we do not have power measurements for all servers
new_row = row[:15]

#iterates through three lists and creates parameters with processor type and power measurement
for num,meas,ip in zip(new_row,first_line,iplist):
	if ip in xeon:
		params1[num] = ['Xeon',meas]
	elif ip in xgene:
		params1[num] = ['X-Gene',meas]

#for total power, sends time stamp 
timestamp = '{:%H:%M}'.format(datetime.datetime.now())
params1['total']=[timestamp,totalpower]			
		
#creates other set of paramters for general info. table
#if it is up it sends all metrics, sends blanks if down	
for ip,num in zip(iplist,row):
	if status(ip) == 'UP':		
		values = [i for i in metrics(ip)]
		values.insert(0,ip)
		values.insert(1,'UP')
		values.insert(2,layer(ip))
		parameters[num] = values
	else:
		values = [ip, 'DOWN',' ', ' ', ' ', ' ']
		parameters[num] = values

#have a crontab log, timestamp is useful to see if its working
print timestamp

#send parameters to the two different app scripts	
url = "https://script.google.com/macros/s/AKfycbxUtBFrGmkhp_G5jIWnmfBwhZtP-HVEHAC6RM1C8i2-DEuFH-Q/exec"		
r=requests.get(url,params=parameters)				 

url1 = "https://script.google.com/macros/s/AKfycbzHwunoIpglhtk_8H6sgLF9gtd8Yj_6P3Wk_4u3Rmrlw5WeWWfJ/exec"
r1 = requests.get(url1,params=params1)
