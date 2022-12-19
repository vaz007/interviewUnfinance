# Interview Test

Following project contains Authentication and bulk upload of CSV using Node, Express and Mongo
 
# Pre-requisites: 
1. Install Nodejs 12 or above. 
2. Postman to check and verify the API's. 
3. Please Import ```Test.postman_collection.json``` file in postman. This will help you walk through the API's.


# Steps to Run 
1. Run ```npm i``` command in test folder, to install all the dependencies. 
2. After installation run ```npm start``` to run the server. 
3. Open Postman and test the API's. 

# Note
1. I have pushed .env file as well so no need to worry about it just start the server. 

# Improvements

1. I could have written a better documentation, but due to time constraint I was unable to do so. 
2. For service worker I am just converting the csv to json, which can be further improved by migrating DB queries and upload part directly to a worker thread. 
3. One can create a proper logging system using something like winston if the code is running on EC2 or on any server. 
4. Can create a Docker file for the given project which will help us deploy in ECS. 
