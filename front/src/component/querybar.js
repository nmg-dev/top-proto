import React from 'react';
import moment from 'moment';

import MetricBtn from './metricbtn';
import PeriodBtn from './periodbtn';
import DropBtn from './dropbtn';

const styles = {
    querybar: {
        width: '100%',
        display: 'flex-block',
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    topRowControl: {
        display: 'inline-flex',
        minWidth: '10vw',
    },
    cardRow: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'baseline',
    },
    cardsection: {
        border: 0,
        minWidth: '10vw',
    }
}

class Querybar extends React.Component {
    constructor(ps) {
        super(ps);
        this.state = {
            category: [],
            channel: [],
            media: [],
            goal: [],
        };
    }

    render() {
        return (
            <div style={styles.querybar}>
                <div style={styles.topRow}>
                    <div style={{width: '49vw'}}>
                        <img src="/img/logo_lg.png" alt="logo-large" />
                    </div>
                    <div style={{display: 'inline-flex'}}>
                        <MetricBtn />
                        <PeriodBtn />
                    </div>
                </div>
                <div style={styles.cardRow}>
                    <DropBtn icon={<i class="fas fa-industry" />}
                        title="업종"
                        placeholder="업종 선택"
                        options={[
                            {key: 'a', label: 'A'},
                        ]} />
                    <DropBtn icon={<i class="fas fa-broadcast-tower" />}
                        title="채널" placeholder="채널 선택"
                        options={[
                            {key: 'a', label: 'A'},
                        ]} />

                    <DropBtn icon={<i class="fas fa-video" />}
                        title="광고미디어" placeholder="미디어 선택"
                        options={[
                            {key: 'a', label: 'A'},
                        ]} />
                    <DropBtn icon={<i class="fas fa-microphone" />}
                        title="목표" placeholder="목표 선택"
                        options={[
                            {key: 'a', label: 'A'},
                        ]} />
                </div>
            </div>
        );
    }
}

export default Querybar;