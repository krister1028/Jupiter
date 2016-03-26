module.exports = {
    entry: {
        vendor: ['angular', 'angular-material'],
        jupiter: ['./scheduler/frontend/index.js']
    },
    output: {
        path: __dirname + '/static/compiled/',
        filename: "[name]-bundle.js"
    }
};