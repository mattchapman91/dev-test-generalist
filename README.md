# Backend Stack Dev Task

![on my mf bike](favicon.png)

Here's a back-end oriented assessment that we'd like you to complete in approx one week.

We estimate that this task will take about **6-10 hours** of contiguous development.  Feel free to develop in a non-contiguous manner.
If you start to go way over time then just submit what you have and create a list in your project's **README.md** of anything else that would have liked to add/do given the time.

### Assignment Details
To complete this task, you must:

1. Fork this project
2. Make some reasonable assumptions (and document)
3. write your code to fulfill the user story below (as much as you see fit)
4. Document profusely
5. *OPTIONAL* If you have time, attempt to get some bonus points (see below for assessment criteria)

#### Notes and assumptions

1. **continuously** commit your code
2. When finished send over the GitHub repo and any other links
3. You will need to install docker on your machine to get your database working, it is suggested that you use the latest beta version of docker with it's native hosting features for OSX and Windows users.
4. Provide CURL based examples on how to interact with your API (GET and POST)
5. The database layer is provided to you via Mongo in a Docker container, the instructions below will start the `Mongo 3.3` database on your machine and populate it with sample bike data for your api
6. API API must output JSON in its responses
7. You must include installation and setup instructions in your **README.md**
8. Please list any other assumptions you may have made
9. Use any modern language you see fit to get the job done, obviously it will have to work with Mongo 3.3
10. Feel free to a micro-framework such as Flask (Python), Express (Node), Sinatra (Ruby), Slim (PHP), Goji (Go)

#### The User story

- As a front-end dev user, or as a command line dev user
- Assuming that all authentication and security has been handled by another layer in the application and is sorted
- Assuming I'm connected to the Mongo database supplied (see DB section below)
- I would like API endpoints that model the bike schema (see [Sample Bike Schema](schema/bike.json))
  - I would like to be able to see all bikes (`GET` the entire collection)
  - I would like to see an individual bike (`GET` an item) given its `bikeId`
  - I would like to add a new bike (`POST` to collection)
  - I would like the interface to the API to be RESTful
  - I would like to interact with the API using tools like [curl](https://curl.haxx.se/) or [postman](https://www.getpostman.com/)
  - I am not concerned DELETE and PUT endpoints and do not need them

### Assessment Criteria

Your application will be assessed on the following criteria (in order of importance):

- Approach and thinking
- Code organisation, commenting and use of GitHub
- Quality of setup instructions in your **README.md**
- Quality of api documentation in your **README.md**
- Maintainability
- **bonus points** If you unit test your models and include test instructions
- **bonus points** If you can host the api code in a public docker container and link it to the Mongo Docker container with instructions

We're trying to see your thought processes with this task. What's more important to us is how you approach the task, rather than the actual final output itself.

Looking forward to seeing your project :-)

## DB and Schema

### Sample Bike schema
To give you an idea of the documents (records) of what's in the Mongo `bike` collection in the `test` db.  This is a sample schema for bikes, you can add/modify fields as you see fit:

```
{
  "id": 1,
  "name": "Litening C:68 super trike",
  "description": "The trike for professional 4 year old cyclists.  Full carbon frame, complete with novelty horn",
  "price": "5006.33"
}
```

### Database instructions

Follow these instructions to get the test database working on your machine:

1. Ensure you have the latest version of Docker installed on your machine (Native Docker for Windows, and Docker for Mac that no longer use docker-machine) [https://docs.docker.com/engine/installation/](https://docs.docker.com/engine/installation/).
2. Ensure the docker service is running on your machine and you can connect to it using the `docker info` command
3. Get Mongo running as a service on your machine by typing the following commands into a console window.
```bash
#A. remove the old instance of the db if it exists, don't worry if this errors 
docker rm --force jlmongo

#B. start the Mongo container as a service
docker run -d --name jlmongo -p 27017:27017 jujhars13/dev-test-generalist-mongo:latest

#C. Once the container is up and running. Import the bike schema by running this command in
docker exec jlmongo mongoimport --collection bike /schema/bike.json --jsonArray

```

#### DB Notes

- You can test if your db works by running `docker exec jlmongo mongo --eval "db.getCollection('bike').find({})"` 
- If you shutdown your machine or do something bad to your database, simply trash your db and follow the instructions again in part 3
- There is no username and password for your local db
- The default database is `test`, the default collection is `bike` with the data in it
- The local Mongo instance sits on the default **TCP:27017** port you may have to tweak this if you're already running a local Mongo instance of your own
- We suggest you use a Mongo GUI tool like [Robomongo](https://robomongo.org/) to make your life easier
