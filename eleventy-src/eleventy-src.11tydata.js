const glob = require('glob');

const jsFiles = glob.sync('**/*.js', { cwd: './momonet-2021/build' });
const cssFiles = glob.sync('**/*.css', { cwd: './momonet-2021/build' });

const shortAboutMe =`
I'm a Kuwaiti developer living in Brooklyn NY. I love working with the .net stack,
which subsequently led me to my career at Microsoft. My hobbies include weight lifting, and watercoloring.
I also play a lot of video games mostly on PC.
`;

const social = {
    linkedin: {
        url: "https://www.linkedin.com/in/mohammad91",
        icon: "linkedin-in"
    },
    github: {
        url: "https://github.com/AlahmadiQ8",
        icon: "git"
    },
    email: {
        url: "mailto:m91.alahmadi@gmail.com?Subject=[from my site]",
        icon: "envelope"
    },
    stackoverflow: {
        url: "https://stackoverflow.com/users/5431968/mmohammad",
        icon: "stack-overflow"
    }
};

module.exports = () =>{

    return {
        title: "Mohammad's personal space",
        description: `Mohammad's personals website`,
        shortAboutMe,
        Author: "Mohammad Mohammad",
        layout: 'layouts/base.njk',
        jsFiles,
        cssFiles,
        ...social,
        eleventyComputed: {
            ownTags: data => {
                if (!data.tags) return [];
                // console.debug(Object.entries(data))
                return data.tags.filter(t => !['posts', 'notes'].includes(t));
            }
        }
    };
};
