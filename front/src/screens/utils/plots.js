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
        scores.forEach((v) => { average += v.score/scores.length; });
        return average;
    }

    categoryStdev(scores, average) {
        let stdev=0;
        scores.forEach((v) => { stdev += Math.pow(average-v.score,2)/scores.length; });
        return stdev;
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
            x: names,
            y: values,
            error_y: {
                type: 'data',
                array: errs,
                visible: true
            },
        };
        console.log(category, data);

        return (
            <Plot data={[data]} layout={layout} />
        );
    }
}

export default new Plots;