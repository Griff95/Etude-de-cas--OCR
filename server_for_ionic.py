from flask import Flask, request, Response
import jsonpickle
import numpy as np
import cv2
import glob
import os
import warnings
warnings.filterwarnings("ignore")
import pytesseract
from flask_cors import CORS, cross_origin
import base64
from PIL import Image
import io
import json
import matplotlib.pyplot as plt

import urllib.request as req_url

# home made modules
import scanner
import text_detection
import prediction


# pytesseract.pytesseract.tesseract_cmd = r'H:\\Program Files\\Tesseract-OCR\\tesseract.exe'


# Initialize the Flask application
app = Flask(__name__)
cors = CORS(app)

img_list=[]

os.chdir(os.path.dirname(os.path.realpath(__file__)))



#cv2.imshow('hi',img_list[0])


# route http posts to this method
@app.route('/post', methods=['POST'])
@cross_origin()
def post_img():
    r = request

    # cleaning debug image folder
    for f in glob.glob('./img_debug/*.jpg'):
        os.remove(f)
    # convert string of image data to uint8
    #print(r.json['data'])
    try:
        imtxt=r.json['data'].split(',')[1]
        print('ok')
    except:
        imtxt=r.json['data']
        print("couldn't split")


    # convert to openCV image
    # image_64 = io.BytesIO(base64.b64decode(imtxt))
    # print(type(image_64))
    # test = cv2.imdecode(np.fromstring(image_64.read(), np.uint8), 1)
    document = cv2.imread('./CAP2.jpg', cv2.IMREAD_COLOR)
    save_img_step = True
    # get document scan (binary, transformed)
    scan = scanner.get_scan(document, save_img_step)
    if scan is None:
        return Response(response=jsonpickle.encode({"txt_read":"aucun document détecté"}), status=200, mimetype="application/json")
    # get spatialy sorted list of paragraph images
    text_regions = text_detection.get_text_regions(scan, save_img_step)
    if text_regions == []:
        return Response(response=jsonpickle.encode({"txt_read":"aucune région de texte détectée"}), status=200, mimetype="application/json")
    print("text_regions :" +str(len(text_regions)))

    text_lines = []
    for i in range(len(text_regions)):
        text_lines.append(text_detection.get_lines(text_regions[i], i, save_img_step))


    text_words = []
    for i in range(len(text_lines)):
        lines = []
        for l in range(len(text_lines[i])):
            lines.append(text_detection.get_words(text_lines[i][l], i, l, save_img_step))
        text_words.append(lines)

    # "modelHTR_augmented_79epochs.h5", "CRNN_architecture.json" --> manuscrit, train on hand_words_1
    # "f11.h5", "CRNN_architecture_capitale.json" --> captiale, trained on 300 000 data
    # "model10.h5", "CRNN_architecture_capitale.json" --> captiale, trained on 300 000 data
    # "model5_11.h5", "CRNN_architecture_capitale.json" --> captiale, trained on 300 000 data
    model = prediction.get_model("f11.h5", "CRNN_architecture_capitale.json")
    predictions = []
    for i, tr in enumerate(text_words):
        pred_lines = []
        for l, line in enumerate(tr):
            pred_lines.append(prediction.predict_words(line, model, i, l))
        predictions.append(pred_lines)

    predictions = list(map(lambda paragraph: list(map(lambda line: " ".join(line), paragraph)), predictions))
    predictions = list(map(lambda paragraph: "\n".join(paragraph), predictions))
    predictions = "\n\n".join(predictions)

    print('number of text regions:', len(text_words))
    print('number of text lines:', *list(len(i) for i in text_words))
    print()
    print(predictions)

    # print(pytesseract.image_to_string(test))
    # response={'txt_read':pytesseract.image_to_string(test)}
    return Response(response=jsonpickle.encode({'txt_read':predictions}), status=200, mimetype="application/json")

# route http posts to this method

@app.route('/test_get', methods=['GET'])
@cross_origin()
def show():
    response = {'txt_read': "bravo, l'API marche"}
    response_pickled = jsonpickle.encode(response)

    return Response(response=response_pickled, status=200, mimetype="application/json")

if __name__ == "__main__":
    # start flask app
    app.run(host="0.0.0.0", port=5000, debug=True)
