import { Fragment, useState,useEffect } from "react";
import {Button, Dialog,DialogContent,DialogContentText,Typography} from "@mui/material";
import { Search } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


// const ariaLabel = { 'aria-label': 'description' };

const Navbar=({term,searchTerm,setSearchTerm,posts,setPosts,setDeleteQueue,deleteQueue,fetchPosts})=>{   
    const [err,setErr]=useState(false);
    const[empty,setEmpty]=useState(false)
    const [delConfirm,setDelConfirm]=useState(false);
    const sugesstion=posts.map((post)=>{
    const t=post.title.split(' ')
    let a; 
    for(let b of t){
      a=b;
      return a;
    }
    return a;
  })

const search=()=>{
        term=searchTerm.trim();
        if(term.trim()===''){
            setErr(true);
        }
        else{
            setErr(false)
        }
    }
    
   
    const handleDelete = () => {
      setTimeout(()=>{
        const updatedQueue = [...deleteQueue];
        while (updatedQueue.length > 0) {
          const postId = updatedQueue.pop();
          setPosts((prevPosts) => prevPosts.filter((post,index) => index !== postId));
        }
    
        setDeleteQueue([]);
        setDelConfirm(false);
      },3000)
      
    };
    const searchReset=()=>{
      localStorage.removeItem('search')
      setSearchTerm('')
      setDeleteQueue([]);
      setErr(false)
      fetchPosts();     
  }
    useEffect(() => {
      localStorage.setItem('deleteQueue', JSON.stringify(deleteQueue));
    }, [deleteQueue]);
    return(
<Fragment>
<div className="navbar-container">
  <div className="title">
  <h2 style={{color:'red'}}>Q-max Task</h2>
  </div>
 
  
<div className="outer-container">
<div className="navbar-search">
{/* <Input onChange={(e)=>{setSearchTerm(e.target.value);localStorage.setItem('search',e.target.value)}} value={searchTerm} style={{padding:'10px'}}placeholder="Enter a term to search" inputProps={ariaLabel}></Input> */}
<Autocomplete
      disablePortal
      className="search-input"
      id="combo-box-demo"
      options={[...new Set(sugesstion)].sort()}
      clearOnBlur={false}
      onChange={(event, newValue) => {
        if(newValue===null){
          setSearchTerm('')
        localStorage.removeItem('search')
        }
        else{
          setSearchTerm(newValue);
          localStorage.setItem('search',newValue)
          setErr(false)
        }
        
      }}
      value={searchTerm}
      renderInput={(params) => <TextField {...params} onChange={(e)=>{setSearchTerm(e.target.value);localStorage.setItem('search',e.target.value)}} label="Enter a Search term" />}
    />
<Button style={{width:'200px'}} onClick={search} variant="contained" startIcon={<span><Search style={{fontSize:'2rem'}}></Search></span>}>
  <span className="input">Search</span>
</Button>

<Button style={{padding:'15px',width:'200px'}} onClick={searchReset} variant="contained" >
  Refresh
</Button>
</div>
<div style={{marginTop:'10px',paddingLeft:'10px'}}>
{err&&<p style={{color:'red'}}>Please enter any search term</p>}
</div>
</div>
</div>
<div className="delete">
  <p>Delete Queue: <span style={{color:'red'}}>{deleteQueue.length}</span></p>
  <Button onClick={()=>{
    if(deleteQueue.length>0){setDelConfirm(true);handleDelete()}
    else{
      setEmpty(true)
      setTimeout(()=>setEmpty(false),2000)
    }}} style={{padding:'15px'}} variant="contained" >
  Dlete Posts in Queue
</Button>
  </div>
  <Dialog open={delConfirm}
        className="dialog"
        onClose={()=>{setDelConfirm(false)}}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <DialogContent>
          <DialogContentText>
            <Typography style={{fontSize:'2rem',color:'red'}}>
              Deleting posts
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog open={empty}
        className="dialog"
        onClose={()=>{setEmpty(false)}}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <DialogContent>
          <DialogContentText>
            <Typography style={{fontSize:'2rem',color:'red'}}>
              Delete Queue Is Empty
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
</Fragment>
    )
}
export default Navbar;