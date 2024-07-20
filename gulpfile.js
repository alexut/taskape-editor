const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const file = require('gulp-file');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { exec } = require('child_process');
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

// Mermaid script to be injected
const mermaidScript = `
<script type="module">
  import mermaid from 'https://unpkg.com/mermaid@10.8.0/dist/mermaid.esm.min.mjs';

  function renderMermaidLangs() {
    [...document.querySelectorAll('.lang-mermaid')].forEach((markdownGraphEl, i) => {
      const graphDefinition = markdownGraphEl.innerText;

      mermaid.render(\`mermaid_graph_\${i}\`, graphDefinition)
        .then(({ svg }) => {
          const graphContainerEl = document.createElement('div');
          graphContainerEl.innerHTML = svg;
          const graphEl = graphContainerEl.querySelector('svg');

          graphEl.style.display = 'block';
          graphEl.style.margin = '0 auto';
          graphContainerEl.style.margin = '50px 0';

          markdownGraphEl.replaceWith(graphContainerEl);
        })
        .catch((err) => console.error('Error rendering Mermaid diagram:', err));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    mermaid.initialize({ startOnLoad: true });
    renderMermaidLangs();
  });
</script>
`;

// JSDoc configuration
const jsdocConfig = require('./jsdoc.json');

// Custom clean function
function clean(filePaths, cb) {
  filePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  });
  if (cb) cb();
}

// Task to build JavaScript with esbuild
gulp.task('scripts', gulp.series(done => {
  clean(['./index.js', './index.min.js'], done);
}, () => {
  return esbuild.build({
    entryPoints: ['./src/init.js'],
    bundle: true,
    outfile: 'index.js',
    minify: false,
    sourcemap: true,
  }).then(() => {
    return gulp.src('./index.js')
      .pipe(rename('index.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./'))
      .pipe(browserSync.stream()); // Stream changes to BrowserSync
  }).catch((err) => {
    console.error('Error during build:', err);
  });
}));

// Task to generate JavaScript documentation
gulp.task('docs', (cb) => {
  gulp.src(['README.md'], { read: false }) // Only include README.md here to avoid redundancy
    .pipe(jsdoc(jsdocConfig, cb));
});

// Task to inject Mermaid script into index.html
gulp.task('inject-mermaid-script', (cb) => {
  const targetFile = './docs/index.html';

  if (fs.existsSync(targetFile)) {
    let htmlContent = fs.readFileSync(targetFile, 'utf8');
    htmlContent = htmlContent.replace('</body>', `${mermaidScript}</body>`);
    fs.writeFileSync(targetFile, htmlContent, 'utf8');
  }
  cb();
});

// Function to create the desired output format
function formatFileContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative('', filePath).replace(/\\/g, '/'); // Adjust this if you need a different root path
  return `${relativePath}:\n${content}\n\n`;
}

// Function to recursively get all files in a directory, excluding specified directories
function getAllFiles(dirPath, arrayOfFiles, excludeDirs = []) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Exclude certain directories here
      if (!excludeDirs.some(excludeDir => filePath.includes(excludeDir))) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles, excludeDirs);
      }
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// SASS

// Function to compile SCSS using Dart Sass
function compileSass(src, dest, key) {
  return new Promise((resolve, reject) => {
    const destFile = path.join(dest, `${key}.css`);
    const nodeModulesPath = path.resolve(__dirname, 'node_modules');
    exec(`sass --load-path=${nodeModulesPath} ${src}:${destFile}`, (err, stdout, stderr) => {
      console.log(stdout);
      if (err) {
        console.error(stderr);
        reject(err);
      } else {
        resolve(destFile);
      }
    });
  });
}

// Task to process compiled CSS with Tailwind and Autoprefixer
gulp.task('process-css', () => {
  return gulp.src('main.css')
    .pipe(postcss([
      tailwindcss,
      autoprefixer,
    ]))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream()); // Stream changes to BrowserSync
});

// Main CSS task
gulp.task('css', (done) => {
  const srcFile = 'styles/main.scss';
  const destDir = '.';
  compileSass(srcFile, destDir, 'main')
    .then(() => gulp.series('process-css')(done))
    .catch(done);
});

// Function to create a Gulp task for concatenating files from source directories and individual files
function createConcatTask(srcPaths, outputFile, excludeDirs = []) {
  return function () {
    let srcFiles = [];
    
    // Get files from source directories and individual files
    srcPaths.forEach(srcPath => {
      if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
          srcFiles = srcFiles.concat(getAllFiles(srcPath, [], excludeDirs).filter(file => file.endsWith('.js') || file.endsWith('.scss')));
        } else {
          srcFiles.push(srcPath);
        }
      }
    });

    let combinedContent = '';
    srcFiles.forEach(file => {
      combinedContent += formatFileContent(file);
    });

    return file(`gpt/${outputFile}.gpt`, combinedContent, { src: true })
      .pipe(gulp.dest('.'));
  };
}

// BrowserSync serve task
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch('styles/**/*.scss', gulp.series('css')); // Watch SCSS files
  gulp.watch('*.html').on('change', browserSync.reload); // Watch HTML files
  gulp.watch('src/**/*.js', gulp.series('scripts')).on('change', browserSync.reload); // Watch JS files and run scripts task
});

// Configuration for source directories and files, and their respective output files
const gpt_config = [
  { src: ['readme.md', 'index.html', 'src'], output: 'src' }
];

// Create Gulp tasks based on configuration
gpt_config.forEach(({ src, output, exclude = [] }) => { // Default exclude to an empty array if not provided
  gulp.task(`concat-${output}`, createConcatTask(src, output, exclude));
});

// Default task to run scripts, docs, inject-mermaid-script, css, and serve tasks
gulp.task('default', gulp.series('scripts', 'docs', 'inject-mermaid-script', 'css', 'serve', ...gpt_config.map(({ output }) => `concat-${output}`)));
