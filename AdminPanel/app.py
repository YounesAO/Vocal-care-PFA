from flask import Flask, request, render_template, jsonify, Response
from flask_pymongo import PyMongo
from pymongo import MongoClient
from gridfs import GridFS
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
import tempfile
import os
import subprocess
import random




app=Flask("__name__")
CORS(app)  

app.config["MONGO_URI"] = "mongodb://localhost:27017/vocal_care"

mongo = PyMongo(app)
pathodologie = mongo.db.scan
pathname=mongo.db.Pathodologie
symptoms = mongo.db.symptom
users = mongo.db.users
fs = GridFS(mongo.db)



@app.route("/")
def index1():
    return render_template("index1.html")

@app.route("/index")
def index():
    return render_template("index.html")






########################################################################################
########################################################################################
######################    BACKEND  FOR MOBILE APP API     ##############################
########################################################################################
########################################################################################
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json  
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    user_id = mongo.db.users.insert_one({
        'username': username,
        'email': email,
        'password': password  
    }).inserted_id

    return jsonify({'success': True, 'user_id': str(user_id)}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = mongo.db.users.find({'email': email,'password':password})
    print(user)
    # Check if user exists and password matches
    if  user :
        return jsonify({'success': True, 'message': 'Login successful'}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401


@app.route('/symptoms', methods=['GET'])
def symptoms():
    try:
        result = list(mongo.db.symptom.find({}, {'_id': 0}))  
        print(result)
        return jsonify({'message': 'Form data stored successfully','symptom': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500    

@app.route('/scan', methods=['POST'])
def scan():

    data = request.json
    meta_data = (data.get('metaData'))

    gender = meta_data.get('gender')
    age = meta_data.get('age')
    occupation = meta_data.get('occupation')
    country_region = meta_data.get('countryRegion')
    #user_id = meta_data.get('user_id')
    #document definition
    data_document = {
        'gender': gender,
        'age': age,  
        'occupation': occupation,
        'country_region': country_region,
    }
    try:
        result = mongo.db.users.insert_one(data_document)
        user_id = result.inserted_id
        print(user_id)
        print(data.get('metaData'))
        symptom = data.get("symptoms")
        path = random.choice(["Neoplasm", "Vocal Palsy", "Phonotrauma", "none"])
        print(path)
        result = mongo.db.scan.insert_one({'user_id':user_id,'symptoms':symptom,'result':path}) 
        print(data.get("symptoms"))
        return jsonify({'message': 'Form data stored successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    #audio
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file :
        temp_dir = tempfile.mkdtemp()
        audio_path = os.path.join(temp_dir, 'input_audio' + '.wav')
        file.save(audio_path)
        wav_path = os.path.join(temp_dir, 'output_audio.wav')
        subprocess.run(['ffmpeg', '-i', audio_path, '-ac', '1', '-ar', '16000', wav_path])

    data_document = {
        'audio_file':file.filename,
        'audio_path':wav_path,
        }
    try:
        mongo.db.scans.insert_one(data_document)
        return jsonify({'message': 'Scan data stored successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/pathologies', methods=['GET'])
def pathologies():
    try:
        result = list(mongo.db.pathologie.find({}, {'_id': 0}))  
        print(result)
        return jsonify({'message': 'Form data stored successfully','pathologie': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/addPathologie", methods=["POST"])
def add_pathologie():
    req = request.get_json()
    if pathname.find_one({"Nom": req["Nom"]}):
        return Response("false", status=200, mimetype='text/plain') 
    pathname.insert_one(req)
    print(req)
    return Response(status=203, mimetype='text/plain')

@app.route("/stopPathologie", methods=["POST"])
def stop_pathologie():
    req = request.get_json()
    path = pathodologie.find_one({"nom": req["nom"]})
    if path and symptoms.find_one({"nom": req["nom"]}):
        pathodologie.update_many(
            {"nom": req["nom"]},
            {"$set": {"id_path": i}}
        )
        return Response("false", status=200, mimetype='text/plain')
    return Response(status=404, mimetype='text/plain') 

@app.route("/importML", methods=["POST"])
def import_ml():
    if 'fichier' not in request.files:
        return "Aucun fichier n'a été envoyé."

    fichier = request.files['fichier']
    if fichier.filename == '':
       return Response("false", status=201, mimetype='text/plain')
    fs.put(fichier, filename=fichier.filename)
    print(request)
    return Response(status=200, mimetype='text/plain')
    
@app.route('/add_symptom', methods=['POST'])
def add_symptom():
    req = request.get_json()

    if not req or "label" not in req or "data" not in req:
        return Response("Invalid request data", status=400, mimetype='text/plain')

    cat = symptoms.find_one({"label": req["label"]})
    
    if cat:
        # Vérifier si le nom existe déjà dans la liste des symptômes
        if any(symptom["name"] == req["data"] for symptom in cat["data"]):
            return Response(status=300)

        # Append new data to the existing data list
        updated_data = cat["data"] + [{"name": req["data"], "description": ""}]
        symptoms.update_one(
            {"label": req["label"]},
            {"$set": {"data": updated_data}}
        )
        return Response("false", status=201, mimetype='text/plain')
    else:
        # Insert new symptom data
        new_symptom = {
            "label": req["label"],
            "data": [{"name": req["data"], "description": ""}]
        }
        symptoms.insert_one(new_symptom)
        return Response(status=200, mimetype='text/plain')

########################################################################################
########################################################################################
###################### BACKEND  FOR ADMINISTRATOR WEBSITE ##############################
########################################################################################
########################################################################################

@app.route('/data')
def get_data():
    data = {}
    j = 0
    code = pathodologie.find()
    for i in code:
        i_dict = {}
        for key, value in i.items():
            i_dict[key] = value
        data[f"path{j}"] = str(i_dict)
        j += 1
    return jsonify(data)

@app.route('/donnes', methods=['GET'])
def envoyer_donnees():
    data = {}
    j = 0
    code = pathodologie.find()
    for i in code:
        i_dict = {}
        for key, value in i.items():
            i_dict[key] = value
        data[f"scan {j}"] = str(i_dict)
        j += 1
    return jsonify(data)

@app.route("/admin_info",methods=["POST"])
def user_info():
    req=request.get_json()
    message="bom"
    data=mongo.db.admin_information.find_one({"username":"abdellah"})
    print(data["username"])
    print(req["username"])
    print(req["password"])
    print(data["password"])
    if(data["username"]==req["username"] and data["password"]==req["password"]):
        return Response(message, status=200, mimetype='text/plain')
    return Response(message, status=404, mimetype='text/plain')

@app.route("/dare", methods=['GET'])
def getinfo():
    pipeline = [
        {
            '$lookup': {
                'from': 'scan',        # The target collection to join
                'localField': '_id', # Field from the 'scan' collection
                'foreignField': 'user_id', # Field from the 'users' collection
                'as': 'userData'        # Alias for the joined data
            }
        },
        {
            '$unwind': '$userData'     # Deconstruct the userData array field to objects
        },
        {
            '$project': {              # Specifies which fields to include or exclude and renames them
                '_id': 0,              # Exclude the _id field
                'Id': '$userData._id',
                'Gender':'$gender',
                'Age':'$age',
                'Occupation':'$occupation',
                'Region' :'$country_region',# Rename 'userid' from 'scan' to 'scan_userid'
                'Symptoms': '$userData.symptoms',   # Rename 'email' from 'userData' to 'user_email'
                'Result': '$userData.result', # Rename 'otherField' from 'userData' to 'user_otherField'
                # Include any other fields from the 'scan' collection if needed, e.g., 'scanField': 1
            }
        }
    ]

    # Execute the aggregation pipeline
    results = list(users.aggregate(pipeline))
    data={}
    colection=[]
    code = pathodologie.find()
    for element in results:
        for key in element:
            if( key=="Symptoms"  or key=="Result" or key=="Occupation" or key=="Region" or key=="Age"or key=="Gender") :
                data[key]=element[key]
        print(element["Result"])
        colection.append(data)
        data={}
    return jsonify(colection)

@app.route("/score")
def score():
    code = list(pathodologie.find())
    print(code)
    score=[0,0,0,0]
    for element in code:
        if element.get("result")=="Neoplasm":
            score[0]+=1
        elif element.get("result")=="Phonotrauma":
            score[1]+=1
        elif element.get("result")== "Vocal Palsy":
            score[2]+=1
        elif element.get("result")=="none":
                score[3]+=1
    return score
@app.route("/age")
def age():
    code = list(users.find())
    print(code)
    score=[0,0,0]
    for element in code:
       if ( element.get("age") == "under 20" or element.get("age")=="20-29" or element.get("age") =="30-39" ):
           score[0]+=1
       if ( element.get("age")=="40-49" or element.get("age")=="50-59" or element.get("age")=="60-69" or element.get("age") =="70-79"):
            score[1]+=1
       if (element.get("age")=="80-89" or element.get("age")=="90 or older"):
            score[2]+=1
    total = sum(score)
    num1,num2,num3=(score[0]/total)*100,(score[1]/total)*100,(score[2]/total)*100
    print([num1,num2,num3])
    return [int(num1),int(num2),int(num3)]


@app.route('/delete_symptom', methods=['POST'])
def delete_symptom():
    req = request.get_json()

    if not req or "label" not in req or "data" not in req:
        return Response("Invalid request data", status=400, mimetype='text/plain')

    cat = symptoms.find_one({"label": req["label"]})

    if cat:
        new_data = [symptom for symptom in cat["data"] if symptom["name"] != req["data"]]

        if len(new_data) == len(cat["data"]):
            return Response("Symptom not found", status=404, mimetype='text/plain')

        symptoms.update_one(
            {"label": req["label"]},
            {"$set": {"data": new_data}}
        )
        return Response("Symptom deleted", status=200, mimetype='text/plain')
    else:
        return Response("Label not found", status=404, mimetype='text/plain')
        

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
# flask run --host=0.0.0.0