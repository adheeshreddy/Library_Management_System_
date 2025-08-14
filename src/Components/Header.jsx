import React from 'react'
const Header=()=>{
//     const {users}=props;

//     const [filterList,setFilterList]=useState([]);

//     const elementWithoutJSX = React.createElement(
//   'h1',
//   { className: 'no-jsx-heading' },
//   'Hello from React without JSX!'
// );

// // Create a React element WITH JSX
// const elementWithJSX = (
//   <p className="jsx-paragraph">
//     This is a paragraph created with JSX.
//   </p>
// );
    // console.log(users);
    // console.log(users[0].name);

    
// console.log("hi");
//     const[btnName,setBtnName]=useState("login");
    // var btn="login";
    // console.log(btn);
// useEffect(()=>{
//     console.log("this will come after the page is rendered (only once)");
// },[btnName]);

console.log("this will render first before calling use effect");



    return(
        <div>
            <h1>Header </h1>
        {/* {elementWithJSX}
        {elementWithoutJSX}

 {users.map((item, index) => (
        <li key={index}>{item.name}</li>   
      ))} */}

      {/* {
         filterList.setFilterList( users.filter((x)=>{
            return x.age>24;
        }))
      }

      {filterList.map((ite)=>(
        <li>
           {ite.age} 
        </li>
      ))} */}
{/* 
            <h2>this is my name:{name}</h2>
            <h2>this is my name:{age}</h2> */}
       {/* <h1>     click me to turn into logout </h1>
        <button onClick={()=>{
           setBtnName(btnName=="login"?"logout":"login");
        }}>{btnName}</button> */}
        </div>
    )
}
export default Header;