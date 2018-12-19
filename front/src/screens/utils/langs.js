function trans(lang, v, defaultPropName) {
    if(v && v.i18n && v.i18n[lang])
        return v.i18n[lang];
    else if(defaultPropName)
        return v[defaultPropName];
    else if(v.label)
        return v.label;
    else if(v.name)
        return v.name;
    else
        return v;
};

function nums(k) {
    let kr = Math.floor(Math.log10(k));
    let radix = Math.floor(kr/3);
    let rres = kr%3;
    
    if(radix<=0) {
        return k.toLocaleString();
    } else {
        let ds = k/Math.pow(10,3*radix)*100;
        let suffices = ['', 'K', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
        return (ds/100).toFixed(2-rres) + suffices[radix];
    }
}

export default {
    trans: trans,
    nums: nums,
};