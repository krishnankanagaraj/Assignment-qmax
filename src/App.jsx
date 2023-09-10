import {Fragment, useState } from "react";
import './App.css'
import PromiseQueue from "./PromiseQueue";

function App() {
  const [searchTerm,setSearchTerm]=useState('');
  let term='';
  return (
    <Fragment>
  <PromiseQueue searchTerm={searchTerm} setSearchTerm={setSearchTerm} term={term}></PromiseQueue>
    </Fragment>
    
  );
}

export default App;
