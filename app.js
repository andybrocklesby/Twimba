import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(event){
    if(event.target.dataset.comment){
        handleCommentBtn(event.target.dataset.comment)
    }
    else if(event.target.dataset.like){
        handleLikeBtn(event.target.dataset.like)
    }
    else if(event.target.dataset.share){
        handleRetweetBtn(event.target.dataset.share)
    }
    else if(event.target.id === 'tweet-btn'){
        tweet()
    }
    else if(event.target.dataset.delete){
        handleDelete(event.target.dataset.delete)
    }
})

function tweet(){
    const userInput =  document.getElementById('user-input').value

    const newTweet = {
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: userInput,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
    }
    
    if(userInput){
        tweetsData.unshift(newTweet)
    }

    render()
}

function handleDelete(tweetId){
    const index = tweetsData.findIndex(tweet => tweet.uuid === tweetId);
    
    if(index !== -1) {
        tweetsData.splice(index, 1); 
        console.log("Tweet deleted successfully!");
        render();
    } else {
        console.log("Tweet not found with ID:", tweetId);
    }
}

function handleCommentBtn(tweetId){
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden');
}

function handleLikeBtn(tweetId){

    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    render()

}

function handleRetweetBtn(tweetId){

    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    render()

}

function getFeedHtml(){

    let tweetHtml = ''

    tweetsData.forEach(function(tweet){

        let likeClass = ''
        let retweetClass = ''

        if(tweet.isLiked){
            likeClass = 'liked'
        }

        if(tweet.isRetweeted){
            retweetClass = 'retweeted'
        }

        let repliesHtml = ''

        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }

        

        tweetHtml += `
        <div class="tweet-container flex-row">
            <img 
            class="profile-img" 
            src="${tweet.profilePic}" 
            alt="" >
            <div class="twimba-user-data flex-column">
                <div class="handle">${tweet.handle}</div>
                <div class="tweet-text">${tweet.tweetText}</div>
                <div class="tweet-icons flex-row">
                    <div class="icon-item flex-row">
                        <i class="fa-regular fa-comment-dots" data-comment="${tweet.uuid}"></i>${tweet.replies.length}
                    </div>
                    <div class="icon-item flex-row">
                        <i class="fa-solid fa-heart ${likeClass}" data-like="${tweet.uuid}"></i>${tweet.likes}
                    </div>
                    <div class="icon-item flex-row">
                        <i class="fa-solid fa-retweet ${retweetClass}" data-share="${tweet.uuid}"></i>${tweet.retweets}
                    </div>
                </div>
            </div>
            <i class="fa-solid fa-trash trash" data-delete="${tweet.uuid}"></i>
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
        </div>  
        `

    })

    return tweetHtml
}

function render(){

    document.getElementById('twimba-feed').innerHTML = getFeedHtml()
}

render()


