const { join, basename, relative } = require('path');
const moment = require('moment');
const glob = require('glob');

const generateBlogSideBar = dir => {
  const structure = {};
  const files = glob.sync('**/*.md', { cwd: join(__dirname, dir) })
    .filter(p => basename(p) !== 'README.md')
    .map(p => {
      const [year, month, filename] = p.split('/');
      const day = basename(filename, '.md');
      return [year, month, day];
    }).forEach(([year, month, day]) => {
      structure[year] = { ...structure[year] };
      structure[year][month] = {
        ...structure[year][month],
        [day]: join(dir, year, month, day),
      };
    });
  
  const years = Object.keys(structure).sort().reverse();
  return [].concat(...years.map(year => {
    const months = Object.keys(structure[year]).sort().reverse();
    return months.map(month => {
      const days = Object.keys(structure[year][month]).sort().reverse();
      return {
        title: moment(year + '-' + month).format('YYYY MMM'),
        collapsable: !(year + month === Math.max(...years) + Math.max(...months)),
        children: days.map(day => join(dir, year, month, day)),
      };
    });
  }));
};

module.exports = {
  title: 'Jason Yu',
  description: 'A passionate real-life problem solver and musician.',
  ga: 'UA-113352609-1',
  head: [
    ['link', { rel: 'icon', href: `/favicon.png` }],
  ],
  themeConfig: {
    nav: [
      {
        text: 'Blog',
        link: '/blog/',
      },
      {
        text: 'Curriculum Vitae',
        link: '/cv/'
      },
    ],
    sidebar: {
      '/blog/': [
        '',
        ...generateBlogSideBar('../blog'),
      ],
      '/cv/': [
        '',
      ],
    },
    sidebarDepth: 0,
  },
  markdown: {
    config: md => md.use(require('markdown-it-deflist')),
  }
};
