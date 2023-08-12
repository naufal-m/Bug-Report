from flask import Flask, render_template, request, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import os
import datetime

app = Flask(__name__)

BUG_REPORT_FILES = 'bug_reports.xlsx'

# Configure the database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/bugs_db'
# Replace with your database details
db = SQLAlchemy(app)

class Bug(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bug_id = db.Column(db.String(10), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=False)
    update = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    update_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

db.create_all()

def load_bug_report():
    if os.path.exists(BUG_REPORT_FILES):
        return pd.read_excel(BUG_REPORT_FILES, index_col=0).to_dict(orient='index')
    else:
        return {}

def save_bug_report(bug_reports):
    df = pd.DataFrame.from_dict(bug_reports, orient='index')
    df.index.name = 'Bug ID'
    df.to_excel(BUG_REPORT_FILES)

def add_bug(bug_report, bug_id, description):
    existing_bug = Bug.query.filter_by(bug_id=bug_id).first()
    if existing_bug:
        return f"Bug with ID {bug_id} already exists."

    new_bug = Bug(bug_id=bug_id, description=description, update=description, status='Open')
    db.session.add(new_bug)
    db.session.commit()

    return f"Bug ID {bug_id} created successfully."

def update_bug_status(bug_report, bug_id, update, status):
    existing_bug = Bug.query.filter_by(bug_id=bug_id).first()
    if not existing_bug:
        return f"Bug with ID {bug_id} does not exist."

    existing_bug.update = update
    existing_bug.status = status.strip()
    existing_bug.update_date = datetime.datetime.utcnow()
    db.session.commit()

    return f"Successfully updated bug ID {bug_id} and status changed to '{status}'."

def view_bugs(bug_report):
    return bug_report

@app.route('/', methods=['GET'])
def index():
    bug_report = load_bug_report()

    # Calculate the count of status values
    status_counts = {
        'Open': 0,
        'In Progress': 0,
        'Closed': 0
    }
    for bug_data in bug_report.values():
        status = bug_data.get('Status', '')
        if status in status_counts:
            status_counts[status] += 1

    return render_template('index.html', status_counts=status_counts)

@app.route('/add_bugs', methods=['POST'])
def add_bugs_route():
    bug_report = load_bug_report()
    bug_id = request.form['bug_id']
    description = request.form['description']
    message = add_bug(bug_report, bug_id, description)
    return message

@app.route('/update_bugs', methods=['POST'])
def update_bugs_route():
    bug_report = load_bug_report()
    bug_id = int(request.form['bug_id'])
    change = request.form['change']
    status = request.form['status'].strip()

    message = update_bug_status(bug_report, bug_id, change, status)
    return message

@app.route('/view_bugs', methods=['GET'])
def view_bugs_route():
    bug_report = load_bug_report()
    # return view_bugs(bug_report)
    return render_template('view_table.html', bug_report=bug_report)

@app.route('/download_bug_report')
def download_bug_report():
    # Ensure the 'bug_report.xlsx' file exists in the same directory as 'app.py'
    file_path = 'bug_reports.xlsx'
    return send_file(file_path, as_attachment=True)

@app.route('/get_bug_details')
def get_bug_details():
    bug_id = int(request.args.get('bug_id'))
    with app.app_context():
        bug = Bug.query.filter_by(bug_id=bug_id).first()
        if bug:
            return jsonify({
                'Description': bug.description,
                'Update': bug.update,
                'Status': bug.status
            })
        else:
            return jsonify({'error': 'Bug with the provided ID does not exist.'})

if __name__ == "__main__":
    app.run(debug=True)
