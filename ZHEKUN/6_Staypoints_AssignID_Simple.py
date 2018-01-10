#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sep 25 2017

Replace the original ID with a simple ID as I1, I2 to I.....
Create json file of staypoints with simplied info

And export the JSON file for each day with extension of "_simple.json", JSON file structure:
{
“SimplifiedID”
   {“S”:{0:{“la”:42.50,
            “lo”: 1.52,
            “s”: epoch format.
            “e”: epoch format.
            “l”: epoch format (length of interval)
            }
        1:{………….
            }
        },
    “N”: Andorra
   }
“id”:xxxxxxxx
…..
}

As well as a csv file "20160630_id_table.csv", which is the id refererence table for old and new ID


@author: Zhekun Xiong
"""

import exifread
import os
import json
import csv


for filename in os.listdir("staypoints_date_JSON"):
    if ".json" in filename:
        with open("staypoints_date_JSON/"+filename,mode="r") as infile:
            data = json.load(infile)

        ids = data.keys()
        newid_data = {}
        id_table = []
        new_id = 0
        for old_id in ids:
            # prepare for making csv id reference table
            id_table.append(str(old_id)+",I"+str(new_id))

            # simplify each individual
            new_each_id = {}
            new_each_id["N"] = data[old_id]["Nation"]

            # simplify stay
            new_stay = {}
            for stay_num in range(len(data[old_id]["stay"])):
                each_stay = {}
                each_stay["l"] = data[old_id]["stay"][str(stay_num)]["interval"]
                each_stay["s"] = data[old_id]["stay"][str(stay_num)]["start"]
                each_stay["e"] = data[old_id]["stay"][str(stay_num)]["end"]
                each_stay["la"] = data[old_id]["stay"][str(stay_num)]["lat"]
                each_stay["lo"] = data[old_id]["stay"][str(stay_num)]["long"]
                new_stay[stay_num] = each_stay

            new_each_id["S"] = new_stay
            
            newid_data["I"+str(new_id)] = new_each_id
            new_id += 1
        
        with open("staypoints_date_JSON/"+filename[:8]+"_id_table.csv", "w") as idTable:
            idTable.write("old_id,new_id\n")
            for id_line in id_table:
                idTable.write(id_line+"\n")

        with open("staypoints_date_JSON/"+filename[:-5]+"_simple.json", mode="w") as newidJSON:
            json.dump(newid_data, newidJSON, indent = 4)


