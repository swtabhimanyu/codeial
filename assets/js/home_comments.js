class PostComments{

    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;

        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });

    }


    createComment(postId) {
        let pSelf = this;
        // this.newCommentForm = $('#new-comment-form');
        this.newCommentForm.submit(function (event) {
            event.preventDefault();
            let self = this;
            $.ajax({
                type: 'post',
                url: '/comment/create',
                data: $(self).serialize(),
                success: function (data) {
                    let newCommentData = pSelf.newComment(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newCommentData);
                    // console.log($(' input[type="text"]',pSelf));
                    // $(`post-${pSelf.postId}-comments-form>input[type=text]`).val();
                    pSelf.deleteComment($(' .delete-comment-button',newCommentData));


                    new Noty({
                        theme: 'relax',
                        text: "Comment Published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error: function (err) {
                    console.log(err.responseText);
                }
            })

        });
    }

    newComment(comment) {
        // console.log(comment,"Inside sucess");
        return $(`<li id="comment-${comment._id}">
        ${comment.content}
        
    <small>
    
     <a class="delete-comment-button" href="/comment/destory/${comment._id}">Delete</a>
     </small>
        <small>${comment.user.name}</small>
     </li>
    
    `);
    }


    deleteComment(deleteLink) {
        console.log('Delete comment inisde ',deleteLink);
        // console.log(deleteLink);
        $(deleteLink).click(function (event) {
            console.log('Inside delete comment')
            event.preventDefault();
            console.log("Here")
            console.log('After delete Default');

            $.ajax({ 
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {

                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment removed!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error: function (err) {
                    console.log(err.responseText);
                }
            })
        });
    };

    // createComment();



}
    