#!/bin/sh
#
#
DIR=/ramdisk/Temperature
DB=${DIR}/temperature.db
if [ ! -d $DIR ] ; then mkdir $DIR ; fi
if [ ! -f $DB ] ; then
  #echo "CREATE TABLE temperature \(unixtime\, datetime\, temperature\, humidity\)\; " > ${DIR}/sqlcmd.txt
  echo "CREATE TABLE temperature (unixtime, datetime, temperature, humidity);" > ${DIR}/sql.cmd
  sqlite3 $DB < ${DIR}/sql.cmd
fi
if [ -f ./temperature.db ] ; then rm ./temperature.db ; fi
ln -s ${DB}

python moverecords.py ${DB} ./temperature_archive.db
