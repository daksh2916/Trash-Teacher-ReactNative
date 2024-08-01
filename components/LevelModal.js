import React, { useState, useEffect } from "react";
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity, Image } from "react-native";
import LeaderboardModal from "./LeaderboardModal";

// Import star image (adjust the path as per your project structure)
const starImage = require("../assets/images/STAR.png");

const LevelUpModal = ({ visible, level, score, onClose }) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [token, setToken] = useState("");

  // Function to decode JWT token
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

  // Fetch token from AsyncStorage on component mount
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

  // Function to update user's score
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
      } else {
        console.error("Request failed:", response.statusText);
        // Handle unsuccessful API request (e.g., show error message)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to fetch leaderboard data
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("http://localhost:8000/v1/api/leaderboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLeaderboardData(data.data); // Assuming data is an array of leaderboard entries
      } else {
        console.error("Request failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  // Function to open leaderboard modal
  const openLeaderboard = async () => {
    await updateData();
    fetchLeaderboardData();
    setShowLeaderboard(true);
  };

  // Function to close leaderboard modal
  const closeLeaderboard = () => {
    setShowLeaderboard(false);
  };

  // Function to render stars based on level
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < level; i++) {
      stars.push(
        <Image
          key={i}
          source={starImage}
          style={styles.starImage}
          resizeMode="contain"
        />
      );
    }
    return stars;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Level Up!</Text>
          <View style={styles.starContainer}>
            {renderStars()}
          </View>
          <Text style={styles.levelUpMessage}>You reached level {level}</Text>
          <Text style={styles.scoreText}>Your Score: {score}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.leaderboardButton} onPress={openLeaderboard}>
              <Text style={styles.buttonText}>Leaderboard</Text>
            </TouchableOpacity>
            <Button title="Continue" onPress={onClose} />
          </View>
        </View>
        <LeaderboardModal
          onPress={updateData}
          visible={showLeaderboard}
          data={leaderboardData}
          onClose={closeLeaderboard}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay outside the modal
  },
  modalView: {
    backgroundColor: "#CCCCFF", // Dark blue background color
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: 300, // Adjust width as needed for square shape
    borderWidth: 2,
    borderColor: "#add8e6", // Light blue border color
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white", // White text color
  },
  levelUpMessage: {
    fontSize: 18,
    textAlign: "center",
    color: "white", // White text color
  },
  scoreText: {
    fontSize: 20,
    color: "white", // White text color
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  starImage: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Center buttons side by side
    width: "100%", // Ensure buttons take full width
    marginTop: 20,
  },
  leaderboardButton: {
    backgroundColor: "orange",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white", // White text color
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LevelUpModal;
