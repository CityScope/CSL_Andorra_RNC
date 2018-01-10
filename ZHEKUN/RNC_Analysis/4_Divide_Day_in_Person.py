#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sep 25 2017

Go through each day's csv file, and produce of csv files of each ID,
for further calculating staypoints of each individual, see "5_Person_Staypoints.py"

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

# Make a folder to store our output
os.makedirs("outputcsv_date_combined_person") 

for filename in os.listdir("outputcsv_date_combined"):
    if ".csv" in filename:
        date = filename[:-4]

        # Make a date sub folder to store our output
        os.makedirs("outputcsv_date_combined_person/"+date) 

        with open("outputcsv_date_combined/"+filename, mode = 'r') as infile:
            df = pd.read_csv(infile, sep=';')

        # categorize the datapoints by ID, and produce one csv file for each ID
        for person, df_id in df.groupby('id'):
            df_id.to_csv("outputcsv_date_combined_person/"+date+"/"+person+".csv", sep=";", encoding='utf-8', index=False)                  
    print(filename + "_done")
                


    
