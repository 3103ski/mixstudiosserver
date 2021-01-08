# Mix Studios API
A backend server built using Express and Node.  

---
# Users
Used to interact with a user's **core profile**. The user's core profile is common among all users. User's  can attach service profiles and then to service profiles add pricing profiles and all will be connected to this core profile. The core profile should be limited to personal information and the users overall style profile.

### Fetch ALL user core profiles
- GET: returns an `Array` of core profile objects.
- POST: expects a valid user object.
- PUT: not supported at this endpoint
- DELETE: not supported at this endpoint

> `/users`

### Fetch a specific user core profile
- GET: returns a user core profile object as an `Object`.
- POST: not supported at this endpoint.
- PUT: will update user profile
- DELETE: will remove user's core profile but then **ALSO remove all their service and pricing profiles**

> `/users/[userId]`

### User Core Profile Object
- `user.userId` [str]
- `user.createdOn` [date]
- `user.lastModified` [date]
- `user.userInfo` [object] 
- `user.styleInfo` [object] 
- `user.serviceProfiles` [object] 
- `user.soundsLike` [array of objects]

## Sounds Like Objects
Sounds like objects are intended to track what artists users suggest they sounds like. This is a popular metric for artists trying to find people to work on their audio project.

### Fetch ALL sounds like objects for ALL users
- GET: returns an `array` of all 'sounds like' objects
- POST: expects a valid **sounds like object**.
- PUT: not supported at this endpoint
- DELETE: not supported at this endpoint

> `/users/sounds-like`

### Fetch ALL sounds like objects for a SPECIFIC user
- GET: expects a valid user id, will return an object
- POST: not supported at this endpoint.
- PUT: expects a valid 'sounds like' object.
- DELETE: will remove that artists' sounds like object

> `/users/sounds-like/[userId]`

---
# Service Profiles

Used to interact with service profiles for users. Each user can have up to one service profile per service.  These profiles **do not** include pricing, but do include a list of pricing profile ids at `serviceProfile.pricing.pricingProfiles` to get more info. To interact with pricing using those ids, refer to the **service rates** section.


## All Service Profiles

### ALL service profiles for ALL users
- GET: returns an `Array` of ALL service profiles from ALL services for ALL users.
- POST: not supported at this endpoint.
- PUT: not supported at this enpoint
- DELETE: not supported at this enpoint

> `/service-profiles`


## A Specific User or Service
To get service profiles for a specific user, you must access the specific service. To get all service profiles for a user in one call you can filter all the service profiles on the client side using the `/service-profiles` endpoint, but the intention is to access each profile as needed and that endpoint is more for information purposes. 

## Mixing
### Fetch all mixing service profiles
> `/service-profiles/mixing-engineers`

### Fetch a specific mixing service profile
> `/service-profiles/mixing-engineers/[userId]`

## Mastering
### Fetch all mastering service profiles
> `/service-profiles/mastering-engineers`

### Fetch a specific mastering service profile
> `/service-profiles/mastering-engineers/[userId]`

## Singer
### Fetch all singer service profiles
> `/service-profiles/singers`

### Fetch a specific singer service profile
> `/service-profiles/singers/[userId]`

## Producer
### Fetch all producer service profiles
> `/service-profiles/producers`

### Fetch a specific producer service profile
> `/service-profiles/producers/[userId]`

## Songwriter
### Fetch all songwriter service profiles
>  `/service-profiles/songwriters`

### Fetch a specific songwriter service profile
>  `/service-profiles/songwriters/[userId]`

## Studio Musicians & Instruments
- Studio musicians have their service profile which holds all their information regarding their service details and active preferences for that service. 
- A studio musician will then have an array at `musicianprofile.serviceDetails.instruments` which will hold profiles for all the instruments the musician offers. These **instrument profiles**  *are not* pricing details, but instrument and skill level details being attached to musicians. 
- **Pricing profiles** are more dynamic and change participation based on which is active and what genres/instruments are being priced inside; so they are separated into pricing profiles endpoint. These larger pricing profiles will *then* have **instrument pricing profiles** within them located at `pricingProfile.pricing.instrumentPricingProfiles`.
- **Instrument pricing profiles** exist so that the user can break down their pricing **per** instrument **per** pricing profile. 

### Reaching all studio musician service profiles
- GET: returns an `Array` of all studio musician service profiles
- POST: will add a NEW studio musician service profile
- DELETE: not supported at this endpoint
- PUT: not supported at this endpoint

>  `/service-profiles/studio-musicians`

### Reaching a specific studio musician's profile
- GET: expects a valid user id of a user who *has a studio musician profile setup*.
- PUT: will update service profile
- POST: not supported at this endpoint
- DELETE: will remove a studio musician's profile and **then also remove all of their instrument profiles**.

>  `/service-profiles/studio-musicians/[userId]`

## Instrument Profiles
Instrument profiles will return a profile of an instrument with details about the user's skill. These are used to list isntruments a studio musician can play. These are not intended for pricing; for pricing, see **instrument pricing profiles**

###  Reaching all instrument profiles
- GET: returns ALL instrumnet profiles for ALL users
- POST: expects a valid *instrumnet profile* and adds it
- DELETE: not supported at this endpoint
- PUT not supported at this endpoint

>  `/instruments`

###  Getting a studio musician's instruments
- GET: expects a valid user id for a user *that has a studio musician profile setup*. 
- DELETE: will remove ALL instrument profiles belonging to a user
- PUT: not supported at this endpoint
- POST: not suppoerted at this endpoint

>  `/instruments/user-instrument-collection/[userId]`

###  Specific instrument profiles
Reach a specific instrument profile with its id; to get the id you must already have loaded a user's studio musician profile where the collection of ids lives.
- GET: expects a valid instrument profile id; returns instrument object
- DELETE: expects valid instrument id; will remove specific instrument
- PUT: will update instrument
- POST: not suppoerted at this endpoint

>  `/instruments/user-instrument/[instrumentId]`

## Instrument Pricing Profiles
***Not to be confused with pricing profiles for a service.**

Instrument pricing profiles are all intended to be matched to a studio musician service pricing profile. The intention for these are to track isntrument rates for artist who have decided to have different rates for different genres **within** a pricing profile for studio musician.

### ALL *instrument* pricing profiles for ALL pricing profiles
- GET: Will returnan `Array` of ALL *instrument pricing profiles* for ALL *studio musician pricing profiles*.
- POST: expects valid *instrument pricing profile* and will add 
- PUT: not supported at this endpoint. **To update a specific profile**, use the endpoint for *instrument pricing profile*
- DELETE: will delete ALL *instrument pricing profiles* for a SPECIFIC *studio musician pricing profile*. **To delete a single profile**, use the endpoint for *instrument pricing profile* 

>  `/instruments/pricing-profiles`

### ALL *instrument* pricing profiles for a SPECIFIC pricing profile
- GET: Will returnan `Array` of ALL *instrument pricing profiles* for a SPECIFIC *studio musician pricing profile*.
- POST: not supported at this endpoint.
- PUT: not supported at this endpoint. **To update a specific profile**, use the endpoint for *instrument pricing profile*
- DELETE: will delete ALL *instrument pricing profiles* for a SPECIFIC *studio musician pricing profile*. **To delete a single profile**, use the endpoint for *instrument pricing profile* 

>  `/instruments/pricing-profiles/[pricingProfileId]`

### Instrument pricing profile 
- GET: Will return SPECIFIC instrument pricing profile for the SPECIFIC instrument. 
- POST: not supported at this endpoints
- PUT: will update a *specific* pricing profile
- DELETE: expects a valid instrument pricing profile id

>  `/instruments/pricing-profiles/instruments/[instrumentPricingProfileId]`
