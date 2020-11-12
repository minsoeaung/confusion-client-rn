import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';


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

    if(dish!=null) {

        return (
            <View>
                <Card featuredTitle = {dish.name} image = {{uri: baseUrl + dish.image}}>
                    <Text style = {{margin: 10}}>{dish.description}</Text>
                    <View style = {{flexDirection:"row", justifyContent:"center"}}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPressFav()}
                        />
                        <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color='#0000FF'
                            onPress={() => props.onPressPencil() }
                        />
                    </View> 
                </Card>
         </View>
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
                        imageSize={15}
                    />
                </Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
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

    handleComment(dishId, rating, author, comment) {
        this.props.postComment(dishId, rating, author, comment);
        this.toggleModal();
        this.resetCommentForm();
    }

    resetCommentForm() {
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
                    onPressPencil = {() => this.toggleModal()}
                />
                <RenderComments 
                    comments = {this.props.comments.comments.filter((comment) => comment.dishId === dishId)}
                />
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