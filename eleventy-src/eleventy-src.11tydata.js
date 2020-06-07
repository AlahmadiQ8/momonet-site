const glob = require('glob');

module.exports = () =>{

    const jsFiles = glob.sync('**/*.js', { cwd: 'build' });
    const cssFiles = glob.sync('**/*.css', { cwd: 'build' });

    return {
        layout: 'layouts/base.njk',
        jsFiles,
        cssFiles
    };
};
