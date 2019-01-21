const LANG_DICT = {
    ko: {
        //
        app: '태그 오퍼레이션 v0.alpha',
        index: '대시보드',
        view: '상세보기',
        manage: '캠페인관리',
        admin: '시스템관리',

        //
        cid: '캠페인ID',
        date: '날짜',
        impression: '노출',
        click: '클릭',
        conversion: '전환',
        cost: '비용 (한국 원)',

        category: '업종',
        goal: '광고목표',
        channel: '채널',
        media: '매체',

        layout: '레이아웃',
        background: '배경',
        objet: '오브제',
        lead: '카피',

        //
        from: '기간 시작',
        till: '기간 종료',
    },
    en: {
        //
        app: 'TAG OPERATION',
        index: 'index',
        view: 'view',
        manage: 'manage',
        admin: 'admin',

        //
        cid: 'campaign ID',
        date: 'Date',
        impression: 'Impressions',
        click: 'Clicks',
        conversion: 'Conversions',
        cost: 'Cost (KRW)',
        //
        category: 'category',
        goal: 'goal',
        channel: 'channel',
        media: 'ad media',

        layout: 'layout',
        background: 'background',
        objet: 'objet',
        lead: 'copy text',

        //
        from: 'from',
        till: 'till',
    }
};

const LANGUAGE_KEYS = [
    'ko', 'en'
];

class ModLang {
    static currentDict;
    static currentLang = 'ko';
    static setDict(lang) {
       this._dict = LANG_DICT[lang]; 
       this._lang = lang;
    }

    static packTags(tags) {
        tags.forEach((t) => {
            if(t.property) {
                Object.keys(LANG_DICT).forEach((l) => {
                    if(t.property[l]) {
                        let _k = t.class + '.' + t.name;
                        LANG_DICT[l][_k] = t.property[l];
                    }
                });
            }
        });

        ModLang.currentDict = LANG_DICT[l];
    }

    static tr(key) {
        if(ModLang.currentDict[key]) {
            return ModLang.currentDict[key];
        }
    }
}

export default ModLang;