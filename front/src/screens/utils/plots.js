import React from 'react';
import Plot from 'react-plotly.js';

class Plots {    
    pie(values, layout) {
        let pdata = { 
            values: [],
            label: [],
            type: 'pie'
        };
        Object.keys(values).forEach((vk) => {
            pdata.label.push(vk);
            pdata.values.push(values[vk]);
        });
        return (
            <Plot 
                data={pdata}
                layout={layout}
            ></Plot>
        )
    }

    bestScoredAt(scoremap, cat) {
        let scs=scoremap[cat];
        let bestAt = null;
        // search for best
        Object.keys(scs).forEach((tid) => {
            if(!bestAt || scs[bestAt].score < scs[tid].score)
                bestAt = tid;
        });
        return bestAt;
    }


    categoryValues(scoremap) {
        let sm = scoremap;
		let vs = [];		
		Object.keys(sm).forEach((tid) => {
			vs.push(sm[tid]);
        });
        
		return vs.sort((l,r) => l.score!=r.score? r.score-l.score : l.priority-r.priority);
    }

    categoryAverage(scores) {
        let average = 0;
        let cnts = 0;
        scores.forEach((v) => { average += v.score*v.count; cnts+=v.count; });
        return average/cnts;
    }

    categoryStdev(scores, average) {
        let stdev=0;
        let cnts=0;
        scores.forEach((v) => { stdev += Math.pow(average-v.score,2)*v.count; cnts+=v.count; });
        return stdev/Math.max(1, cnts-1);
    }

    categoryBars(scores, category, layout) {
        let names = [];
        let values = [];
        let errs = [];

        this.categoryValues(scores).forEach((sc) => {
            names.push(sc.label);
            values.push(sc.score);
            errs.push(sc.stdev/(sc.count+1));
        });
        

        let data = {
            type: 'bar',
            name: category,
            y: names,
            x: values,
            orientation: 'h',
            error_x: {
                type: 'data',
                array: errs,
                visible: true
            },
        };

        return (
            <Plot data={[data]} layout={layout} />
        );
    }
    
    summaryBoxes(scoremap) {
        let _data=[];
        let _mean=null;
        let _xs=[], _ys=[];

        Object.keys(scoremap).forEach((category) => {  
            let trace = {x: [], y: [], type: 'box', name: category};
            let scores = scoremap[category];
            if(!_mean) {
                let total = 0;
                let count = 0;
                Object.keys(scores).forEach((tid) => {
                    total += scores[tid].score * scores[tid].count;
                    count += scores[tid].count;
                });
                _mean = total/count;
            }

            Object.keys(scores).forEach((tid) => {
                scores[tid]._raws.forEach((sc) => {
                    trace.x.push(scores[tid].label);
                    // _xs.push(scores[tid].label)
                    // _ys.push(_mean);
                    trace.y.push(sc);
                });
            });
            _data.push(trace);
        });

        _data.push({
            // x: _xs,
            y: _ys,
            type: 'line',
            name: 'AVG.',
        });

        return (
            <Plot data={_data} layout={{
                width: window.innerWidth-20, 
                height: window.innerHeight/2,
                legend: {'orientation': 'h'},
            }} />
        );
    }
}

export default new Plots;