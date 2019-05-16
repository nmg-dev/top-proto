
const GOOGLE_API_SCRIPT = 'https://apis.google.com/js/platform.js';
// const GOOGLE_API_KEY = '';
const GOOGLE_CLIENT_ID = '812043764419-lunbnv3g64rg709da2ad6asnqg05c7oi.apps.googleusercontent.com';

class Utils {
    static html(tag, attrs) {
        let el = document.createElement(tag);
        Object.keys(attrs).forEach((ak) => {
            el.setAttribute(ak, attrs[ak]);
        });
        return el;
    }

    static gauth() {
        let meta = this.html('meta', {
            name: 'google-signin-client_id',
            content: GOOGLE_CLIENT_ID,
        });
        document.head.appendChild(meta);
    
        let src = this.html('script', {
            async: '', defer: '',
            src: GOOGLE_API_SCRIPT,
        });
        // src.addEventListener('load', onGoogleApiScriptLoaded);
        document.head.appendChild(src);
    }
}

export default Utils;