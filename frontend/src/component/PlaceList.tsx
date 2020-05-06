import * as React from "react";
import * as Geohash from 'ngeohash'
import MaterialTable, {Column} from 'material-table'
import {useDispatch, useSelector} from "react-redux";
import {GlobalState, listPlaces} from "../redux/ducks";
import {useEffect} from "react";

export const PlaceList: React.FunctionComponent<Props> = ({email}) => {

    const places = useSelector((state: GlobalState) => state.selectedUserStat.places)
    const isInProgress = useSelector((state: GlobalState) => state.isInProgress)

    const columns: Array<Column<RowData>> = [
        {title: 'Name', field: 'name'},
        {title: 'Address', field: 'address'},
        {title: 'Incentive', field: 'incentive'},
        {title: 'Mission', field: 'mission', export: false},
        {title: 'Location', field: 'location', export: false},
        {title: 'NumMission', field: 'numMission', hidden: true},
        {title: 'NumSuccess', field: 'numSuccess', hidden: true},
        {title: 'Latitude', field: 'latitude', hidden: true},
        {title: 'Longitude', field: 'longitude', hidden: true},
        {title: 'GeoHash', field: 'geoHash', hidden: true}
    ]

    const data: Array<RowData> = places?.map(place => {
        const name = place.name
        const address = place.address
        const incentive = place.incentive
        const numMission = place.numMission
        const numSuccess = place.numSuccess
        const geoHash = place.id
        const latlon = Geohash.decode(place.id)
        const latitude = latlon.latitude
        const longitude = latlon.longitude

        return {
            name,
            address,
            incentive,
            numMission,
            numSuccess,
            geoHash,
            latitude,
            longitude,
            mission: `${numSuccess} / ${numMission}`,
            location: `${latitude}, ${longitude} (${place.id})`
        }
    }) ?? []

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(listPlaces(email))
    }, [dispatch, email])

    return (
        <div>
            <MaterialTable
                columns={columns}
                data={data}
                isLoading={isInProgress}
                options={{
                    showTitle: false,
                    exportButton: true,
                    exportFileName: `${email}-place.csv`,
                    paging: false
                }}
            />
        </div>
    )
}

interface RowData {
    name: string,
    address: string,
    location: string,
    incentive: number,
    mission: string,
    numMission: number,
    numSuccess: number,
    latitude: number,
    longitude: number,
    geoHash: string
}

interface Props {
    email: string
}