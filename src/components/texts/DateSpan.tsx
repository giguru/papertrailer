import React from 'react';
import moment from 'moment';

function DateSpan({ date }: { date: string }) {
    return (
        <div>{moment(date).format('DD MMM YYYY HH:mm')}</div>
    );
}

export default DateSpan;
