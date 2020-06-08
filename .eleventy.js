module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("debug", function (value) {
    console.log(Object.keys(value))
    return value;
  });

  eleventyConfig.addCollection("tagList", getTaglist);

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
