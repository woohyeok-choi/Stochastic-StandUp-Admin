import * as React from "react";
import MaterialTable, {Column, MTableToolbar} from 'material-table'
import {useDispatch, useSelector} from "react-redux";
import {GlobalState, listMissions} from "../redux/ducks";
import {useCallback, useEffect, useState} from "react";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import * as DateFns from 'date-fns'
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {FormControlLabel, Switch} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        toolBarControl: {
            marginLeft: theme.spacing(3)
        },
        progress: {
            marginTop: theme.spacing(5),
            display: 'flex',
            justifyContent: 'center'
        }
    })
)

export const MissionList: React.FunctionComponent<Props> = ({email}) => {
    const classes = useStyles()

    const [state, setState] = useState<State>({
        isRangeChecked: false,
        fromDate: DateFns.startOfDay(Date.now()).getTime(),
        toDate: DateFns.startOfDay(Date.now()).getTime()
    })

    const dispatch = useDispatch()

    const missions = useSelector((state: GlobalState) => state.selectedUserStat.missions)
    const isInProgress = useSelector((state: GlobalState) => state.isInProgress)

    const columns: Array<Column<RowData>> = [
        {title: 'Date', field: 'date'},
        {title: 'Time', field: 'time', export: false},
        {title: 'State', field: 'state'},
        {title: 'Incentive', field: 'incentive'},
        {title: 'Location', field: 'location', export: false},
        {title: 'PrepareTime', field: 'prepareTime', hidden: true},
        {title: 'StandByTime', field: 'standByTime', hidden: true},
        {title: 'TriggerTime', field: 'triggerTime', hidden: true},
        {title: 'ReactionTime', field: 'reactionTime', hidden: true},
        {title: 'Latitude', field: 'latitude', hidden: true},
        {title: 'Longitude', field: 'longitude', hidden: true},
        {title: 'GeoHash', field: 'geoHash', hidden: true}
    ]
    const format = "HH:mm:ss"

    const data: Array<RowData> = missions?.map(mission => {
        const date = mission.triggerTime === 0 ? "" : DateFns.format(mission.triggerTime, "yyyy-MM-dd")
        const prepareTime = mission.prepareTime
        const standByTime = mission.standByTime
        const triggerTime = mission.triggerTime
        const reactionTime = mission.reactionTime

        const startTime = DateFns.format(prepareTime, format)
        const end = Math.max(
            standByTime,
            triggerTime,
            reactionTime
        )
        const endTime = end === 0 ? "" : DateFns.format(end, format)
        const state = mission.state
        const incentive = mission.incentive
        const latitude = mission.latitude
        const longitude = mission.longitude
        const geoHash = mission.geoHash

        return {
            time: `${startTime} - ${endTime}`,
            location: `${latitude}, ${longitude} (${geoHash})`,
            incentive,
            state,
            prepareTime,
            standByTime,
            triggerTime,
            reactionTime,
            latitude,
            longitude,
            geoHash,
            date
        }
    }) ?? []

    const handleFromDateChanged = (date?: MaterialUiPickersDate) => {
        if (!date) return

        const selectedDate = date.getTime()

        setState({
            ...state,
            fromDate: selectedDate
        })
    }

    const handleToDateChanged = (date?: MaterialUiPickersDate) => {
        if (!date) return
        const selectedDate = date.getTime()

        setState({
            ...state,
            toDate: selectedDate
        })
    }

    const handleRangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            isRangeChecked: event.target.checked
        })
    }

    const loadData = useCallback((email: string, fromDate: number, toDate: number) => {
        let diffDays = DateFns.differenceInDays(toDate, fromDate)
        if (diffDays < 0) diffDays = 0

        const start = DateFns.startOfDay(fromDate).getTime()
        const end = DateFns.addDays(DateFns.startOfDay(fromDate), diffDays + 1).getTime()

        dispatch(
            listMissions(email, start, end)
        )
    }, [dispatch])


    useEffect(() => {
        loadData(email, state.fromDate, state.toDate)
    }, [email, loadData, state.fromDate, state.toDate])

    return (
        <div>

            <MaterialTable
                columns={columns}
                data={data}
                isLoading={isInProgress}
                components={{
                    Toolbar: props => (
                        <div>
                            <MTableToolbar {...props}/>
                            <FormControlLabel
                                className={classes.toolBarControl}
                                control={
                                    <Switch
                                        checked={state.isRangeChecked}
                                        onChange={handleRangeChecked}
                                        color={'secondary'}
                                    />
                                }
                                label={"Range"}
                            />
                            <KeyboardDatePicker
                                className={classes.toolBarControl}
                                variant={'inline'}
                                format={'yyyy-MM-dd'}
                                value={state.fromDate}
                                onChange={handleFromDateChanged}
                            />
                            {
                                state.isRangeChecked ?
                                    <KeyboardDatePicker
                                        className={classes.toolBarControl}
                                        variant={'inline'}
                                        format={'yyyy-MM-dd'}
                                        value={state.toDate}
                                        onChange={handleToDateChanged}
                                    /> : undefined
                            }

                        </div>
                    )
                }}
                options={{
                    showTitle: false,
                    exportButton: true,
                    exportFileName: `${email}-mission.csv`,
                    paging: false,
                }}
            />
        </div>
    )
}

interface RowData {
    date: string,
    time: string,
    state: string,
    incentive: number,
    location: string,
    prepareTime: number,
    standByTime: number,
    triggerTime: number,
    reactionTime: number,
    latitude: number,
    longitude: number,
    geoHash: string,
}

interface Props {
    email: string
}

interface State {
    isRangeChecked: boolean,
    fromDate: number,
    toDate: number
}