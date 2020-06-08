module.exports = function (eleventyConfig) {
  
  eleventyConfig.addFilter("debug", function (value) {
    console.log(Object.keys(value))

    return value;
  });

  return {
    dir: {
      input: "eleventy-src",
      output: "build"
    }
  }
};
