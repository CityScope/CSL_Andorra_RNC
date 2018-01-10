#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Nov 20 2017
   Transform the amenity dataset from json file into csv files
   * Json file from FTP database: home/data_repository/datasets/tourism
     2016-AndorraTurisme-Culture&Gastronomy&Leisure&Lodging&Nature&Services&Shopping&Snow&Wellness

   Refer to 2_amenity_duplicate.py for finding the duplicate amenities in the next step

@author: Zhekun Xiong
"""

from sklearn.cluster import DBSCAN
import numpy as np
import os
import time
import calendar
import json
import pyproj
import csv
import matplotlib.path as mplPath


JSONlist=[]

for filename in os.listdir("Amenity"):
   if ".json" in filename:
      JSONlist.append(filename)


for filename in JSONlist:
   with open("Amenity/"+filename,mode ="r",encoding='utf-8') as inFile:
      data = json.load(inFile)
   with open("Amenity/"+filename[:-5]+".csv", "w", encoding='utf-8') as outFile:
      w = csv.writer(outFile,delimiter=';')

      w.writerow(["id","name","lat","long"])

      for line in data:
         if "Hotels" in filename or "Restaurants" in filename:
            ID = line["id"]
            name = line["attr"]["name"]
            if line["attr"]["geo_location"]:
               lat = line["attr"]["geo_location"]["latitude"]
               long = line["attr"]["geo_location"]["longitude"]
               # street = line["attr"]["geo_location"]["street"]
               w.writerow([ID,name,lat,long])
         else:
            try:
               ID = line["id"]
               name = line["attr"]["name"]
               if line["attr"]["geo_location"][0]["latitude"]:
                  lat = line["attr"]["geo_location"][0]["latitude"]
                  long = line["attr"]["geo_location"][0]["longitude"]
                  w.writerow([ID,name,lat,long])
            except:
               print(filename)
         

      
