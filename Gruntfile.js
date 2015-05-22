module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt, {
        pattern: ['assemble', 'grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        paths: {
            dev: 'dev',
            dist: 'assets',
        },

        clean: {
            options: {
                force: true /* Need force to clean beyond current working dir */
            },
            js: {
                src: ['<%= paths.dist %>/js/**/*']
            },
            css: {
                src: ['<%= paths.dist %>/css/**/*']
            },
            images: {
                src: ['<%= paths.dist %>/images/**/*']
            },
            src: {
                src: ['<%= paths.dist %>/*', '!<%= paths.dist %>/**']
            }
        },

        sass: {
            options: {
                trace: true
            },
            prod: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    debugInfo: false,
                    lineNumbers: false
                },
                files: [{
                    expand: true,
                    src: ['**/*.scss', '!**/_*.scss', '!libs/*'],
                    cwd: '<%= paths.dev %>/scss',
                    dest: '<%= paths.dist %>/css',
                    ext: '.css'
                }]
            }
        },

        watch: {
            options: {
                livereload: true
            },
            scss: {
                files: ['<%= paths.dev %>/scss/*.scss'],
                tasks: ['scss']
            }
        },

        copy: {
            root: {
                expand: true,
                cwd: '<%= paths.dev %>/root/',
                src: ['**'],
                dest: '<%= paths.dist %>/'
            }
        },


        autoprefixer: {
            options: {
                browsers: ['last 2 version', '> 1%', 'ff esr', 'ie >= 8', 'ios >= 5', 'android >= 2.3'],
                map: false
            },
            site: {
                src: '<%= paths.dist %>/css/styles.css'
            }
        }

    });

    grunt.registerTask('scss', ['clean:css', 'sass:prod', 'autoprefixer:site']);

    grunt.registerTask('default', ['scss']);

    grunt.registerTask('production', ['scss']);
};
