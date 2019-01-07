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

        // option values
        'layout.left': '좌측', 'layout.right': '우측', 'layout.center': '중앙', 'layout.between': '좌우',
        'background.blank': '공백', 'background.solid': '단색', 'background.split': '면분할', 'background.image': '이미지',
        'objet.picture': '사진', 'objet.illust': '일러스트', 'objet.model': '모델',
        'lead.time': '타임형', 'lead.benefit': '혜택형', 'lead.persuade': '유도형',




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

        'layout.left': 'Text Left', 'layout.right': 'Text Right', 'layout.center': 'Text Center', 'layout.between': 'Image between text',
        'background.blank': 'Blank', 'background.solid': 'Solid', 'background.split': 'Split area', 'background.image': 'Image',
        'objet.picture': 'Picture', 'objet.illust': 'Illustration', 'objet.model': 'Models',
        'lead.time': 'Time', 'lead.benefit': 'Beneficial', 'lead.persuade': 'Persuade',

        //
        from: 'from',
        till: 'till',
    }
};

class Locale {
    constructor(lang) {
        this._dict = LANG_DICT[lang];
        if(!this._dict)
            this._dict = LANG_DICT.ko;
    }
    setDict(lang) {
       this._dict = LANG_DICT[lang]; 
    }

    tr(key) {
        console.log(this._dict[key]);
        return this._dict && this._dict[key] ? this._dict[key] : key;
    }
}

export default Locale;