import {
    Mission,
    OverallStat,
    PlaceStat,
    SedentaryEvent,
    toOverallStat,
    toMission,
    toSedentaryEvent, toPlaceStat
} from "./data";
import axios from 'axios'
import {call, put, takeEvery} from 'redux-saga/effects'
const PREFIX = 'stochastic-stand-up/admin/'
const HOST_URL = "http://localhost:8080"

/** STATE **/

export interface UserStat {
    email: string,
    stat: OverallStat,
}

export interface SelectedUserStat {
    email?: string,
    stat?: OverallStat,
    events?: Array<SedentaryEvent>,
    missions?: Array<Mission>,
    places?: Array<PlaceStat>
}

export interface GlobalState {
    isInProgress: boolean,
    userStats: Array<UserStat>,
    selectedUserStat: SelectedUserStat
}

/** FETCH **/

const FETCH_REQUESTED = `${PREFIX}fetch-requested`
const FETCH_IN_PROGRESS = `${PREFIX}fetch-in-progress`
const FETCH_SUCCESS = `${PREFIX}fetch-success`
const FETCH_FAILURE = `${PREFIX}fetch-failure`

interface FetchRequestedAction {
    type: typeof FETCH_REQUESTED,
    query: string,
    email?: string,
    requestType: RequestType,
    url: string,
    data?: any,
    transform?: (payload: any) => any
}

enum RequestType { GET, POST }

interface FetchInProgressAction {
    type: typeof FETCH_IN_PROGRESS,
    query: string,
    email?: string
}

interface FetchSuccessAction<T> {
    type: typeof FETCH_SUCCESS,
    query: string,
    email?: string,
    result?: T
}

interface FetchFailureAction {
    type: typeof FETCH_FAILURE,
    query: string,
    email?: string,
    reason?: any
}

type Action = FetchInProgressAction | FetchSuccessAction<any> | FetchFailureAction

const fetchInProgress = (query: string, email?: string): FetchInProgressAction => ({
    type: FETCH_IN_PROGRESS,
    query,
    email
})

const fetchSuccess = <T>(query: string, email?: string, result?: T): FetchSuccessAction<T> => ({
    type: FETCH_SUCCESS,
    query,
    email,
    result
})

const fetchFailure = (query: string, email?: string, reason?: any): FetchFailureAction => ({
    type: FETCH_FAILURE,
    query,
    email,
    reason
})

function* fetch(action: FetchRequestedAction) {
    const {query, requestType, url, data, transform, email} = action
    yield put(fetchInProgress(query, email))

    const request = requestType === RequestType.GET ? axios.get : axios.post
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    try {
        const response = yield call(request, url, data, config)
        let result
        if (transform) {
            result = transform(response.data)
        } else {
            result = response.data
        }
        yield put(fetchSuccess(query, email, result))
    } catch (reason) {
        yield put(fetchFailure(query, email, reason))
    }
}

const buildQueryString = (map: Map<string, any | undefined>): string =>
    Array.from(map.keys()).filter(
        key => map.get(key) !== undefined
    ).map(key => `${key}=${map.get(key)}`).join("&")


/**
 * List Users
 */
const QUERY_LIST_USERS = `${PREFIX}list-users`

export const listUsers = (): FetchRequestedAction => {
    const transform = (payload: any): Array<UserStat> => Object.keys(payload).map(value => ({
        email: value,
        stat: toOverallStat(payload[value])
    }))

    return {
        type: FETCH_REQUESTED,
        query: QUERY_LIST_USERS,
        requestType: RequestType.GET,
        url: `${HOST_URL}/users`,
        transform
    }
}


/**
 * List Events
 */
const QUERY_LIST_EVENTS = `${PREFIX}list-events`

export const listEvents = (
    email: string,
    fromTime: number | Array<number>,
    toTime: number | Array<number>,
    limit?: number
): FetchRequestedAction => {
    const transform = (payload: Array<any>): Array<SedentaryEvent> => payload.map(value => (toSedentaryEvent(value)))

    const query = new Map<string, any>([
        ['fromTime', fromTime],
        ['toTime', toTime],
        ['limit', limit]
    ])

    console.log(query)

    return {
        type: FETCH_REQUESTED,
        query: QUERY_LIST_EVENTS,
        requestType: RequestType.GET,
        url: `${HOST_URL}/users/${email}/events?${buildQueryString(query)}`,
        transform,
        email
    }
}


/**
 * List Missions
 */
const QUERY_LIST_MISSIONS = `${PREFIX}list-missions`

export const listMissions = (
    email: string,
    fromTime: number,
    toTime: number,
    limit?: number
): FetchRequestedAction => {
    const transform = (payload: Array<any>) : Array<Mission> => payload.map(value => toMission(value))
    const query = new Map([
        ['fromTime', fromTime],
        ['toTime', toTime],
        ['limit', limit]
    ])
    return {
        type: FETCH_REQUESTED,
        query: QUERY_LIST_MISSIONS,
        requestType: RequestType.GET,
        url: `${HOST_URL}/users/${email}/missions?${buildQueryString(query)}`,
        transform,
        email
    }
}

/**
 * List Places
 */
const QUERY_LIST_PLACES = `${PREFIX}list-places`

export const listPlaces = (
    email: string,
    limit?: number
): FetchRequestedAction => {
    const transform = (payload: Array<any>) => payload.map(value => toPlaceStat(value))
    const query = new Map([
        ['limit', limit]
    ])
    return {
        type: FETCH_REQUESTED,
        query: QUERY_LIST_PLACES,
        requestType: RequestType.GET,
        url: `${HOST_URL}/users/${email}/places?${buildQueryString(query)}`,
        transform,
        email
    }
}

export const reducer = (state: GlobalState = {
    isInProgress: false,
    userStats: [],
    selectedUserStat: {}
}, action: Action): GlobalState => {
    switch (action.type) {
        case FETCH_IN_PROGRESS:
            return {...state, isInProgress: true}
        case FETCH_SUCCESS:
            let success
            switch (action.query) {
                case QUERY_LIST_EVENTS:
                    success = action as FetchSuccessAction<Array<SedentaryEvent>>
                    return {
                        ...state,
                        isInProgress: false,
                        selectedUserStat: {
                            ...state.selectedUserStat,
                            events: success.result
                        }
                    }
                case QUERY_LIST_MISSIONS:
                    success = action as FetchSuccessAction<Array<Mission>>
                    return {
                        ...state,
                        isInProgress: false,
                        selectedUserStat: {
                            ...state.selectedUserStat,
                            missions: success.result
                        }
                    }
                case QUERY_LIST_PLACES:
                    success = action as FetchSuccessAction<Array<PlaceStat>>
                    return {
                        ...state,
                        isInProgress: false,
                        selectedUserStat: {
                            ...state.selectedUserStat,
                            places: success.result
                        }
                    }
                case QUERY_LIST_USERS:
                    success = action as FetchSuccessAction<Array<UserStat>>
                    return {...state, isInProgress: false, userStats: success.result ?? []}
                default:
                    return {...state, isInProgress: false}
            }
        case FETCH_FAILURE:
            return {...state, isInProgress: false}
        default:
            return state
    }
}

export default function* rootSaga() {
    yield takeEvery(FETCH_REQUESTED, fetch)
}


