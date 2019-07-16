// import React from 'react';
// import './constants.css';
//
//
// const iconconfig = {
//     pass:{
//         text:"test passed",
//         iconName:'snowflake'
//     },
//     fail:{
//         text: "test failed",
//         iconName:'sun'
//     }
// };
//
//
// const geticon = (trueorfalse) =>{
//     // for (let i in trueorfalse){
//     //     console.log(trueorfalse[i]);
//     //
//     // }
//
//     if (trueorfalse){
//         return 'pass';
//     }
//     else{
//         return 'fail';
//     }
//
// };
//
//
//
// const IconDisplay = (props) =>{
//     const season = geticon(props.torf);
//     const{text, iconName} = iconconfig[season]  //returns {text, iconName}
//
//
//     return (<div className={`season-display ${season}`}>
//         <i className={`icon-left massive ${iconName} icon`} />
//         <h1>{text} </h1>
//         <i className={`icon-right massive ${iconName} icon`} />
//
//     </div>);
// };
//
//
// export default IconDisplay;