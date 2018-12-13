import React, { Component } from 'react';
import axios from 'axios';
import './Video.css';
import pic from './icons8-facebook-dislike-24.svg';
import pic2 from './icons8-facebook-like-24.png';
import likedIcon from './like.svg'
import dislikedIcon from './dislike.svg'
import Comments from '../Comments/Comments';
import {Link} from 'react-router-dom';

class Video extends Component {
    constructor() {
        super()
        this.state = {
            videos: [],
            showVid: {},
            clickedLike: false,
            clickedDislike: false,
            likeCount: 0,
            dislikeCount: 0
        }
    }

    componentDidMount() {
        this.getVideo()
        this.getLikes()
        this.getDislikes()   
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            this.getVideo()
            this.getLikes()
            this.getDislikes()
        }
    }

    getVideo = () => {
        axios.get(`/api/video/${this.props.match.params.id}`).then(res => {
            this.setState({
                showVid: res.data[0]
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
        console.log(video_id)
        axios.post(`/api/like-dislike`, {video_id, likeDislike}).then(res => {
            this.getLikes()
            this.getDislikes()
        })
    }

    dislikeVideo = () => {
        let video_id = this.props.match.params.id
        let likeDislike = false
        axios.post(`/api/like-dislike`, {video_id, likeDislike}).then(res => {
            this.getLikes()
            this.getDislikes()
        })
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
                        <span><p>{this.state.showVid.view_count} views</p></span>
                        <div className="likes">
                            <div className="likebox">
                                <button onClick={this.likeVideo} id="like-button"> <img src={pic2} alt="" /></button>
                                <p>{this.state.likeCount}</p>
                            </div>
                            <div className="dislikebox">
                                <button onClick={this.dislikeVideo} id="dislike-button"><img src={pic} alt="" /></button>
                                <p>{this.state.dislikeCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="author-n-descrip">
                        <div>
                            <div className="user-piccc">
                                img
                            </div>
                            <div className="author-area">
                                author
                            </div>
                        </div>
                        <div className="vid-description">
                            descrip3
                        </div>
                    </div>
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