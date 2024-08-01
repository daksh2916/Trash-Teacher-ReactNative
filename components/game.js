import React, { useState, useEffect, useRef} from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text, Animated, Modal, Button, Platform,PanResponder,Alert,Dimensions } from "react-native";
import wasteItemsData from "../wasteItems.json";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-js-decode';
import LevelUpModal from "./LevelModal";

const { width } = Dimensions.get('window');

const Game = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [newLevel, setNewLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [currentWaste, setCurrentWaste] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showLevelChangeMessage, setShowLevelChangeMessage] = useState(false);
  const [streakAchieved, setStreakAchieved] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const fadeStreak = useState(new Animated.Value(0))[0];
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [correctModalVisible, setCorrectModalVisible] = useState(false);
  const [incorrectModalVisible, setIncorrectModalVisible] = useState(false);
  const[bintype,setBintype]=useState("");
  const currentWasteRef = useRef(null); // Ref for currentWaste
  const bintypeRef = useRef("");
  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);

const pan = useRef(new Animated.ValueXY()).current;
const dropZones = useRef(Array(5).fill(null).map(() => ({ layout: null })));

const setDropZoneValues = (index) => (event) => {
  dropZones.current[index].layout = event.nativeEvent.layout;
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

      // Check if gesture is inside any drop zone
      dropZones.current.forEach((zone, index) => {
        if (isDropZone(gesture, zone.layout)) {
          console.log(`Dropped in drop zone ${index + 1} - Bin: ${bins[index].label}`);
          checkWaste(index);
          droppedInZone = true;
        }
      });
      console.log(droppedInZone);
      // Reset pan position to { x: 0, y: 0 } only if dropped inside a drop zone


        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();

    },
  })
).current;


const logout = async () => {
  try {
    await updateData();
    await AsyncStorage.removeItem('token');
    setToken('');
     navigation.navigate('Welcome');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
const backgroundImages = [
  require('../assets/images/operation_theatre.jpg'),
  require('../assets/images/ct_scan.png'),
  require('../assets/images/medical_shop.jpg'),
];
const levelHeading = [{'name':`Operation Theatre`},{'name':`CT Scan Center`},{'name':`Pharmacy`}];
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
  const [token, setToken] = useState(""); // State to store the token

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const token1 = await AsyncStorage.getItem('token');
        if (token1) {
          console.log('Token found:', token1);
          setToken(token1);
          const decodedToken = decodeJWT(token1);
          if (decodedToken) {
            const { fname, lname } = decodedToken;
            setFname(fname);
            setLname(lname);
          }
        } else {
          console.log('Token not found in AsyncStorage');
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
    getToken();
  }, []);

  const updateData = async () => {
    try {
      console.log("update data function called");
      const response = await fetch("http://localhost:8000/v1/api/updateScore", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fname, lname, score }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API EXECUTED");
        // Process data as needed
      } else {console.log(token);
        console.error("Request failed:", response.statusText);
        // Handle unsuccessful API request (e.g., show error message)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    generateWaste(level);
  }, [level]);

  useEffect(() => {
    if (score !== 0) {
      updateData();
    }
  }, [score]);
   
  useEffect(() => {
    // Logic to update the background image based on level
    setBackgroundImageIndex((level - 1) % 3);
  }, [level]);

  const generateWaste = (level) => {
    const wasteItemsPerLevel = wasteItemsData[level] || [];
    console.log("level",level);
    const randomIndex = Math.floor(Math.random() * wasteItemsPerLevel.length);
    const randomWaste = wasteItemsPerLevel[randomIndex];
    setCurrentWaste(randomWaste);
    currentWasteRef.current = randomWaste; // Update ref
    setBintype(randomWaste?.type);
    bintypeRef.current = randomWaste?.type; // Update ref
    console.log("Generated Waste:", randomWaste); // Debugging line
  };

  const checkWaste = (index) => {
    setScore((prevScore) => {
      let newScore = prevScore;
      let newStreak = streak; // Initialize newStreak with current streak
  
      const currentWasteVal = currentWasteRef.current;
      const bintypeVal = bintypeRef.current;
  
      console.log("Selected bin type:", bins[index].type);
      console.log("Current waste bin type:", currentWasteVal?.bin);
  
      if (currentWasteVal && bins[index].type === currentWasteVal.bin) {
        console.log("Correct bin selected");
  
        if (streak === 4) {
          newScore += 10;
        } else {
          newScore += 1;
        }
  
        setStreak((prevStreak) => {
          newStreak = prevStreak + 1;
  
          if (newScore % 2 === 0) {
            // Update level when score is even
            setLevel((prevLevel) => {
              const newLevel = (newScore/2)+1;
              setFeedback(`You reached level ${newLevel}`);
              setShowLevelUpModal(true);
              setTimeout(() => {
                setShowLevelUpModal(false);
              }, 40000);
              return newLevel;
            });
          }
  
          return newStreak;
        });
  
        // Show correct modal
        setCorrectModalVisible(true);
        setTimeout(() => {
          setCorrectModalVisible(false);
        }, 1500);
       
      } else {
        console.log("Incorrect bin selected");
  
        // Show incorrect modal
        setIncorrectModalVisible(true);
        setTimeout(() => {
          setIncorrectModalVisible(false);
        }, 1500);
  
        setStreak(0);
        setFeedback("incorrect");
      }
  
      // Log the updated values before returning the new state
      console.log("New score before setState:", newScore);
      console.log("New streak before setState:", newStreak);
      console.log("New level before setState:", level);
     
  
      return newScore;
    });
  
    // Add useEffect to log updated score

  };
  useEffect(() => {
    console.log("Updated score:", score);
    generateWaste(level);
  }, [score]);

  // Add useEffect to log updated streak
  useEffect(() => {
    console.log("Updated streak:", streak);
  }, [streak]);

  // Add useEffect to log updated level
  useEffect(() => {
    console.log("Updated level:", level);
  }, [level]);
  
  

  const checkGameOver = () => {
    if (level >= 3 && score === 0) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    checkGameOver();
  }, [score, level]);

  useEffect(() => {
    if (showLevelChangeMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setShowLevelChangeMessage(false);
            fadeAnim.setValue(0);
          });
        }, 2000);
      });
    }
  }, [fadeAnim, showLevelChangeMessage]);

  useEffect(() => {
    if (streakAchieved) {
      setTimeout(() => {
        Animated.timing(fadeStreak, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(fadeStreak, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }).start(() => {
              setStreakAchieved(false);
              fadeStreak.setValue(0);
            });
          }, 2000);
        });
      }, 1500);
    }
  }, [fadeStreak, streakAchieved]);


  const restartGame = () => {
    setScore(0);
    setLevel(1);
    setCurrentWaste(null);
    setFeedback("");
    setShowLevelChangeMessage(false);
    setStreakAchieved(false);
    setGameOver(false);
  };

  

  const generateBins = () => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.binsContainer}>
          {bins.map((bin, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bin}
              onPress={() => checkWaste(bin.type)}
            >
              <Image source={bin.image} style={styles.binImage} onLayout={logImageCoordinates}/>
              <Text style={styles.binText}>{bin.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      const upperBins = bins.slice(0, 2);
      const lowerBins = bins.slice(2);

      return (
        <View>
          <View style={styles.upperBinsContainer}>
            {upperBins.map((bin, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bin}
                onPress={() => checkWaste(bin.type)}
              >
                <Image source={bin.image} style={styles.binImage} />
                <Text style={styles.binText}>{bin.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.lowerBinsContainer}>
            {lowerBins.map((bin, index) => (
              <TouchableOpacity
                key={index + upperBins.length}
                style={styles.bin}
                onPress={() => checkWaste(bin.type)}
              >
                <Image source={bin.image} style={styles.binImage} />
                <Text style={styles.binText}>{bin.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={backgroundImages[backgroundImageIndex]} style={styles.backgroundImage} />

      <View style={styles.topRowContainer}>
        <View style={styles.topBox}>
          <Text style={styles.topBoxLabel}>Score:</Text>
          <Text style={styles.topBoxContent}>{score}</Text>
        </View>
        <View style={styles.topBox}>
        <Text style={styles.levelHeadingText}>
          {levelHeading[level - 1].name}
        </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.wasteContainer}>

        <Text style={styles.wasteNameText}>
          {currentWaste ? `Waste: ${currentWaste.name}` : ""}
        </Text>
      </View>

      {correctModalVisible && (
        <View style={styles.correctModal}>
          <Text style={styles.modalText}>Correct!</Text>
        </View>
      )}

      {incorrectModalVisible && (
        <View style={styles.incorrectModal}>
          <Text style={styles.modalText}>Incorrect!</Text>
        </View>
      )}

      {dropZones.current.map((zone, index) => (
        <View
          key={index}
          style={[
            styles.dropZone,
            {
              left: index * ((width - 40) / 5 + 10), // Adjust left position with additional spacing (10 is the space between drop zones)
            }
          ]}
          onLayout={setDropZoneValues(index)}
        >
          <Image source={bins[index].image} style={styles.dropZoneImage} />
          <Text>{bins[index].label}</Text>
        </View>
      ))}

      <Animated.View
        style={[
          styles.wasteImageContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
            ],
            top: 200, // Adjust top position of pan responder
          },
        ]}
        {...panResponder.panHandlers} // Apply panHandlers here
      >
        {currentWaste && (
          <Image source={{ uri: currentWaste.img }} style={styles.wasteImage} />
        )}
      </Animated.View>

      {showLevelChangeMessage && (
        <Animated.View style={[styles.levelChangeMessage, { opacity: fadeAnim }]}>
          <Text style={styles.levelChangeText}>Level Up!</Text>
        </Animated.View>
      )}

      {streakAchieved && (
        <Animated.View style={[styles.streakMessage, { opacity: fadeStreak }]}>
          <Text style={styles.streakText}>Streak +1!</Text>
        </Animated.View>
      )}

      {gameOver && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={gameOver}
          onRequestClose={() => {
            setGameOver(false);
          }}
        >
          <View style={styles.gameOverModal}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Game Over!</Text>
              <Text style={styles.finalScoreText}>Final Score: {score}</Text>
              <Button title="Restart Game" onPress={restartGame} />
            </View>
          </View>
        </Modal>
      )}

      <LevelUpModal
        visible={showLevelUpModal}
        level={level}
        onClose={() => setShowLevelUpModal(false)}
        score={score}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#87CEEB", // Sky blue background
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  topRowContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBox: {
    alignItems: 'center',
    backgroundColor: '#FF5733', // Medium blue background for the score box
    padding: 10,
    borderRadius: 5,
  },
  topBoxLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  topBoxContent: {
    fontSize: 16,
    color: 'white',
  },
  levelHeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  wasteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80, 
    borderColor: 'white',
  },
  wasteImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 100,
    marginBottom: 10,
  },
  wasteNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#96DED1',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    borderBlockColor:'white',
  },
  dropZone: {
    position: 'absolute',
    top: 450, // Adjust top position accordingly
    width: (width - 40) / 5,
    height: 150,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, // Add margin horizontally
  },
  dropZoneImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  wasteImageContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  correctModal: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center', // Center horizontally
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  incorrectModal: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center', // Center horizontally
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  levelChangeMessage: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  streakMessage: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  gameOverModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 18,
    marginBottom: 20,
  },

});



export default Game;
