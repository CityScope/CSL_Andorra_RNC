#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Mar 10 11:27:31 2017

@author: doorleyr
"""

import os
import pickle
import calendar
import pandas as pd
import time

folders=['2016-AndorraTelecom-RNC',
         '2016-AndorraTelecom-RNC-2',
         '2016-AndorraTelecom-RNC-BTT',
         '2016-AndorraTelecom-RNC-BTT-2',
         '2016-AndorraTelecom-RNC-FestaMajorSantJulia',
         '2016-AndorraTelecom-RNC-FestaMajorSantJulia-2',
         '2016-AndorraTelecom-RNC-TourDeFrance']

outData={}
timeWindows=[1467158400+i*60*60 for i in range(24*96)]
outData['all']=dict(zip(timeWindows, [0 for i in range(24*96)]))
   
#os.chdir('/Users/doorleyr/Documents/Fulbright/Andorra Project/Telecoms/Tour de France') 
             
for f in folders:
    print(f)
    outData[f]=dict(zip(timeWindows, [0 for i in range(24*96)]))
    path='/home/data_repository/datasets/telecom/rnc/' + f
    os.chdir(path)          
    fileCount=0
    #Loop through all the csv files in the current folder
    for file in os.listdir('.'):    
        if 'Location' in file:
            fileCount+=1
            print(fileCount)
            dfCurrentFile=pd.read_csv(file, sep=';')
            for index, row in dfCurrentFile.iterrows():
                #loop through each row in dataframe
                ts=calendar.timegm(time.strptime(row['Timestamp'][0:11], '%Y%m%dT%H'))
                outData[f][ts]+=1
                outData['all'][ts]+=1
    os.chdir('/home/workspace/rdoorley/hoursCovered')
    pickle.dump(outData, open( "hoursCovered.p", "wb" ))


