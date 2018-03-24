## Andorra RNC

![](/DOCS/2.gif)

### Predicting Urban Performance Through Behavioral Patterns in Temporal Telecom Data
This study explores a novel method to analyze diverse behavioral patterns in large urban populations and to associate them with discrete urban features. This work utilizes machine learning and anonymized telecom data to understand which fragments of the city has greater potential to attract dense and diverse populations over longer periods of time.   Finally, this work suggests a road map for building spatial prediction tools in an effort to improve city-design and planning processes.  


## How do we use urban environments?
Urban environments are inherently temporal: they contain static artifacts (buildings, roads, public or open spaces) that are staged to support dynamic activities (movements, traffic, commerce or stay). For centuries, planners, developers and governments were investigating these relationships in an attempt to improve the design and performance of successful urban spaces.


Nevertheless, more empirical analysis of users’ engagement with urban environments has always been challenging:  Lack of data and scarcity of tools left room for unproven assessments, sometimes leading to poor decision-making. But recent advancements in data and machine learning carry a promise to potentially reverse this approach: instead of looking at the form to infer behavior, can we look at behavior and potentially suggest urban form?


![](/DOCS/0.gif)

_The telecom mesh in Andorra La Vella. Data collected in these towers was used to localize tens of thousands of locals and visitors every second, over a period of several months. Overall, millions of data points where allowing the patterning of urban behavior at a city-scale._  
____



## Urban Analysis Using Telecom Data
Utilizing telecom data for spatial analysis has been widely researched and practiced. In the past few decades, the advent of Location Based Services [LBS] has sparked the interests of urbanists who wished to sense the ‘beating pulse’ of the city and allowed them near real-time comprehension of urban dynamics. Yet in many cases, low data resolution or limited accuracy forced researchers to generalize behavioral patterns over large tracts of the city. At the same time, measuring highly-accurate behaviors was mostly available through participatory processes or by using specialized equipment; These limitations bounded discrete spatial analysis to confined and small portions of the city.
å
![](/DOCS/1.gif)

_Stay events analysis over 24h period. Accumulating the public's behavioral patterns  over multiple days highlights where 'urban clusters' are forming._
____
However, higher spatial and temporal resolution data can be obtained through signal strengths aggregation from multiple cell-towers and by using geolocation techniques such as Received Signal Strength and triangulation. This study also provides a comparative analysis of temporal data sources in the context of urban planning and suggest potential coupling of various sources to achieve large scale, near-GPS accuracy. 


## Machine Learning the Urban Form: Case study Andorra 
As a case study, this work examines the country of Andorra (EU) with a focus on its major urban areas. A European tourist city-state, Andorra is now undergoing changes to its visitors’ population as well a wave of new urban development. The country features diverse population of locals, visitors and tourists which is challenging to survey using traditional methods. The purpose of the described method is to correlate locals and visitors’ dynamics to a set of discrete urban features describing Andorra's cityscape and eventually aid in understanding and designing highly-performing urban interventions.


This method involves dividing Andorra’s study area into microscopic, regularly spaced cells and computing two sets of metrics:

(A) Human Dynamics
 A measure of urban performance is generated based on a set of timestamped geolocated cellphone traces associated with individuals. This is achieved by segmenting the data into discrete time periods, finding ‘staypoints’ and identifying spatial clusters within each time period . The occurrence of specific clusters [dense, heterogeneous, persistent and stationary] is considered as an indication of higher social activity and interaction.

(B) Urban Features
Diverse set of urban features are then defined and computed for each grid cell. Machine Learning algorithms (such as Random Forest) which model the occurrence of clusters as a function of these features are then trained on the city’s grid-cells. All through this process, the accuracy of this model is tested against unbiased random grid cells.

Finally, the most prevailing urban features in correlation to the presence of clusters are extracted using this model. Of these, the presence of open space, impact of amenities, the degree of built-up area and the highest betweenness centrality of the road network nodes appeared to largely dominate. Additional models have been developed to explain other cluster characteristics such as diversity and persistence. 
