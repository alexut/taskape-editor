const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const file = require('gulp-file');
const fs = require('fs');
const path = require('path');

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

// Task to generate JavaScript documentation
gulp.task('docs', (cb) => {
  gulp.src(['README.md'], { read: false }) // Only include README.md here to avoid redundancy
    .pipe(jsdoc(jsdocConfig, cb));
});

// Task to concatenate JavaScript files
gulp.task('scripts', () => {
  return gulp.src('./src/**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./'))
    .pipe(rename('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
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


// ** GPT CONCATENATION FEATURE **

// Configuration for source directories and files, and their respective output files
// MODEL FOR CONFIGURATION:
// const gpt_config = [
//   { src: ['src', 'anotherSrc/file1.js', 'anotherSrc/file2.js'], exclude: ['src/exclude-folder'], output: 'src' },
//   { src: ['scss', 'scss/style1.scss', 'scss/style2.scss'], output: 'scss' } // No exclude provided
// ];


const gpt_config = [
    { src: ['readme.md','index.html','src'], output: 'src' }
];

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

// Create Gulp tasks based on configuration
gpt_config.forEach(({ src, output, exclude = [] }) => { // Default exclude to an empty array if not provided
  gulp.task(`concat-${output}`, createConcatTask(src, output, exclude));
});


// ** END OF GPT CONCATENATION FEATURE **


// Default task to run both scripts and docs tasks
gulp.task('default', gulp.series('scripts', 'docs', 'inject-mermaid-script', ...gpt_config.map(({ output }) => `concat-${output}`)));
