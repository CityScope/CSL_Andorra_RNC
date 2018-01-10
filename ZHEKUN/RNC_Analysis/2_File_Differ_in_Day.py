#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sep 25 2017

Go through all raw data csv files, and categorize the datapoints based on the date
Produce csv files with each only contain one-day datapoints


Each datapoint includes info:
- ID
- Nation: transformed to country name based on MCC code
          - see "mcc_talbe_final.csv" table
- Timestamp: datetime format
- Longitude
- Latitude
- Ec/No
- RSCP
- Cell: Cell tower ID


SPECIAL EXPLANATION:
    Ideally, the code would be better to produce each day's datapoints in one file.
    However, due to the memory and computing power of own PC, the code will produce file after going through every 500 raw data csv files (one set)
    e.g. for 1-500 csv files, set 1; for 501-1000 csv files, set 2..... (This is how "num" and "set500" elements in the code work)

    Therefore, the final output for one day's data may be in multiple files, such as 20160705_10.csv and 20160705_11.csv
    The file names indicate that they are all datapoints on 07/05/2016, but from set 10 and set 11 respectively

    See "3_Combine_CSV.py" for how to merge one day's files into one csv


    **I also write another python script which we can compute one day csv file directly with big computing power, see "2b_File_Differ_in_Day_SHORTCUT"
    **In this case, we can skip "3_Combine_CSV.py"

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

# Reference of MCC (mobile country code), get mccDict
with open("mcc_table_final.csv") as mccFile:
    next(mccFile, None)
    mccData = csv.reader(mccFile)
    mccDict = {}
    for row in mccData:
        code, country = row
        mccDict[int(code)] = country

# Make a folder to store our output
os.makedirs("outputcsv_date")       

# List which stores all the dataframes from differernt csv files the code go through
df_list = []

# Counting how many files go through right now in a set
num = 0
# Counting how many sets we have (1 set = 500 raw data csv files)
set500 = 0

for folder in rncFilePath:
#    os.chdir(folder)
    for filename in os.listdir(folder):
        if "Location" in filename:
            with open(folder+"/"+filename, mode = 'r') as infile:
                df = pd.read_csv(infile, sep=';')
                #Delete unnecessary data: Static/Mobile;Indoor/Outdoor;IMEI;TAC;Rncld;LAC;DL UARFCN
                df.drop(["MNC", "Static/Mobile", "Indoor/Outdoor", "HASH_IMEI", "IMEI_TAC", "RncId", "LAC", "DL UARFCN"], axis = 1, inplace=True)
                #Rename the column names
                df = df.rename(columns = {'HASH_IMSI': "id", "MCC": "Nation", "MNC": "Network", "CellId": "Cell"})
                #Replace the mcc code with country name
                df['Nation'].replace(mccDict, inplace=True)
                #map timestamp from UTC/GMT to Andorra's time, +2 hours summer time
                df['Timestamp'] = df['Timestamp'].apply(lambda x : time.strftime("%Y%m%d %H:%M:%S", time.gmtime(timeCorrection+int(calendar.timegm(time.strptime(x[0:15], '%Y%m%dT%H%M%S'))))))
                #add one column with only the date of timestamp for further subdivision
                df['TimeRef'] = df['Timestamp'].apply(lambda x: x[:8])


                df_list.append(df)
                print(folder+" "+ filename + " done")
                num += 1

                if num == 500:
                    # set num to 0 when we finish one set
                    num = 0
                    # indicate 
                    set500 += 1
                    # Combine all dataframes from one set (500 csv files)
                    df_all = pd.concat(df_list)

                    # Divide dataframe based on date, and write to csv file
                    for date, df_timeRef in df_all.groupby('TimeRef'):
                        del df_timeRef['TimeRef']
                        df_timeRef.to_csv("outputcsv_date/"+date+"_"+str(set500)+".csv", sep=";", encoding='utf-8', index=False)

                    # set to empty list after one set
                    df_list = []


# Repeat for the last set in case it hasn't reached 500 raw data csv files
# Combine all dataframes
set500 += 1
df_all = pd.concat(df_list)

# Divide dataframe based on date, and write to csv file
for date, df_timeRef in df_all.groupby('TimeRef'):
    del df_timeRef['TimeRef']
    df_timeRef.to_csv("outputcsv_date/"+date+"_"+str(set500)+".csv", sep=";", encoding='utf-8', index=False)                 

                


    
