# Etude-de-cas--OCR

# set Flask server name as a global variable
export FLASK_APP=server_for_ionic.py

# python dependencies installation
pip3 install Flask jsonpickle opencv-python glob2 pytesseract flask_cors

# run Flask server
flask run
