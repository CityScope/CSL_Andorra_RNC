#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sep 25 2017

Check whether each csv file includes the points all in the same day
Print out the file name which includes points of different days

The result shows that each csv raw data file may contain more than 1-day's data.
Therefore, we need to subdivide those csvs based on the date of each datapoint,
and get one day csv file for each day (see "2_File_Differ_in_Day.py")

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


# List of raw data folder names
rncFilePath = ["2016-AndorraTelecom-RNC", "2016-AndorraTelecom-RNC-2"]

# RNC times are in UTC- will need to convert them to Andorra time: UTC+2 in the summer.
timeCorrection=2*60*60


for folder in rncFilePath:
    for filename in os.listdir(path = folder):
        if "Location" in filename:
            with open(folder+"/"+filename, mode = 'r') as infile:
                data = csv.DictReader(infile, delimiter=";")

                startpoint_day = None
                for row in data:
                    # Get epoch format time after 2-hours time zone correction
                    CorrectedEpochTime = timeCorrection+calendar.timegm(time.strptime(row['Timestamp'][0:15], '%Y%m%dT%H%M%S'))
                    # Transform into datetime format from epoch format
                    CorrectedDateTime = time.strftime("%Y%m%d %H:%M:%S", time.gmtime(CorrectedEpochTime))


                    # Check whether the date of all datapoints is consistent or not

                    # Check if the date of the new point is equal to the first data point
                    if startpoint_day:
                        if CorrectedDateTime[:8] != startpoint_day:
                            print(folder+"/"+filename)
                            break
                    # Starting of the file, store the date into the element of "startpoint_day"
                    else:
                        startpoint_day = CorrectedDateTime[:8]



    
