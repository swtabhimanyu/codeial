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
                    $('#new-post-form>textArea').val("");
                    deletePost($(' .delete-post-button',newPostData));

                    new PostComments(data.data.post._id);

                    new ToggleLike($(' .toggle-like-button',newPostData));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();


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
    
        return $(`<li id="post-${post._id}">
        <p>
        ${post.content}
        <small>
      <a class="toggle-like-button" href="/likes/toggle/?id=${post._id}&type=Post" data-likes="0">
         
      0 Like   
      </a>
      &nbsp;
   </small>
           <small>
     
              <a class="delete-post-button" href="/posts/destory/${post._id}">Delete</a>
           </small>
            <br>
            &emsp;&emsp;<small> ${post.user.name}</small>
     
        </p>
     
        <div id="comment">
     
           <form id="post-${post._id}-comments-form" action="/comment/create" method="POST" >
              <input type="text" name="content" placeholder="Write comment" required>
              <input type="hidden" name="postId" value="${post._id}">
     
              <button type="submit" name="submit-comment">Comment</button>
           </form>
     
     
        </div>
     
        <div class="post-comments-list">
           <ul id="post-comments-${post._id}">
              
            </ul>
         </div>
      </li>
     
      `)
    }


    //method to delete a post from DOM

    let deletePost=function(deleteLink){
        console.log('Inside delete post')
        $(deleteLink).click(function(event){
            event.preventDefault();
            console.log("HERE")
            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){

                    //ajax send req to controller which returns res.status().json({data:{},message:}) 
                    //this returned response is used by ajax to perform operation on data recieved form controller


                    //DOM --> AJAX --> Controller --> return data to AJAX --> perform operation on data received in AJAX --> return to controller
                    $(`#post-${data.data.post_id}`).remove();

                    

                    new Noty({
                        theme: 'relax',
                        text: "Post removed!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error:function(err){
                    console.log(err.responseText);
                }
            }); 
        })
    }


    let convertToAjax=function(){
        $('#posts-fetched>ul>li').each(function(){
            let self=$(this);
            deletePost($(' .delete-post-button',self));

            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }


        createPost();
        convertToAjax();
    }




