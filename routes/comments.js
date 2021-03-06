//=========================
//    COMMENT ROUTES
//=========================

var express = require("express");
var router  = express.Router({mergeParams: true});

var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

//New comment route
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {camp: foundcamp});
        }
    })
})

//Create Comment Route
router.post("/", isLoggedIn, function(req, res){
    // res.send("You hit the post route");
    Campground.findById(req.params.id, function(err, foundcamp){
        if(err) {
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err, newcomment){
                if(err){
                    console.log(err);
                } else{
                    //add username and id to comment	
                    newcomment.author.id = req.user._id;	
                    newcomment.author.username = req.user.username;	
                    //save comment	
                    newcomment.save();	
                    foundcamp.comments.push(newcomment);	
                    foundcamp.save();	
                    console.log(newcomment);	
                    // res.redirect('/campgrounds/' + foundcamp._id);	
                }
            })
        }
        res.redirect("/campgrounds/"+foundcamp._id);
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;