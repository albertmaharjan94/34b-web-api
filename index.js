require("dotenv").config() 

const express = require("express")
// 2 new import
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoute")
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin")

const adminProductRoutes = require("./routes/admin/productRouteAdmin")
const path = require("path") // 
const cors = require("cors")
const app = express()

let corsOptions = {
    origin: "*" // or list of domain to whitelist
}
app.use(cors(corsOptions))

app.use(express.json()) // accept json in request
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// path.join concats 2 path string,
// __dirname -> current directory path

// 2 new implementation
connectDB()
app.use("/api/auth", userRoutes)
app.use("/api/admin/users", adminUserRoutes)
app.use("/api/admin/category", adminCategoryRoutes)

app.use("/api/admin/product", adminProductRoutes)

// task
// from student model make admin crud operation
// create, get, getone, udpateone, deleteone
// make a controllers -> admin -> studentcontroller
// make a route routers -> admin -> studentRouteAdmin
// implement the route in index.js and try all route in postman 


app.get("/", 
    (req, res) => {
        // logic
        return res.status(200).send("Hell!!o world 2000")
    }
)

app.get("/post/:id", 
    (req, res) => {
        console.log(req.params.id) // :id
        // get query params
        console.log(req.query)
        return res.status(200).send("Success")
    }
)
const users = [
    {id: 1, name: "saroj", email: "saroj@gmail.com"},
    {id: 2, name: "sushant", email: "sushant@gmail.com"},
    {id: 3, name: "bhumi", email: "bhumi@gmail.com"},
]
// make a get request called /users
// that takes dynamic id as params
// if id is not present in users send bad response with "Failure"
// check url query and search for name
// if name is present and name matches the user with the id
// send success response with "Success"
// else send 500 response with "Server error"
app.get("/users/:id",
    (req, res) => {
        let id = req.params.id
        let found
        for(user of users){
            if(user.id == id){
                found = user
                break
            }
        }
        if(!found){
            return res.status(400).send("Failure")
        }
        if(req.query.name && req.query.name == found.name){
            return res.status(200).send("Success")
        }else{
            return res.status(500).send("Server Error")
        }
    }
)

app.get("/users/:id/:name", 
    (req, res) => {
        // find the users with id and name
        // if found send 200 sucess
        // else 400 failures
        let id = req.params.id
        let name = req.params.name
        let found
        for(user of users){
            if(user.id == id && user.name == name){
                found = user
                break
            }
        }
        if(found){
            return res.status(200).send("Success")
        }else{
            return res.status(400).send("Failure")
        }
    }
)

// API 
// HTTP Response CODE
// 200 - 20x -> Success response
// 300 - 30x -> Redirect response
// 400 - 40x -> Bad response 
// (404) -> not found 
// (401) -> forbidden
// (403) -> unauthorized
// 500 - 50x -> Server Error

// multiple request, GET, POST, PUT, PATCH, DELETE ...
// route blogs
// get blogs
// create blogs
// edit blogs
// delete blogs
let blogs = [
    {id: 1, name: "Nikesh", title: "Trip to pokhara", desc: "Lorem ipsum"},
    {id: 2, name: "Subham", title: "My life of softwarica", desc: "Lorem ipsum"},
    {id: 3, name: "Kushal", title: "Trip to kakani", desc: "Lorem ipsum"}
]
// local db/blogs
app.get("/blogs/",
    (req, res) => {
        // db to query blogs
        return res.status(200).json(
            {
                "success": true,
                "blogs": blogs
            }
        )
    }
)
// single blog
app.get("/blogs/:blogId",
    (req, res) => {
        let blogId = req.params.blogId
        // search
        let search
        for(blog of blogs){
            if(blogId == blog.id){
                search = blog
                break
            }
        }
        if(search){
            return res.status(200).json(
                {
                    "success" : true,
                    "blog": search
                }
            )
        }else{
            return res.status(404).json(
                {
                    "success": false,
                    "message": "Blog not found"
                }
            )
        }
    }
)
// data add/add to blogs
app.post("/blogs/",
    (req, res) => {
        console.log("Body", req.body) // all request
        // {id: 1, name: "asd", title: "!23", desc: "123123"}
        // const id = req.body.id
        const { id, name, title, desc } = req.body 
        // validataion
        if(!id || !name || !title || !desc){
            return res.status(404).json(
                {
                    "succes": false,
                    "message": "Not enough data"
                }
            )
        }
        blogs.push(
            {
                id: id, // same key and variable
                name:name, // name: name
                title:title, // title: title
                desc: desc
            }
        )
        return res.status(200).json(
            {
                "success": true,
                "message": "Blog added"
            }
        )
    }
)
// update put/patch -> data update
app.put("/blogs/:blogid",
    (req, res) => {
        let blogId = req.params.blogid
        let foundIdx
        for(blogIdx in blogs){
            if(blogs[blogIdx].id == blogId){
                foundIdx = blogIdx
                break
            }
        }
        const {name, title, desc} = req.body
        blogs[foundIdx].name = name
        blogs[foundIdx].title = title
        blogs[foundIdx].desc = desc
        return res.status(200).json(
            {
                "success": true,
                "message": "Blog updated"
            }
        )
    }
)
// Delete
app.delete("/blogs/:blogId",
    (req, res) => {
        let blogId = req.params.blogId
        blogs = blogs.filter((blog) => blog.id != blogId)
        return res.status(200).json(
            {
                "success": true,
                "message": "Blog deleted"
            }
        )
    }
)

module.exports = app