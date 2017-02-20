#!/bin/sh
#
#
cmd=/ramdisk/export_csv.sql
SQLDB1=/home/pi/Project/TemperatureMonitor/temperature_archive.db
SQLDB2=/ramdisk/Temperature/temperature.db
tmpcsv1=/ramdisk/result1.csv
tmpcsv2=/ramdisk/result2.csv
RESULT=/ramdisk/Temperature/temperature_all.csv

echo ".headers on" > $cmd
echo ".mode csv" >> $cmd
echo ".output $tmpcsv1" >> $cmd
echo "select * from temperature;" >> $cmd
cat $cmd | sqlite3 $SQLDB1

echo ".headers off" > $cmd
echo ".mode csv" >> $cmd
echo ".output $tmpcsv2" >> $cmd
echo "select * from temperature;" >> $cmd
cat $cmd | sqlite3 $SQLDB2

cat $tmpcsv1 $tmpcsv2 > $RESULT
rm $tmpcsv1 $tmpcsv2 $cmd
