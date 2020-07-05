    //method to submit post form data using ajax
    {
        let createPost = function () {
            let newPostForm = $('#new-post-form');
            newPostForm.submit(function (e) {
                console.log('Default prevented')
                e.preventDefault();


            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPostData=newPost(data.data.post);
                    $('#posts-fetched>ul').prepend(newPostData); 
                    // $('#new-post-form>textArea').val("");
                    deletePost($(' .delete-post-button', newPostData));
                    console.log("AJX ***************",data);
                },
                error: function (err) {
                    console.log(err.responseText);
                }

            });
        });

            console.log('after AJAX')
        }

        
    //method to create post in views ajax 
    let newPost=function(post){
        console.log(post)
    
        return (`<li id="post-${post._id}">
        <p>
        ${post.content}
    
        <small>
    
            <a class="delete-post-button" href="/posts/destory/${post._id}">Delete</a>
        </small>
        
            <br>
            &emsp;&emsp;<small> ${post.user.name}</small>
    
        </p>
    
        <div id="comment">
    
        <form id="new-comment-form" action="/comment/create" method="POST" >
         <input type="text" name="content" placeholder="Write comment" required>
         <input type="hidden" name="postId" value="${post._id}">

         <button type="submit" name="submit-comment">Comment</button>
      </form>
 
    
        </div>
    
        <div class="post-comments-list">
        <ul id="post-comments-${post._id}">
            
            </ul>
        </div>
    </li>`)
    }


    //method to delete a post from DOM

    let deletePost=function(deleteLink){
        console.log('Inside delete post')
        $(deleteLink).click(function(event){
            event.preventDefault();

            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){

                    //ajax send req to controller which returns res.status().json({data:{},message:}) 
                    //this returned response is used by ajax to perform operation on data recieved form controller


                    //DOM --> AJAX --> Controller --> return data to AJAX --> perform operation on data received in AJAX --> return to controller
                    $(`#post-${data.data.post_id}`).remove();
                },
                error:function(err){
                    console.log(err.responseText);
                }
            }); 
        })
    }


        createPost();
    }




