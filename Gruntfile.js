module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    validation: {
      options: {
        reset: grunt.option('reset') || true,
        stoponerror: false
      },
      files: {
        src: ['index.html']
      }
    },

    w3c_css_validation: {
      src: ['css/*.css'],
    },

    watch: {
      options: {
        livereload: true
      },
      files: ['css/*.css', '*.html'],
    }
  });

  grunt.loadNpmTasks('grunt-w3c-html-validation');
  grunt.loadNpmTasks('grunt-w3c-css-validation');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['validation', 'w3c_css_validation']);
  grunt.registerTask('watch', ['watch']);

};
