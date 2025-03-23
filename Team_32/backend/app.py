from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd

app = Flask(__name__)

# ✅ Step 1: Configure Database (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'  # Use PostgreSQL/MySQL in production
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ✅ Step 2: Define Database Schema
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    service = db.Column(db.String(100))
    date = db.Column(db.String(20))
    time = db.Column(db.String(20))
    location = db.Column(db.String(200))

# ✅ Step 3: Fetch Data from Google Sheets
def fetch_google_sheets():
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("alert-brook-454605-e1-c32736f41074.json", scope)
    client = gspread.authorize(creds)

    sheet = client.open("Event Registration (Responses)").sheet1  # Change to your sheet name
    data = sheet.get_all_records()
    return pd.DataFrame(data)

# ✅ Step 4: Store Data in Database
def update_database():
    df = fetch_google_sheets()
    db.session.query(Appointment).delete()  # Clear old data

    for _, row in df.iterrows():
        new_entry = Appointment(
            name=row['Name'],
            email=row['Email Address'],
            service=row['Service Needed'],
            date=row['Enter the preferred date:'],
            time=row['Enter the preferred time:'],
            location=row['Enter the address for service delivery:']
        )
        db.session.add(new_entry)

    db.session.commit()

# ✅ Step 5: Define Routes
@app.route('/')
def home():
    return render_template('index.html')  # Your existing homepage

@app.route('/appointments')
def appointments():
    all_appointments = Appointment.query.all()
    return render_template('appointments.html', appointments=all_appointments)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        update_database()

    print("\n🚀 Server is running! Access the web pages here:")
    print("🏠 Home Page: http://127.0.0.1:5000/")
    print("📅 Appointments Page: http://127.0.0.1:5000/appointments\n")

    app.run(debug=True)


# import gspread
# from oauth2client.service_account import ServiceAccountCredentials

# # Set up authentication
# scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
# creds = ServiceAccountCredentials.from_json_keyfile_name("alert-brook-454605-e1-c32736f41074.json", scope)
# client = gspread.authorize(creds)

# # Open the sheet
# sheet = client.open("Event Registration (Responses)").sheet1  # Change to actual sheet name

# # Fetch data
# data = sheet.get_all_records()
# print(data)  # Should print rows from your Google Sheet





