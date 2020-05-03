# carclone-booking-app

Simpliflied car inspection booking app

## Please install SQLite in order to use this app.

You can use the resource below to assist you in installing SQLite.

https://www.tutorialspoint.com/sqlite/sqlite_installation.htm

## Before running the app please do the following:

1. Run `yarn install` to install all the required node modules for the app to work.

2. Run `yarn start` to run the API server on port 4000.

## API Guide

### GET /locations

Returns a JSON object that is an array of available locations.

### GET /cars

Returns a JSON object that contains a list of car brands and their associated models.

### GET /available-slots/:location

Returns a JSON object that contains a list of available booking slots based on a location parameter. Each available slot will have an `available` flag that will allow the front-end to disable a time slot if all of it's slots for that time has been booked.

### POST /user

Accepts a JSON object in the body of the request that contains the data to create a User entitiy and creates said entity in the c_users table.

### POST /timeslot

Accepts a JSON object in the body of the request that contains the data to create a Booking entitiy and creates said entity in the c_bookings table.
