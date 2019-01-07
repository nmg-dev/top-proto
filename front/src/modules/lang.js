const LANG_DICT = {
    ko: {
        //
        app: '태그 오퍼레이션 v0.alpha',
        index: '인덱스',
        view: '상세보기',
        manage: '캠페인관리',
        admin: '시스템관리',

        //
        category: '업종',
        goal: '목표',
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
    constructor(lang) {
        this._dict = LANG_DICT[lang];
        this._lang = 'ko';
        if(!this._dict) {
            this._dict = LANG_DICT.ko;
        }
    }
    setDict(lang) {
       this._dict = LANG_DICT[lang]; 
       this._lang = lang;
    }

    packTags(tags) {
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

        this.setDict(this._lang);
    }

    tr(key) {
        return this._dict && this._dict[key] ? this._dict[key] : key;
    }
}

export default ModLang;