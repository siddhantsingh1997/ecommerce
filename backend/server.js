const app =require("./app");

const dotenv = require("dotenv");

const connectDatabase=require("./config/database");

//config

dotenv.config({path:"backend/config/config.env"});

// Handling Uncaught Exception

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting Down Server due to handling uncaught exception`);
    process.exit(1);

})



// connecting to database

connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});

// unhandled promise rejections

process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting Down Server due to unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
})