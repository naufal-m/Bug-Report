from flask import Flask, render_template, request, send_file, jsonify
import pandas as pd
import os
import datetime

app = Flask(__name__)

BUG_REPORT_FILES = 'bug_reports.xlsx'

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
    if bug_id in bug_report:
        return f"Bug with ID {bug_id} already exists."
    else:
        created_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        bug_report[bug_id] = {'Description': description, 'Update': description, 'Status': 'Open', 'Date': created_date,
                               'Update_date': created_date }
        save_bug_report(bug_report)
        return f"Bug ID {bug_id} created successfully."

def update_bug_status(bug_report, bug_id, update, status):
    if bug_id not in bug_report:
        return f"Bug with ID {bug_id} does not exist."
    else:
        update_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        bug_report[bug_id]['Update'] = update
        bug_report[bug_id]['Status'] = status.strip()
        bug_report[bug_id]['Update_date'] = update_date
        save_bug_report(bug_report)
        return f"Successfully updated bug ID {bug_id} and status changed to '{status}'."

def delete_bug(bug_report, bug_id):
    if bug_id in bug_report:
        del bug_report[bug_id]
        save_bug_report(bug_report)
        return f"Bug ID {bug_id} deleted successfully."
    else:
        return f"Bug with ID {bug_id} does not exist."

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

@app.route('/delete_bug/<int:bug_id>', methods=['DELETE'])
def delete_bug_route(bug_id):
    bug_report = load_bug_report()
    message = delete_bug(bug_report, bug_id)
    return jsonify({'message': message})

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
    bug_report = load_bug_report()
    bug_id = int(request.args.get('bug_id'))
    if bug_id in bug_report:
        return jsonify(bug_report[bug_id])
    else:
        return jsonify({'error': 'Bug with the provided ID does not exist.'})

if __name__ == "__main__":
    app.run(debug=True)
