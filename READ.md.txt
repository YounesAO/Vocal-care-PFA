# Vocal Care

![Application logo ](https://example.com/path/to/your/image.png)

## Overview

This project is devolloped in the cadre of PFA (Projet End of Year) for the subject of deploying an ML model 
For detecting Vocal Pathologies ;also focusing on colletion data to improve the model.
## content

- Mobile App using Expo react-native toolbox.  
- Web site for managing the database ,exporting data ,uploading and keeping the model updated 
- Flask API connect to the mangoDB in the backend.

## Installation

To get started with this project, clone the repository and install the necessary dependencies.
Flask ,Mongodb .
## To run the application: 
1-Run the Flask API located in .AdminPanel/App.py
2- open the Expo project file locaten in ./Vocal-care
3- insure that the config file in vocal-care\assets\config.json has the same IP adresse and Port as the Flask server.
4-locate to /vocal-care and run npm install to install expo's dependencies.
5-Run open an android eumelator and type interminal of /vocale/care npx expo start 
    -to run the application in the emulator types a
    -to run the preview the mobile app in navigator type w
    -to run the application in your phone install expo go and scan the QR code (note they must be in the same network)
6-to acces the admin panel enter the adress of the Flask server in the nagivator : http://127.0.0.1:5000