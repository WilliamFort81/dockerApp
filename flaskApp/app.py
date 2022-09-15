# Imports 
import mysql.connector
from flask import Flask, render_template, redirect

connected = False

while not connected:
    try:
        # Connect to mysql
        mydb = mysql.connector.connect(
            host="172.22.0.2",
            user="root",
            password="my-secret-pw",
            port=3306
        )
        connected = True
    except:
        pass



# Open /files/data.csv
with open('files/data.csv', 'r') as f:
    dataArray = []
    for line in f:
        dataArray.append(line.split(','))
dataArray.pop(0)
for i in dataArray:
    for x in i:
        i[-1] = i[-1].strip()
    i.pop(0)
print(dataArray)
        
colNames = [ 'HotelName', 'City', 'Continent', 'Country', 'Category', 'StarRating', 'TempRating','Location', 'PricePerNight']

# Make cursor for mydb
myCursor = mydb.cursor()
# Create holidayTravel if not already
myCursor.execute("CREATE DATABASE IF NOT EXISTS holidayTravel")
mydb.commit()
myCursor.execute("USE holidayTravel")
myCursor.execute("CREATE TABLE IF NOT EXISTS data (id INT AUTO_INCREMENT PRIMARY KEY, HotelName VARCHAR(255), City VARCHAR(255), Continent VARCHAR(255), Country VARCHAR(255), Category VARCHAR(255), StarRating VARCHAR(255), TempRating VARCHAR(255), Location VARCHAR(255), PricePerNight VARCHAR(255))")
mydb.commit()
myCursor.execute("TRUNCATE TABLE data")
for i in range(len(dataArray)):
    sql = "INSERT INTO data (HotelName, City, Continent, Country, Category, StarRating, TempRating, Location, PricePerNight) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    var = (dataArray[i][0], dataArray[i][1], dataArray[i][2], dataArray[i][3], dataArray[i][4], int(dataArray[i][5]), dataArray[i][6], dataArray[i][7], dataArray[i][8])
    print(dataArray[i][5])
    myCursor.execute(sql, var)
    mydb.commit()
app = Flask(__name__)
questions = ['What temperature do you prefer?', 'What is your budget (nearest 25GBP)?', 'What Star Rating would you like?']
resultArray = []
query = []
@app.route("/submitClicked/<args>")
def submitClicked(args):
    # Take csv args and turn into array
    userAnswerArray = args.split(',')

    # Section for generating SQL query
    # First is for temperature and then for budget and then for star rating
    lowerCost = int(userAnswerArray[1]) - 25
    upperCost = int(userAnswerArray[1]) + 25
    query = "SELECT * from data WHERE TempRating = '" + userAnswerArray[0] + "' AND PricePerNight >=" + str(lowerCost) + " AND PricePerNight <= " + str(upperCost)+" AND StarRating = "+ userAnswerArray[2]
    myCursor.execute(query)
    query = []
    
    
    for i in myCursor:
        resultArray.append(i)
    print(resultArray)
    userAnswerArray = []
    return(render_template('/index.html', questions=questions, resultArray=resultArray))
@app.route("/")
def index():
    return render_template('/index.html', questions=questions, resultArray=resultArray)

@app.route("/reset")
def reset():
    global resultArray
    resultArray = []
    return render_template('/index.html', questions=questions, resultArray=[])




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
    