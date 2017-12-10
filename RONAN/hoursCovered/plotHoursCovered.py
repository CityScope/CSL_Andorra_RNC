#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Mar 20 11:25:40 2017

@author: doorleyr
"""

import pickle
import os
import time
import datetime
import numpy as np
from matplotlib import lines

os.chdir('/Users/doorleyr/Documents/Fulbright/Andorra Project/Telecoms/Results')  
   
hoursCovered=pickle.load( open( "hoursCovered.p", "rb" ) )

cols=["#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059",
        "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762"]

import matplotlib.pyplot as plt
import matplotlib.dates as mdates

plt.figure(1)
ax1 = plt.subplot(111)
runTotal=list([0]*len(hoursCovered['all']))
n=0
# convert the epoch format to matplotlib date format
legendText=[]
for k in hoursCovered:
    if k != 'all':
        legendText.extend([k])
        dt=[]
        y=[]
        for key in hoursCovered[k]:
            dt.extend([datetime.datetime.utcfromtimestamp(key)])
            y.extend([hoursCovered[k][key]])
        ax1.bar(dt, y, width=0.02, bottom=runTotal, color=cols[n],edgecolor=cols[n])
        n+=1
        runTotal=[runTotal[i]+y[i] for i in range(len(y))]
ax1.xaxis_date()
plt.show()

legLines=[lines.Line2D([], [], color=cols[i], linewidth=4, markersize=2000) for i in range(len(legendText))]
labels=legendText
plt.legend(handles=legLines, labels=labels, loc='best')

plt.figure(2)
ax2 = plt.subplot(111)
k='all'
dt=[]
y=[]
for key in hoursCovered[k]:
    dt.extend([datetime.datetime.fromtimestamp(key)])
    y.extend([hoursCovered[k][key]])
ax2.bar(dt, y)
ax2.xaxis_date()
plt.show()

#create json with string datetimes
hoursCoveredStr={}
for folder in hoursCovered:
    hoursCoveredStr[folder]={}
    for t in hoursCovered[folder]:
        strDate=datetime.datetime.utcfromtimestamp(t).strftime("%Y/%m/%d %H:%M:%S")
        hoursCoveredStr[folder][strDate]=hoursCovered[folder][t]
        
import json
with open('hoursCoveredRNC.json', 'w') as fp:
    json.dump(hoursCoveredStr, fp) 
