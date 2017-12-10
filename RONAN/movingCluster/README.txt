Script for finding ‘meeting places’ in Andorra.

Reads the previously created stay-point files, organises the stay-point data into time-slices and applies a moving cluster algorithm.

Based on the Moving Cluster algorithm MC1 in Kalnis et al (2005) https://link.springer.com/chapter/10.1007/11535331_21

Parameters of the MC algorithm:
theta: proportion of cluster membership which must be the same for 2 consecutive clusters to be considered the same cluster.
eps: distance parameter of the DBSCAN algorithm used at each time step.
minPeople: minimum cluster size for the DBSCAN algorithm.

Change the ‘startTimeStrings’ variable to change the days being processed. Eg. to process data for July 9th and 10th:
startTimeStrings=['2016-07-03 000000', '2016-07-10 000000’]

Before this script can run, the staypoint files for the days of interest must already exist in the stay points folder.

At present, only the first 10 minute slice of each hour is used in the output files in order to reduce the volume of data.

There are four types of output which can be turned on or off by changing the booleans. These optional outputs are:

lightJson: to be used for the Andorra CityScope table. One file per day. Don’t include subscriber ids or unclustered points

heavyJson: include both clustered points and unclustered points. Each location observation in the clustered data includes an id for the subscriber. 1 file for all days.

htmlFiles: Google maps html files showing clustered and unclustered observations.

RJson: used by Ronan for R Shiny app
