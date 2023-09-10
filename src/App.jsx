import {Fragment, useState } from "react";
import './App.css'
import HomePage from "./HomePage";
import PromiseQueue from "./PromiseQueue";

function App() {
  const [searchTerm,setSearchTerm]=useState('');
  let term='';
  return (
    <Fragment>
  {/* <HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} term={term}></HomePage> */}
  <PromiseQueue searchTerm={searchTerm} setSearchTerm={setSearchTerm} term={term}></PromiseQueue>
    </Fragment>
    
  );
}

export default App;
