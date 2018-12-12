import React, { Component } from 'react';
import axios from 'axios';
import './Video.css';
import pic from './icons8-facebook-dislike-24.svg';
import pic2 from './icons8-facebook-like-24.png';
import Comments from '../Comments/Comments';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2';


class Video extends Component {
    constructor() {
        super()
        this.state = {
            videos: [],
            showVid: {},
            author: '',
            img: '',
            description: '',
            likeCount: 0,
            dislikeCount: 0,
            signedIn: false,
            userInfo: {}
        }
    }

    componentDidMount() {
        this.getVideo()
        this.getLikes()
        this.getDislikes()
        this.getUser()
    }

    
    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.getVideo()
            this.getLikes()
            this.getDislikes()
        }
    }

    getUser = () => {
        axios.get('/api/userinfo').then(res => {
            console.log("hello", res.data)
            if (res.data.user_id) {
                this.setState({
                    signedIn: true,
                    userInfo: res.data
                })
            }
        })
    }

    getVideo = () => {
        axios.get(`/api/video/${this.props.match.params.id}`).then(res => {
            console.log(6666, res.data)
            this.setState({
                showVid: res.data[0],
                author: res.data[0].channel_name,
                img: res.data[0].user_img,
                description: res.data[0].video_desc
            })
            let category = res.data[0].category
            axios.get(`/api/video-categories/${category}/${this.props.match.params.id}`).then(res => {
                this.setState({
                    videos: res.data
                })
            })
        })
    }

    getLikes = () => {
        console.log(this.props.match.params.id)
        axios.get(`/api/get-likes/${this.props.match.params.id}`).then(res => {
            this.setState({
                likeCount: res.data[0].count
            })
        })
    }

    getDislikes = () => {
        axios.get(`/api/get-dislikes/${this.props.match.params.id}`).then(res => {
            console.log(res.data)
            this.setState({
                dislikeCount: res.data[0].count
            })
        })
    }

    likeVideo = () => {
        let video_id = this.props.match.params.id
        let likeDislike = true
        let {signedIn} = this.state
        if(!signedIn){
            Swal ({
                type: 'warning',
                title: 'Oops',
                text: 'Sign in to access this feature'
            })
        } else {
            axios.post(`/api/like-dislike`, {video_id, likeDislike}).then(res => {
                this.getLikes()
                this.getDislikes()
    
            })
        }
    }

    dislikeVideo = () => {
        let video_id = this.props.match.params.id
        let likeDislike = false
        let {signedIn} = this.state
        if(!signedIn){
            Swal ({
                type: 'warning',
                title: 'Oops',
                text: 'Sign in to access this feature'
            })
        } else {
            axios.post(`/api/like-dislike`, {video_id, likeDislike}).then(res => {
                this.getLikes()
                this.getDislikes()
            })
        }
    }

    render() {
        console.log(this.props)
        let categoryList = this.state.videos.map((list, i) => {
            let user = ''
            if(list.channel_name){
                user = list.channel_name
            } else {
                user = `${list.first_name} ${list.last_name}`
            }
            return (
                <div className='suggested-list' key={i}>
                    <Link to={`/video/${list.video_id}`}><video id="thumbnail" src={list.video_url}></video></Link>
                    <div className='category-desc'>
                        <h4>{list.title}</h4>
                        <p id="sug-auth">{user}</p>
                        <p id="sug-v-count">{list.view_count} views</p>
                    </div>
                </div>
            )
        })

        return (
            <div className="Video">
                <div className="player">
                    <video className="vid" controls src={this.state.showVid.video_url}></video>
                    <h4 id="titulo">{this.state.showVid.title}</h4>
                    <div className="views-n-likes">
                        <span><p id="xxxx">{this.state.showVid.view_count} views</p></span>
                        <div className="likes">
                            <div className="likebox">
                                <button onClick={this.likeVideo} id="like-button"><img src={pic2} alt="" /></button>
                                <p>{this.state.likeCount}</p>
                            </div>
                            <div className="dislikebox">
                                <button onClick={this.dislikeVideo} id="dislike-button"><img src={pic} alt="" /></button>
                                <p>{this.state.dislikeCount}</p>
                            </div>
                        </div>
                    </div>
                    <div id="line-thing"></div>
                    <div className="author-n-descrip">
                        <div className="upperTier">
                            <div className="user-piccc">
                                <img id="com-pic" src={this.state.img} alt=""/>
                            </div>
                            <div className="author-area">
                                <h3 id="author-text">{this.state.author}</h3>
                            </div>
                        </div>
                        <div className="vid-description">
                            {this.state.description}
                        </div>
                    </div>
                    <br/>
                    <div id="line-thing"></div>
                    <Comments video_id={this.props.match.params.id}/>
                </div>
                <div className='category-list'>
                    {categoryList}
                </div>
                
            </div>
        )
    }
}

export default Video;