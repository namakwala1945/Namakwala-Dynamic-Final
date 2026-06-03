const fs = require('fs');
const path = require('path');

// If you have blog posts in a folder like `data/blogs`:
const blogDir = path.join(__dirname, 'data/blogs'); // change this path if needed
let blogSlugs = [];
if (fs.existsSync(blogDir)) {
  blogSlugs = fs.readdirSync(blogDir).map(file => file.replace(/\.mdx?$/, ''));
}

module.exports = {
  siteUrl: 'https://www.namakwala.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  // Dynamically add blog URLs
  additionalPaths: async (config) => {
    return blogSlugs.map(slug => `/blog/${slug}`);
  },
};
