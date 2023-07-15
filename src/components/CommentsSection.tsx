import {Box, Button, CircularProgress, TextField, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {addComment, CommentsState, selectComments, Status} from "../store/slices/commentsSlice";
import Comment from "./Comment";
import React, {useEffect, useRef, useState} from "react";
import {sagaActions} from "../store/sagas/sagaActions";

const CommentsSection = () => {
    const [page, setPage] = useState(1)
    const textRef = useRef<null | HTMLInputElement>(null);

    const commentsData : CommentsState = useAppSelector(selectComments);
    const dispatch = useAppDispatch();

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const containerHeight = e.currentTarget.clientHeight;
        const scrollHeight = e.currentTarget.scrollHeight - 2;
        const scrollTop = e.currentTarget.scrollTop;

        if (
            commentsData.totalPages !== undefined
            && containerHeight + scrollTop >= scrollHeight
            && commentsData.status !== Status.LOADING
            && page < commentsData.totalPages
        ) {
            setPage(prev => prev + 1);
        }
    }

    const handleSubmit = () => {
        if (!!textRef.current?.value) {
            dispatch(addComment({parent: undefined, comment: textRef.current!.value}))
            textRef.current.value = "";
        }
    }

    useEffect(() => {
        dispatch({ type: sagaActions.FETCH_COMMENTS, action: {page} })
    },[dispatch, page])

    return (
        <Box
            component={"section"}
            sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                py: 3,
                px: 5,
                height: "100vh",
                alignContent: "flex-start",
            }}
        >
            <Box sx={{width: "100%", my: 1}}>
                <Typography>
                    Add a comment
                </Typography>
                <TextField
                    inputRef={textRef}
                    sx={{width: "100%", my: 1}}
                />
                <Button
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
            {commentsData.comments.length === 0 ?
                (commentsData.status === Status.IDLE &&
                    <Typography color={"warning"}>
                        There are no comments
                    </Typography>
                )
                :
                <Box
                    sx={{
                        height: "70vh",
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        overflow: "auto",
                        p: 1,
                        border: 1,
                    }}
                    onScroll={handleScroll}
                >
                    {commentsData.comments.map(comment =>
                        <Comment comment={comment} canReply key={comment.id}/>
                    )}
                </Box>
            }
            {commentsData.status === Status.LOADING && <CircularProgress/>}
            {commentsData.status === Status.FAILED && <Typography color={"error"}>An error has been occurred</Typography>}
        </Box>
    );
}

export default CommentsSection;