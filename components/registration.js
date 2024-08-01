import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Image, Picker, TouchableOpacity ,Alert} from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const RegistrationScreen = () => {
    const [roles, setRoles] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedFacility, setSelectedFacility] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [validationError, setValidationError] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/api/roles');
                const rolesData = response.data.map(role => ({
                    label: role.role_name,
                    value: role.role_name,
                }));
                setRoles(rolesData);
            } catch (error) {
                console.error('Failed to fetch roles', error);
            }
        };

        const fetchFacilities = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/api/health_facilities');
                const facilitiesData = response.data.map(facility => ({
                    label: facility.health_facility_name,
                    value: facility.health_facility_name,
                }));
                setFacilities(facilitiesData);
            } catch (error) {
                console.error('Failed to fetch health facilities', error);
            }
        };

        fetchRoles();
        fetchFacilities();
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateMobileNumber = (number) => {
        const re = /^[0-9]{10}$/;
        return re.test(String(number));
    };

    const handleRegister = async () => {
        // Validation
        if (!fname || !lname || !mobileNumber || !email || !selectedRole || !selectedFacility) {
            setValidationError('Please enter all details.');
            return;
        }
        if (!validateEmail(email)) {
            setValidationError('Please enter a valid email address.');
            return;
        }
        if (!validateMobileNumber(mobileNumber)) {
            setValidationError('Please enter a valid 10-digit mobile number.');
            return;
        }

        try {
            // API Call
            const response = await axios.post('http://localhost:8000/v1/api/registration', {
                fname,
                lname,
                mobileNumber,
                email,
                role_name: selectedRole,
                health_facility_name: selectedFacility,
            });

            // Reset validation error and show success message
            setValidationError('');
            setRegistrationSuccess(true);
            Alert.alert('Success', response.data.message);

            // Navigate and close modal after 2 seconds
            setTimeout(() => {
                setRegistrationSuccess(false);
                navigation.navigate("Login");
            }, 1000);

        } catch (error) {
            console.error('Failed to register', error);
            Alert.alert('Error', 'Registration failed');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image
                    source={require('../assets/images/who-logo.jpg')} // Replace with your image path
                    style={styles.logo}
                />
            </View>
            <View style={styles.heading}>
            <Text style={styles.labelheading}>Registration</Text>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    value={fname}
                    onChangeText={setFname}
                      placeholder="First Name"
                />

                <TextInput
                    style={styles.input}
                    value={lname}
                    onChangeText={setLname}
                      placeholder="Last Name"
                />

                <TextInput
                    style={styles.input}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                    placeholder="Mobile Number"
                />

                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholder="Email"
                />

                <Picker
                    selectedValue={selectedRole}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedRole(itemValue)
                    }
                    style={styles.picker}
                >
                    <Picker.Item label="Select Role" value="" />
                    {roles.map((role, index) => (
                        <Picker.Item
                            key={index}
                            label={role.label}
                            value={role.value}
                        />
                    ))}
                </Picker>

                <Picker
                    selectedValue={selectedFacility}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedFacility(itemValue)
                    }
                    style={styles.picker}
                >
                    <Picker.Item label="Select Facility" value="" />
                    {facilities.map((facility, index) => (
                        <Picker.Item
                            key={index}
                            label={facility.label}
                            value={facility.value}
                        />
                    ))}
                </Picker>
                {validationError ? (
                    <Text style={styles.errorMessage}>{validationError}</Text>
                ) : null}
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                {registrationSuccess && (
                    <View style={styles.successMessage}>
                        <Text style={styles.successText}>Registered Successfully!</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff', // Light blue background
        alignItems: 'center',
    },
    topContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain', // Adjust image size to contain within its bounds
    },
    formContainer: {
        width: '60%',
        backgroundColor: '#f0f8ff', // Denim background color
        borderRadius: 10,
        padding: 10,
        marginTop: 0,
        alignItems: 'center',
        shadowOpacity: 0,


    },
    heading: {
        padding: 20,
        marginTop: 15,
        alignItems: 'center',
    },
    labelheading: {
        fontSize: 25,
        marginBottom: 2,
        color: '#00008B',
        alignSelf: 'flex-start'
    },
    label: {
        fontSize: 10,
        marginBottom: 5,
        color: '#00008B',
        alignSelf: 'flex-start'
    },
    input: {
        height: 30,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        borderRadius: 5,
        width: '100%',
        backgroundColor: '#ADD8E6', // Denim background color
        color: '#6082B6',
    },
    
    picker: {
        height: 30,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        backgroundColor: '#ADD8E6', // Denim background color
        color: '#6082B6',
        borderRadius:5,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        width: '20%',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    successMessage: {
        marginTop: 10,
    },
    successText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
});

export default RegistrationScreen;
