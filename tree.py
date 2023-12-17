import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__)
CORS(app)

# Đọc dữ liệu và đào tạo mô hình
df = pd.read_csv('fire.csv')
X = df[['temp', 'hum', 'gas', 'flame']]
y = df['goal']

clf = DecisionTreeClassifier(random_state=42)
clf.fit(X, y)

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.get_json()

    temp = data.get('temp', None)
    hum = data.get('hum', None)
    gas = data.get('gas', None)
    flame = data.get('flame', None)

    if temp is not None and hum is not None and gas is not None and flame is not None:
        new_data = {'temp': temp, 'hum': hum, 'gas': gas, 'flame': flame}  
        new_data_df = pd.DataFrame([new_data])

        danger_level = clf.predict(new_data_df)
        return jsonify({'status': 'success', 'danger_level': danger_level[0]})
    else:
        return jsonify({'status': 'error', 'message': 'Invalid input data'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
