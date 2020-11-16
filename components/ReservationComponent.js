import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Alert, Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import { Notifications } from "expo";

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: ''
        }
    };

    static navigationOptions = {
        title: 'Reserve Table'
    };

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        } else {
            if (Platform.OS === "android") {
                Notifications.createChannelAndroidAsync("notify", {
                  name: "notify",
        
                  sound: true,
        
                  vibrate: true,
                });
            }
        }
        return permission;
    }
    
    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }
    
    async obtainCalendarPermission() {
        let permission = await Calendar.getCalendarPermissionsAsync();
        if (permission.status !== 'granted') {
            permission = await Calendar.requestCalendarPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Calendar Permission not granted');
            }
        }

        return permission;
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        const startDate = new Date(Date.Parse(date));
        const endDate = new Date(Date.Parse(date) + 2 * 60 * 60 * 1000);
        Calendar.createEventAsync( Calendar.DEFAULT, {
            title: 'Con Fusion Table Reservation',
            startDate: startDate,
            endDate: endDate,
            timeZone: 'Asia/Hong_Kong',
            location:  '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
        });
    }

    handleReservation = () => {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Your Reservation OK?',
            'Number of Guests: '+this.state.guests+'\n'+'Smoking?: '+this.state.smoking +'\n'+'Date and Time: '+this.state.date,
            [
                {text: 'Cancel', onPress: () => this.resetForm(), style: 'cancel'},
                {text: 'OK', onPress: () => {
                    this.presentLocalNotification(this.state.date); 
                    this.resetForm()
                }}
            ],
            { cancelable: false }
        );
        this.addReservationToCalendar(this.state.date);
    }
    
    resetForm = () => {
        this.setState({
            guests: 1,
            smoking: false,
            date: ''
        });
    }

    render() {
        return (
            <Animatable.View animation="zoomIn" duration={2000} delay={1000}>
                <ScrollView>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DA8'
                            onValueChange={(value) => this.setState({smoking: value})}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{flex: 2, marginRight: 20}}
                            date={this.state.date}
                            format=''
                            mode='datetime'
                            placeholder="Select date and time"
                            minDate="2020-10-10"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                },
                                    dateInput: {
                                        marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title="Reserve"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                </ScrollView>
            </Animatable.View>
        );
    };
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});

export default Reservation;