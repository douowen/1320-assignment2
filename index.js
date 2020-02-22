// Your Assignment2 JavaScript code goes here
const urlBase = 'http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=';
const tweetMap = new Map();
const tweetContainer = document.getElementById('tweets-container');
let searchString = '';

function refreshTweets(sortedResult) {
    if (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild);
    }

    const tweetList = document.createElement('ul');
    tweetList.setAttribute('class', 'pl-0');
    sortedResult.forEach(tweetObject => {
        const tweet = document.createElement("li");
        tweet.setAttribute('class', 'middle-row');
        const profileImg = document.createElement('img');
        profileImg.setAttribute('class', 'tweet-pic rounded-circle');
        profileImg.src = tweetObject.user.profile_image_url;
        profileImg.alt = `${tweetObject.user.name}'s profile image}`;
        tweet.appendChild(profileImg);
        const tweetContainer = document.createElement('div');
        tweetContainer.setAttribute('class', 'tweet-container');
        const p1 = document.createElement('p');
        const strong = document.createElement('strong');
        const username = document.createTextNode(tweetObject.user.name);
        strong.appendChild(username);
        strong.setAttribute('class', 'mr-1');
        p1.appendChild(strong);
        const span = document.createElement('span');
        span.setAttribute('class', 'profile-tag');
        const screenName = document.createTextNode('@' + tweetObject.user.screen_name);
        span.appendChild(screenName);
        p1.appendChild(span);
        const p2 = document.createElement('p');
        p2.setAttribute('class', 'mb-2 tweet-datetime');
        const datetime = document.createTextNode(moment(tweetObject.created_at).format('LLLL'));
        p2.appendChild(datetime);
        const p3 = document.createElement('p');
        const tweetText = document.createTextNode(tweetObject.text);
        p3.appendChild(tweetText);
        tweetContainer.appendChild(p1);
        tweetContainer.appendChild(p2);
        tweetContainer.appendChild(p3);
        tweet.appendChild(tweetContainer);
        tweetList.prepend(tweet);
    });

    tweetContainer.appendChild(tweetList);

    $(".tweet-pic").on("error", function(){
        $(this).attr('src', './img/no_photo.png');
    });
}

function fetchData(url) {
    console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let tweets = data.statuses;
            if (tweets.length > 0) {
                tweets.forEach(feed => {
                    tweetMap.set(feed.id, feed);
                });

                const filteredResult = Array.from(tweetMap.values()).filter(tweet => tweet.text.includes(searchString));
                const sortedResult = filteredResult.sort((tweet1, tweet2) => new Date(tweet1.created_at) - new Date(tweet2.created_at));
                refreshTweets(sortedResult);
            }
        });
}

function removeIntervals() {
    for (let i = 0; i < 99999; i++) {
        window.clearInterval(i);
    }
}

let isChecked = false;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        let checkFeeds = document.querySelector('input[name=checkFeeds');
        checkFeeds.checked = true;
        isChecked = true;
        document.getElementById('searchBar').addEventListener('input', handleSearch);
        checkFeeds.addEventListener('change', event => {
            isChecked = checkFeeds.checked;
            if (isChecked && searchString !== '') {
                let url = urlBase + searchString;
                fetchData(url);
                window.intervalId = setInterval(fetchData, 6000, url);
            } else {
                // clearInterval(window.intervalId);
                removeIntervals();
                console.log('SetInterval has been cleared');
            }
            console.log(isChecked);
        });
    });
}

const handleSearch = event => {
    console.log('search is fired');
    searchString = event.target.value.trim().toLowerCase();
    if (searchString === '') {
        removeIntervals();
        // clearInterval(window.intervalId);
    }
    let url = urlBase + searchString;
    if (isChecked && searchString !== '') {
        // clearInterval(window.intervalId);
        removeIntervals();
        fetchData(url);
        window.intervalId = setInterval(fetchData, 10000, url);
    }
};
