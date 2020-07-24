    class ToggleLike{

        constructor(toggleElem){
            console.log('constructor')
            this.toggler=toggleElem;
            this.toggleLike();
        }

        toggleLike(){
            console.log('here')
            $(this.toggler).click(function(e){
                e.preventDefault();

                let self=this;

                $.ajax({
                    type: 'POST',
                    url: $(self).prop('href')   
                }).done(
                    function(data){
                        let likesCount=parseInt($(self).attr('data-likes'));
                        console.log(likesCount);
                        if(data.data.deleted==true){
                            likesCount-=1;
                        }
                        else{
                            likesCount+=1;
                        }

                        $(self).attr('data-likes',likesCount);
                        $(self).html(`${likesCount} Likes`);
                    }
                ).fail(function(errData){
                    console.log(errData);
                });
            });
        }

    }