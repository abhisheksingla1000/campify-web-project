//=========================
//    CAMPGROUND ROUTES
//=========================

var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground");

//Index route
router.get("", function(req, res){
    Campground.find({},function(err, foundcamps){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/campgrounds", {camps: foundcamps});
        }
    })
})

//New Route
router.get("/new", isLoggedIn, function(req,res){
    // res.send("Add new campground");
    res.render("campgrounds/new");
})

//Create Route
router.post("", isLoggedIn, function(req, res){
    // res.send("You hit the post route");
    Campground.create({
        name: req.body.name,
        src: req.body.src,
        author: {
            id: req.user._id,
            username: req.user.username
        },
        description: req.body.description
    }, function(err, camp){
        if(err){
            console.log(err);
        } else{
            console.log("we saved a campground");
            console.log(camp);
        }
    })
    res.redirect("/campgrounds");
})

//SHOW Route
router.get("/:id", function(req, res){
    //Populate method work as 'campground left join comments' as in SQL
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {camp:foundcamp});
        }
    })
})

//EDIT CAMP
router.get("/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/edit", {camp:foundcamp});
        }
    })
})

//UPDATE ROUTE
router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp){
        if(err){
            console.log(err);
        } else{
            console.log(updatedCamp);
        }
    })
    res.redirect("/campgrounds/"+req.params.id);
})

//DELETE Camp Route
router.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    })
})

//Middleware Functions
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;