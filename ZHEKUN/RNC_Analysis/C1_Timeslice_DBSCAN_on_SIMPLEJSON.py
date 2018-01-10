#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Oct 20 2017
Reads the staypoints Json files (simplied version) for the specified days and:
    Record each day by moments of every 5 mins
    For each staypoint, if the staypoint period intersects with the timeslice moment, include the staypoint into that timeslice  
    Produces json files of different timeslices including all staypoints presented at that timeslice



2016xxxx_clustering_slice_simple.json Json format

{
   "0"{
      "nations":[]
      "long31Nlist":[]
      "ids"[]
      "lat31Nlist":[]
   }
   "1"{
      ...
   }
} 

Among them, the key represents the "th"(order) five mins, so e.g. "0" means "00:00"; "1" means "00:05", till "287" means "23:55", altogether 0-287


@author: Zhekun Xiong
"""

from sklearn.cluster import DBSCAN
import numpy as np
import os
import time
import calendar
import json
import pyproj
import matplotlib.path as mplPath

os.makedirs("staypoints_date_JSON_clustering", exist_ok=True)

startTimeStrings = []
for filename in os.listdir("staypoints_date_JSON"):
   if "csv" in filename:
      startTimeStrings.append(filename[:8]+" 000000")

# length of time slices at which the clustering (DBSCAN) is applied
# 5 mins
T=60*5
periods=int((24*60*60)/T)

  
utm31N=pyproj.Proj("+init=EPSG:25831") #projection for Andorra
wgs84=pyproj.Proj("+init=EPSG:4326")


# loop through each of the specified days
for dd in range(len(startTimeStrings)):
   startTimeString=startTimeStrings[dd]
   shortString=startTimeString[0:8]
    
   stayFile="staypoints_date_JSON/"+shortString+'_person_staypoints_simple.json' 

   #prepare the new dataframe
   timeSlices={} 
   for p in range(periods):
      timeSlices[p]={'lat31NList':[], 'long31NList':[], 'ids':[], 'nations':[]}
      startTime=calendar.timegm(time.strptime(startTimeStrings[dd], '%Y%m%d %H%M%S'))

   #get the stay-point file for the appropriate day
   with open(stayFile) as file:
      data=json.load(file)
   #organise the data into timeslices in order to prepare for the Moving Cluster algorithm
   for ID in data:
      for num_stay in range(len(data[ID]['S'])):
         num_stay = str(num_stay)
         lat=data[ID]['S'][num_stay]['la']
         long=data[ID]['S'][num_stay]['lo']
         lat31N, long31N =pyproj.transform(wgs84, utm31N, lat, long)

         # put the points present at that moment !!!!
         timePosS=((data[ID]['S'][num_stay]['s'])-startTime)//T + 1
         timePosE=((data[ID]['S'][num_stay]['e'])-startTime)//T + 1

         # since our period is 5 mins, and the period of each staypoint is not less than 5mins, so timePosS will not equal to timePoseE
         for tp in range(timePosS, timePosE):
            timeSlices[tp]['lat31NList'].extend([lat31N])
            timeSlices[tp]['long31NList'].extend([long31N])
            timeSlices[tp]['ids'].extend([ID])
            timeSlices[tp]['nations'].extend([data[ID]['N']])
   
   with open("staypoints_date_JSON_clustering/"+shortString+'_clustering_slice_simple.json', 'w') as intermediary_outFile:
      json.dump(timeSlices, intermediary_outFile, indent = 4)
