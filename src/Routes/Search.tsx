import React from "react";
import { useLocation } from "react-router";

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    console.log(keyword);
    return <div style={{ backgroundColor: "whitesmoke", height: "200vh" }}></div>;
  }
  export default Search;