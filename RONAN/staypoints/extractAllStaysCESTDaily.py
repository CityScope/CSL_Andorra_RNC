#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar  9 11:46:33 2017

Searches the RNC data files for observations in a time period of interest.
Extracts stay-points from these observations and saves the results, organised by subscriber, in a series of JSON files.
Locations are in UTM31N format

@author: doorleyr
"""

import pandas as pd
import os
import time
import pyproj
import numpy as np
import calendar
import json
import datetime

def maxDistFromGroup(newPoint, pointGroup):
    maxDist=0
    for p in pointGroup:
        distN=np.sqrt( (p[1] - newPoint[1])**2 + (p[0] - newPoint[0])**2)
        maxDist=max(distN,maxDist)
    return maxDist

rncFilePath='/home/data_repository/datasets/telecom/rnc/2016-AndorraTelecom-RNC-FestaMajorSantJulia-2'
outputFilePath='/home/workspace/rdoorley/staypoints'
maxRoam=200# max distance (m) between 2 points in a cluster
minStay=20*60 # min 20mins for a stay point

startTime='2016_07_30 000000' # start of analysis period as '%Y_%m_%d %H%M%S'
chunkPeriod=24*60*60 # analyze one day at a time
numChunks=1 # number of days to analyze
startTimeM=calendar.timegm(time.strptime(startTime, '%Y_%m_%d %H%M%S')) # numerical date (ignores time zones)

# RNC times are in UTC- will need to convert them to Andorra time: UTC+2 in the summer.
timeCorrection=2*60*60
  
##define To and From coordinate systems
utm31N=pyproj.Proj("+init=EPSG:25831")
wgs84=pyproj.Proj("+init=EPSG:4326")

# First loop extracts all the relevant observations from the csv files and stores in the agents dataframe.
# Loop through all the csv files in the current folder
for ch in range(numChunks):
    fileCount=0
    startTimeChunkM=ch*chunkPeriod+startTimeM
    endTimeChunkM=(ch+1)*chunkPeriod+startTimeM
    startTimeChunkStr=datetime.datetime.utcfromtimestamp(startTimeChunkM).strftime('%Y-%m-%d %H%M%S')
    agents=[[],[],[],[],[],[]]
    stayData={'ids':[], 'nation':[], 'TAC': [], 'stays': []} 
    #Loop through all the csv files in the current folder
    os.chdir(rncFilePath)
    for file in os.listdir('.'):
        if 'Location' in file:
            dfCurrentFile=pd.read_csv(file, sep=';')# Create pandas dataframe from file 
            firstTimeStamp=timeCorrection+calendar.timegm(time.strptime(dfCurrentFile['Timestamp'][0][0:15], '%Y%m%dT%H%M%S'))
            if firstTimeStamp>=startTimeChunkM and firstTimeStamp<endTimeChunkM:
                fileCount=fileCount+1
                print('Day: ' + str(ch+1)+', '+str(fileCount) + 'files included so far')
                #print file
                for index, row in dfCurrentFile.iterrows():
                    #loop through each row in dataframe
                    try:
                        # if this ID already exists in the agents array, add the new timestamp and coordinates
                        ind=agents[0].index(row['HASH_IMSI'])
                        timeStamp=timeCorrection+int(calendar.timegm(time.strptime(row['Timestamp'][0:15], '%Y%m%dT%H%M%S')))
                        agents[1][ind].extend([timeStamp])
                        x, y =pyproj.transform(wgs84, utm31N, row['Longitude'], row['Latitude'])
                        #x, y =row['Longitude'], row['Latitude']
                        agents[2][ind].extend([int(x)])
                        agents[3][ind].extend([int(y)])
                        if agents[5][ind]==0: # if the TAC is currently 0, try to get it from the new observation
                            try:
                                agents[5][ind]=int(row['IMEI_TAC'])
                            except:
                                pass    
                    except ValueError:
                        # if this ID does not yet exist in the agents array, add it
                        nation=int(row['MCC'])
                        timeStamp=timeCorrection+int(calendar.timegm(time.strptime(row['Timestamp'][0:15], '%Y%m%dT%H%M%S')))
                        agents[0].extend([row['HASH_IMSI']])
                        #print('Adding')
                        agents[1].append([timeStamp])# use append, not extend, so a nested list is added
                        x, y =pyproj.transform(wgs84, utm31N, row['Longitude'], row['Latitude'])
                        #x, y =row['Longitude'], row['Latitude']
                        agents[2].append([int(x)])
                        agents[3].append([int(y)])
                        agents[4].extend([nation])
                        try:
                            agents[5].extend([int(row['IMEI_TAC'])]) # sometimes the TAC will be missing
                        except:
                            agents[5].extend([0]) # if it's missing, assign 0.
            else:
                #print "File contains no entries in time window of interest"
                pass              
    # Second loop takes the agents dataframe and extracts stay points
    # See stay-point detection in http://dl.acm.org/citation.cfm?id=1463477
    print ("Density Based Clustering")        
    for a in range(len(agents[0])):
        for ii in [2,3]: # the fields that need to be sorted based on time
            agents[ii][a]= [x for (y,x) in sorted(zip(agents[1][a],agents[ii][a]))]
        agents[1][a].sort() # after the other fileds have been sorted based on time, can now sort the time field itself
        x, y =agents[2][a], agents[3][a]
        stays=[]
        i=0
        while i<len(agents[2][a]):
            j=i
            while (j+1)<len(agents[2][a]) and maxDistFromGroup([x[j+1],y[j+1]], [[x[ij],y[ij]] for ij in range(i,j+1)])<maxRoam:
                j+=1
            #create a stay from the middle position with arrival and departure time
            jj=min(j+1,len(agents[2][a])-1)
            # departure time is the timestamp of the next obs after this cluster. Unless this cluster contains the last point in the series
            if agents[1][a][jj]-agents[1][a][i]>(minStay):
                stays.extend([{'p':[x[int((i+j)/2)],y[int((i+j)/2)]], 's':agents[1][a][i],'e':agents[1][a][jj], 'n':(j-i+1)}])       
            i=j+1
        if stays: # if stays is empty, no need to add anything
            try:
                ind=stayData['ids'].index(agents[0][a])
                #print('agent id already exists')
                stayData['stays'][ind].extend(stays)
                if np.isnan(stayData['TAC'][ind]): # if the TAC is currently nan, try to get it from the new observation
                    stayData['TAC'][ind]=agents[5][a]            
                #add the new stays to the exisiting stays for this agent
            except:
                #add the new agent to the stay data
                stayData['stays'].append(stays)
                stayData['TAC'].extend([agents[5][a]])
                stayData['ids'].extend([agents[0][a]])
                stayData['nation'].extend([agents[4][a]])
    os.chdir(outputFilePath)    
    stayData={'stays':stayData['stays'], 'TAC':stayData['TAC'],
                   'ids':stayData['ids'], 'nation':stayData['nation']}
    with open('stays_Day_CEST_'+startTimeChunkStr+'_'+'.json', 'w') as fp:
        json.dump(stayData, fp)

