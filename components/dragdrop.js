import React, { useRef } from 'react';
import { Animated, View, StyleSheet, PanResponder, Text, Dimensions, Image } from 'react-native';
import wasteItemsData from "../wasteItems.json";


const { width } = Dimensions.get('window');

const DragDrop = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const dropZones = useRef(Array(5).fill(null).map(() => ({ layout: null })));

  const setDropZoneValues = (index) => (event) => {
    dropZones.current[index].layout = event.nativeEvent.layout;
  };

  const bins = [
    {
      type: "infectious",
      image: require("../assets/images/infectious_bin.png"),
      label: "Infectious",
    },
    {
      type: "glass",
      image: require("../assets/images/glass_bin.png"),
      label: "Glass",
    },
    {
      type: "biodegradable",
      image: require("../assets/images/biodegradable_bin.png"),
      label: "Biodegradable",
    },
    {
      type: "hazardous",
      image: require("../assets/images/hazardous_bin.png"),
      label: "Hazardous",
    },
    {
      type: "metal sharps",
      image: require("../assets/images/metal_sharps_bin.png"),
      label: "Metal Sharps",
    },
  ];

  const checkWaste = (gesture, index) => {
    const { type } = bins[index];
    const droppedWaste = wasteItemsData.find(item => item.image === gesture.image); // Assuming gesture has a property 'image' to identify waste type
    if (droppedWaste && droppedWaste.type === type) {
      setScore(score + 1); // Increase score if correct waste item is dropped in correct bin
      console.log(`Correct waste item dropped in ${type} bin! Current score: ${score + 1}`);
    } else {
      console.log("Incorrect waste item dropped.");
    }
  };


  const isDropZone = (gesture, layout) => {
    if (!layout) return false;
    const { x, y, width, height } = layout;
    const boxCenterX = gesture.moveX;
    const boxCenterY = gesture.moveY;

    return (
      boxCenterX > x &&
      boxCenterX < x + width &&
      boxCenterY > y &&
      boxCenterY < y + height
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        let droppedInZone = false;
        dropZones.current.forEach((zone, index) => {
          if (isDropZone(gesture, zone.layout)) {
            console.log(`Dropped in drop zone ${index + 1} - Bin: ${bins[index].label}`);
            checkWaste(gesture, index);
            droppedInZone = true;
          }
        });

        if (!droppedInZone) {
          console.log("Dropped outside drop zones.");
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {dropZones.current.map((zone, index) => (
        <View
          key={index}
          style={[
            styles.dropZone,
            { left: index * ((width - 40) / 5 + 10) } // Adjust left position with additional spacing (10 is the space between drop zones)
          ]}
          onLayout={setDropZoneValues(index)}
        >
          <Image source={bins[index].image} style={styles.dropZoneImage} />
          <Text>{bins[index].label}</Text>
        </View>
      ))}

      <Animated.View
        style={[
          styles.box,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.boxContent} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZone: {
    position: 'absolute',
    top: 100,
    width: (width - 40) / 5,
    height: 150,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropZoneImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  box: {
    height: 50,
    width: 50,
    backgroundColor: 'blue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxContent: {
    height: 50,
    width: 50,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default DragDrop;

