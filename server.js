const express = require("express");
const mangoose=require("mongoose");
const Registeruser=require("./model/register")
const Blogs =require("./model/blog")
const middleware=require("./middleware")
const jwt =require("jsonwebtoken");
const cors =require("cors");
const app=express();
app.use(express.json())
app.use(cors({origin:"*"}))

const port=4000;



mangoose.connect("mongodb+srv://15072cm031:Vineeth123@cluster0.yx49o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
    ()=>console.log("db connected")
).catch(err => console.log(err))



/*  login and registartion */

app.post('/login',async (req, res) => {
    try{
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err,token) =>{
              if (err) throw err;
              return res.json({token})
          }  
            )

    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})




/* Register user*/

app.post("/register",async(req,res)=>{
    try{
        const {email,username,password,confirmpassword}=await req.body;
        let exist= await Registeruser.findOne({email});
        if (exist){
            return res.status(400).send("user Already Exist");
        }
        if (password!==confirmpassword){
            return res.send("password is not matched");

        }
        let newUser=new Registeruser({
            username,email,password,confirmpassword
        })

        await newUser.save();
        res.send("registartion is success");


    }
    catch(err){
        console.log(err)
        return res.send("server error");
    }
})








/* blogs page*/

app.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blogs.find();
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // GET /posts/:id (Get a specific post)
  app.get('/blogs/:id', async (req, res) => {
    try {
      const post = await Blogs.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // POST /posts (Create a new post)
  app.post('/createpost', async (req, res) => {
    try {
    const { title, content, author,description,urlToImage } = req.body;
  
    // Basic input validation
    if (!title || !content || !author||!description||!urlToImage) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const newBlog = new Blogs({
      title,
      content,
      author,
      urlToImage,
      description
    });
  
    
      await newBlog.save();
      res.status(200).json("new blog created");
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // PUT /posts/:id (Update a post)
  /*app.put('/:id', async (req, res) => {
    const { title, content, author } = req.body;
  
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      if (title) post.title = title;
      if (content) post.content = content;
      if (author) post.author = author;
  
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });*/
  
  // DELETE /posts/:id (Delete a post)
 /* app.delete('/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      await post.remove();
      res.json({ message: 'Post deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });*/


app.listen(port,()=>{
    console.log("server running");
})
