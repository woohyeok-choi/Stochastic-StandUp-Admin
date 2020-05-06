import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GlobalState, listEvents} from "../redux/ducks";
import {KeyboardDatePicker} from '@material-ui/pickers'
import MaterialTable, {Column, MTableToolbar} from 'material-table'
import * as DateFns from 'date-fns'
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
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

export const EventList: React.FunctionComponent<Props> = ({email}) => {
    const classes = useStyles()

    const [state, setState] = useState<State>({
        isRangeChecked: false,
        fromDate: DateFns.startOfDay(Date.now()).getTime(),
        toDate: DateFns.startOfDay(Date.now()).getTime()
    })

    const dispatch = useDispatch()

    const events = useSelector((state: GlobalState) => state.selectedUserStat.events)
    const isInProgress = useSelector((state: GlobalState) => state.isInProgress)

    const columns: Array<Column<RowData>> = [
        {title: 'Date', field: 'date'},
        {title: 'Time', field: 'time', export: false},
        {title: 'Duration', field: 'durationStr', export: false},
        {title: 'Location', field: 'location', export: false},
        {title: 'StartTime', field: 'startTime', hidden: true},
        {title: 'EndTime', field: 'endTime', hidden: true},
        {title: 'Duration', field: 'duration', hidden: true},
        {title: 'Latitude', field: 'latitude', hidden: true},
        {title: 'Longitude', field: 'longitude', hidden: true},
        {title: 'GeoHash', field: 'geoHash', hidden: true}
    ]

    const data: Array<RowData> = events?.map(event => {
        const date = DateFns.format(event.startTime, "yyyy-MM-dd")
        const startTime = DateFns.format(event.startTime, "HH:mm:ss")
        const endTime = event.endTime <= Date.now() ? DateFns.format(event.endTime, "HH:mm:ss") : ""
        const duration = Math.floor(event.duration / 1000 / 60)
        const latitude = event.latitude
        const longitude = event.longitude
        const geoHash = event.geoHash
        return {
            time: `${startTime} - ${endTime}`,
            location: `${latitude}, ${longitude} (${geoHash})`,
            durationStr: `${duration} min.`,
            startTime: event.startTime,
            endTime: event.endTime,
            duration: event.duration,
            date,
            latitude,
            longitude,
            geoHash
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
        let start: number | Array<number>
        let end: number | Array<number>

        let diffDays = DateFns.differenceInDays(toDate, fromDate)
        if (diffDays < 0) diffDays = 0

        start = []
        end = []

        for (let i = 0; i <= diffDays; i++) {
            const s = DateFns.addDays(DateFns.startOfDay(fromDate), i).getTime()
            const e = DateFns.addDays(DateFns.startOfDay(fromDate), i + 1).getTime()
            start.push(s)
            end.push(e)
        }

        dispatch(
            listEvents(email, start, end)
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
                    exportFileName: `${email}-event.csv`,
                    paging: false,
                }}
            />
        </div>
    )
}

interface RowData {
    date?: string,
    time?: string,
    location?: string,
    durationStr?: string,
    startTime: number,
    endTime: number,
    duration: number,
    latitude: number,
    longitude: number,
    geoHash: string
}

interface Props {
    email: string
}

interface State {
    fromDate: number,
    toDate: number
    isRangeChecked: boolean
}