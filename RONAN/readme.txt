I’ve added some scripts, cleaned data etc. to my workspace folder on the server that you may find useful while I’m away. I’ve also added README files and tried to comment the code pretty well.

/home/workspace/rdoorley/staypoints
script for creating stay-point json files (1 per day) from the raw RNC data.
Results of above script: json stay-point files for most of July and some of August.

/home/workspace/rdoorley/movingCluster
a script for finding ‘meeting places’ using moving cluster algorithm. Can produce a full json file for Unity, a light json file for CityScope and Google Maps html files.

/home/workspace/rdoorley/hoursCovered
script for determining the time periods covered by the raw RNC files in each of the folders on the server.
script for producing bar plot of results
png file of the bar plot

_________________________________________________


/home/workspace/rdoorley/cityscope
script for producing light RNC json files for displaying ‘raw’ RNC data on the Andorra CityScope table.
Results of above script: light RNC files for the 6 days of the CityScope table



/home/workspace/rdoorley/events
scripts for analyzing Cirque de Soleil, MTB and TdF attendance.
Results of above scripts: pickle files for CdS attendees and MTB attendees. csv file of Tour De France attendance.

/home/workspace/rdoorley/expansion
script for calculating expansion factor to correct for difference between number of devices and number of people of each nationality during July 2016.
Results of above script: a pickle file of expansion factors for each nationality by MCC code

/home/workspace/rdoorley/mcc
a csv file which can be used to lookup up countries by MCC code.

