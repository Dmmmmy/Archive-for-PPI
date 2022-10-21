from urllib import response
from builtins import print
import flask
from flask import render_template, request, jsonify
from flask_cors import CORS
import json
from urllib.parse import unquote, urlparse
import requests
from newspaper import Article
from bs4 import BeautifulSoup
import pymysql

#NLP model packages
import pandas as pd
import numpy as np
import ktrain
import tensorflow as tf
from ktrain import text
from sklearn.model_selection import train_test_split
import torch
import re
import nltk
nltk.download('punkt')
from nltk import sent_tokenize
from google.colab import files



#FLASK CONFIG
app = flask.Flask(__name__)
#app.config["DEBUG"] = True
cors = CORS(app)
UPLOAD_FOLDER = './html'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # 设置文件存储的目标文件夹


#GET the privacy policy URL from frontend
url = ''
@app.route('/', methods=['GET','POST'])#
def geturl():   
    #dict_ana = request.get_json(silent=True)
    #dict_ana = json.loads(dict_ana)
    #print(dict_ana)
    #print(type(dict_ana))
    #url = dict_ana['analyze']
    url = unquote(request.json.get('analyze', ""))
    #request_data = request.get_data(as_text=True)
    #request_data = ''.join(request_data.split())  
    #request_body = json.loads(request_data)
    #url = request_body['analyze']
    #print(url)
    #return json.dumps(result)#json.dumps
    '''
    if request.method == "POST":
        #print(request.headers)
        #print(request.json)
        #print(request.get_json)
        dict_ana = request.get_json(silent=True)#json.get('')
        url = dict_ana['analyze']
        #print(request.form)
        #url = request.form.get('analyze',"")    
        url = unquote(url)   
        print(url)
        return "this is a post method"
    else:
        #print(request.headers)
        #print(request.json)
        #print(request.get_json)
        #print(request.args)
        #url = request.args.get('analyze',"") 
        #dict_ana = request.get_json(silent=True)
        #url = dict_ana['analyze']      
        #print(url)
        return "this is a get method"
    #print(url)
    #process the url
    #print(unquote(url))
    #url = unquote(url)
    '''
    input_text = downloadhtml(url)
    #print(pp_text)
    # LOAD MODELS 
    all_icons = model_load(input_text)
    predictor_type = ktrain.load_predictor('transformer_trained_models/transformer_trained_models/type_of')
    predictor_source = ktrain.load_predictor('transformer_trained_models/transformer_trained_models/source')
    predictor_third_party = ktrain.load_predictor('transformer_trained_models/transformer_trained_models/third_party')
    predictor_purpose = ktrain.load_predictor('transformer_trained_models/transformer_trained_models/purpose')
    list_type = get_classes(input_text, predictor_type)
    list_source = get_classes(input_text, predictor_source)
    list_third_party = get_classes(input_text, predictor_third_party)
    list_purpose = get_classes(input_text, predictor_purpose)

    if "Data Transfer" in list_third_party and "No Data Transfer" in list_third_party: 
        list_third_party.remove("No Data Transfer")
  
    all_icons = list_type + list_source + list_third_party + list_purpose 
    print(all_icons)

    # SAVE ICONS INTO A CSV FILE 
    domain = urlparse(url)
    domain_url = domain.netloc
    info_dict = {'domain': domain_url, 'privacy_policy_url':url, 'annotations': all_icons}
    with open('annotations.json', 'r') as f:
        content = json.load(f)
    content['websites'].append(info_dict)
    with open('annotations.json', 'w') as json_file:
        json.dump(content, json_file,  indent=4)

    # SAVE INTO MYSQL DB
    # create a empty string di
    di = ""

    # Convert the data values in the dictionary to a comma-separated string for the insertion of the entire row below
    for i in info_dict.keys():
        di = (di + '"%s"' + ",") % (info_dict[i])

    db = pymysql.connect(host="localhost", user="ppiuser", password="Eiqu4eos", db="ppi_db")
    # create a cursor object
    cur = db.cursor()
    sql1 = "INSERT INTO testppi VALUES (%s)" % (di[:-1])
    cur.execute(sql1)
    cur.connection.commit()  
    db.close()

    return "success"
    
def probabilities(input_sentence, predictor): # calculate probabilites 
    probs = {} 
    probability = predictor.predict(input_sentence, return_proba=True)
    for prob, classes in zip(probability, predictor.get_classes()):
        probs[classes] = round((prob*100),2)

    return probs 

def get_classes(input_text, predictor): # only take classes where the model is 92% confident about its decision 
  sentences = sent_tokenize(input_text)

  occuring_classes = []
  for sentence in sentences: 
    probs = probabilities(sentence, predictor)

    max_prob = max(probs, key=probs.get)
    max_value = probs[max_prob] 

    if max_value >= 92: 
      occuring_classes.append(max_prob)
      #print('Max Class: ', '\t', max_prob,'\t', max_value, '\t', sentence)

  #print(occuring_classes)
  return list(set(occuring_classes))
   
#download the html
def downloadhtml(url):
    if(url):
        r = requests.get(url)
        soup = BeautifulSoup(r.text, 'html.parser')
        text = soup.find_all(text=True)
        output = ''
        blacklist = [
            '[document]',
            'noscript',
            'header',
            'html',
            'meta',
            'head', 
            'input',
            'script',
            'style'# there may be more elements you don't want, such as "style", etc.
        ]
        for t in text:
            if t.parent.name not in blacklist:
                output += '{} '.format(t)
        
        with open('rcontent.html','w') as f:#here for Windows users the file should be in a absolute path
            f.write(output)
            f.close
    return output

#insert the NLP model


#APP RUNSERVER
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=8000)#
