import React, { Component } from 'react';
import Home from './HomeComponent';
import About from './AboutComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import Dishdetail from './DishdetailComponent';
import { View, Platform } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Constants from 'expo-constants';



const MenuNavigator = createStackNavigator({
  Menu: { screen: Menu },
  Dishdetail: { screen: Dishdetail }
}, {
  navigationOptions: {
    headerStyle: { backgroundColor: "#512DA8" },
    headerTitleStyle: { color: "#fff" },
    headerTintColor: '#fff'
  }
});

const HomeNavigator = createStackNavigator({
  Home: { screen: Home }
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: { backgroundColor: "#512DA8" },
    headerTitleStyle: { color: "#fff" },
    headerTintColor: "#fff"  
  })
});

const AboutNavigator = createStackNavigator({
  Home: { screen: About }
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: { backgroundColor: "#512DA8" },
    headerTitleStyle: { color: "#fff" },
    headerTintColor: "#fff"  
  })
});

const ContactNavigator = createStackNavigator({
  Home: { screen: Contact }
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: { backgroundColor: "#512DA8" },
    headerTitleStyle: { color: "#fff" },
    headerTintColor: "#fff"  
  })
});

const MainNavigator = createDrawerNavigator({
  Home: 
    { screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: 'Home'
      }
    },
  Aboutus: 
    { screen: AboutNavigator,
      navigationOptions: {
        title: 'About Us',
        drawerLabel: 'About Us'
      }
    },
  Menu: 
    { screen: MenuNavigator,
      navigationOptions: {
        title: 'Menu',
        drawerLabel: 'Menu'
      }, 
    },
  Contactus: 
    { screen: ContactNavigator,
      navigationOptions: {
        title: 'Contact Us',
        drawerLabel: 'Contact Us'
      }
    }
}, {
drawerBackgroundColor: '#D1C4E9'
});

class Main extends Component {
  render() { 
    return (
        <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight}}>
          <MainNavigator />
        </View>
    );
  }
}
  
export default Main;