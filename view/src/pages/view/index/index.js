import React, { Component } from "react";
import { browserHistory } from "react-router";
import "./index.css";

class Index extends Component {
  componentDidMount() {
    var doc = document;
    var flower = doc.querySelector(".flower");

    var maxParts = 20;
    var maxPetalsDef = 6;
    var maxPetals = maxPetalsDef;

    var partsFontStepDef = 25 / maxParts;
    var partsFontStep = partsFontStepDef;
    var huetStep = 150 / maxParts;

    createFlower();

    function createFlower() {
      var angle = 360 / maxPetals;

      for (var i = 0; i < maxPetals; i++) {
        var petal = createPetal();
        var currAngle = angle * i + "deg";
        var transform =
          "transform: rotateY(" +
          currAngle +
          ") rotateX(-30deg) translateZ(9vmin)";

        petal.setAttribute("style", transform);

        flower.appendChild(petal);
      }
    }

    function createPetal() {
      var box = createBox(null, 0);

      var petal = doc.createElement("div");
      petal.classList.add("petal");

      for (var i = 1; i <= maxParts; i++) {
        let newBox = createBox(box, i);
        box = newBox;
      }

      petal.appendChild(box);

      return petal;
    }

    function createBox(box, pos) {
      var fontSize = partsFontStep * (maxParts - pos) + "vmin";
      var half = maxParts / 2;

      var bright = "50";

      if (pos < half + 1) {
        fontSize = partsFontStep * pos + "vmin";
      } else {
        bright = 10 + (40 / half) * (maxParts - pos);
      }

      var color = "hsl(" + huetStep * pos + ", 100%, " + bright + "%)";

      // 1. Add shape
      var newShape = doc.createElement("div");
      newShape.classList.add("shape");

      // 2. Create wrapper .box
      var newBox = doc.createElement("div");
      newBox.classList.add("box");

      var boxStyle = ["color: " + color, "font-size: " + fontSize].join(";");
      newBox.setAttribute("style", boxStyle);

      // 3. Add old box to new box
      if (box) {
        newBox.appendChild(box);
      }

      // 4. Add shape to new box
      newBox.appendChild(newShape);

      return newBox;
    }
  }

  handleClickStart = () => {
    browserHistory.push("/main");
  };
  render() {
    return (
      <div id="index">
        <div className="wrapper" onClick={this.handleClickStart.bind(this)}>
          <div className="flower">{/* <span >开始</span> */}</div>
        </div>
        <span className="alert">点击花朵开始体验</span>
      </div>
    );
  }
}

export default Index;
