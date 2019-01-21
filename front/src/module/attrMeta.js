class AttributeMeta {
    constructor(mk, classes) {
        this._mk = mk;
        this._clss = classes;
    }

    classes() {
        return this._clss;
    }


    static Config = new AttributeMeta('config', ['category', 'channel', 'media', 'goal']);
    static Design = new AttributeMeta('design', ['layout', 'objet', 'background', 'button',]);
    static Message = new AttributeMeta('message', ['keytopic', 'keyword', 'trigger', 'adcopy',]);
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
}

export default AttributeMeta;