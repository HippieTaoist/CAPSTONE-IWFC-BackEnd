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
	- Users can add crypto
		-Future: Crypto Symbol added must match with that Symbol used in standard reference to crypto.
### Read
	- Users can read from the database with appropriate permissions
	- Users can read cryptos available.
### Update
	- Users can update the database with appropriate permissions and limited parameters. Email can be changed, but username cannot.
		-Success: Email and Password have been changed.
			- Based on email||password switch case to be sent from front end under json: {"updateType" :"email"||"password"} <-not code
		-Future: On email change a successful verification from email will be needed.
	-User can update favoring and unfavoring crypto with a restriction of not being able to do both and will be removed from both databases.
	-Future: other update aspects will come with adminLevel.
### Delete
	- Users can delete their account. | Will release username in database.
		-Success: User was deleted successfully from MongoDB.
	-Crypto can be deleted through use of Thunder Client/postman, but not implemented on site. Will put in after adminLevel aspect is established
		- user wil be able to delete crypto if:
			- they initiated creation
			- there are no other users favoring the crypto
		- this will hopefully bring down amount of bad creations.
## API
	-3rd Party API	called from CoinMarketCap for coin info and KuCoin for updated price. 
	-Price is updated on every update call

## Still Working On
-Users will have CRUD operations on the programs they choose to associate with.
Favorite Programs to account
Sort Program through multiple params
Sort Crypto through params


Hooks	Hooks will be used through out to make use of advanced react technologies, strategies and concepts.