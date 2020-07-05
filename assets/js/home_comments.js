{

    let createComment = function () {

        let newCommentForm = $('#new-comment-form');
        newCommentForm.submit(function (event) {
            console.log('Comment default prevented')
            event.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comment/create',
                data: newCommentForm.serialize(),
                success: function (data) {
                    // console.log(data);
                    let newCommentData = newComment(data.data.comment);
                    console.log(newCommentData);
                    $('.post-comments-list>ul').prepend(newCommentData);
                    $('#new-comment-form>input[type="text"]').val("");
                    deleteComment($('.delete-comment-button'));
                    console.log(data)
                },
                error: function (err) {
                    console.log(err.responseText);
                }
            })

        });
    }

    let newComment = function (comment) {
        // console.log(comment,"Inside sucess");
        return (`<li id="comment-${comment._id}">
            ${comment.content}
            
        <small>
        
        <a href="/comment/destory/${comment._id}">Delete</a>
        </small>
            <small>${comment.user.name}</small>
        </li>
        
        `);
    }


    let deleteComment = function (deleteLink) {
        $(deleteLink).click(function (event) {
            console.log('Inside delete comment')
            event.preventDefault();
            console.log('After delete Default');

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {

                    $(`#comment-${data.data.comment_id}`).remove();

                },
                error: function (err) {
                    console.log(err);
                }
            })
        });
    };

    createComment();
}
