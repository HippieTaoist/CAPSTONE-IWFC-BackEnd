# I Want Free Crypto - ReBuild - CAPSTONE

## back-end
### Node.js // Express.js // MongoDB
#### Via Node
	-Install Express.js via npx express-generator
		-Success: Express Running
	-Connect to MongoDB through mongoose in express
		-Success: Database verified

## front-end
### Node.js // react
#### via Node
	-Install react via npx react-generator
		------
	-Link to back-end through api calls
		------

## Authentication
### via bcryptjs
	-passwords will be hashed and users will have a timed token attached to them after account creation and login which will help guide the flow of the site.
		-Success: Authentication has been established and successfully bound to user though jwtToken
### via jsonwebtoken(JWT)
	-JWT will be used to initiate, act as, reject and decipher token, with the assistance of jwt-decode.
		-Success:used to decrypt and verify token attached to user
### via validator
	-Input Check
		- All inputs will be checked for validity, errors, empty strings and other appropriate flags.
			-Success: Validator has be established from User model to updating password.
## Create | Read | Update | Delete
### Create
	- Users can create a new user with appropriate parameters met
### Read
	- Users can read from the database with appropriate permissions
### Update
	- Users can update the database with appropriate permissions and limited parameters. Email can be changed, but username cannot.
		-Success: Email and Password have been changed.
			- Based on email||password switch case to be sent from front end under json: {"updateType" :"email"||"password"} <-not code
		-Future: On email change a successful verification from email will be needed.
### Delete
	- Users can delete their account. | Will release username in database.

-Users will have CRUD operations on the crypto and programs they choose to associate with.
-2-3 features
	Favorite Cryptos to account
Favorite Programs to account
Sort Program through multiple params
Sort Crypto through params
-3rd Party API	Plan to use api from CoinMarketCap or crypto.com or KuCoin possibly. The first seems to be the best, but limited to only 11 endpoints. if i want more I may pull from alternate apis. All seem to have good documentation.

Hooks	Hooks will be used through out to make use of advanced react technologies, strategies and concepts.