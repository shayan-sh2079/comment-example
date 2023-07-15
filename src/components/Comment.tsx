import React, {useRef, useState} from "react";
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import {useAppDispatch} from "../store/hooks";
import {addComment, deleteComment} from "../store/slices/commentsSlice";

export interface CommentType {
    id: number;
    comment: string;
    replies?: CommentType[];
}

interface CommentProps {
    comment: CommentType;
    canReply?: boolean;
    parentId?: number;
}

const Comment: React.FC<CommentProps> = (props) => {
    const [isInputOpen, setIsInputOpen] = useState(false);
    const textRef = useRef<null | HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const handleReply = () => {
        setIsInputOpen(false);
        if (!!textRef.current?.value)
            dispatch(addComment({parent: props.comment.id, comment: textRef.current!.value}))
    }

    const handleDelete = () => {
        dispatch(deleteComment({parent: props.parentId, currentId: props.comment.id}))
    }

    return (
        <Box
            sx={{
                border: 1,
                width: "100%",
                py: 2,
                px: 4,
            }}
        >
            <Box
                p={2}
            >
                <Typography sx={{lineBreak: "anywhere"}}>
                    {props.comment.comment}
                </Typography>
                <Grid container justifyContent={"space-between"} mt={2}>
                    {props.canReply && !isInputOpen &&
                        <Button onClick={() => setIsInputOpen(true)}>
                            Reply
                        </Button>
                    }
                    <Button
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Grid>
                {isInputOpen &&
                    <Box sx={{width: "100%", my: 1}}>
                        <TextField
                            inputRef={textRef}
                            sx={{width: "100%", my: 1}}
                        />
                        <Button
                            onClick={handleReply}
                        >
                            Submit
                        </Button>
                        <Button
                            onClick={() => setIsInputOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Box>
                }
            </Box>

            {props.comment.replies?.map((comment =>
                <Comment comment={comment} parentId={props.comment.id} key={comment.id}/>
            ))}
        </Box>
    );

}

export default Comment;