import React from 'react';
import moment from 'moment';

function DateSpan({ date }: { date: string }) {
    return (
        <span>{moment(date).format('DD MMM YYYY HH:mm')}</span>
    );
}

export default DateSpan;
