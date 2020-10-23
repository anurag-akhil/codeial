{
    // method to submit form data using ajax
let createPost = function(){
    let newPost = $('#new-post-form');
    console.log('newpost is ',newPost.serialize());
    newPost.submit(function(e){
        e.preventDefault();

        $.ajax({
            url: "posts/create",
            type: 'post',
            data: newPost.serialize(),
            success: function(data){
                console.log(data.data.post);
                let addedpost = newPostDom(data.data.post);
                deletePost($(' .delete-post-button', addedpost));
                $('#posts-list-container').prepend(addedpost);
            },
            error: function(err){
                console.log(err.responseText);
            }
        });
    });
}
// method to create post in dom
let newPostDom = function(post){
    return $(`
            <li id="post-${post._id}">
                <small><a href="/posts/destroy/${post._id}">X</a></small>
                 ${post.content}
            </li>
            <span>${post.user.name}</span>
            <div class="comments">
                    <form action="/comments/create" method="POST">
                            <input type="text" name="content">
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="comment">
                    </form>
            </div>
            <div class="post-comments-list">
                <ul id="post-comment-${post._id}">
                    
                </ul>
            </div> `)
}

//method to delete post from dom

let deletePost = function(deletelink){
    $(deletelink).click(function(e){
        e.preventDefault();

        $.ajax({
            url: $(deletelink).prop('href'),
            type: 'get',
            success: function(data){
                $(`post-${data.data.post_id}`).remove();
            },
            error: function(err){console.log(err.responseText);}
        });
    });
}

createPost();
}