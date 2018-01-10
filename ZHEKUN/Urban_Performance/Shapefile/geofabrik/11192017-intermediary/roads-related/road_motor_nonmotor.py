import csv

motor = []
non_motor = []
with open("motor_grid.csv", "r") as infile1:
   reader_motor = csv.reader(infile1, delimiter=',')
   next(reader_motor)
   for row in reader_motor:
      motor.append(row[1])
      

with open("non_motor_grid.csv", "r") as infile2:
   reader_non_motor = csv.reader(infile2, delimiter=',')
   next(reader_non_motor)
   for row in reader_non_motor:
      non_motor.append(row[1])

with open("all_grid.csv", "w") as outfile:
   writer = csv.writer(outfile, delimiter=',')
   writer.writerow(["id","motor","non_mo"])
   for i in range(37524):
      ID = str(i+1)
      if ID in motor:
         motor_value = "1"
      else:
         motor_value = "0"
      if ID in non_motor:
         non_motor_value = "1"
      else:
         non_motor_value = "0"

      writer.writerow([ID, motor_value, non_motor_value])


