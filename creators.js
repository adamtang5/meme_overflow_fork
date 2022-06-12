const creators = require('./creators.json');

const fetchCreators = async () => {
    const ans = [];

    creators.forEach(creator => {
        const res = await fetch(`https://api.github.com/users/${creator.github_username}`);
        const data = await res.json();
        ans.push({
            ...creator,
            avatar_url: data.avatar_url,
            github_url: data.html_url,
        });
    });

    return ans;
};

module.exports = {
    fetchCreators,
};
