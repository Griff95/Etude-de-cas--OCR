from flask import Flask, request, Response
import jsonpickle
import numpy as np
import cv2
from glob2 import glob
import os
import pytesseract
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
import base64
from PIL import Image
import io
import json
from flask import jsonify


pytesseract.pytesseract.tesseract_cmd = r'H:\\Program Files\\Tesseract-OCR\\tesseract.exe'


# Initialize the Flask application
app = Flask(__name__)
cors = CORS(app)
api = Api(app)

img_list=[]

os.chdir(os.path.dirname(os.path.realpath(__file__)))



#cv2.imshow('hi',img_list[0])


# route http posts to this method
@app.route('/post', methods=['POST'])
def post_img():
    r = request
    # convert string of image data to uint8
    #print(r.json['data'])
    try:   
        try:
            imtxt=r.json['data'].split(',')[1]
        except: 
            imtxt=r.json['data']
            print("couldn't split")
        with open('imtxt.txt','w') as f:
            f.write(imtxt)
        #image_64_decode.show()
        im = Image.open(io.BytesIO(base64.b64decode(imtxt)))
        #im.show()

        print(pytesseract.image_to_string(im))
        response={'txt_read':pytesseract.image_to_string(im)}

    except Exception as e:
        print(e)
        #im.save('H:/Cloud/OneDrive/COURS/ETUDE DE CAS/Etude-de-cas--OCR/temp.jpg')

        print("ERROR, no file received")
        
        response={'txt_read':"you're in the except"}

    response_pickled = jsonpickle.encode(response)

    return Response(response=response_pickled, status=200, mimetype="application/json")

# route http posts to this method

@app.route('/test_get', methods=['GET'])
def show():

    response = {'txt_read': "bravo, l'API marche"}
    response_pickled = jsonpickle.encode(response)

    return Response(response=response_pickled, status=200, mimetype="application/json")

class Morning(Resource):
    def get(self):
        
        result= {'txt_read': "yo"}
        return jsonify(result)


api.add_resource(Morning, '/morning')

# start flask app
app.run(port=5000)