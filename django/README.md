This repository consists of AUtolife Source Code.

To run the project please refer to the Installation document in confluence.

Language Used in this project:
	Python 3.5
	Javascript
	Java 8


Framework used:

	Django (Backend)
	Django Rest Framework
	React-redux architecture




Made with Love <3  by Team Autolife.

//////////////////////////////////

To deploy the frontend React app to AWS S3. You must have AWS cli installed and an AWS admin user configured with AWS cli. Create a profile for aws cli called 'autolife' (https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html).

Then cd into autolife_frontend and in the terminal type: npm run s3. This will build a production version of the React application into a 'dist' directory. The S3 bucket will be cleared and then files will be uploaded to the s3 bucket. 

NOTE: The site will be unavailable when the s3 bucket is cleared and files are being synced.

-RT

///////////////////////////////////

