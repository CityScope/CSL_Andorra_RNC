#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Oct 20 2017
Reads the timelisced staypoints Json files (simplied version) for the specified days and:
    Uses DBSCAN for clustering
    Produces json files of all clusters of each day for different timestamp, as well as unclustered staypoints corresponding to the same timestamp as well



e.g. 2016xxxx_clustering_clusters_R30_P15_simple.json Json format
(The name of the file indicates the day, as well as the parameters of the radius and min number of people used in the algorithm)

{
   “UnC”:{
         Timestamp(Epoch Time){
                              nations: {}
                              coord: {}
                              ids: {}
                              },
         Timestamp....
         }

   “C”:{
         Timestamp(Epoch Time){
                              cluster_id:{
                                          nations: {}
                                          coord: {}
                                          ids: {}
                                          total:           — total number of people in this cluster
                                          meanCoord: []    — center coordination of this cluster 
                                          propOutsider:    — proportion of outsiders (not from Andorra) in this cluster
                                          common_both:{}   — related to calculating time based on change of cluster composition
                                          common_new:{}    — related to calculating time based on change of cluster composition
                                          common_prev:{}   — related to calculating time based on change of cluster composition
                                          }
                              },
         Timestamp....
       }
}

For each timestamp, there will be one in both “UnC” and “C” corresponding this timestamp for clustered staypoints and unclustered staypoints


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

startTimeStrings = []
for filename in os.listdir("staypoints_date_JSON"):
   if "csv" in filename:
      startTimeStrings.append(filename[:8]+" 000000")

# length of time slices at which the clustering (DBSCAN) is applied
T=60*5 # 5 mins
periods=int((24*60*60)/T)

# eg. if theta is 0.5 then two consecutive clusters will be considered to be the same cluster if at least half of their members are the same people.
# eps=30 #max distance
# minPeople=15 #minimum cluster size

# eps_list = [20,25,30,35,40,45,50]
# minPeople_list = [10,15,20,25,30,35,40]

eps_list = [30]
minPeople_list = [15]
  
utm31N=pyproj.Proj("+init=EPSG:25831") #projection for Andorra
wgs84=pyproj.Proj("+init=EPSG:4326")

        
# Apply the moving clustering algorithm                    
# see algorithm MC1 in Kalnis et al (2005) https://link.springer.com/chapter/10.1007/11535331_21


for startTimeString in startTimeStrings:
   
   epochStartTime = int(calendar.timegm(time.strptime(startTimeString, "%Y%m%d %H%M%S")))

   shortString=startTimeString[0:8]

   os.makedirs("staypoints_date_JSON_clustering/"+shortString, exist_ok=True)

   timeslicefile = "staypoints_date_JSON_clustering/"+shortString+"_clustering_slice_simple.json"

   with open(timeslicefile, "r") as inFile:
      timeSlices = json.load(inFile)


   ###################
   ###################
   for eps in eps_list:
      for minPeople in minPeople_list:
         allClusters={}
         unClustered={}
         clusterID=0
         for p in range(1, periods):
            p = str(p)
            print(p+"_start")
            # establish numpy array of lat and long in UTM31N
            X=np.transpose(np.array([timeSlices[p]['lat31NList'], timeSlices[p]['long31NList']]))

            # calculate clusters at the p(th) period
            try:
               
               db=DBSCAN(eps=eps, min_samples=minPeople).fit(X)
               pClusters={}
               unique_labels=set(db.labels_)

               # remove the outliers
               unique_labels.remove(-1)

               unCID=[timeSlices[p]['ids'][i] for i in range(len(db.labels_)) if db.labels_[i]==-1]
               unCNation=[timeSlices[p]['nations'][i] for i in range(len(db.labels_)) if db.labels_[i]==-1]
               # unClustered["T"+p]=[X[i,:].tolist() for i in range(len(db.labels_)) if db.labels_[i]==-1]
               unClustered31N = [X[i,:].tolist() for i in range(len(db.labels_)) if db.labels_[i]==-1]
               unClustered84 = []
               for coord in unClustered31N:
                  lat, long = pyproj.transform(utm31N, wgs84, coord[0], coord[1])
                  unClustered84.append([lat, long])
                  
               unClustered[epochStartTime+int(p)*T]={'ids':unCID, 'coord':unClustered84, 'nations':unCNation}

              
               for l in unique_labels:
                  cID=[timeSlices[p]['ids'][i] for i in range(len(db.labels_)) if db.labels_[i]==l]
                  cIDset=set(cID)
                  cNation=[timeSlices[p]['nations'][i] for i in range(len(db.labels_)) if db.labels_[i]==l]
                  cCoord31N=[X[i,:].tolist() for i in range(len(db.labels_)) if db.labels_[i]==l]
                  meanCoord31N=[np.mean([cCoord31N[i][0] for i in range(len(cCoord31N))]), np.mean([cCoord31N[i][1] for i in range(len(cCoord31N))])]

                  cCoord84 = []
                  for coord in cCoord31N:
                     lat, long = pyproj.transform(utm31N, wgs84, coord[0], coord[1])
                     cCoord84.append([lat, long])

                  lat, long = pyproj.transform(utm31N, wgs84, meanCoord31N[0], meanCoord31N[1])
                  meanCoord84 = [lat, long]
                  
                  # calculate proportion of outsiders
                  numOutsider = 0
                  for country in cNation:
                     if country != "Andorra":
                        numOutsider += 1
                  cPropOutsider = numOutsider / len(cNation)

                  # total number of person in the cluster
                  total = len(cNation)
                  
                  if allClusters: #if not empty, i.e. if not the first run
                     common_prev = {}
                     common_new = {}
                     common_both = {}

                     prevClusters = allClusters[epochStartTime+(int(p)-1)*T]
                     for formerID in prevClusters:
                        
                        # two more scenarios!!!!
                        new_common_prev = len(set(prevClusters[formerID]['ids']).intersection(cIDset)) / len(set(prevClusters[formerID]['ids']))
                        new_common_new = len(set(prevClusters[formerID]['ids']).intersection(cIDset)) / len(cIDset)
                        
                        # if len(g['ids'].intersection(cID))>theta*len(g['ids'].union(cID)):
                        new_common_both = len(set(prevClusters[formerID]['ids']).intersection(cIDset)) / len(set(prevClusters[formerID]['ids']).union(cIDset))
                        common_prev[formerID] = new_common_prev
                        common_new[formerID] = new_common_new
                        common_both[formerID] = new_common_both
                        
                     pClusters["C"+str(clusterID)] = {'ids':cID, 'coord':cCoord84, 'meanCoord':meanCoord84, 'nations':cNation, 'propOutsider':cPropOutsider, 'total':total, "common_prev":common_prev, "common_new":common_new, "common_both":common_both}
                     
                  if not allClusters:
                     pClusters["C"+str(clusterID)] = {'ids':cID, 'coord':cCoord84, 'meanCoord':meanCoord84, 'nations':cNation, 'propOutsider':cPropOutsider, 'total':total, "common_prev":common_prev, "common_new":common_new, "common_both":common_both}

                  clusterID += 1
                  
               allClusters[epochStartTime+int(p)*T] = pClusters

            except:
               allClusters[epochStartTime+int(p)*T] = {}
               unClustered[epochStartTime+int(p)*T] = {}

            
            print(p+"_done")

         ALL = {}
         ALL["UnC"] = unClustered
         ALL["C"] = allClusters

         with open("staypoints_date_JSON_clustering/"+shortString+"/"+shortString+"_clustering_clusters_R"+str(eps)+"_P"+str(minPeople)+"_simple.json", "w") as outFile:
            json.dump(ALL, outFile, indent = 4)
