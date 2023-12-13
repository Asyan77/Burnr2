import { useDispatch, useSelector } from 'react-redux'
import './SinglePhoto.css'
import { useEffect, useState } from 'react';
import { getOnePhoto, onePhoto } from '../../../store/photo';
import { Link, useParams } from 'react-router-dom';
import userIcon from '/assets/logos/zebra.png'
import editIcon from '/assets/logos/editIcon.png'
import { allPhotosComments, deleteOneComment, getAllComments} from '../../../store/comment';
import CommentForm from '../CommentForm/CommentForm';
import EditPhotoCommentModal from '../EditPhotoComment/EditCommentModal';
import deleteIcon from '../../../../assets/logos/deleteIcon.png'


const SinglePhoto = () => {
    const {photoId} = useParams();
    const {userId} = useParams();
    const dispatch = useDispatch();
    const photo = useSelector(onePhoto(photoId));
    const photosComments = useSelector(allPhotosComments(+photoId))
    const currentUser = useSelector(state => state.session.currentUser);
    const currentUserId = useSelector(state => state.session.currentUserId);
    const [showEditForm, setShowEditForm] = useState(false)
    const [selectedComment, setSelectedComment] = useState(null)

 

    useEffect(() => {
        dispatch(getAllComments(photoId))
        dispatch(getOnePhoto(photoId))
    },[dispatch, photoId, userId])

   
    const formatDate = (date) => {
        const dateObj = new Date(date)
        return dateObj.toDateString()
    }
 
    const deleteComment = async (e, commentId) => {
        e.preventDefault();
        dispatch(deleteOneComment(commentId))
    }

    const openEditModal = (commentId) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (showEditForm) return;
        setShowEditForm(true);
        setSelectedComment(commentId)
  
    }

    useEffect(() => {
        if (!showEditForm) return;
        const closeEditForm = () => {
            setShowEditForm(false)
        };
        return () => document.removeEventListener("click", closeEditForm);
    }, [showEditForm]);

    if(!photo) return null

    return (
        <div className='single-photo-page'>
            <div className='top-box-SP'>
                <Link to='' className='link-back-SP'> Back to photostream</Link>
                <div className='left-box-SP'>
                    <img src={photo.photoUrl} alt="single-photo" className="single-photo-image" />
                </div>

                <div className='right-box-SP'>
                    <div className='top-right-box-SP'>
                        <img className='user-icon-SP' src={userIcon}/>
                        <Link className='username-link-SP' to={`/photos/${photo.userId}`}>
                            <div className='username-SP'>{photo.username}</div>
                        </Link>
                    </div>

                    <div className='mid-right-box-SP'>
                        <img src={editIcon} className='edit-icon-SP'/>
                        <div className='text-SP title-SP'>{photo.title}</div>
                        <div className='text-SP description-SP'>{photo.description}</div>
                    </div>
         
                    <div className='bottom-right-box-SP'>
                        <div className='text-SP'>11 views</div>
                        <div className='text-SP'>2 faves</div>
                        <div className='text-SP'>{photosComments.length} comments</div>
                    </div>
                    <div className='upload-SP text-SP'>Uploaded on {formatDate(photo.createdAt)}</div>
                </div>

            </div>

            <div className='bottom-box-SP'>
                <div className='comments-SP'> 
                    <div className='comment-label'>Comments</div>
                    {photosComments.map(comment => {
                        return (
                            <div className="comment-details-SP" key={comment.id}>
                                <Link to={`/photos/${comment.userId}`} className='author-link'>{comment.author} </Link>
                                <div className='edit-options-SP'>
                                    {showEditForm && selectedComment === comment.id ? 
                                        <div id='edit-display'>
                                            <EditPhotoCommentModal setShowEditForm={setShowEditForm} commentId={comment.id} currentComment={comment.comment} />                                 
                                        </div>
                                  : <>
                                     <div className='comment-comment'>{comment.comment}</div>
                                        {comment.userId === currentUserId ?
                                            <div className="comment-buttons">
                                                <img className="delete-btn-SP" src={deleteIcon} alt="delete" onClick={e => deleteComment(e, comment.id)} />
                                                <img className="edit-btn-SP"src={editIcon} onClick={openEditModal(comment.id)} alt="edit" />
                                            </div>
                                        : null }                                    
                                    </>
                                    }
                                </div>
                            </div>
                        );
                    })}
                    {currentUser ? 
                        <CommentForm photoId={+photoId} /> : null
                    }
                </div>  
            </div>

        </div>
    
    )
}

export default SinglePhoto