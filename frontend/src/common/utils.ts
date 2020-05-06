import {LocalDate} from "@js-joda/core";

export const formatDateTime = (millis?: number): string | undefined => {

    if (!millis) return undefined

    const date = new Date(millis)

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export const millisToMinute = (millis?: number) : number | undefined => {
    if (!millis) return undefined

    const MINUTE_MILLIS = 1000 * 60 * 60
    return Math.floor(millis / MINUTE_MILLIS)
}

export const millisToLocalDate = (millis: number) : LocalDate => {
    const date = new Date(millis)

    return LocalDate.of(date.getFullYear(), date.getMonth(), date.getDate())
}

