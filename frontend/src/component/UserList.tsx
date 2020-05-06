import * as React from 'react'
import MaterialTable, { Action, Column } from 'material-table'
import {GlobalState, listUsers} from "../redux/ducks";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { EMAIL_TO_NAME } from "../redux/data";
import * as DateFns from 'date-fns'

export const UserList: React.FunctionComponent<Props> = ({onUserClick}) => {

    const userStats = useSelector((state: GlobalState) => state.userStats)
    const isInProgress = useSelector((state: GlobalState) => state.isInProgress)

    const columns: Array<Column<RowData>> = [
        { title: 'Email', field: 'email'},
        { title: 'Name', field: 'name'},
        { title: 'Created', field: 'create'},
        { title: 'Last Updated', field: 'update'},
        { title: 'Incentive', field: 'incentive'},
        { title: '# Success', field: 'mission'},
        { title: '# Days on Mission', field: 'days'},
    ]

    const data: Array<RowData> = userStats.map(stat => ({
        email: stat.email,
        name: EMAIL_TO_NAME.get(stat.email),
        create: DateFns.format(stat.stat.createTime, "yyyy-MM-dd HH:mm:ss"),
        update: DateFns.format(stat.stat.updateTime, "yyyy-MM-dd HH:mm:ss"),
        incentive: stat.stat.incentive ?? 0,
        mission: `${stat.stat.numSuccess} / ${stat.stat.numMission}`,
        days: stat.stat.numDaysMissions,
    })).filter(value => value.name !== undefined)

    const handleClick = (event: any, rowData: RowData | RowData[]) => {
        if (!Array.isArray(rowData)) {
            const email = rowData.email
            if (email ) onUserClick?.(email)
        }
    }

    const action: Action<RowData> = {
        icon: 'details',
        onClick: handleClick
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(listUsers())
    }, [dispatch])

    return (
        <div>
            <MaterialTable
                title={"Users"}
                columns={columns}
                data={data}
                actions={[action]}
                isLoading={isInProgress}
                options={{
                    actionsColumnIndex: -1,
                    showTitle: false,
                    exportButton: true,
                    paging: false
                }}/>
        </div>
    )
}

interface RowData {
    email?: string,
    name?: string,
    create?: string,
    update?: string,
    incentive?: number,
    mission?: string,
    days?: number
}

interface Props {
    onUserClick?: (email: string) => void
}

