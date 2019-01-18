import React from 'react';

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
            <div className="querybar">
                <div className="querybar-top">
                    <div className="querybar-title">
                        <h1>Tag Operation<sup>Beta</sup></h1>
                    </div>
                    <div className="querybar-controls">
                        {this.props.tops}
                    </div>
                </div>
                <div className="querybar-mid">
                    {this.props.mids}
                </div>
                <div className="querybar-bottom categorybar">
                    {this.props.bottoms}
                </div>
            </div>
        );
    }
}

export default Querybar;