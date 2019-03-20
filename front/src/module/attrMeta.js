const CATEGORY_INDUSTRY = 'category';

class AttributeMeta {
    static CATEGORY = {
        industry: CATEGORY_INDUSTRY
    };
    
    constructor(mk, classes) {
        this._mk = mk;
        this._clss = classes;
    }

    classes() {
        return this._clss;
    }


    static Config = new AttributeMeta('config', [CATEGORY_INDUSTRY, 'device', 'media', 'adtype']);
    static Design = new AttributeMeta('design', ['design.layout', 'design.objet', 'design.background', 'design.button',]);
    static Message = new AttributeMeta('message', ['content.keytopic', 'content.keyword', 'content.trigger', 'content.adcopy',]);
    static ALL = [
        AttributeMeta.Design, 
        AttributeMeta.Message,
        AttributeMeta.Config,
    ];
    static __ALLCLSs;
    static AllClasses() {
        if(!AttributeMeta.__ALLCLSs)
            AttributeMeta.__ALLCLSs = AttributeMeta.ALL
                .reduce((arr, am) => arr.concat(am.classes()), []);
        return AttributeMeta.__ALLCLSs;
    }
    static PredefinedClasses() {
        return AttributeMeta.Design.classes()
            .concat(AttributeMeta.Message.classes());
    }
}

export default AttributeMeta;