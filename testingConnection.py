# Connect to mysql
import mysql.connector
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="my-secret-pw"
)

print(mydb)

myCursor = mydb.cursor()

# List all databases
myCursor.execute("SHOW DATABASES")
for i in myCursor:
    print(i)