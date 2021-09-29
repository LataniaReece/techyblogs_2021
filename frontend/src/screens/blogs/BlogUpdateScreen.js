import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { getBlogDetail, updateBlog } from '../../actions/blogAction';
import Spinner from '../../components/layout/Spinner'
import Alert from '../../components/layout/Alert';
import { BLOG_UPDATE_RESET } from '../../actions/actionTypes/blogTypes';

const BlogUpdateScreen = ({match, history}) => {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [image, setImage] = useState({})
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState('')

    const blogDetail = useSelector(state => state.blogDetail)
    const { loading, error, blog } = blogDetail

    const blogUpdate = useSelector(state => state.blogUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate, blog: updatedBlog } = blogUpdate

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config)

            setImage(data)
            setUploading(false)

        } catch (error) {
            setMessage(error)
            setUploading(false)
        }
    }
    
    
    const submitHandler = (e) => {
        e.preventDefault();
        if(image){
            if(title, text){
                dispatch(updateBlog(blog._id, {
                    title, 
                    text, 
                    image
                }))
            }
        } else if(title, text){
            dispatch(updateBlog(blog._id, {
                title, 
                text
            }))
        }  
    }       

    useEffect(() =>{
        if (successUpdate) {
            dispatch({ type: BLOG_UPDATE_RESET })
            history.push(`/blogs/${updatedBlog._id}`)
        } else{
        if (!blog || !blog.title || blog._id !== match.params.id) {
            dispatch(getBlogDetail(match.params.id))
        } else {
            setTitle(blog.title)
            setText(blog.text)
        }
    }
    }, [match, dispatch, blog, successUpdate])
    
    
    return (
        <>
        {message && <Alert type="danger">{message}</Alert>}
        <div className="form-container update-blog" onSubmit={submitHandler}>
            <h2 className="form-heading text-center">Update New Blog</h2>
            <form>
                <div class="mb-4">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" name="title" class="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div class="mb-4">
                    <label for="Blog Text" class="form-label">Blog Text</label>
                    <textarea name="text" class="form-control" id="Blog Text" rows="8" resize="none" value={text} onChange={(e) => setText(e.target.value)}></textarea>
                </div>
                <div class="input-group mb-4">
                    <input type="file" class="form-control" id="file" name="image" onChange={uploadFileHandler}/>
                </div>
                {uploading && <Spinner />}
                <div className="mb-4">
                    <button type="submit" class="btn btn-primary w-100" disabled={uploading && true}>Submit</button>
                </div>
            </form>
        </div>
        </>
    )
}

export default BlogUpdateScreen