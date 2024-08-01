import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const images = [
    require('../assets/images/image2.jpg'),
    require('../assets/images/images1.jpg'),
    require('../assets/images/image3.jpg')
];

const Card = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.card}>
            <Image source={images[currentImageIndex]} style={styles.cardImage} />
            <View style={styles.textContainer}>
                <Text style={styles.cardText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width * 0.4, // 40% of the screen width
        height: Dimensions.get('window').width * 0.4, // 40% of the screen width
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 20,
        margin: 10, // Adjust margin as needed
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
    },
    cardImage: {
        width: '100%',
        height: '70%',
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default Card;
