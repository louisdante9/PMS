# Population Management System

This is a system that contains a list of locations and the total 
number of residents broken down by gender.


## Setup
Install [mongodb]() and start its server using:

```angular2html
sudo mongod
```

create a database and add its url to the `.env`.

## Running the app

Ensure that you have [nodemon](https://nodemon.io/) installed. `cd` into the PMS folder and then install 
the app dependencies by running:

```angular2html
npm install
``` 

To start the application run:

```angular2html
npm start
```

## Adding a location

Send a `POST` request with the `application/json` payload as shown in the example below to 
```angular2html
/api/v1/location
```

```angular2html
{
	"name": "Nigeria",
	"female": 50,
	"male": 40,
	"total": 90
}
```

Response will be a `201` with a payload as shown in the 
example below.

```angular2html
{
    "status": "success",
    "data": {
        "name": "Nigeria",
        "female": 60,
        "male": 40,
        "total": 100,
        "subLocations": []
    }
}
```

## Add a sub location to a location

Send a `POST` request with the location details to the url below replacing `:location_id`
with the location id.

```angular2html
/api/v1/location/:location_id/sub
```

## Get a location with its sub locations
Send a `GET` request to the endpoint below

```angular2html
/api/v1/location/:location_id
```
and a response will be returned as shown below

```angular2html
{
    "id": "5baa1fe39980437cf3766821",
    "name": "lagos",
    "female": 150,
    "male": 50,
    "total": 200,
    "subLocations": [
        {
            "id": "5bab932d1a2202a61e934970",
            "name": "IKJ",
            "female": 70,
            "male": 20,
            "total": 90,
            "subLocations": []
        },
        {
            "id": "5bab93b8f71da3a66869ded5",
            "name": "FST",
            "female": 70,
            "male": 60,
            "total": 130,
            "subLocations": []
        },
    ]
}    
```

## Get all locations with sub locations

Send a `GET` request to the endpoint below

```angular2html
/api/v1/locations
```

### Update a location
Send a `PUT` request with a location data payload to teh endpoint below

```angular2html
/api/v1/locations/:id
```


