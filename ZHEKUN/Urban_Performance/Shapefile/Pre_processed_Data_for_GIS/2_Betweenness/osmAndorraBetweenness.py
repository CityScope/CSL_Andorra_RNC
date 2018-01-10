#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Nov 14 13:16:41 2016

@author: doorleyr
"""
import os
import matplotlib.pyplot as plt
import xml.etree.ElementTree as et
import pandas as pd
import urllib.request
from matplotlib import cm, colors, lines
import numpy as np
import pyproj
import networkx as nx
import json
import csv

utm31N=pyproj.Proj("+init=EPSG:25831")
wgs84=pyproj.Proj("+init=EPSG:4326")

saveFileLocation='/Users/zhekunxiong/Desktop'

def calculateLinkLengths(nodesXY, net):
    distances=[]
    for link in net.index.values:
        if float(net['length'][link])!=float(net['length'][link]):
            anode=net['aNodes'][link]
            bnode=net['bNodes'][link]
            distances.extend([np.sqrt(np.power((nodesXY[anode,0]-nodesXY[bnode,0]),2)+np.power((nodesXY[anode,1]-nodesXY[bnode,1]),2))])
        else:
            distances.extend([net['length'][link]])
    return np.array(distances)


file = urllib.request.urlopen('http://api.openstreetmap.org/api/0.6/map?bbox=1.5062,42.498,1.5525,42.522')
#xData = file.read()
xData=et.parse(file)
file.close()


root=xData.getroot()


nodeLat=[]
nodeLon=[]
nodeId=[]
aNodes=[]
bNodes=[]
hwTags=[]
names=[]
oneway=[]
ref=[]
maxspeed=[]
osmid=[]

for child in root:
    if child.tag=='node':
        nodeLat.extend([child.get('lat')])
        nodeLon.extend([child.get('lon')])
        nodeId.extend([child.get('id')])
    elif child.tag=='way':
        highwayTag, name, oneW, re, mSp=[], [], [], [], []
        for t in child.findall('tag'):
            key=t.get('k')
            if key=='highway':
                value=t.get('v')
                highwayTag.extend([value])
        #now confirmed if the child is a way: if so, loop through the tags again and save them
        if any(highwayTag):
            for t in child.findall('tag'):
                if t.get('k')=='name':
                    name=t.get('v')
                if t.get('k')=='oneway':
                    oneW=t.get('v')
                if t.get('k')=='ref':
                    re=t.get('v')
                if t.get('k')=='maxspeed':
                    mSp=t.get('v')
            first=1
            for gChild in child:
                if gChild.tag=='nd':
                    if first==1:
                        #aNodes.extend([gChild.get('ref')])
                        lastNode=gChild.get('ref')
                    else:
                        aNodes.extend([lastNode])
                        lastNode=gChild.get('ref')
                        bNodes.extend([lastNode])
                        hwTags.extend([highwayTag])
                        names.extend([name])
                        oneway.extend([oneW])
                        ref.extend([re])
                        maxspeed.extend([mSp])
                        osmid.extend([list(child.getiterator())[0].attrib['id']])
                    first=0

latLon= [[nodeLat[i], nodeLon[i]] for i in range(len(nodeId))]
LatLonDict = dict(zip(nodeId, latLon))

aNodeLat=[LatLonDict[aNodes[i]][0] for i in range(len(aNodes))]
aNodeLon=[LatLonDict[aNodes[i]][1] for i in range(len(aNodes))]
bNodeLat=[LatLonDict[bNodes[i]][0] for i in range(len(bNodes))]
bNodeLon=[LatLonDict[bNodes[i]][1] for i in range(len(bNodes))]

#indIncluded=[ht[0] in roadsIncluded for ht in hwTags]

network=pd.DataFrame({'aNodes':aNodes, 'bNodes':bNodes,
'aNodeLat':aNodeLat, 'aNodeLon':aNodeLon,'bNodeLat':bNodeLat,'bNodeLon':bNodeLon, 'type':hwTags, 
'name':names, 'speed':maxspeed, 'ref':ref, 'osmid':osmid, 'oneway':oneway})
    
network['length']=[np.nan for i in range(len(network))]

       
## add more links for 2 way to the driving network only if it's not one-way
copyOriginialNet=network.copy()
for i in range(len(copyOriginialNet)):
    #print(link['oneway'])
    if copyOriginialNet.loc[i]['oneway']!='yes':
        #print('entered if')
        tempLink=copyOriginialNet.loc[i].copy()
        tempAnode = tempLink['aNodes']
        tempLink['aNodes']=tempLink['bNodes']
        tempLink['bNodes']=tempAnode
        network.loc[len(network)]=tempLink.copy()

usedNodesLat, usedNodesLon, usedNodes=[], [], []
aNodeList=list(network['aNodes'])
bNodeList=list(network['bNodes'])

for n in range(len(nodeId)):
    if nodeId[n] in aNodeList or nodeId[n] in bNodeList:
        usedNodesLat.extend([nodeLat[n]])
        usedNodesLon.extend([nodeLon[n]])
        usedNodes.extend([nodeId[n]])

newNodeNums=list(range(len(usedNodes)))
## need to replace node nums by a continuous list from 1 to the num of nodes
## in order to be compatible with the andorraTraffic script
## create and save dict to convert between old and new node nums
nodeNumDict=dict(zip(usedNodes, newNodeNums))
#
copyNetwork=network.copy()
for index, row in copyNetwork.iterrows():
    newAnode=nodeNumDict[row['aNodes']]
    newBnode=nodeNumDict[row['bNodes']]
    network.set_value(index, 'aNodes', newAnode)
    network.set_value(index, 'bNodes', newBnode)
    
nodesXY=np.empty([len(usedNodes),2])
for i in range(len(nodesXY)):
    lat=usedNodesLat[i]
    lon=usedNodesLon[i]
    nodesXY[i,:]=pyproj.transform(wgs84, utm31N, lon, lat)
    
    
distances=calculateLinkLengths(nodesXY, network) 
network['distances']=distances

netABD=network.as_matrix(columns=['aNodes','bNodes'])

os.chdir(saveFileLocation)

# Analyze the network centrality

G=nx.from_pandas_dataframe(network, source='aNodes', target='bNodes', edge_attr='distances')

bc=nx.betweenness_centrality(G,k=2000, weight='distance') #increase k for better accuracy but slower running
degree=nx.degree_centrality(G)
#ebc=nx.edge_betweenness_centrality(G,k=1000, weight='distance')
#ebcValues=[ebc[k] for k in ebc]
#maxEbc=max(ebcValues)
maxBc=max([bc[k] for k in bc])


import gmplot
import colorsys
gmap = gmplot.GoogleMapPlotter.from_geocode('Andorra')
for l in bc:
    hue=0.3*bc[l]/maxBc # min red, max green
    col1=colorsys.hls_to_rgb(hue, 0.5, 0.5) # green
    col1Hex='#%02x%02x%02x' % (int(256*col1[0]), int(256*col1[1]), int(256*col1[2]))
    gmap.scatter([float(usedNodesLat[l]), float(usedNodesLat[l])], [float(usedNodesLon[l]), float(usedNodesLon[l])],  alpha=bc[l]/maxBc, marker=False, color=col1Hex) 
    
gmap.draw("nodeBetweenness2.html")

output={'lats':usedNodesLat, 'lons': usedNodesLon,
'betweenness': [bc[l] for l in bc], 'degree': [degree[l] for l in degree]}

with open('netCentrality.json', 'w') as fp:
    json.dump(output, fp)


with open('netCentrality.csv', 'w') as csvfile:
    csvwriter = csv.writer(csvfile, delimiter = ' ')
    for l in bc:
        csvwriter.writerow([usedNodesLat[l], usedNodesLon[l], bc[l], degree[l]])



