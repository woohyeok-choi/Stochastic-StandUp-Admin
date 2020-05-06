import * as React from 'react'
import {Tab, Tabs} from "@material-ui/core";
import {useState} from "react";
import {EventList} from "./EventList";
import {PlaceList} from "./PlaceList";
import {MissionList} from "./MissionList";

export enum ViewType {
    Events, Missions, Places
}

export const SelectedUser: React.FunctionComponent<Props> = ({email}) => {
    const [state, setState] = useState<State>({
        viewType: ViewType.Events
    })

    const handleChange = (event: React.ChangeEvent<{}>, newValue: ViewType) => {
        setState({
            ...state,
            viewType: newValue
        })
    }

    const getTabPanel = (viewType: ViewType): React.ReactNode => {
        switch (viewType) {
            case ViewType.Events:
                return <EventList email={email}/>
            case ViewType.Missions:
                return <MissionList email={email}/>
            case ViewType.Places:
                return <PlaceList email={email}/>
            default:
                return undefined
        }
    }

    return (
        <div>
            <Tabs value={state.viewType} onChange={handleChange}>
                <Tab id={"events"} label={"Events"} value={ViewType.Events}/>
                <Tab id={"missions"} label={"Missions"} value={ViewType.Missions}/>
                <Tab id={"places"} label={"Places"} value={ViewType.Places}/>
            </Tabs>
            <div>
                { getTabPanel(state.viewType) }
            </div>
        </div>
    )
}

interface State {
    viewType: ViewType
}

interface Props {
    email: string
}