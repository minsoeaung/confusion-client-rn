import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes : state.dishes,
        comments : state.comments,
        favorites : state.favorites,
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite : (dishId) => dispatch(postFavorite(dishId)),
    postComment : (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
});

function RenderDish(props) {
    
    const dish = props.dish;   

    // handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }

    const recognizeLeftToRight= ({ moveX, moveY, dx, dy }) => {
        if (dx > +200) 
            return true;
        else 
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        // onPanResponderGrant: () => {
        //     this.view.rubberBand(1000)
        //     .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        // },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPressFav()}},
                    ],
                    { cancelable: false }
                );
            } else if (recognizeLeftToRight(gestureState)) { 
                props.openModal();
            }
            return true;
        }
    })

    if (dish != null) {     
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                // ref={this.handleViewRef}
                {...panResponder.panHandlers} >
                <Card featuredTitle = {dish.name} image = {{uri: baseUrl + dish.image}}>
                    <Text style = {{margin: 10}}>{dish.description}</Text>
                    <View style = {{flexDirection:"row", justifyContent:"center"}}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPressFav()} />
                        <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color='#0000FF'
                            onPress={() => props.openModal() } />
                    </View> 
                </Card>
         </Animatable.View>
        );
    } else {
        return ( <View></View> );
    }
}

function RenderComments(props) {
    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>
                    <Rating 
                        count={5}
                        startingValue={item.rating}
                        style={{ paddingVertical: 5 }}
                        imageSize={15} />
                </Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>  
            <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}
    
class Dishdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 3,
            author: '',
            comment: '',
            modalVisible : false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleComment = this.handleComment.bind(this);
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    toggleModal = () => { this.setState({modalVisible : !this.state.modalVisible}); }

    markFavorite = (dishId) => { this.props.postFavorite(dishId); }

    handleComment = (dishId, rating, author, comment) => {
        this.props.postComment(dishId, rating, author, comment);
        this.toggleModal();
        this.resetCommentForm();
    }

    resetCommentForm = () => {
        this.setState({
            rating: 3,
            author: '',
            comment: ''
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish 
                    dish = {this.props.dishes.dishes[+dishId]} 
                    favorite = {this.props.favorites.some(el => el === dishId)} 
                    onPressFav = {() => this.markFavorite(dishId)} 
                    openModal = {() => this.toggleModal()} 
                />
                <RenderComments comments = {this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType = {"slide"} transparent = {false}
                    visible = {this.state.modalVisible}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() } >
                    <View style = {styles.modal}>
                        <Rating 
                            showRating 
                            count={5}
                            startingValue={3}
                            onFinishRating={ (rating) => this.setState({rating: rating})}
                        />
                        <Input
                            placeholder="  Author"
                            leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                            onChangeText={ (text) => this.setState({author: text})}
                        />
                        <Input
                            placeholder=" Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={(text) => this.setState({comment: text})}
                        />
                        <Button  
                            title="SUBMIT" 
                            color="#512DA8"
                            onPress = { () => {
                                    this.handleComment(
                                        dishId,
                                        this.state.rating,
                                        this.state.author,
                                        this.state.comment
                                    );
                                }
                            }
                        />
                        <Text> </Text>
                        <Button 
                            title="CANCEL" 
                            color="grey"
                            onPress = {() => this.toggleModal()}
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);