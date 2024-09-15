# Exam #3: "Concert Seats"
## Student: s333217 ANDREA DIMAURO 

## React Client Application Routes
Route /: Home page, it shows the list of concerts available 
Route /reservation/showId: Page dedicated to the selected concert. Unlogged users can see the available and the reserved seats. Logged users can reserve the seats in two different ways. 
Route /login: Login form, allow users to login. After a successful login, the user is redirected to the seats page.
Route /sign-up: Sign up form. Allow users to login successfully and to reserve seats.

## API Server 
GET /reservation
DELETE /reservation/id
POST /reservation
GET /theater
GET /shows/showId
GET /theater/theaterId/shows

Auth
POST /login: Authenticate and login the user.
POST /logout: Logout the user. 
POST /register: Register the user in the system to be able to make the reservation.

## API Server2
POST /calculate-discount

## Database Tables 
Table Reservation – discount, belongsToShow, belongsToTheater, hasManySeat
Table Show – title, time
Table Theater – name, location
Table User – username, password, loyal
Table Seats - seatNumber

## Main React Components
Home (in App.jsx)
Reservation (in App.jsx)
Seatgrid (Reservation.jsx)
ReservationInfo (Reservation.jsx)

## Screenshot

##User Credentials 
{ username: 'john_doe', password: 'password123' },
{ username: 'jane_doe', password: 'password123' },
{ username: 'alice_wonder', password: 'password123' },
{ username: 'bob_builder', password: 'password123' }

