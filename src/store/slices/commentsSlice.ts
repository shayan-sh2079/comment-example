import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {CommentType} from "../../components/Comment";


export enum Status {
    IDLE = 'IDLE',
    LOADING ='LOADING',
    FAILED ='FAILED',
}

export interface CommentsState {
    comments: CommentType[];
    status: Status;
    totalPages: undefined | number;
}

const initialState: CommentsState = {
    comments: [],
    status: Status.LOADING,
    totalPages: undefined,
};


export const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addComment: (state, action:PayloadAction<{parent: undefined | number; comment: string;}> ) => {
            if (action.payload.parent === undefined) {
                let lastId = state.comments.at(-1)?.id || 0;

                if (state.totalPages !== undefined && state.totalPages * 10 > lastId) lastId = state.totalPages * 10;

                state.comments.push({
                    id: lastId + 1,
                    comment: action.payload.comment,
                })
            } else {
                const idx = state.comments.findIndex(comment => comment.id === action.payload.parent);
                const lastId = state.comments[idx].replies?.at(-1)?.id;
                if (lastId === undefined) {
                    state.comments[idx].replies = [{
                        id: 1,
                        comment: action.payload.comment,
                    }];
                } else {
                    // @ts-ignore
                    state.comments[idx].replies.push({
                        id: lastId + 1,
                        comment: action.payload.comment,
                    });
                }
            }
        },
        deleteComment: (state, action: PayloadAction<{parent: undefined | number; currentId: number;}>) => {
            if (action.payload.parent === undefined) {
                state.comments = state.comments.filter(comment => comment.id !== action.payload.currentId);
            } else {
                const idx =  state.comments.findIndex(comment => comment.id === action.payload.parent);
                state.comments[idx].replies = state.comments[idx].replies?.filter(comment => comment.id !== action.payload.currentId);
            }
        },
        getComments: (state, action:PayloadAction<CommentsState>) => {
            if (action.payload.status !== Status.IDLE) {
                state.status = action.payload.status;
            } else {
                state.status = action.payload.status;
                state.totalPages = action.payload.totalPages;
                action.payload.comments.forEach(comment => {
                    if (!state.comments.some(_comment => _comment.id === comment.id)) {
                        state.comments.push(comment);
                    }
                })
            }
        }
    },
});

export const { addComment, deleteComment, getComments } = commentsSlice.actions;

export const selectComments = (state: RootState) => state.comments;

export default commentsSlice.reducer;
