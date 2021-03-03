const { format } = require('date-fns');

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  // used for debuging only
  eleventyConfig.addFilter("debug", function (value) {
    console.log(value)
    return value;
  });

  // formats date
  eleventyConfig.addFilter('formatDate', (dateStr) => {
    return format(new Date(dateStr), 'MMM d, yyyy');
  });

  // collection for all tags excluding directory based tags
  eleventyConfig.addCollection("tagList", getTaglist);

  eleventyConfig.addPassthroughCopy({ "public": "/" });

  const mapping = { img: 'mx-auto border-gray-400 border-2 rounded' }
  let markdownIt = require("markdown-it")().use(require('@toycode/markdown-it-class'), mapping);
  eleventyConfig.setLibrary("md", markdownIt);

  return {
    dir: {
      input: "eleventy-src",
      output: "build",
    }
  }
};

function getTaglist(collection) {
  let tagSet = new Set();
  collection.getAll().forEach(function(item) {
    if( "tags" in item.data ) {
      let tags = item.data.tags;
      tags = tags.filter(function(item) {
        switch(item) {
          // this list should match the `filter` list in tags.njk
          case "all":
          case "posts":
          case "notes":
            return false;
        }
        return true;
      });
      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
  });

  // returning an array in addCollection works in Eleventy 0.5.3
  return [...tagSet];
}
