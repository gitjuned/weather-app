import React from "react";

import SunIcon from "./assets/icons/sun.svg";
import RainIcon from "./assets/icons/rain.svg";
import CloudIcon from "./assets/icons/cloudy.svg";

export default function ImageComponent({ type }) {
  if (type === "Cloudy") {
    return <img src={CloudIcon} alt="cloud" />;
  } else if (type === "Rains") {
    return <img src={RainIcon} alt="rain" />;
  } else {
    return <img src={SunIcon} alt="sun" />;
  }
}
