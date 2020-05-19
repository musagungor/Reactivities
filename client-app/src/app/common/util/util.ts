import { IUser } from './../../models/user';
import { IActivity, IAttendee } from './../../models/activity';
export const combineDateAndTime = (date: Date, time: Date) => {
    const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const dateString = `${year}-${month}-${day}`;

    return new Date(dateString + ' ' + timeString);

}

export const setActivityProps = (activity: IActivity, user: IUser) => {
    activity.date = new Date(activity.date);
    activity.isGoing = activity.attendees.some(a => a.username === user.username);
    activity.isHost = activity.attendees.some(a => a.isHost && a.username === user.username);
    return activity;
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.username,
        image: user.image!
    }

}