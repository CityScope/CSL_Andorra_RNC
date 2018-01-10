#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sep 25 2017

Categorize the csv files produced by "2_File_Differ_in_Day.py" into differnt days, and combine for each day
e.g. combine 20160705_10.csv and 20160705_11.csv, and produce "20160705.csv"

** If using "2b_File_Differ_in_Day_SHORTCUT.py", we can skip running this code

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

# The folder where we store the output from "2_File_Differ_in_Day.py"
csvFilePath = ["outputcsv_date"]

df_date_list = []
date = None
date_set = set([])

# Make a folder to store our output
os.makedirs("outputcsv_date_combined") 

# calculate the total number of valid files in the folder
total_file_num = 0
for folder in csvFilePath:
    for filename in os.listdir(folder):
        if ".csv" in filename:
            total_file_num += 1
            
# Counting how many files we have gone through
file_num = 0

for folder in csvFilePath:
    for filename in os.listdir(folder):
        if ".csv" in filename:
            print(filename)
            file_num += 1

            # a new date csv file is gone through
            if filename[:8] not in date_set:
                # convert the previous date data into one csv file
                if df_date_list:
                    df_date = pd.concat(df_date_list)
                    df_date.to_csv("outputcsv_date_combined/"+date+".csv", sep=";", encoding='utf-8', index=False)
                    df_date_list = []
                    print(date+" done")
                # add this new date into the date_set
                date_set.add(filename[:8])
                date = filename[:8]

            # store this new date file's data into the list, and we will check if the next one is the same date as this or not
            with open(folder+"/"+filename, mode="r") as infile:
                df = pd.read_csv(infile, sep=';')
                df_date_list.append(df)

            # after the last file, produce the csv directly
            if file_num == total_file_num:
                df_date = pd.concat(df_date_list)
                df_date.to_csv("outputcsv_date_combined/"+date+".csv", sep=";", encoding='utf-8', index=False)
                print("last done")
                  

                


    
