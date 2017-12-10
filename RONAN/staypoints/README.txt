This script reads the raw RNC csv files and produces json files of ‘stay-points’ for each day, organised by person.

Based on stay-point detection algorithm in paper ‘Mining user similarity based on location history’ http://dl.acm.org/citation.cfm?id=1463477

maxRoam (meters) and minStay (seconds) are parameters of the stay point detection algorithm.

The time period to process is determined by startTime, chunkPeriod (seconds) and numChunks. eg. if startTime='2016_07_30 000000’, chunkPeriod=24*60*60 and numChunks=2, the script will produce two json files, one for July/30 and one for July/31

IMPORTANT:Before running, ensure that rncFilePath is pointing to the correct folder. The RNC data for different time periods are stored in different folders. See workspace/rdoorley/hoursCovered’ for information on which time periods are covered by which folders.

The top level of each output json file contains 4 objects: 
‘ids’: the list of hashed subscriber IDs
‘TAC’: the list of TACs (phone model codes) corresponding to each subscriber, 
‘nation’: the list of MCC (nationality codes) of each subscriber
’stays’: a list of stay-point objects for each subscriber.

Each stay-point object contains the following fields:
‘p’: position in UTM31N format
’s’: start time of stay in local time (CEST), epoch format
‘e’: end time of stay in local time (CEST), epoch format
’n’: number of observations which comprise this stay.
