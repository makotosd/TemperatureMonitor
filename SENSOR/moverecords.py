# -*- coding: utf-8

import sqlite3
import sys

def mySqlExecute (sql_cursor, sql_str) :
  for iter in range(5):
    #print iter, sql_str
    try :
      sql_cursor.execute(sql_str)
    except sqlite3.Error as e:
      print "An error occurred:", e.args[0]
    else :
      return True

dbname_src = sys.argv[1]
dbname_dst = sys.argv[2]

conn_src = sqlite3.connect(dbname_src)
conn_dst = sqlite3.connect(dbname_dst)
cursor_src = conn_src.cursor()
cursor_dst = conn_dst.cursor()

cursor_src.execute("select * from temperature")
result = cursor_src.fetchall()
for row in result:
  insert_str = "insert into temperature (unixtime, datetime, temperature, humidity) values (\"%s\", \"%s\", \"%s\", \"%s\" )" % (row[0], row[1], row[2], row[3])

  ##############################################
  ret = mySqlExecute(cursor_dst, insert_str)
  if ret is True:
    delete_str = "delete from temperature where unixtime = %s" % (row[0])
    mySqlExecute(cursor_src, delete_str)
  else:
    pass

conn_src.commit()
conn_dst.commit()
mySqlExecute(cursor_src, "vacuum");
mySqlExecute(cursor_dst, "vacuum");
cursor_src.close()
cursor_dst.close()
conn_src.close()
conn_dst.close()

