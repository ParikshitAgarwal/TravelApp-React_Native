import React from "react";
import { View, Text, ImageBackground, Image, Animated } from "react-native";

import { COLORS, SIZES, FONTS, icons } from "../constants";

import { HeaderBar, TextIconButton, Rating, TextButton } from "../components";

import SlidingUpPanel from "rn-sliding-up-panel";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import { MapStyle } from "../styles";

const Place = ({ navigation, route }) => {
  const [selectedPlace, setSelectedPlace] = React.useState(null);

  const [selectedHotel, setSelectedHotel] = React.useState(null);

  const [allowDraggging, setAllowDraggging] = React.useState(true);

  const _draggedValue = React.useRef(new Animated.Value(0)).current;
  let _panel = React.useRef(null);

  React.useEffect(() => {
    let { selectedPlace } = route.params;
    setSelectedPlace(selectedPlace);

    //to stop swipe when map is show

    _draggedValue.addListener((valueObj) => {
      if (valueObj.value > SIZES.height) {
        setAllowDraggging(false);
      }
    });

    return () => {
      _draggedValue.removeAllListeners();
    };
  }, []);

  function renderPlace() {
    return (
      <ImageBackground
        source={selectedPlace?.image}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <HeaderBar
          title=""
          leftOnPress={() => navigation.goBack()}
          right={false}
          containerStyle={{
            marginTop: SIZES.padding * 2,
          }}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: SIZES.padding,
            justifyContent: "flex-end",
            marginBottom: 100,
          }}
        >
          {/*Name & Ratings*/}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.largeTitle,
              }}
            >
              {selectedPlace?.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginRight: 5,
                  color: COLORS.white,
                  ...FONTS.h3,
                }}
              >
                {selectedPlace?.rate}
              </Text>
              <Image
                source={icons.star}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </View>
          </View>

          {/*Description*/}
          <Text
            style={{
              marginTop: SIZES.base,
              color: COLORS.white,
              ...FONTS.body3,
            }}
          >
            {selectedPlace?.description}
          </Text>
          {/* Text Icon Button */}
          <TextIconButton
            label="Book a flight"
            icon={icons.aeroplane}
            customContainerStyle={{
              marginTop: SIZES.padding,
            }}
            onPress={() => console.log("Book a flight")}
          />
        </View>
      </ImageBackground>
    );
  }

  function renderMap() {
    return (
      <SlidingUpPanel
        ref={(c) => {
          _panel = c;
        }}
        allowDragging={allowDraggging}
        draggableRange={{ top: SIZES.height + 120, bottom: 120 }}
        showBackdrop={false}
        animatedValue={_draggedValue}
        onBottomReached={() => setAllowDraggging(true)}
        snappingPoints={SIZES.height + 120}
        height={SIZES.height + 120}
        friction={0.7}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              height: 120,
              color: "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={icons.up_arrow}
              style={{
                width: 18,
                height: 18,
                tintColor: COLORS.white,
              }}
            />
            <Text
              style={{
                color: COLORS.white,
                ...FONTS.h4,
              }}
            >
              SWIPE FOR DETAILS
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MapView
              style={{
                width: "100%",
                height: "100%",
              }}
              customMapStyle={MapStyle}
              provider={PROVIDER_GOOGLE}
              initialRegion={selectedPlace?.mapInitialRegion}
            >
              {selectedPlace?.hotels.map((hotel, index) => (
                <Marker
                  key={index}
                  coordinate={hotel.latlng}
                  identifier={hotel.id}
                  onPress={() => setSelectedHotel(hotel)}
                >
                  <Image
                    source={
                      selectedHotel?.id == hotel.id
                        ? icons.bed_on
                        : icons.bed_off
                    }
                    resizeMode="contain"
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                </Marker>
              ))}
            </MapView>

            <HeaderBar
              title={selectedPlace?.name}
              leftOnPress={() => _panel.hide()}
              right={true}
              containerStyle={{
                position: "absolute",
                top: SIZES.padding * 0.5,
              }}
            />
            {selectedHotel && (
              <View
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 0,
                  right: 0,
                  padding: SIZES.radius,
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    ...FONTS.h2,
                    fontWeight: "bold",
                  }}
                >
                  Hotels in {selectedPlace?.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: SIZES.radius,
                    padding: SIZES.radius,
                    borderRadius: 15,
                    backgroundColor: COLORS.transparentBlack1,
                  }}
                >
                  <Image
                    source={selectedHotel?.image}
                    resizeMode="cover"
                    style={{
                      width: 90,
                      height: 120,
                      borderRadius: 15,
                    }}
                  />

                  <View
                    style={{
                      flex: 1,
                      marginLeft: SIZES.radius,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        ...FONTS.h3,
                      }}
                    >
                      {selectedHotel?.name}
                    </Text>
                    <Rating
                      containerStyle={{
                        marginTop: SIZES.base,
                      }}
                      rate={selectedHotel?.rate}
                    ></Rating>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: SIZES.base,
                      }}
                    >
                      <TextButton
                        label="Details"
                        customContainerStyle={{
                          marginTop: SIZES.base,
                          width: 100,
                          height: 45,
                        }}
                        customLabelStyle={{
                          ...FONTS.h3,
                        }}
                        onPress={() => console.log("Details")}
                      ></TextButton>

                      <View
                        style={{
                          flex: 1,
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.lightGray,
                            ...FONTS.body5,
                            fontSize: SIZES.body5,
                          }}
                        >
                          From ${selectedHotel?.price} / night
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </SlidingUpPanel>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {renderPlace()}
      {renderMap()}
    </View>
  );
};

export default Place;
