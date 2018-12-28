import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableRow, TableBody, TableHead, TableCell, Chip, Icon, IconButton } from '@material-ui/core';

const pallett = {
    'lowest': '#D70B49',
    'lower': '#F00C0C',
    'low': '#F0730C',
    'below': '#F0A40C',
    'average': '#F0C90C',
    'above': '#F0F00C',
    'high': '#99E00C',
    'higher': '#0AC00A',
    'highest': '#079090',
}

const boundCoeff = 20;

const styles = {}

class DataTable extends React.Component {
    constructor(props) {
        super(props);
        this._lowerBound = this.props.mean - boundCoeff*this.props.stdev;
        this._upperBound = this.props.mean + boundCoeff*this.props.stdev;
        this._boundedRange = this._upperBound - this._lowerBound;

        this._minValue = null;
        this._maxValue = null;
        this._verifyMinMax();

        this.state = {
            selecteds: this.props.selecteds,
        }
    }

    _verifyMinMax() {
        let vvs =[];
        this.props.values.forEach((v) => {
            vvs.push(v);
            if(this._minValue==null || v.score < this._minValue) this._minValue = v.score;
            if(this._maxValue==null || v.score > this._maxValue) this._maxValue = v.score;
        });

        console.log(this.props.category, this._minValue, this._maxValue, vvs);
    }

    componentWillUpdate() {
        this._verifyMinMax();
    }

    valueClassify(value) {
        if(this.props.mean <= value) {
            if(this._upperBound <= value) 
                return 'highest'; 
            else if(this._upperBound - 0.75*boundCoeff*this.props.stdev <= value) 
                return 'higher';
            else if(this._upperBound - 0.5*boundCoeff*this.props.stdev <= value)
                return 'high';
            else if(this._upperBound - 0.25*boundCoeff*this.props.stdev <= value)
                return 'above';
        }
        else {
            if(this._lowerBound >= value)
                return 'lowest';
            else if(this._lowerBound + 0.75*boundCoeff*this.props.stdev >= value)
                return 'lower';
            else if(this._lowerBound + 0.5*boundCoeff*this.props.stdev >= value)
                return 'low';
            else if(this._lowerBound + 0.25*boundCoeff*this.props.stdev >= value)
                return 'below';
        }
        return 'average';
    }

    valueRanged(value, cls) {
        let percent = value/this._maxValue;
        console.log(this.props.category, value.toFixed(4), this._minValue.toFixed(4), this._maxValue.toFixed(4), percent.toFixed(4));
        return (percent*100.0).toFixed(1)+'%';
        // if(!cls)
        //     cls = this.valueClassify(value);
        // console.log(cls, value, this._lowerBound, this._upperBound);
        // switch(cls) {
        //     case 'highest': return '100%';
        //     case 'higher': return '99%';
        //     case 'lower': return '1%';
        //     case 'lowest': return '0%';
        //     /// 
        //     case 'high':
        //     case 'above':
        //     case 'averae':
        //     case 'below':
        //     case 'low':
        //     default: 
        //         return (1+98.0*(value-this._lowerBound)/(this._boundedRange)).toFixed(1)+'%';
        // }
    }

    hasSelected(tid) {
        tid = tid.toString();
        if(!this.state.selecteds || this.state.selecteds.length<=0)
        return true;
        else 
        return 0<=this.state.selecteds.indexOf(tid);
    }
    
    resetSelecteds() {
        this.setState({selecteds: []});
    }

    getSelecteds() {
        if(!this.state.selecteds || this.state.selecteds.length<=0) {
            return null;
        } else {
            return this.state.selecteds;
        }
    }

    updateSelected(ev) {
        let tid = ev.currentTarget.getAttribute('tag_id');
        if(tid) {
            let ss = this.state.selecteds;
            if(ss.indexOf(tid)<0) {
                ss.push(tid);
                if(ss.length==this.props.values.length)
                    ss = [];
            }
            else 
                ss.splice(ss.indexOf(tid), 1);
            
            this.setState({selecteds: ss});
            // propagate parent
            this.props.onCategorySelect(ev);
        }
    }

    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{width: '25%'}}><Icon>filter_list</Icon></TableCell>
                        <TableCell style={{width: '25%'}}>Category</TableCell>
                        <TableCell style={{width: '50%'}}>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody style={{maxHeight: 300, overflowY: 'auto'}}>
                    {this.props.values.map((row) => {
                        let cls = this.valueClassify(row.score);
                        let hasSelected = this.hasSelected(row._id);
                        return (
                            <TableRow vals={row}>
                                <TableCell>
                                    <IconButton onClick={this.updateSelected.bind(this)} tag_id={row._id} category={this.props.category}>
                                        <Icon>visibility</Icon>
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <Chip tag_id={row._id} category={this.props.category}
                                        style={hasSelected
                                            ? {backgroundColor: pallett[cls], color: '#fff'} 
                                            : {backgroundColor: '#efefef', color: '#ccc' } }
                                        label={row.label}
                                    />
                                </TableCell>
                                <TableCell value={row.score}>
                                    <div style={{width: '100%', height: '100%', backgroundColor: '#efefef', borderRadius: 4}}>
                                        <div style={{
                                            width: this.valueRanged(row.score, cls), 
                                            height: '100%', 
                                            overflowX: 'visible',
                                            color: cls=='highest'||cls=='higher'?'#fff':'a0a0a0',
                                            textIndent: 8,
                                            backgroundColor: pallett[cls], 
                                            opacity: 0.9, 
                                            borderRadius: 4}}>
                                            {this.props.valueToString(row.score)}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )

                    })}
                </TableBody>
            </Table>
        );
    }
}

DataTable.propTypes = {
    category: PropTypes.string,
    values: PropTypes.arrayOf((v) => { return v.score && v.label }),
    mean: PropTypes.number,
    stdev: PropTypes.number,
    valueToString: PropTypes.func
};

export default DataTable;