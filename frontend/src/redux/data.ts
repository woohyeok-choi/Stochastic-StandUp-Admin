export interface SedentaryEvent {
    id: string,
    startTime: number,
    endTime: number,
    duration: number,
    latitude: number,
    longitude: number,
    geoHash: string
}


export const toSedentaryEvent = (payload: any): SedentaryEvent => ({
    id: payload['id'],
    startTime: payload['startTime'],
    endTime: payload['endTime'],
    duration: payload['duration'],
    latitude: payload['latitude'],
    longitude: payload['longitude'],
    geoHash: payload['geoHash']
})


export interface Mission {
    id: string,
    prepareTime: number,
    standByTime: number,
    triggerTime: number,
    reactionTime: number,
    state: string,
    latitude: number,
    longitude: number,
    geoHash: string,
    incentive: number
}

export const toMission = (payload: any): Mission => ({
    id: payload['id'],
    prepareTime: payload['prepareTime'],
    standByTime: payload['standByTime'],
    triggerTime: payload['triggerTime'],
    reactionTime: payload['reactionTime'],
    state: payload['state'],
    latitude: payload['latitude'],
    longitude: payload['longitude'],
    geoHash: payload['geoHash'],
    incentive: payload['incentive']
})

export interface PlaceStat {
    id: string,
    name: string,
    address: string,
    incentive: number,
    numVisit: number,
    numMission: number,
    numSuccess: number,
    lastVisitTime: number
}

export const toPlaceStat = (payload: any): PlaceStat => ({
    id: payload['id'],
    name: payload['name'],
    address: payload['address'],
    incentive: payload['incentive'],
    numVisit: payload['numVisit'],
    numMission: payload['numMission'],
    numSuccess: payload['numSuccess'],
    lastVisitTime: payload['lastVisitTime']
})

export interface OverallStat {
    createTime: number,
    updateTime: number,
    numPlaces: number,
    incentive: number,
    numVisit: number,
    numMission: number,
    numSuccess: number,
    numDaysMissions: number,
    lastMissionDay: number
}

export const toOverallStat = (payload: any): OverallStat => ({
    createTime: payload['createTime'],
    updateTime: payload['updateTime'],
    numPlaces: payload['numPlaces'],
    incentive: payload['incentive'],
    numVisit: payload['numVisit'],
    numSuccess: payload['numSuccess'],
    numMission: payload['numMission'],
    numDaysMissions: payload['numDaysMissions'],
    lastMissionDay: payload['lastMissionDay']
})

export const EMAIL_TO_NAME = new Map<string, string>([
    ["4401dudgus3@gmail.com", "고영현"],
    ["keonhan1171@gmail.com", "김건한"],
    ["doyoung9803@gmail.com", "김도영"],
    ["boson95@gmail.com", "김도형"],
    ["rlarlgus97@gmail.com", "김민정"],
    ["xodwk1205@gmail.com", "김보경"],
    ["qhtjd5421@gmail.com", "김보성"],
    ["js99962102@gmail.com", "김보연"],
    ["sue2368@gmail.com", "김세현"],
    ["mody3062@gmail.com", "김예린"],
    ["jjgod4490@gmail.com", "김인섭"],
    ["wjdaud923@gmail.com", "김정명"],
    ["jw950310@gmail.com", "김정우"],
    ["iplay93@gmail.com", "김현주"],
    ["hkkim1227@gmail.com", "김형근"],
    ["naeunjee7907@gmail.com", "나은지"],
    ["jiyoon0424@gmail.com", "명지윤"],
    ["jaehyuk705@gmail.com", "문재혁"],
    ["2qkrtkdfuf@naver.com", "박동훈"],
    ["kbg04191@gmail.com", "박성호"],
    ["pink0151@gmail.com", "박인영"],
    ["skypeperfectedu@gmail.com", "박재순"],
    ["pk32167@gamil.com", "박현욱"],
    ["jeesoo100412@gmail.com", "백지수"],
    ["ehdgus030212@gmail.com", "안동현"],
    ["dbtjd5567@gmail.com", "유성진"],
    ["santa3091@gmail.com", "이동은"],
    ["dlalsgud0625@gmail.com", "이민형"],
    ["dltmdqh7577@gmail.com", "이승보"],
    ["sylee0665@gmail.com", "이승윤"],
    ["bugiljaewoo@gmail.com", "이재우"],
    ["jihee931110@gmail.com", "이지희"],
    ["beskkuim@gmail.com", "장형운"],
    ["wjstnwp12345@gmail.com", "전수제"],
    ["chungp607@gmail.com", "정바울"],
    ["chungsea99@gmail.com", "정세아"],
    ["winjungle@gmail.com", "정승재"],
    ["gusrbwjd1229@gmail.com", "정현규"],
    ["cyj3141@kaist.ac.kr", "최유진"],
    ["gkswogus2437@gmail.com", "한재현"],
    ["jeehyunhong97@gmail.com", "홍지현"],
    ["gomsing1122@gmail.com", "황유진"]
])



