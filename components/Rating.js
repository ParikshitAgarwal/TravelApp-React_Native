import React from "react";

import { View, Image } from "react-native";

import { icons } from "../constants";

const Rating = ({ containerStyle, rate }) => {
  const starComponent = [];

  for (var i = 0; i < rate; i++) {
    starComponent.push(
      <Image
        key={`full-${i}`}
        source={icons.star}
        resizeMode="cover"
        style={{
          marginLeft: i == 0 ? 0 : 5,
          width: 15,
          height: 15,
        }}
      />
    );
  }
  return (
    <View
      style={{
        flexDirection: "row",
        ...containerStyle,
      }}
    >
      {starComponent}
    </View>
  );
};

export default Rating;
