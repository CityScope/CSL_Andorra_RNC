#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sep 25 2017

Go through each day's csv file of each ID, Calculate the staypoints for each ID
stay-point detection algorithm in paper ‘Mining user similarity based on location history’ http://dl.acm.org/citation.cfm?id=1463477:


And export the JSON file for each day, JSON file structure:
{
“id”:xxxxxxx
   {“Nation”: Andorra,
    “Stay”:{0:{“lat”:42.50,
               “long”: 1.52,
               “start”: epoch format.
               “end”: epoch format.
               “interval”: epoch format
               “Ec/No”:average of all points in this stay period
               “RSCP”: the same above
               “Cell”: the cell of the middle points in the period
              }
            1:{………….
              }
           }
   }
“id”:xxxxxxxx
…..
}

In the "Stay", "0"/"1" represent the sequential number of this particular stay period in one day of this ID person


**maxDist (meters) and minStay (seconds) are parameters of the stay point detection algorithm. (in the code, 200m/5min)

@author: Zhekun Xiong
"""

import pandas as pd
import os
import time
import pyproj
import numpy as np
import calendar
import json
import datetime
import csv


# Calculate the max distance between the new point to all the points in the pointGroup
def maxDistFromGroup(newPoint, pointGroup):
    maxDist=0
    for p in pointGroup:
        distN=np.sqrt( (p[1] - newPoint[1])**2 + (p[0] - newPoint[0])**2)
        maxDist=max(distN,maxDist)
    return maxDist


# max distance (m) between 2 points regarded as a staypoint
maxDist = 200
# min 5mins for a stay point
minStay = 5*60

# define To and From coordinate systems, Andorra is WGS84/UTM31N
utm31N=pyproj.Proj("+init=EPSG:32631")
wgs84=pyproj.Proj("+init=EPSG:4326")

# Transform WGS84 lat/long into UTM31N for calculating distance
def coord_transform(df, i):
    x, y = pyproj.transform(wgs84, utm31N, df.iloc[i]['Latitude'], df.iloc[i]['Longitude'])
    return x, y

# Calculate the centroid of a group of points, in UTM31N
def coord_avg(pointGroup):
    x_total, y_total = 0, 0
    for p in pointGroup:
        x_total += p[0]
        y_total += p[1]
    return x_total/len(pointGroup), y_total/len(pointGroup)

# get average Ec/No and RSCP value
def signal_avg(df, i, j, name):
    total = 0
    for index in range(i, j):
        total += df.iloc[index][name]
    return total/(j-i)
        
# Get all the date folder in the folder"outputcsv_date_combined_person"
folders = []
for filename in os.listdir("outputcsv_date_combined_person"):
    if "2016" in filename:
        folders.append(filename)

# make folder to store the JSON file
os.makedirs("staypoints_date_JSON")

# Go through each day's file
for folder in folders:
    # Keep track of how many csv files gone through
    numfile = 0
    # A dict of all the staypoints of all IDs
    all_person = {}
    
    for filename in os.listdir("outputcsv_date_combined_person/"+folder):
        if ".csv" in filename:
            numfile += 1
            # A dict of all the staypoints of one ID
            person = {}
            with open("outputcsv_date_combined_person/"+folder+"/"+filename, mode = 'r') as infile:
                df = pd.read_csv(infile, sep=';')
                # change time into epoch format
                df['Timestamp'] = df['Timestamp'].apply(lambda x : int(calendar.timegm(time.strptime(x, '%Y%m%d %H:%M:%S'))))
                df = df.sort_values('Timestamp')
                df = df.reset_index(drop=True)
                
            # person['id'] = filename[:-4]
            person['Nation'] = df.get_value(0,'Nation')

            # create stay points dict for one individual
            person['stay'] = {}
            rowNum = len(df)
            x, y = pyproj.transform(wgs84, utm31N, df.iloc[0]['Latitude'], df.iloc[0]['Longitude'])

            i = 0
            # keep track of how many stays in the dictionary
            numstay = 0

            # The initial point
            while i < rowNum:
                x_i, y_i = coord_transform(df, i)
                onestay = {}
                j = i+1
                pointGroup = [(x_i, y_i)]
                
                # The next point
                while j < rowNum:
                    x_j, y_j = coord_transform(df, j)

                    # the new point is still in the cluster
                    if maxDistFromGroup((x_j, y_j), pointGroup)<=maxDist:
                        pointGroup.append((x_j, y_j))
                        j += 1
                    # the new point is not in the cluster
                    else:
                        interval = df.iloc[j-1]['Timestamp'] - df.iloc[i]['Timestamp']
                        # the duration of this stay is longer than our threshold
                        if interval >= minStay:
                            x_avg, y_avg = coord_avg(pointGroup)
                            x_wgs, y_wgs = pyproj.transform(utm31N, wgs84, x_avg, y_avg)
                            onestay['lat'] = x_wgs
                            onestay['long'] = y_wgs
                            onestay['start'] = int(df.iloc[i]['Timestamp']) 
                            onestay['end'] = int(df.iloc[j-1]['Timestamp'])
                            onestay['interval'] = int(interval)
                            onestay["Ec/No"] = float(signal_avg(df, i, j, "Ec/No"))
                            onestay["RSCP"] = float(signal_avg(df, i, j, "RSCP"))
                            # get the cell of the middle point in the interval
                            onestay["Cell"] = int(df.iloc[(i+j)//2]["Cell"])
                            person['stay'][numstay] = onestay
                            numstay += 1
                        break
                # Start from the next new point
                i = j
            # write into the file if this person has staypoints
            if person['stay']:
                all_person[filename[:-4]] = person
                print(numfile)

    with open("staypoints_date_JSON/"+folder+"_person_staypoints.txt", mode = 'w') as outfile:
        json.dump(all_person, outfile, indent=4)

                
                
        

        
        

                


    
