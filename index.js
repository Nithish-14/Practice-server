const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3")
const {open} = require("sqlite")
const path = require("path")

const app = express();

//Creating a path of the database file
const dbPath = path.join(__dirname, "fakeuser.db");

//Using middleware functions
app.use(express.json());
app.use(cors());

let db = null;

//Initializing Database and Server
const initializeDbAndServer = async () => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(8080, () => {
            console.log("Server Running");
        });
    } catch(error) {
        console.log(`DB error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer()

app.get("/", (request, response) => {
    response.send("I'm Alive!!!")
});

app.get("/users", async (request, response) => {
    const query = `
        SELECT *
        FROM user;
    `

    const userArray = await db.all(query);

    response.send({users: userArray})
});

app.post("/register", async (request, response) => {
    const userDetails = request.body;
    console.log(userDetails)

    const {name, password} = userDetails;

    const registerquery = `
        INSERT INTO user(name, password)
        VALUES('${name}', '${password}');
    `

    await db.run(registerquery)

    console.log("User Created Successfully")
    response.send({message: "User Created Successfully"})
})
