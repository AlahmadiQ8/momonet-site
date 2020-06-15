const glob = require('glob');

const jsFiles = glob.sync('**/*.js', { cwd: 'build' });
const cssFiles = glob.sync('**/*.css', { cwd: 'build' });

const shortAboutMe =`
I'm Kuwaiti developer living in Brooklyn NY. My current tech interests are 
c# (dotnet core) and cloud technologies (AWS). In the past I've done front development 
with Angular and some React. My hobbies include weightlifting, blogging, and Zumba. 
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
