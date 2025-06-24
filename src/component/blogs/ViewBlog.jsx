import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { fetchBlogs } from '../../utils/Api';

const ViewBlog = () => {

    const location = useLocation();
    const { id } = location?.state;
    const [loader, setLoader] = useState(true)
    const [blog, setBlog] = useState({
        id: 1,
        created_at: "2023-02-23T00:00:00.000Z",
        dateicon: "assets/img/home/dateicon.svg",
        author: "assets/img/home/Shape-2.svg",
        name: "Lorem Ipsum",
        link: '/CommingSoon', // Add the link property
        image: "assets/img/referral/Group_star1.png",
        description: 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.'
    });

    useEffect(() => {
        fetchBlogs().then(res => {
            if (res.code == "200" && res?.data?.length > 0) {
                const blogData = res.data.find(item => item.id == id)
                setLoader(false)
                if (blogData) {
                    setBlog(blogData)
                }
            }
        })
    }, [])


    const convertToHtml = (text) => {
        return text
            .replace(/\r\n/g, '<br />')
            .replace(/<\/li>/g, '</li></ul>')
            .replace(/<br \/>/g, '</p><p>')
            .replace(/<p><\/p>/g, '');
    }

    return (
        <section className="sigupsec blog-full-view" style={{ minHeight: "100vh" }}>
            {
                loader ? (
                    <div className="loader-overly">
                        <div className="loader" >
                        </div>

                    </div>
                ) :
                    (
                        <div className="container justify-content-center my-5">
                            <div>
                                <h1 className='fw-bolder'>{blog?.name}</h1>
                            </div>
                            <div className='my-5 w-100 d-flex justify-content-center'>
                                <img alt={'blog'} className='w-100' src={process.env.REACT_APP_API_URL + "/media/" + blog?.image} />
                            </div>
                            <div>
                                <p dangerouslySetInnerHTML={{ __html: blog?.description }}></p>
                            </div>
                        </div>
                    )
            }

        </section>

    )
}

export default ViewBlog