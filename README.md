Backyard Games
--------------

Welcome to Backyard Games!

Backyard Games is a backend API that allows users to browse, discover, and create games that can preferably be played in your backyard. Information about the games include the name, number of players, instructions, and a link if the game can be purchased online.

The motivation for this project is to create a clear and concise web location for ideas on games to play. I have not found a single location online with a large catalog of games. It will allow for a frontend to be developed in the future to possibly host a website. 

This project is currently hosted on as a Serverless application on AWS. You can interact directly with the website by importing the Postman collection. To run, authorization must be provided. Further instruction is available below.

### Interacting with the API

The recommended method for interacting with the API is by importing the Postman collection, but you may also use any HTTP request application.

Download Postman at (https://www.postman.com/downloads/)

Once installed, click Collections on the left tab and click Import. Import the file backyard-games-api.postman_collection.json.

Click the top-level collection Backyard Games Serverless. Click Variables on the ribbon. You will need to update the authToken value. Please see next section on how to obtain value.

### Obtaining credentials

In order to obtain a token, open a Private Session on your internet browser and go to:

https://joneill.us.auth0.com/authorize?audience=backyardgamesserverless&response_type=token&client_id=hh0s1rNEsSBEOOPuePTcfxd5z9AcP66K&redirect_uri=http://localhost:3000/callback

This will forward you to the Auth0 login screen.

You may log in with a Google account, or use the following credentials:

Username: admin@backyardgames.com
Password: admin1!#

The webiste will then forward you to a localhost page. You can get the token from the URL in the browser after the hash mark as the 'access_token' parameter value. Copy and paste the entire text up to '&expires_in=7200&token_type=Bearer'

Endpoints
GET '/games'
GET '/games/mygames'
POST '/games'
PATCH '/games/${id}'
DELETE '/games/${id}'
GET '/games-detailed'
GET '/games/${id}/attachment'
PUT {Google presigned URL}


GET '/games'
- Fetches a list of detailed, formatted game information. Each game is formatted as it's own dictionary.
- Request Arguments: None
- Returns: An object with a single key, items, that contains a list of game objects, and a success value:
{
    "items": [
        {
            "instructions": "Two teams of two people. One stands at each board. Players on one board take turns taking shots. Three shots each. One point for on the board. Three for in the hole. Each round is the absolute value of the difference between the two players.",
            "createdByUserId": "auth0|60e716ff04f49a006fe4c967",
            "players": "4",
            "link": "https://www.amazon.com/dp/B007B8ED3Y",
            "name": "Corn Hole",
            "gameId": "35dd600f-43c2-4649-903c-615e1586a26f"
        }
        ...
    ]
    'success': true
}

GET '/games/mygames'
- Fetches a list of detailed, formatted game information of games created by the user. Each game is formatted as it's own dictionary.
- Request Arguments: None
- Returns: An object with a single key, items, that contains a list of game objects, and a success value:
{
    "items": [
        {
            "instructions": "Two teams of two people. One stands at each board. Players on one board take turns taking shots. Three shots each. One point for on the board. Three for in the hole. Each round is the absolute value of the difference between the two players.",
            "createdByUserId": "auth0|60e716ff04f49a006fe4c967",
            "players": "4",
            "link": "https://www.amazon.com/dp/B007B8ED3Y",
            "name": "Corn Hole",
            "gameId": "35dd600f-43c2-4649-903c-615e1586a26f"
        }
        ...
    ]
    'success': true
}


POST '/games'
- Sends a post request in order to create a new game
- Body must include a name, but all other information is optional. If included, the following variables must have the associated data types:

"name": String (required),
"instructions": String,
"players": String,
"link": Strings

- Request Body: 
{
    "name": "Flip Cup",
    "instructions": "Drink your beer then flip the cup over.",
    "players": "4 to 1000",
    "link": ""
}
- Returns: An object with formatted information about the game
{
    "item": {
        "gameId": "8e0b53d7-db01-40fe-b1ab-824bd16639e9",
        "createdByUserId": "google-oauth2|102133592197783227791",
        "name": "Giant Jenga",
        "instructions": "It's jenga but very big",
        "players": "6",
        "link": "www.giantjenga.com",
        "createdAt": "2021-09-03T13:20:34.950Z",
        "attachmentUrl": "https://serverless-joneill-backyard-games-dev.s3.amazonaws.com/8e0b53d7-db01-40fe-b1ab-824bd16639e9"
    }
}

PATCH '/games/${id}'
- Sends a patch request in order to update. You can obtain a game's ID with GET /games
- Body should only include the values to be updated. If you would like to make the value blank, include the value as a blank string (""):

- Request Body: 
{
    "instructions": "It's jenga but big",
    "players": "6",
    "link": "www.giantjenga.com",
    "name": "Giant Jenga"
}
- Returns: An object with a success value and formatted information about the game
{
    'item': "item": {
        "name": "Giant Jenga",
        "instructions": "It's jenga but big",
        "players": "6",
        "link": "www.giantjenga.com"
    }
}


DELETE '/games/${id}'
- Sends a delete request in order to delete a game
- No body required
- Request Arguments: id (can be obtained from GET /games. For example: 7a0a435a-6a36-42ec-99f8-f2c9318f0325)
- Returns: Deleted game id
7a0a435a-6a36-42ec-99f8-f2c9318f0325

POST '/games/${id}/attachment'
- Requests a presigned URL from Amazon for uploading a file to an S3 bucket.
- No body required
- Request Arguments: id (can be obtained from GET /games. For example: 7a0a435a-6a36-42ec-99f8-f2c9318f0325)
- Returns: AWS Presigned URL
{
    "uploadUrl": "https://serverless-joneill-backyard-games-dev.s3.us-east-2.amazonaws.com/35dd600f-43c2-4649-903c-615e1586a26f?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAUN3ZJXJ6EIGL7WUM%2F20210903%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210903T132300Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJGMEQCID%2FvSvmKuj3mx%2BFvSiPDEZc5zqtJJSzHoD5E8Sx2d46xAiAoUSVJTV%2Fovvt40wzN9z%2BORwBl%2Bu6Jy2tPt9%2BOtBDyUyqpAggvEAAaDDMwNDY2MDIwMDA2MCIMWS54k9GoyG7R89%2B3KoYC8DOMU88zZhF61MpUsw6eWJWGe3H2LowCPvr5V2eFrcmo5xq34cA9VLl%2FBAECj9PlPP23R%2BMOLFk%2BYY%2BwqHy8PQd95YjLxUys3GnC7nvBSXfgsxzyhkdlXuVM4icySGhzPVHmQk2Co4%2FjR16%2FNS8kntIs6%2BRNNt7LSuVoNKX6bHJK61K%2BOPA2y3XWeYHLme5PEMdtZkPwKTOhJgckrj%2FdBHZPX%2BUZZ2KsyNVsvNV89%2BN%2F2AE7YUIYScJY2%2FYEdcOPZ8oKNUtv8bqav%2Bj5QvUUifqeAJXacAk1hEaw7FkteqwCQ3eYVx7VcgOYHjp4P%2Ftkw6K5iSbX76MHnfwcQD5DX2I2wBP5ZTCzw8iJBjqbAX%2FCuNZvlhXlqW06sYdOCR7%2FY2EoQ5jMFvM%2FRFKrAMsBR0cH4j1RVKSiX5m9I7Kcaj9qe5Rxpv2zhjxXGPv4q32h8YobCM44L3kBSY5cmqWY6HlcUXF5oKBrlQPl%2B%2FZCiLelP4lrWOP2YtT%2FDtHa4vUxykjqk1GNblS%2B%2FbwwJvItHRy0ZWW6CIJlxNT3YiaFnwD2RKQwnvb%2BF4RN&X-Amz-Signature=ee5a4a536be71e1d8a963533c0a958383f4a9885cbc68e94f8aea01626013fdf&X-Amz-SignedHeaders=host"
}

PUT '{uploadURL}'
- Allows one to upload a file associated with a single game instance.
- No body required
- Request Arguments: Input the URL obtained from POST '/games/${id}/attachment'. In Postman, click Body and upload a file. Make sure no authorization outside of the URL in enabled.
- Returns: None
