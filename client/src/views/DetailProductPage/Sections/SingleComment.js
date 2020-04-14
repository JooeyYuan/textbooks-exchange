import React from 'react'
import { Comment, Avatar} from 'antd';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {
    const actions = [
        <LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.fullname}
                avatar={
                    <Avatar
                        src={props.comment.writer.image}
                        alt="image"
                    />
                }
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
            ></Comment>
        </div>
    )
}

export default SingleComment