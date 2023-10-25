const gulp = require('gulp')
const connect = require('gulp-connect')
const yargs = require('yargs')

const root = yargs.argv.root || '.'
const port = yargs.argv.port || 8000
const host = yargs.argv.host || 'localhost'

gulp.task('reload', () => gulp.src(['index.html'])
    .pipe(connect.reload()));

gulp.task('serve', () => {

    connect.server({
        root: root,
        port: port,
        host: host,
        livereload: true
    })

    const slidesRoot = root.endsWith('/') ? root : root + '/'
    gulp.watch([
        slidesRoot + '**/*.html',
        slidesRoot + '**/*.md',
        `!${slidesRoot}**/node_modules/**`, // ignore node_modules
    ], gulp.series('reload'))
})
