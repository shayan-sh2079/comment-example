import {call, put, takeEvery} from 'redux-saga/effects'
import {sagaActions} from './sagaActions'
import {CommentType} from "../../components/Comment";
import {data} from "../../data/data";
import {getComments, Status} from "../slices/commentsSlice";

interface MockReturn {
    data: CommentType[];
    totalPages: number;
}
type Action = {type: string, action: { page: number }}

// A mock function to mimic making an async request for data
function fetchComments(page: number) {
    return new Promise<MockReturn>((resolve) =>
        setTimeout(() => {
            let slicedData : CommentType[] = [];
            const startIdx = (page - 1) * 10, endIdx = page * 10;

            if (endIdx <= data.length) {
                slicedData = data.slice(startIdx, endIdx )
            } else if (startIdx < data.length) {
                slicedData = data.slice(startIdx, data.length)
            }

            resolve({data: slicedData, totalPages: data.length / 10})
        }, 1000)
    );
}

export function* fetchCommentsSaga(action: Action) {
    try {
        yield put(getComments({comments: [], totalPages: undefined, status: Status.LOADING}))
        let result: MockReturn = yield call(
            async () => await fetchComments(action.action.page)
        )
        yield put(getComments({comments: result.data, totalPages: result.totalPages, status: Status.IDLE}))
    } catch (e) {
        yield put(getComments({comments: [], totalPages: undefined, status: Status.FAILED}))
    }
}

export default function* rootSaga() {
    yield takeEvery(sagaActions.FETCH_COMMENTS, fetchCommentsSaga)
}