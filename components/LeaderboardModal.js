import React from "react";
import { View, Modal, Text, Button, FlatList, StyleSheet } from "react-native";
import { Avatar } from 'react-native-elements';
import UserImage1 from '../assets/images/user.jpg';

const LeaderboardModal = ({ visible, data, onClose }) => {

  // Separate the top 3 users and the rest
  const topThree = data.slice(0, 3);
  const restUsers = data.slice(3);

  const renderPodiumItem = (item, index) => {
    let podiumStyle;
    switch (index) {
      case 0:
        podiumStyle = [styles.podiumItem, styles.firstPlace];
        break;
      case 1:
        podiumStyle = [styles.podiumItem, styles.secondPlace];
        break;
      case 2:
        podiumStyle = [styles.podiumItem, styles.thirdPlace];
        break;
      default:
        podiumStyle = [styles.podiumItem];
        break;
    }

    return (
      <View key={index} style={podiumStyle}>
        <Avatar rounded source={UserImage1 ? { uri: UserImage1 } : null} size="medium" avatarStyle={styles.avatarStyle} />
        <View style={styles.textContainer}>
          <Text style={styles.rankEmoji}>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.score}>Score: {item.score}</Text>
        </View>
      </View>
    );
  };

  const renderListItem = ({ item, index }) => {
    const renderIndex = index + 4; // Start numbering from 4 for users beyond top 3

    return (
      <View style={styles.simpleItem}>
        <Text style={styles.rankText}>{renderIndex}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.score}>Score: {item.score}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.leaderboardModal}>
        <View style={styles.leaderboardContent}>
          <Text style={styles.leaderboardTitle}>Leaderboard</Text>

          {/* Podium for top 3 */}
          <View style={styles.podium}>
            {topThree.map((item, index) => renderPodiumItem(item, index))}
          </View>

          {/* List for the rest (starting from index 3) */}
          <FlatList
            data={restUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderListItem}
            style={styles.flatList}
          />

          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  leaderboardModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  leaderboardContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
    elevation: 5,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  podium: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  podiumItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    marginLeft: 10,
  },
  rankEmoji: {
    fontSize: 24,
    marginRight: 5,
  },
  rankText: {
    fontSize: 18,
    marginRight: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    fontSize: 16,
    color: "#555",
  },
  firstPlace: {
    backgroundColor: "#ffe0b2",
  },
  secondPlace: {
    backgroundColor: "#e6ee9c",
  },
  thirdPlace: {
    backgroundColor: "#ffcc80",
  },
  avatarStyle: {
    resizeMode: 'cover'
  },
  flatList: {
    maxHeight: 200, // Adjust as needed for the maximum height of the list
    marginTop: 10,
  },
  simpleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#f0f0f0", // Simple background color
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default LeaderboardModal;
