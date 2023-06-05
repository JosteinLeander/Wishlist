const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/user");
const Wish = require("./models/wish");


const app = express();

const dbURI = "mongodb+srv://josteinla:tLnWXc5tVnV7PCdD@cluster0.idlymfy.mongodb.net/wishlist?retryWrites=true&w=majority";

mongoose.connect(dbURI)
  .then(() => {
    app.listen(3000);
    console.log("Listening 3000")
  })
  .catch((err) => {
    console.log(err);
  });

dotenv.config();
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let currUser = "";

// index
app.get("/", async (req, res) => {
    let info = "";
    const filter = { number: 1 };
    const wishlist = await Wish.find(filter).sort({ dato: -1 }).limit(5);
    console.log(wishlist);
    res.render("index.ejs", {user: "", title: "hjem", wish: wishlist})
})

// Logg inn
app.get("/sign-in", (req, res) => {
    res.render("sign-in.ejs", { title: "Sign in", user: "", feedback: "" });
  });

  app.post("/sign-in", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
        if (user.password == password) {
            currUser = username;
            res.redirect("/home:" + username, { title: "User home", user: username, wish: "" }, 200);
        } else {
            let feedback = "Feil passord";
            res.render("sign-in.ejs", { title: "Sign in", user: "", feedback: feedback });
        }
    } else {
        console.log("Brukeren finnes ikke");
        let feedback = "Brukeren finnes ikke";
        res.render("sign-in.ejs", { title: "Sign in", user: "", feedback: feedback });
    }
  });

  // Lag ny bruker
app.get("/sign-up", (req, res) => {
    res.render("sign-up.ejs", { title: "Sign up", user: "", feedback: "" });
});

app.post("/sign-up", async (req, res) => {
const { username, password } = req.body;
console.log(username, password);
let pwd1 = password[0];
let pwd2 = password[1];
if (pwd1 != pwd2) {
    let feedback = "Passordene stemmer ikke";
    res.render("sign-up.ejs", { title: "Sign up", user: "", feedback: feedback });
} else {
    let password = pwd1;
    try {
        currUser = username;
        const user = await User.create({ username, password });
        res.redirect("/home:" + username, { title: "User home", user: username, wish: "" }, 200);
    }
    catch (err) {
        console.log(err.message);
        let feedback = "Brukeren finnes fra før";
        res.render("sign-up.ejs", { title: "Sign up", user: "", feedback: feedback });
    }
}
});

// Legg til ønske
app.get("/home:user", async (req, res) => {
    if (currUser == "") {
        res.render("sign-in.ejs", { title: "Sign in", user: "", feedback: "" });
    } else {
        let user = req.params.user;
        user = user.substring(1);
        console.log(user);
        const filter = { user: user };
        const wishlist = await Wish.find(filter).sort({ number: 1 });
        res.render("userhome.ejs", { title: "User home", user: user, wish: wishlist });
    }
});

app.post("/add", async (req, res) => {
    const { username, wishitem, number } = req.body;
    console.log(username, wishitem, number );
    const user = username;
    try {
        const dato = new Date();
        const wish = await Wish.create({ user, wishitem, number, dato });
        const filter = { user: user };
        const wishlist = await Wish.find(filter).sort({ number: 1 });
        console.log(wishlist);
        res.render("userhome.ejs", { title: "User home", user: username, wish: wishlist });
    }
    catch (err) {
        console.log(err.message);
        const filter = { user: user };
        const wishlist = await Wish.find(filter).sort({ number: 1 });
        res.render("userhome.ejs", { title: "User home", user: username, wish: wishlist });
    }
});

// Andre lister
app.get("/:user", async (req, res) => {
    let user = req.params.user;
    user = user.substring(1);
    console.log("HER", user);
    const filter = { user: user };
    const wishlist = await Wish.find(filter).sort({ number: 1 });
    res.render("otherlist.ejs", { title: "Other list", user: user, wish: wishlist });
});

app.get("/LoggUt", async (req, res) => {
    currUser = "";
    let info = "";
    const filter = { number: 1 };
    const wishlist = await Wish.find(filter).sort({ dato: -1 }).limit(5);
    console.log(wishlist);
    res.render("index.ejs", {user: "", title: "hjem", wish: wishlist})
});