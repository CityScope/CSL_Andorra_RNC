#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Apr  5 09:15:40 2017
Reads the stay-point files for the specified days and:
    Finds meeting places by applying a moving-cluster algorithm to the stay-points
    Produces json files including all stay-points and their cluster Ids (if they are part of a cluster)
    Produces html files of Google maps displaying the clusters (1 per hour)
@author: doorleyr
"""
startTimeStrings=['2016-07-03 000000', '2016-07-10 000000',
                  '2016-07-11 000000', '2016-07-12 000000',
                  '2016-07-16 000000', '2016-07-23 000000', '2016-08-20 000000']
#startTimeStrings=['2016-08-20 000000']

# length of time slices at which the clustering (DBSCAN) is applied
T=60*10
periods=int((24*60*60)/T)

# toggle file outputs
lightJson=True 
fullJson=True
htmlFiles=False # html files are heavy so only set to True if they are needed
RJson=False

# parameter of moving clustering algorithm: 
theta=0.5 
# eg. if theta is 0.5 then two consecutive clusters will be considered to be the same cluster if at least half of their members are the same people.
eps=20 #max distance
minPeople=50 #minimum cluster size

# colors used for creating Google maps
colors=["#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941", "#006FA6", "#A30059", "#FFDBE5", "#7A4900", "#0000A6", "#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",         "#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601", "#3B5DFF", "#4A3B53", "#FF2F80",         "#61615A", "#BA0900", "#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA", "#D16100",         "#DDEFFF", "#000035", "#7B4F4B", "#A1C299", "#300018", "#0AA6D8", "#013349", "#00846F",         "#372101", "#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2", "#C2FF99", "#001E09",         "#00489C", "#6F0062", "#0CBD66", "#EEC3FF", "#456D75", "#B77B68", "#7A87A1", "#788D66", "#885578", "#FAD09F", "#FF8A9A"]
colorDict=dict(zip(range(len(colors)), colors))

from sklearn.cluster import DBSCAN
import numpy as np
import os
import time
import calendar
import json
import pyproj
import matplotlib.path as mplPath

# function returns 1 if point is inside shape
def inTableArea(point, shape):
        codes, verts = zip(*shape)
        path = mplPath.Path(verts, codes)
        return path.contains_point((point[0],point[1]))
        
# shape of the Andorra table
path_data = [
(mplPath.Path.MOVETO, (1.509961, 42.505086)),
(mplPath.Path.LINETO, (1.544024, 42.517066)),
(mplPath.Path.LINETO, (1.549798, 42.508161)),
(mplPath.Path.LINETO, (1.515728, 42.496164)),
(mplPath.Path.LINETO, (1.509961, 42.505086))]

  
utm31N=pyproj.Proj("+init=EPSG:25831") #projection for Andorra
wgs84=pyproj.Proj("+init=EPSG:4326")

outData={'dates':[]} #prepare output file
outDataR={}
# loop through each of the specified days
for dd in range(len(startTimeStrings)):
    startTimeString=startTimeStrings[dd]
    shortString=startTimeString[0:10]
    outDataR[shortString]={}
    
    stayFile='stays_Day_CEST_'+startTimeString+'_.json' 
    thisDate={'date':shortString,'hours':[]}
    #prepare the new dataframe
    timeSlices={}
    
    for p in range(periods):
        timeSlices[p]={'xList':[], 'yList':[], 'ids':[], 'nations':[], 'TAC':[]}
    startTime=calendar.timegm(time.strptime(startTimeStrings[dd], '%Y-%m-%d %H%M%S'))
    os.chdir( '/home/workspace/rdoorley/staypoints')    
    #get the stay-point file for the appropriate day
    with open(stayFile) as file:
        data=json.load(file)
    data['idNum']=list(range(len(data['TAC'])))
    #organise the data into timeslices in order to prepare for the Moving Cluster algorithm
    for a in range(len(data['stays'])):
        for s in range(len(data['stays'][a])):
            if data['stays'][a][s]['s']>startTime and data['stays'][a][s]['s']<(startTime+periods*T):
                #print('in time period')
                x=data['stays'][a][s]['p'][0]
                y=data['stays'][a][s]['p'][1]
                lon, lat =pyproj.transform(utm31N,wgs84,  x,y)
                timePosS=int(((data['stays'][a][s]['s'])-startTime)/T)
                timePosE=min(int(((data['stays'][a][s]['e'])-startTime)/T), periods-1, timePosS+60)
                if inTableArea([lon,lat], path_data):
                    for tp in range(timePosS, timePosE):
                        timeSlices[tp]['xList'].extend([x])
                        timeSlices[tp]['yList'].extend([y])
                        timeSlices[tp]['ids'].extend([data['idNum'][a]])
                        timeSlices[tp]['nations'].extend([data['nation'][a]])
                        timeSlices[tp]['TAC'].extend([data['TAC'][a]])
        
    # Apply the moving clustering algorithm                    
    # see algorithm MC1 in Kalnis et al (2005) https://link.springer.com/chapter/10.1007/11535331_21
    Gc=[]
    unClustered={}
    nextId=0
    for p in range(periods-1):
        print(p)
        X=np.transpose(np.array([timeSlices[p]['xList'], timeSlices[p]['yList']]))
        Gn=[]
        db=DBSCAN(eps=eps, min_samples=minPeople).fit(X)
        unique_labels=set(db.labels_)
        unique_labels.remove(-1)
        unC=[X[i,:] for i in range(len(db.labels_)) if db.labels_[i]==-1]
        unClustered[p]=unC
        for l in unique_labels:
            c=set([timeSlices[p]['ids'][i] for i in range(len(db.labels_)) if db.labels_[i]==l])
            cNation=[timeSlices[p]['nations'][i] for i in range(len(db.labels_)) if db.labels_[i]==l]
            coord=[X[i,:] for i in range(len(db.labels_)) if db.labels_[i]==l]
            meanCoord=[np.mean([coord[i][0] for i in range(len(coord))]), np.mean([coord[i][1] for i in range(len(coord))])]
            assigned=False
            if Gc: #if not empty, i.e. if not the first run
                for g in Gc[p-1]:
                    if len(g['ids'].intersection(c))>theta*len(g['ids'].union(c)):
                        Gn.extend([{'ids':c, 'Cid':g['Cid'], 'coord':coord, 'meanCoord':meanCoord, 'nations':cNation}])
                        assigned=True
            if not assigned:
                Gn.extend([{'ids':c, 'Cid':nextId, 'coord':coord, 'meanCoord':meanCoord, 'nations':cNation}])
                nextId+=1
        Gc.append(Gn)
    
    # take one timeslice for each hour and create the output files (json and html)
    os.chdir( '/home/workspace/rdoorley/movingCluster')
    lightData={'hours':[]}
    for i in range(24):       
        pp=int(i*((60*60)/T)) #only look at the first timeslice in each hour
        gcp=Gc[pp]
        unC=unClustered[pp]
        xUnC=[unC[ii][0] for ii in range(len(unC))]
        yUnC=[unC[ii][1] for ii in range(len(unC))]
        lonUnC, latUnC =pyproj.transform(utm31N,wgs84,  xUnC,yUnC)
        thisHour={'hour':i,'unC':{'lon':lonUnC, 'lat':latUnC}, 'C':{}}
        if htmlFiles==True:
            import gmplot
            gmap = gmplot.GoogleMapPlotter.from_geocode('Andorra')
            gmap.scatter(latUnC, lonUnC, 'gray', marker=False, size=1)
        lonList=[]
        latList=[]
        cidList=[]
        nationList=[]
        PidList=[]
        for cc in range(len(gcp)):
            xx=[co[0] for co in gcp[cc]['coord']]
            yy=[co[1] for co in gcp[cc]['coord']]
            nations=gcp[cc]['nations']
            idsP=gcp[cc]['ids']
            lon, lat =pyproj.transform(utm31N,wgs84,  xx,yy)
            if htmlFiles==True:
                gmap.scatter(lat, lon, colorDict[gcp[cc]['Cid']%len(colorDict)], marker=False, size=2)
            lonList.extend(lon)
            latList.extend(lat)
            cidList.extend([gcp[cc]['Cid']]*len(lon))
            nationList.extend(nations)
            PidList.extend(idsP)
        thisHour['C']['nation']=nationList
        thisHour['C']['lon']=lonList
        thisHour['C']['lat']=latList
        thisHour['C']['Cid']=cidList
        thisHour['C']['personId']=PidList
        thisDate['hours'].append(thisHour)
        outDataR[shortString][i]=thisHour
        lightData['hours'].append({'hour':i,'nations':nationList,
                 'lon':lonList,
                 'lat':latList,
                 'Cid':cidList})
        if htmlFiles==True:
            gmap.draw("mcMap"+shortString+"_P"+str(i)+".html")
    outData['dates'].append(thisDate)
    if lightJson==True:
        with open('movingClusterLight'+shortString+'.json', 'w') as fp:
            json.dump(lightData, fp)
            
if fullJson==True:                            
    with open('mcMultiDay.json', 'w') as fp:
        json.dump(outData, fp)
        
if RJson==True:                            
    with open('mcMultiDayR.json', 'w') as fp:
        json.dump(outDataR, fp)
