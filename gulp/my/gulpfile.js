// 引入 gulp
var gulp = require('gulp');

// 引入组件
var less = require('gulp-less'), // less
    sass = require('gulp-sass'), // sass
    jshint = require('gulp-jshint'), // js代码校验
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'), // js压缩
    concat = require('gulp-concat'), // 合并文件
    rename = require('gulp-rename'), // 重命名
    gulpif = require('gulp-if'),
    autoprefixer = require('gulp-autoprefixer'), // 自动添加css前缀
    notify = require('gulp-notify'), // 更改提醒
    clean = require('gulp-clean'); //清空文件夹

// sass的编译                  （gulp-ruby-sass）
// 压缩图片                    （gulp-imagemin）
// 自动刷新页面                 （gulp-livereload）
// 图片缓存，只有图片替换了才压缩  （gulp-cache）
// 清除文件                    （del）

// 是否上线
var isProd = false;

// var gulp = require('gulp'),
//     gulpLoadPlugins = require('gulp-load-plugins'),
//     plugins = gulpLoadPlugins();


// 检查脚本：Link任务会检查js/目录下得js文件有没有报错或警告。
gulp.task('lint', function () {
    //gulp.src('./js/*.js')
    gulp.src('./static/scripts/js.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 编译Sass：Sass任务会编译scss/目录下的scss文件，并把编译完成的css文件保存到/css目录中。
gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css'));
});

// less解析
gulp.task('build-less', function () {
    // gulp.src('./javis/static/less/lib/s-production.less')
    gulp.src('./static/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('./build/css'))
});

// 合并、压缩、重命名css
gulp.task('styles', function () {
    // gulp.src(['./build/css/*.css', '!./javis/static/build/css/areaMap.css'])
    gulp.src('./static/css/*.less')
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))   // ????
        .pipe(rename({suffix: '.min'}))
        .pipe(gulpif(isProd, minifycss()))
        .pipe(gulp.dest('./static/css/'))

        .pipe(notify({message: 'Styles task complete'}));
});

// 合并，压缩文件:scripts任务会合并js/目录下得所有得js文件并输出到dist/目录，然后gulp会重命名、压缩合并的文件，也输出到dist/目录。
gulp.task('scripts', function () {
    gulp.src('./static/scripts/js.js')
        // .pipe(concat('all.js'))
        // .pipe(gulp.dest('./build'))
        .pipe(rename('js.min.js'))
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulp.dest('./static/scripts/'))
        .pipe(notify({message: 'Scripts task complete'}));
});

// 清空图片、样式、js
gulp.task('clean', function () {
    return gulp.src(['./build'], {
        read: false
    }).pipe(clean({
        force: true
    }));
});


// 将bower的库文件对应到指定位置
gulp.task('buildlib',function(){

  gulp.src('./bower_components/angular/angular.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular/angular.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-route/angular-route.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-animate/angular-animate.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-bootstrap/ui-bootstrap.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  gulp.src('./bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js')
      .pipe(gulp.dest('./javis/static/build/js/'))

  //--------------------------css-------------------------------------

  gulp.src('./javis/static/less/fonts/*')
      .pipe(gulp.dest('./javis/static/build/css/fonts/'))

  gulp.src('./bower_components/bootstrap/fonts/*')
      .pipe(gulp.dest('./javis/static/build/css/fonts/'))

  gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('./javis/static/build/css/lib'))

});

gulp.task('build', function () {
    gulp.run('styles', 'scripts');

    gulp.watch('./static/css/*.less', ['styles']);
    gulp.watch('./static/scripts/js.js', ['scripts']);
});

// 定义develop任务在日常开发中使用
gulp.task('develop', function () {
    gulp.run('build');
});


// 定义一个prod任务作为发布或者运行时使用
gulp.task('prod', function () {
    isProd = true;
    gulp.run('build');
});


// gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
// gulp.task('default', ['clean'], function() {
gulp.task('default', function () {
    gulp.run('develop');
});



// // Include gulp
// var gulp = require('gulp');

// // Include Our Plugins
// var sass = require('gulp-sass');

// var lr = require('tiny-lr'),
//     refresh = require('gulp-livereload'),
//     server = lr();


// // Task SASS
// gulp.task('sass', function() {
//     gulp.src([
//         'scss/**/*.scss',
//         '!scss/**/_*.scss'
//     ])
//         .pipe(sass({
//             includePaths: ['scss']
//         }))
//         .pipe(gulp.dest('css'))
//         .pipe(refresh(server));
// });


// gulp.task('refresh', function() {
//     gulp.src([
//         '**/*.html',
//         '**/*.php'
//     ])
//         .pipe(refresh(server));
// });


// // Task: default
// gulp.task('default', function() {
//     gulp.run('sass');

//     server.listen(35729, function(error) {
//         if (error) return console.log(error);

//         gulp.watch([
//             'scss/**',
//             'img/**'
//         ], function(event) {
//             gulp.run('sass');
//         });

//         gulp.watch([
//             '**/*.html',
//             '**.php'
//         ], function(event) {
//             gulp.run('refresh');
//         });
//     });
// });