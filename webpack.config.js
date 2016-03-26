module.exports = {
    entry: {
        vendor: ['angular', 'angular-material'],
        jupiter: ['./static/jupiter/js/index.js']
    },
    output: {
        path: __dirname + '/static/compiled/',
        filename: "[name]-bundle.js"
    }
};