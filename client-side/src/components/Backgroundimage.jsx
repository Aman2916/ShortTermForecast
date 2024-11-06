import React from "react";

const BackgroundImage = (params) => {
  const backgroundStyle = {
    backgroundImage: params.image,
    // params.image,
    backgroundSize: "cover", // Adjust to 'contain' if you want to fit the image
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: `100vh`, // Full height of the viewport
    position: "fixed", // Positions is fixed behind other elements
    top: 0,
    left: 0, // Ensures the background starts from the top left corner
    zIndex: -10,
  };
  return (
    <div
      className="-z-10 w-full bg-cover bg-center"
      style={backgroundStyle}
    ></div>
  );
};

export default BackgroundImage;
