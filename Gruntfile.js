'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        // Watch Config
        watch: {
            files: ['views/**/*'],
            options: {
                livereload: true
            },
            scripts: {
                files: [
                    'app/scripts/**/*.js'
                ]
            },
            css: {
                files: [
                    'app/styles/**/*.css'
                ]
            },
            less: {
                files: [
                    'app/styles/less/components/*.less'
                ],
                tasks: ['less:dev'],
                options: {
                    livereload: false,
                    spawn: true
                }
            },
            images: {
                files: [
                    'app/images/**/*.{png,jpg,jpeg,webp}'
                ]
            },
            express: {
                files:  [ 'server.js', '!**/node_modules/**', '!Gruntfile.js', 'lib/**' ],
                tasks:  [ 'express:dev', 'wait' ],
                options: {
                    nospawn: true // Without this option specified express won't be reloaded
                }
            }
        },

        // Clean Config
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'dist/*',
                        '!dist/.git*'
                    ]
                }]
            },
            server: ['.tmp']
        },

        // Hint Config
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'lib/**/*.js',
                //'app/scripts/**/*.js',
                '!app/bower_components/*'
                //'test/**/*.js'
            ]
        },

        // Less Config
        less: {
            dev: {
                options: {
                    paths: ['app/styles/less/components']
                },
                files: {
                    'app/styles/screen.css': 'app/styles/less/theme.less'
                }
            }//,
//            production: {
//                options: {
//                    paths: ["assets/css"],
//                    cleancss: true,
//                    modifyVars: {
//                        imgPath: '"http://mycdn.com/path/to/images"',
//                        bgColor: 'red'
//                    }
//                },
//                files: {
//                    "path/to/result.css": "path/to/source.less"
//                }
//            }
        },

        // Express Config
        express: {
            options: {
              // Override defaults here
            },
            dev: {
                options: {
                    script: 'server.js',
                    debug: true
                }
            }
        },

        // Open Config
        open: {
            site: {
                path: 'http://localhost:3000',
                app: 'Google Chrome'
            },
            editor: {
                path: './',
                app: 'WebStorm'
            }
        },

        // Rev Config
        rev: {
            dist: {
                files: {
                    src: [
                        'dist/assets/scripts/**/*.js',
                        'dist/assets/styles/**/*.css',
                        'dist/assets/images/**/*.{png,jpg,jpeg,gif,webp}'
                        //no noed to rev the fonts in Font Awesome as they use ?version=4.0.6 to get the
                        // request to refresh if it needs to.
                    ]
                }
            }
        },

        // Usemin Config
        useminPrepare: {
            options: {
                dest: 'dist/assets'
            },
            html: ['app/views/**/*.html', 'views/**/*.handlebars'],
            css: ['app/styles/*.css']
        },
        usemin: {
            options: {
                dirs: ['dist/assets'],
                basedir: 'dist/assets'
            },
            html: ['dist/assets/{,*/}*.html', 'dist/views/**/*.handlebars', 'dist/assets/views/**/*.html'],
            css: ['dist/assets/styles/*.css']
        },

        // Imagemin Config
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: 'dist/assets/images'
                }]
            }
        },

        // SVGmin Config
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/images',
                    src: '{,*/}*.svg',
                    dest: 'dist/assets/images'
                }]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        // HTML Config
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: '*.html',
                    dest: 'dist/assets'
                }]
            }
        },

        // Copy Config
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'app',
                    dest: 'dist/assets',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/**/*.{webp,gif}',
                        'styles/fonts/{,*/}*.*'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: 'views',
                    dest: 'dist/views/',
                    src: '**/*.handlebars'
                },
                {
                    expand: true,
                    dot: true,
                    cwd: 'app/views',
                    dest: 'dist/assets/views/',
                    src: '**/*.html'
                },
                {
                    expand: true,
                    dot: true,
                    cwd: 'app/bower_components/font-awesome/fonts',
                    dest: 'dist/assets/fonts/',
                    src: '*.*'
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: 'assets/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        // Concurrent Config
        concurrent: {
            dist: [
                'copy:styles',
                'svgmin',
                'htmlmin'
            ]
        }
    });

    // Register Tasks
    // Workon
    grunt.registerTask('workon', 'Start working on this project.', [
        'jshint',
        'less:dev',
        'express:dev',
        'open:site',
        'open:editor',
        'watch'
    ]);


    // Restart
    grunt.registerTask('restart', 'Restart the server.', [
        'express:dev',
        'watch'
    ]);
    

    // Build
    grunt.registerTask('build', 'Build production ready assets and views.', [
        'jshint',
        'less:dev',
        'clean:dist',
        'concurrent:dist',
        'useminPrepare',
        'imagemin',
        'concat',
        'ngmin',
        'copy:dist',
        'rev',
        'usemin'
    ]);

    // Used for delaying livereload until after server has restarted
    grunt.registerTask('wait', function () {
        grunt.log.ok('Waiting for server reload...');

        var done = this.async();

        setTimeout(function () {
            grunt.log.writeln('Done waiting!');
            done();
        }, 2000);
    });

};
