import React from 'react';

const ImageList = (props) => {
    console.log(props.images[0]);
    const x =props.images[0];
        console.log(x);

    const images = props.images.map(image => {
        console.log(image.constructor === Array);
        console.log("in inmagelist");
        console.log(image.length);
        console.log({image});
        let u = "";
        for (let i in image){


            u+= image[i]+ "         ";
        }
        console.log(u);
        return <p>{u}</p>;






        });

    console.log(images);
    return <div>{images}<br /></div>;
};


export default ImageList;