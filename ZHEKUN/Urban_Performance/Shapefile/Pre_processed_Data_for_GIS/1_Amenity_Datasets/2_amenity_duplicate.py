#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Nov 20 2017
   Find duplicate amenity that has the same id but categoried into multiple types
   ***(copy Amenity/2016-AndorraTurisme-ALL.csv and name it 2016-AndorraTurisme-ALL_id.csv, only leav the first column of id)
   Then manually get rid of duplicated amenities based on categorization

   * Leisure&Nature&Snow&Wellness —> entertainment
   * altogether 6 categories: Culture&Gastronomy&Entertainment&Lodging&Services&Shopping

   
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
import pandas as pd


CSVlist=[]

for filename in os.listdir("Amenity"):
   if "ALL_id" in filename:
      CSVlist.append(filenames)

ids = set({})

for filename in CSVlist:
   with open("Amenity/"+filename, encoding='utf-8') as inFile:
      for row in inFile:
         if row in ids:
            print(row)
         else:
            ids.add(row)

         

      
