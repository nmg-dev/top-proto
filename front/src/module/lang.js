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
        device: '장치',

        channel: '채널',
        media: '매체',
        adtype: '광고유형',

        'design.layout': '레이아웃',
        'design.background': '배경',
        'design.objet': '오브제',
        'design.button': '버튼',

        'content.keytopic': '주제',
        'content.keyword': '키워드',
        'content.trigger': '트리거',
        'content.adcopy': '카피',

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
        device: 'device',

        channel: 'channel',
        media: 'ad media',
        adtype: 'ad type',

        'design.layout': 'Layout',
        'design.background': 'Background',
        'design.objet': 'Objet',
        'design.button': 'Button',

        'content.keytopic': 'Topic',
        'content.keyword': 'Keyword',
        'content.trigger': 'Trigger',
        'content.adcopy': 'Ad Copy',

        //
        from: 'from',
        till: 'till',
    }
};

const LANG_NAMES = {
    ach: "Acoli",
    af: "Afrikaans",
    ak: "Akan",
    am: "አማርኛ",
    ar: "العربية",
    ay: "Aymara",
    az: "azərbaycan",
    ban: "Balinese",
    be: "беларуская",
    bem: "Ichibemba",
    bg: "български",
    bho: "Bhojpuri",
    bn: "বাংলা",
    br: "brezhoneg",
    bs: "bosanski",
    ca: "català",
    ceb: "Cebuano",
    chr: "ᏣᎳᎩ",
    ckb: "کوردیی ناوەندی",
    co: "Corsican",
    crs: "Seselwa Creole French",
    cs: "Čeština",
    cy: "Cymraeg",
    da: "Dansk",
    de: "Deutsch",
    ee: "Eʋegbe",
    el: "Ελληνικά",
    en: "English",
    eo: "esperanto",
    es: "Español",
    et: "eesti",
    eu: "euskara",
    fa: "فارسی",
    fi: "Suomi",
    fil: "Filipino",
    fo: "føroyskt",
    fr: "Français",
    fy: "Frysk",
    ga: "Gaeilge",
    gaa: "Ga",
    gd: "Gàidhlig",
    gl: "galego",
    gn: "Guarani",
    gu: "ગુજરાતી",
    ha: "Hausa",
    haw: "ʻŌlelo Hawaiʻi",
    hi: "हिन्दी",
    hr: "Hrvatski",
    ht: "Haitian Creole",
    hu: "magyar",
    hy: "հայերեն",
    ia: "interlingua",
    id: "Indonesia",
    ig: "Igbo",
    is: "íslenska",
    it: "Italiano",
    iw: "עברית",
    ja: "日本語",
    jv: "Jawa",
    ka: "ქართული",
    kg: "Kongo",
    kk: "қазақ тілі",
    km: "ខ្មែរ",
    kn: "ಕನ್ನಡ",
    ko: "한국어",
    kri: "Krio",
    ku: "kurdî",
    ky: "кыргызча",
    la: "Latin",
    lg: "Luganda",
    ln: "lingála",
    lo: "ລາວ",
    loz: "Lozi",
    lt: "lietuvių",
    lua: "Luba-Lulua",
    lv: "latviešu",
    mfe: "kreol morisien",
    mg: "Malagasy",
    mi: "Māori",
    mk: "македонски",
    ml: "മലയാളം",
    mn: "монгол",
    mr: "मराठी",
    ms: "Melayu",
    mt: "Malti",
    my: "မြန်မာ",
    ne: "नेपाली",
    nl: "Nederlands",
    nn: "nynorsk",
    no: "norsk",
    nso: "Northern Sotho",
    ny: "Nyanja",
    nyn: "Runyankore",
    oc: "Occitan",
    om: "Oromoo",
    or: "ଓଡ଼ିଆ",
    pa: "ਪੰਜਾਬੀ",
    pcm: "Nigerian Pidgin",
    pl: "polski",
    ps: "پښتو",
    pt: "Português",
    qu: "Runasimi",
    rm: "rumantsch",
    rn: "Ikirundi",
    ro: "română",
    ru: "Русский",
    rw: "Kinyarwanda",
    sa: "Sanskrit",
    sd: "سنڌي",
    si: "සිංහල",
    sk: "Slovenčina",
    sl: "slovenščina",
    sn: "chiShona",
    so: "Soomaali",
    sq: "shqip",
    sr: "српски",
    st: "Southern Sotho",
    su: "Sundanese",
    sv: "Svenska",
    sw: "Kiswahili",
    ta: "தமிழ்",
    te: "తెలుగు",
    tg: "тоҷикӣ",
    th: "ไทย",
    ti: "ትግርኛ",
    tk: "türkmen dili",
    tlh: "Klingon",
    tn: "Tswana",
    to: "lea fakatonga",
    tr: "Türkçe",
    tt: "татар",
    tum: "Tumbuka",
    ug: "ئۇيغۇرچە",
    uk: "Українська",
    ur: "اردو",
    uz: "o‘zbek",
    vi: "Tiếng Việt",
    wo: "Wolof",
    xh: "isiXhosa",
    yi: "ייִדיש",
    yo: "Èdè Yorùbá",
    yue: "粵語",
    CN: "简体中文",
    TW: "繁體中文",
    zu: "isiZulu",
}

class ModLang {
    constructor(lang) {
        if(!lang) lang = 'ko';
        this.set(lang);
    }

    static Langs() {
        return Object.keys(LANG_DICT);
    }

    static Names() {
        return ModLang.Langs().map((lcode)=> {
            return { value: lcode, label: LANG_NAMES[lcode] };
        });
    }

    label(val) {
        if(val==null)
            return '-';
        if(val.property && val.property[this.now])
            return val.property[this.now];
        else if(val.label && LANG_DICT[this.now][val.label])
            return LANG_DICT[this.now][val.label];
        else if(val.name && LANG_DICT[this.now][val.name])
            return LANG_DICT[this.now][val.name];
        else if(typeof val==='string' && LANG_DICT[this.now][val])
            return LANG_DICT[this.now][val];
        else if(val.label)
            return val.label;
        else if(val.name)
            return val.name;
        else
            return val.toString();
    }

    set(lcode) {
        if(LANG_DICT[lcode]) {
            this.now = lcode;
            this._dict = LANG_DICT[lcode];
        }
        return this.now;
    }
}

export default ModLang;