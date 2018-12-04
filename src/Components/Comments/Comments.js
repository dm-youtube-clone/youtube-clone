import React, { Component } from 'react';
import './Comments.css';
import axios from 'axios'


class Comments extends Component {
    constructor() {
        super()
        this.state = {
            userInfo: {},
            comments: [],
            writeComment: false
        }
    }
    componentDidMount() {
        axios.get(`/api/comments/${this.props.video_id}`).then(res => {
            this.setState({
                comments: res.data
            })
        })
        axios.get(`/api/userinfo`).then(res=>{
            this.setState({
                userInfo: res.data
            })
        })
    }
    render() {
        let commentsDisplay = this.state.comments.map((comment, i) => {
            return (<div key={i}>
                <div>
                    <div><img src={comment.user_img}></img></div>
                </div>
                <div>
                    <div>{comment.first_name} {comment.last_name}</div>
                    <div>{comment.comment}</div>
                </div>
            </div>)
        })

        return (
            <div className='comments'>
                <div>
                    <h1>Comments: {this.state.comments.length}</h1>
                </div>
                <div>
                    <img src={this.state.userInfo.picture}></img>
                    <input placeholder='Add a public comment...'></input>
                </div>
                <div>
                    {commentsDisplay}
                </div>
            </div>
        )
    }
}

export default Comments;