import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


let tweetsFromLocalStorage = JSON.parse( localStorage.getItem("myTweets") )

if (tweetsFromLocalStorage) {
    render()
} else {
    localStorage.setItem( "myTweets", JSON.stringify(tweetsData) )
    tweetsFromLocalStorage = JSON.parse( localStorage.getItem("myTweets") )
    render()
}


///////// Event Listeners for clicks! /////////

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.answer) {
        handleReplyToTweet(e.target.dataset.answer)
    }
    // else if (e.target.dataset.retweet) {
    //     handleRetweetDiv(e.target.dataset.retweet)
    // } I don't need this because the button isn't clicked separately! It's the same button!
})
 
///////// Handle click functions! /////////

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden') // open replies
}

function handleReplyToTweet(tweetId){
    // when this is clicked, the div has the hidden class by default so that's closing it!
    // oo above, handleReplyClick opens the replies AND the reply to reply section separately!
    // so now what? Keep them both open when you click handleReplyToTweet?

    // find the target tweet object by its uuid
    const targetTweetObj = tweetsData.find((tweet) => tweet.uuid === tweetId)
  
    // check if the target tweet exists and if the reply input has content
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    // add trim() for good practice to handle potential user input errors
    const replyText = replyInput.value.trim()
  
      if (targetTweetObj && replyText){
        // create the new object
        const reply = {
          profilePic:"images/dog.jpg",
          handle: "@GrandChamp",
          tweetText: replyText,
          uuid: uuidv4()
        }
        // add the reply to the replies array
        targetTweetObj.replies.push(reply)
        replyInput.value = ""

        render()
      }
    //keep replies open!
    document.getElementById(`replies-${tweetId}`).classList.toggle('hidden')
  }


function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
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
    
     // new code to make the retweet post a new message!
    //document.getElementById(`replies-${tweetId}`).classList.toggle('hidden') // open replies 

    // have a new section pop up instead of the other messages section? Yeah!!!
    document.getElementById(`retweet-div-${tweetId}`).classList.remove('hidden') // open retweet div!

    // above needs to open a new tweet in the main section!
    
    // add this tweet to the new tweet section!
    
    ////////////////////////////////////////
    // THIS PART IS BREAKING IT!
    tweetsData.unshift({
        handle: `@GrandChamp`, //this part isn't coming ghrough either! It shows up as the original tweet handle!
        profilePic: `images/dog.jpg`,
        tweetText: tweetId.tweetText + 'honk', // needs to be text from the tweet of the clicked item!
        uuid: uuidv4()
    })
    ////////////////////////////////////////
    render()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@GrandChamp`,
            profilePic: `images/dog.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

///////// Build the feed! /////////

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
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
        

        // it doesn't matter if this section below is here at all? hahaha! Why?
            // OH I think it happens becuase the tweet is still the old tweet? The original tweet buttons break after. so it's like it's not it's own tweet still!

        // let retweetDivHtml = ''
        // if(tweet.replies.length > 0){
        //     tweet.replies.forEach(function(retweetD){
        //         retweetDivHtml+=`
        //             <div class="tweet-reply">
        //                 <div class="tweet-inner">
        //                     <img src="${retweetD.profilePic}" class="profile-pic">
        //                         <div>
        //                             <p class="handle">honk from retweetDivHtml!${retweetD.handle}</p>
        //                             <p class="tweet-text">${retweetD.tweetText}</p>
        //                         </div>
        //                     </div>
        //             </div>
        //             `
        //     })
        // }


        
          
        feedHtml += `
            <div class="tweet">
                <div class="hidden" id="retweet-div-${tweet.uuid}">
                    <div class="tweet-inner">
                        <img src="images/dog.jpg" class="profile-pic">
                        <div>
                            <p class="handle">@GrandChamp</p>
                            <div class="rtInner">
                            <img src="${tweet.profilePic}" class="profile-pic">
                                <p class="handle">${tweet.handle}</p>
                                <p class="tweet-text">${tweet.tweetText}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <button class="tweet-detail" data-reply="${tweet.uuid}">
                                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </button>
                            <button class="tweet-detail" data-like="${tweet.uuid}">
                                <span class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}">
                                </span>
                                ${tweet.likes}
                            </button>
                            <button class="tweet-detail" data-retweet="${tweet.uuid}">
                                <span class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></span>
                                ${tweet.retweets}
                            </button>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                    <div class="reply-input-area tweet-reply">
                        <img src="images/dog.jpg" class="profile-pic">
                        <textarea placeholder="Post your reply" class="reply-input" id="reply-input-${tweet.uuid}"></textarea>
                    </div>
                    <button class="reply-btn" data-answer="${tweet.uuid}">Reply</button>
                </div>
                
            </div>
            `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()


// make the retweet work?! Bring the text of the tweet into the text area, or just render it as the dog's new tweet?

// partialy working!!! Holy crap!! 
/// Make the tweet text show up
    // it's showing up but there's an error from somewhere else but it's working! hahha!! Just move forward YAY!
    // The error is because it has the same UUID! I think! It needs to have it's own UUID!
    // each tweet currently has the same tweet tweeted by grandchamp hidden. That's why each tweet gets retweeted right on top of itself and not at the top!!
    // if I move the hidden div out of the main tweets div, it still shows up above each tweet. So find where it's causing that!

    // I added RTinner div and it looks good! I need to figure out why it's causing the .length to break the other buttons after! :) 




// - then have the div show up at the absolute top for every tweet
// - and then make the highlight of the tweet icon show up and make the button unclickable! 
// - - Or have it remove the tweet! hahaha!



// make a footer section that I can use in all my projects! My links and image credits! YAY!!

// save them to localstorage! haha copy Alena!
    // delete a tweet, but ONLY the ones you added!


// reply to tweets! DONE!