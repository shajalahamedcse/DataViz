import requests
from bs4 import BeautifulSoup
from influxdb import InfluxDBClient
import time
import sys
host='localhost'
port=8086
user = 'root'
password = 'root'
dbname = 'sensor'

    
client = InfluxDBClient(host, port, user, password, dbname)
client.create_database(dbname)
 

url='http://192.168.0.1/awp/SFF%20PW%20Treatment%20Plant/index.html'
while(1):
    #choice=input()
   # if choice=='q':
    #    raise SystemExit
    r = requests.get(url)
#print(r.text)
    html_doc=r.text
    soup=BeautifulSoup(html_doc,'html.parser')
#print(soup.prettify())
    p_tag=soup.find_all('p')
    ph_value=float(str(unicode(p_tag[0].string)))

    line_pressure=float(str(unicode(p_tag[1].string)))

    ro_conductivity=float(str(unicode(p_tag[2].string)))

    ro_pressure=float(str(unicode(p_tag[3].string)))

    edi_conductivity=float(str(unicode(p_tag[4].string)))

    edi_pressure=float(str(unicode(p_tag[5].string)))

    ro_temperature= float(str(unicode(p_tag[6].string)))

    edi_temperature=float(str(unicode(p_tag[7].string)))

    ro_flow=float(str(unicode(p_tag[8].string)))

    distribution_pressure=float(str(unicode(p_tag[9].string)))
    
    distribution_conductivity=float(str(unicode(p_tag[10].string)))
    json_body = [
        {
            "measurement": "sensor_data",
          
            "fields": {
                "ph_value":ph_value,
                "line_pressure":line_pressure,
                 "ro_conductivity":ro_conductivity,
                 "ro_pressure":ro_pressure,
                  "edi_conductivity":edi_conductivity,
                  "edi_pressure":edi_pressure,
                  "ro_temperature":ro_temperature,
                  "edi_temperature":edi_temperature,
                  "ro_flow":ro_flow,
                  "distribution_pressure":distribution_pressure,
                  "distribution_conductivity":distribution_conductivity
            
            }
        }
    ]
    client.write_points(json_body)

    print(ph_value);
    print(line_pressure);
    time.sleep(2);

