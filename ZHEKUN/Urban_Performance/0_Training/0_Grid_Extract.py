#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Nov 20 2017
   select grids which are within Andorra La Vella residential area
   create a csv file used for model training

@author: Zhekun Xiong
"""


import json
import csv
import os


# get the grid id within Andorra La Vella residential area
with open("la_vella_overlap_grid_100perc.csv", "r") as inFile:
   reader = csv.reader(inFile, delimiter=',')

   gridlist = []
   for row in reader:
      gridlist.append(row[0])

os.makedirs("Training_Data", exist_ok=True)

# Select those grids with their value and create a new csv file
with open("Feature_Vector/With_Cluster_Bi/Feature_Vector_Normalized_20160702.csv", "r") as inFile:
   reader = csv.reader(inFile, delimiter=',')


   with open("Training_Data/Feature_Vector_Normalized_filter_grid_20160702.csv", "w") as outFile:
      writer = csv.writer(outFile, delimiter = ',')

      for row in reader:
         if row[0] in gridlist or row[0] == "id":
            writer.writerow(row)
            
