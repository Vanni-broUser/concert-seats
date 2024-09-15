# Exam #3: "Concert Seats"
## Student: s333217 ANDREA DIMAURO 

## React Client Application Routes
Route /: Home page, it shows the list of concerts available 
Route /reservation/showId: Page dedicated to the selected concert. Unlogged users can see the available and the reserved seats. Logged users can reserve the seats in two different ways. 
Route /login: Login form, allow users to login. After a successful login, the user is redirected to the seats page.
Route /sign-up: Sign up form. Allow users to login successfully and to reserve seats.

## API Server 
GET /reservation: Uses the query parameter showId, returns all reservations and their related seats for the requested show.
DELETE /reservation/id: Deletes a reservation and all its seats.
POST /reservation: Requires a JSON request with the following keys: showId, seats, userId. Creates a reservation.
GET /theater: Returns all theaters.
GET /shows/showId: Returns all the information about a particular show, including details about the related theater.
GET /theater/theaterId/shows: Returns all the shows for a particular theater.

Auth
POST /login: Authenticate and login the user.
POST /logout: Logout the user. 
POST /register: Register the user in the system to be able to make the reservation.

## API Server2
POST /calculate-discount

## Database Tables 
Table Reservation – discount.
Store the discount, belongs to a show, to a theater and store the seats referred to the reservations. 
Table Show – title, time
Store title and time of the shows. 
Table Theater – name, location, numColumn, numRow
Store the name, the location, the number of column and row of the theaters.
Table User – username, password, loyal
Store username, password of the users and if the user is loyal or not.
Table Seats - seatNumber
Store the seat numeber.

## Main React Components
Home (in App.jsx): Page to select the theater and show of interest.
Reservation (in App.jsx): Page where users can view available seats for a show and make reservations.
SeatGrid (in Reservation.jsx): Grid displaying the seats of a theater for a particular show.
ReservationInfo (in Reservation.jsx): Section where users can view details of a show and their reservation.

## Screenshot

##User Credentials 
{ username: 'john_doe', password: 'password123', loyal },
{ username: 'jane_doe', password: 'password123', loyal },
{ username: 'alice_wonder', password: 'password123', loyal },
{ username: 'bob_builder', password: 'password123', not loyal }

