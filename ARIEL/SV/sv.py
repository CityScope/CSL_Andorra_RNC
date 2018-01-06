# import os and urllib modules
# os for file path creation
# urllib for accessing web content
import urllib
import os
# this is the first part of the streetview, url up to the address, this url will return a 600x600px image
pre = "https://maps.googleapis.com/maps/api/streetview?size=300x300"
head = "&heading="
pitch = "&pitch=-0.76"
loc = "&location="
# this is the second part of the streetview url, the text variable below, includes the path to a text file containing one address per line
# the addresses in this text file will complete the URL needed to return a streetview image and provide the filename of each streetview image
text = "a.txt"
# this is the third part of the url, needed after the address
# API key
suf = "&amp;key=AIzaSyAC9P4Njf_yRogkp0M-cPpWr5Op_r6hvg4"
# this is the directory that will store the streetview images
# this directory will be created if not present
dir = r"img"
# checks if the dir variable (output path) above exists and creates it if it does not
if not os.path.exists(dir):
    os.makedirs(dir)
# opens the address list text file (from the 'text' variable defined above) in read mode ("r")
with open(text, "r") as text_file:
    # the variable 'lines' below creates a list of each address line in the source 'text' file
    lines = [line.rstrip('\n') for line in open(text)]
print "THE CONTENTS OF THE TEXT FILE:\n" + str(lines)
# start a loop through the 'lines' list
for line in lines:
    # get several angles from each point
    for ang in range(0, 360, 30):  # 0 to 360 in jumps of 30 degrees
        # string clean-up to get rid of commas in the url and filename
        ln = line.replace(",", "")
        print '\n'
        print "CLEANED UP ADDRESS LINE:\n" + ln
        # creates the url that will be passed to the url reader, this creates the full, valid, url that will return a google streetview image for each address in the address text file
        URL = pre + head + str(ang) + pitch + loc + ln + suf
        print "URL FOR STREETVIEW IMAGE:\n" + URL
        # creates the filename needed to save each address's streetview image locally
        filename = os.path.join(dir, ln + "_angle_" + str(ang) + ".png")
        print "OUTPUT FILENAME:\n" + filename
        # you can run this up to this line in the python command line to see what each step does
        # final step, fetches and saves the streetview image for each address using the url created in the previous steps
        urllib.urlretrieve(URL, filename)
