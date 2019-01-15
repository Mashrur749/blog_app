var express           = require('express'),
    app               = express(),
    mongoose          = require('mongoose'),
    bodyParser        = require('body-parser'),
    methodOverride    = require('method-override'),
    exrpressSanitizer = require('express-sanitizer');

var DataBase = "mongodb://localhost:27017/blogsite" || "mongodb:://MusaddiqurRahman:asdASD123@ds157544.mlab.com:57544/blogsite";
mongoose.connect(DataBase);
//app config
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(exrpressSanitizer());

//mongoose model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
        type: Date,
        default: Date.now
      }
});

var Blog = mongoose.model('Blog',blogSchema);

app.get('/',function(req,res){
  res.redirect('/blogs');
})


//RESTFUL ROUTES

//index
app.get('/blogs',function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log('Error!');
    }else {
      res.render('index',{blogs: blogs});
    }
  })
})


//new
app.get('/blogs/new',function(req,res){
  res.render('new');
})


//create

app.post('/blogs',function(req,res){
  //create blogs
  req.body.blog.body = req.sanitize(req.body.blog.body);
  var blog = req.body.blog
  console.log(blog);
  Blog.create(blog,function(err,blog){
    if(err){
      console.log(err);
    }else{
     //redirect to blogs
      res.redirect('/blogs');
    }
  })
})


//show
app.get('/blogs/:id',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      console.log(err);
    }else{
      res.render('show', {blog: foundBlog});
    }
  })
})


//edit
app.get('/blogs/:id/edit',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect('/blogs');
    }else{
      res.render('edit',{blog: foundBlog});
    }
  })

})


//update
app.put('/blogs/:id',function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog , function(err,updatedBlog){
    if(err){
      res.redirect('/blogs');
    }else{
      res.redirect('/blogs/' + req.params.id);
    }
  })
})


//delete
app.delete('/blogs/:id',function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect('/blogs');
    }else{
        res.redirect('/blogs');
    }
  })
})



var PORT = process.env.PORT || 65000;

app.listen(PORT, process.env.HOST,function(){
  console.log('Server Has Started');
});
