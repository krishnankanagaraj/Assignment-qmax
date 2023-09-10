import { Fragment, useCallback, useEffect,useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CommentIcon from '@mui/icons-material/Comment';
import Dialog from '@mui/material/Dialog';
import { DeleteRounded } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {DialogActions} from "@mui/material";
import Typography from '@mui/material/Typography';
import { Button, CardActions, IconButton } from '@mui/material';
import Navbar from "./Navbar";
import BorderColorIcon from '@mui/icons-material/BorderColor';


export default function PromiseQueue({searchTerm,setSearchTerm,term}) {
  const [sort,setSort]=useState('recent')
  const[fetchData,setFectchData]=useState(true);
  let [posts,setPosts]=useState([]);
  const [open, setOpen] =useState(false);
  const[modPost,setModPost]=useState([]);
  const [comments,setComments]=useState([]);
  const[deleteAlert,setDeleteAlert]=useState(false);
  const[selectedIndex,setSelectedIndex]=useState(null)
  const[loading,setLoading]=useState(false);
  let localQueue=JSON.parse(localStorage.getItem('deleteQueue'))
  const [deleteQueue, setDeleteQueue] = useState(localQueue?localQueue:[]);
  const [alreadyInQ,setAlreadyInQ]=useState('false');
  const [loadMore,setLoadMore]=useState(10);
  
  const fetchPosts=useCallback(()=>{
    fetch('https://jsonplaceholder.typicode.com/posts').then(async res=>{
      const data=await res.json();
      if(data){
        setPosts(data);
        setFectchData(false)
        setLoading(true);
      }
      }
  )},[])
  
  const fetchComments=(postId)=>{
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`).then(async res=>{
      const data=await res.json();
      console.log(data)
      setComments(data);
      console.log(comments);
    })
  }
  const handelLike=(e)=>{
    e.target.style.color==='lightgray'?e.target.style.color='red':e.target.style.color='lightgray';
  }
  const handleDelete = (index) => {
    // Add the post ID to the delete queue
    setDeleteQueue((prevQueue) => [...prevQueue, index]);
  };
  
  const modOpen=(post)=>{
    fetchComments(post.userId);
    setOpen(true);
    setModPost(post);
  }
  const filteredItems=posts.filter(post=>{
    const title=post.title.split(' ');
    let present=title.some(t=>t===searchTerm)  
    return searchTerm===""?post:present?post:''
  })
  const visibleItems=()=>{
      setLoadMore((perv)=>perv+10)
  }
  const highlightSearchText = (text, searchQuery) => {
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
  
      return parts.map((part, index) => {
        if (part.match(regex)) {
          return <p style={{background:'yellow'}} key={index}>&nbsp;{part} &nbsp;</p>;
        }
        return part;
      });
    
  };
  useEffect(()=>{
    if(fetchData){fetchPosts(); console.log('fetching')
    const term=localStorage.getItem('search')
    if(term){
        setSearchTerm(term);
    }
}
},[fetchData,fetchPosts,setSearchTerm,searchTerm])
    return (
<Fragment>
    <Navbar setLoadMore={setLoadMore} fetchPosts={fetchPosts} deleteQueue={deleteQueue} setDeleteQueue={setDeleteQueue} posts={posts} setPosts={setPosts} sort={sort} setSort={setSort} term={term} searchTerm={searchTerm} setSearchTerm={setSearchTerm}></Navbar>
    <div className="App">
      {!loading&&<p style={{fontSize:'2rem',fontWeight:'bold',color:'red'}}>Loading Please Wait....</p>}
      {filteredItems.length<=0&&loading&&<p style={{fontSize:'2rem',fontWeight:'bold',color:'red'}}>No Results Found, Continue typing</p>}
      {loading&&filteredItems.slice(0,loadMore).map((post,index)=>{
        return(
       <div key={post.id}>
          <Card className="card">
        <CardContent>
          <Typography style={{display:'flex',alignItems:'center'}} gutterBottom variant="h5" component="div">
            <BorderColorIcon/>{searchTerm===''||window.innerWidth<480?post.title: highlightSearchText(post.title, searchTerm)}
          </Typography>
          <Typography  variant="body2" color="text.secondary">
            {post.body}
          </Typography>
        </CardContent>
      <CardActions style={{display:'flex',justifyContent:'space-between'}}>
        <Button variant="contained" onClick={()=>{modOpen(post);}} size="small" color="primary">
          read post
        </Button>
        <div style={{display:'flex',gap:'10px',justifyContent:'center',alignItems:'center'}}>
        <h2 style={{color:'lightgray'}} onClick={handelLike}>Like</h2>
        <IconButton onClick={()=>{
          let inx=deleteQueue.findIndex(t=>t===index);
          if(inx===-1){
            setDeleteAlert(true);setSelectedIndex(index)
          }
          else{
              setAlreadyInQ(true)
              setTimeout(()=>setAlreadyInQ(false),2000)
          }}}>
          <DeleteRounded style={{color:'red',fontSize:'2rem'}} ></DeleteRounded>
        </IconButton>
        </div>
      </CardActions>
    </Card>
        </div>
        )
})}
<Button variant="contained" onClick={visibleItems}>Load More</Button>
    </div>
    <Dialog
        open={open}
        className="dialog"
        onClose={()=>{setOpen(false);setComments([])}}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle style={{display:'flex',alignItems:'center'}} id="scroll-dialog-title"><BorderColorIcon style={{fontSize:'2rem'}}></BorderColorIcon>{modPost.title}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            <div style={{color:'Black',fontSize:'1.25rem',textAlign:'justify',textTransform:'capitalize', marginBlockEnd:'20px'}}>
            {modPost.body}
            </div>
            <h3>Comments</h3>
            {comments.map(comment=>(
              <div>
              <div className="comment-container">
                <AccountCircleIcon style={{fontSize:'4rem',color:'#1576D0'}}></AccountCircleIcon>
                <p className="comment">{comment.name} <p style={{color:'lightgray'}}>@{comment.email}</p></p>
              </div>
                <p className="comment-container" style={{textAlign:'justify',background:'aliceblue',padding:'10px'}}><CommentIcon style={{fontSize:'1.5rem',marginInline:'10px',color:'#1576d0',marginBlockEnd:'auto', marginBlockStart:'8px'}}></CommentIcon>{comment.body}</p>
              </div>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={()=>{setOpen(false);setComments([])}}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteAlert}
        className="dialog"
        onClose={()=>{setDeleteAlert(false)}}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <DialogContent>
          <DialogContentText>
            <Typography style={{fontSize:'1.25rem'}}>
              Are You Surely want to add this Post to delete queue?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button variant="outlined" onClick={()=>{handleDelete(selectedIndex);setDeleteAlert(false)}}>Ok</Button>
        <Button variant="contained" onClick={()=>{setDeleteAlert(false)}}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={alreadyInQ}
        className="dialog"
        onClose={()=>{setAlreadyInQ(false)}}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <DialogContent>
          <DialogContentText>
            <Typography style={{fontSize:'2rem',color:'orange'}}>
              Already in delete queue
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Fragment>
     );
    }
  
