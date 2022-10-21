from builtins import print
import flask
from flask import render_template, request, jsonify
from flask_cors import CORS
import json
from urllib.parse import unquote
import requests
#from newspaper import Article
from bs4 import BeautifulSoup
import os,sys


#FLASK CONFIG
app = flask.Flask(__name__)
#app.config["DEBUG"] = True
CORS(app)
UPLOAD_FOLDER = './html'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  


#GET the privacy policy URL from frontend
url = ''
@app.route('/', methods=['GET','POST'])#
def geturl():   
    #url = unquote(request.json.get('analyze', ""))
    if request.method == "POST":
        #print(request.headers)
        #print(request.json)
        #print(request.get_json)
        #dict_ana = request.get_json(silent=True)#json.get('')
        #url = dict_ana['analyze']
        #print(request.form)
        #url = request.form.get('analyze',"")   
        #url = unquote(request.json.get('analyze')) 
        url = request.json.get('analyze')
        #url = unquote(url)   
        print(url)

        #input_text = downloadhtml(url)
        #print(input_text)
        '''
        with open('rcontent.html','w') as f:#here for Windows users the file should be in a absolute path
            f.write(input_text)
            f.close
        '''
        return "success"

    else:
        #print(request.headers)
        #print(request.json)
        #print(request.get_json)
        #print(request.args)
        #url = request.args.get('analyze',"") 
        #dict_ana = request.get_json(silent=True)
        #url = dict_ana['analyze']      
        url = unquote(request.json.get('analyze', ""))
        input_text = downloadhtml(url)
        #with open('rcontent.html','w') as  f:
         #   f.write(input_text)
          #  f.close
        print(url)
        return "this is a get method"





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
        
    return output

#insert the NLP model


#APP RUNSERVER
if __name__ == "__main__":
    app.run(host='127.0.0.1', debug=True, port=8000)#

