import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const Test = () => {
  const [dropZonePositions, setDropZonePositions] = useState([]);

  const onLayoutDropZone = (event, index) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setDropZonePositions((prev) => [
      ...prev.filter((_, i) => i !== index), // Avoid duplicate entries
      { x, y, width, height, index },
    ]);
  };

  const onDrop = (dropZoneIndex) => {
    console.log(`Dropped on zone: ${dropZoneIndex}`);
  };

  const Draggable = ({ dropZonePositions, onDrop }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const onGestureEvent = useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startX = translateX.value;
        context.startY = translateY.value;
      },
      onActive: (event, context) => {
        translateX.value = context.startX + event.translationX;
        translateY.value = context.startY + event.translationY;
      },
      onEnd: (event) => {
        dropZonePositions.forEach((dropZone) => {
          if (
            event.absoluteX > dropZone.x &&
            event.absoluteX < dropZone.x + dropZone.width &&
            event.absoluteY > dropZone.y &&
            event.absoluteY < dropZone.y + dropZone.height
          ) {
            onDrop(dropZone.index);
          }
        });

        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.draggable, animatedStyle]}>
          <Text style={styles.text}>Drag me</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  const DropZone = ({ index }) => {
    return (
      <View style={styles.dropZone} onLayout={(event) => onLayoutDropZone(event, index)}>
        <Text style={styles.dropZoneText}>Zone {index + 1}</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.dropZoneContainer}>
        {[...Array(5)].map((_, index) => (
          <DropZone key={index} index={index} />
        ))}
      </View>
      <Draggable dropZonePositions={dropZonePositions} onDrop={onDrop} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropZoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  dropZone: {
    width: 80,
    height: 80,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'grey',
  },
  dropZoneText: {
    fontSize: 16,
    color: 'black',
  },
  draggable: {
    width: 80,
    height: 80,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Test;
